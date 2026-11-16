import "server-only";
import { NextResponse, type NextRequest } from "next/server";

const MAX_BODY_BYTES = 16 * 1024;
const WINDOW_MS = 60_000;
const MAX_TRACKED_CLIENTS = 5_000;

export function jsonResponse(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// In-memory, so the limit is per server process. Use a shared store such as
// Redis if the site ever runs on more than one instance.
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string, limit: number): boolean {
  const now = Date.now();
  if (hits.size >= MAX_TRACKED_CLIENTS) {
    for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
    if (hits.size >= MAX_TRACKED_CLIENTS) hits.clear();
  }
  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}

function clientKey(request: NextRequest): string {
  // The right-most entry is the one added by the nearest trusted proxy. Entries
  // further left are supplied by the client and can be forged.
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",").at(-1)?.trim() || "direct";
}

async function readCapped(request: NextRequest): Promise<string | null> {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return text + decoder.decode();
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }
}

type Guarded = { body: Record<string, unknown>; error?: never } | { body?: never; error: NextResponse };

/** Checks origin, rate, content type and size, then parses the JSON body. */
export async function guardJsonPost(request: NextRequest, route: string, limit: number): Promise<Guarded> {
  if (!isSameOrigin(request)) return { error: jsonResponse({ error: "Forbidden." }, 403) };
  if (isRateLimited(`${route}:${clientKey(request)}`, limit)) {
    return { error: jsonResponse({ error: "Too many attempts. Wait a minute and try again." }, 429) };
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return { error: jsonResponse({ error: "Unsupported content type." }, 415) };
  }
  const text = await readCapped(request);
  if (text === null) return { error: jsonResponse({ error: "Request too large." }, 413) };
  try {
    const body: unknown = JSON.parse(text);
    if (body && typeof body === "object" && !Array.isArray(body)) {
      return { body: body as Record<string, unknown> };
    }
  } catch {
    // Falls through to the same response as a non-object body.
  }
  return { error: jsonResponse({ error: "Invalid request." }, 400) };
}
