"use client";

import type { MouseEvent, ReactNode } from "react";

export default function ZoomPhoto({ children }: { children: ReactNode }) {
  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--x", `${((event.clientX - box.left) / box.width) * 100}%`);
    event.currentTarget.style.setProperty("--y", `${((event.clientY - box.top) / box.height) * 100}%`);
  };

  return (
    <div className="product-photo" onMouseMove={onMouseMove}>
      {children}
    </div>
  );
}
