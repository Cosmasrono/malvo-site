import Image from "next/image";

export default function ProductPhoto({ src, alt = "", sizes, preload = false }: { src: string; alt?: string; sizes: string; preload?: boolean }) {
  const illustrative = src === "/products/hp-x360-reference.webp" || src === "/products/hp-elitebook-reference.webp";
  return <>
    <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className={illustrative ? "reference-photo" : undefined} />
    {illustrative && <span className="photo-note">Illustrative photo</span>}
  </>;
}
