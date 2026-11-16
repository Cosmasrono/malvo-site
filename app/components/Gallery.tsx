"use client";

import { useState } from "react";
import Image from "next/image";
import ProductPhoto from "./ProductPhoto";
import ZoomPhoto from "./ZoomPhoto";

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(images[0]);

  return (
    <div>
      <ZoomPhoto>
        <ProductPhoto key={active} src={active} alt={alt} sizes="(max-width: 1000px) 100vw, 50vw" preload />
      </ZoomPhoto>
      {images.length > 1 && (
        <div className="thumbs" role="group" aria-label="Product photos">
          {images.map((src, index) => (
            <button key={src} aria-pressed={src === active} aria-label={`Show photo ${index + 1}`} onClick={() => setActive(src)}>
              <Image src={src} alt="" fill sizes="110px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
