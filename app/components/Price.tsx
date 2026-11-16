"use client";

import { useStore } from "../context/StoreContext";

export default function Price({ usd }: { usd: number }) {
  const { format } = useStore();
  return <>{format(usd)}</>;
}
