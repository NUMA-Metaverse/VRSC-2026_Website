import manifestJson from "@/lib/generated/image-manifest.json";
import { IMAGE_FORMATS, type ImageManifest, variantPath, variantWidths } from "@/lib/images";

// scripts/build-images.mts が書き出した画像の一覧を引く。ビルド時にだけ使う。
// src は assets/ からのパス。例: "/images/a.webp"

const manifest: ImageManifest = manifestJson;

export function getImage(src: string) {
  const image = manifest[src];
  if (!image) throw new Error(`画像 ${src} が見つかりません。assets/ に置いてから npm run images を実行してください。`);
  return image;
}

// 新しいタブで拡大して見るときや、検索エンジンに伝えるときの、いちばん大きな画像のURL。
export function fullImageUrl(src: string) {
  const image = getImage(src);
  const widths = variantWidths(image.width);
  return variantPath(image, widths[widths.length - 1], IMAGE_FORMATS[IMAGE_FORMATS.length - 1]);
}
