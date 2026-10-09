// 画像の書き出し方の決まり。ビルド前に画像を作るスクリプト(scripts/build-images.ts)と、
// 画像を表示する部品(components/ui/Picture.tsx)の両方がこれに従う。
// public/ に置いた画像は、ここに書いた幅と形式の画像に自動で書き出される。

// 書き出す幅。元の画像より大きい幅は作らず、代わりに元の幅のものを作る。
export const IMAGE_WIDTHS = [96, 160, 256, 384, 640, 960, 1280, 1920, 2560] as const;

// 対応しているブラウザが先に選ぶよう、軽い形式から並べる。最後の形式は <img> 自体に使う。
export const IMAGE_FORMATS = ["avif", "webp"] as const;
export type ImageFormat = (typeof IMAGE_FORMATS)[number];

// 書き出した画像を置く public/ の中のフォルダ。
export const IMAGE_OUTPUT_DIR = "_img";

// ファビコンのように、決まった名前のPNGで参照する画像。public/_img/<name> に書き出す。
export const FIXED_PNGS = [
  { src: "/icon.png", width: 48, name: "favicon-48.png" },
  { src: "/icon.png", width: 180, name: "apple-touch-icon.png" },
  { src: "/icon.png", width: 192, name: "icon-192.png" },
] as const;

export type FixedPngName = (typeof FIXED_PNGS)[number]["name"];

export function fixedPngPath(name: FixedPngName) {
  return `/${IMAGE_OUTPUT_DIR}/${name}`;
}

export type ImageInfo = {
  width: number;
  height: number;
  // 元の画像と書き出しの設定から作った値。どちらかが変わったら作り直す。
  hash: string;
};

export type ImageManifest = Record<string, ImageInfo>;

export function variantWidths(originalWidth: number): number[] {
  const largest = Math.min(originalWidth, IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1]);
  return [...IMAGE_WIDTHS.filter((width) => width < largest), largest];
}

// 書き出した画像の名前には、元のパスではなく hash を使う。
// srcset に並べてもHTMLが長くならず、画像を差し替えればURLも変わるので古いものが残らない。
// 例: 幅640のAVIF → "/_img/3f2a9c0d1b7e4a65-640.avif"
export function variantPath(image: Pick<ImageInfo, "hash">, width: number, format: ImageFormat) {
  return `/${IMAGE_OUTPUT_DIR}/${image.hash}-${width}.${format}`;
}
