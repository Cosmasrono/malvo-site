import type { Metadata } from "next";

export const metadata: Metadata = { title: "Image credits" };

export default function ImageCredits() {
  return (
    <div className="wrap page credits-page">
      <p className="eyebrow">THE PHOTOS BEHIND THE STORE</p>
      <h1>Image credits</h1>
      <p>The two HP laptop photos illustrate similar models. They are not photographs of the exact products offered.</p>
      <ul>
        <li><h2>HP EliteBook x360 reference photo</h2><p><a href="https://commons.wikimedia.org/wiki/File:HP_EliteBook_x360_1020_G2.png">HP EliteBook x360 1020 G2</a> by <a href="https://commons.wikimedia.org/wiki/User:Infinatious">Infinatious</a>, licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Resized and converted to WebP; the adapted image remains under the same license.</p></li>
        <li><h2>HP EliteBook reference photo</h2><p><a href="https://commons.wikimedia.org/wiki/File:HP_EliteBook_850_G5.png">HP EliteBook 850 G5</a> by <a href="https://commons.wikimedia.org/wiki/User:Infinatious">Infinatious</a>, licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Resized and converted to WebP; the adapted image remains under the same license.</p></li>
        <li><h2>Landing page workspace photo</h2><p><a href="https://commons.wikimedia.org/wiki/File:Desk-laptop-notebook-table_(23697249344).jpg">Desk-laptop-notebook-table</a> by www.Pixel.la Free Stock Photos, released under <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0</a>. Resized and converted to WebP.</p></li>
      </ul>
    </div>
  );
}
