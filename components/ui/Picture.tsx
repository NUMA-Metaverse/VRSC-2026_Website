import type { CSSProperties } from "react";
import manifestJson from "@/lib/generated/image-manifest.json";
import { IMAGE_FORMATS, type ImageFormat, type ImageInfo, type ImageManifest, variantPath, variantWidths } from "@/lib/images";

// ビルド前に scripts/build-images.mts が書き出した画像を、<picture> で出し分ける。
// ブラウザは対応している形式のうち軽いものを選び、sizes と画面の細かさに合った幅の画像を読む。
// ウィンドウを広げたり拡大したりして足りなくなれば、より大きな幅の画像に自動で切り替わる。

const manifest: ImageManifest = manifestJson;

const FILL_STYLE: CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };

function getImage(src: string) {
  const image = manifest[src];
  if (!image) throw new Error(`画像 ${src} が見つかりません。public/ に置いてから npm run images を実行してください。`);
  return image;
}

// sizes がすべて px で決まっているとき(アイコンなど)は、画面の細かさが3倍の端末で足りる幅までに絞る。
// srcset が短くなり、HTMLが軽くなる。vw などを含むときは、すべての幅を並べる。
const MAX_DEVICE_PIXEL_RATIO = 3;

function usefulWidths(originalWidth: number, sizes: string) {
  const widths = variantWidths(originalWidth);
  const lengths = sizes.split(",").map((entry) => entry.trim().split(/\s+/).at(-1) ?? "");
  if (!lengths.every((length) => /^\d+px$/.test(length))) return widths;
  const needed = Math.max(...lengths.map((length) => parseInt(length, 10))) * MAX_DEVICE_PIXEL_RATIO;
  const enough = widths.findIndex((width) => width >= needed);
  return enough === -1 ? widths : widths.slice(0, enough + 1);
}

function srcSet(image: ImageInfo, widths: number[], format: ImageFormat) {
  return widths.map((width) => `${variantPath(image, width, format)} ${width}w`).join(", ");
}

// 新しいタブで拡大して見るときの、いちばん大きな画像。
export function fullImageUrl(src: string) {
  const image = getImage(src);
  const widths = variantWidths(image.width);
  return variantPath(image, widths[widths.length - 1], IMAGE_FORMATS[IMAGE_FORMATS.length - 1]);
}

type PictureProps = {
  // public/ からのパス。例: "/images/a.webp"
  src: string;
  alt: string;
  // 画面の上でこの画像が表示される幅。
  sizes: string;
  // 親の要素いっぱいに広げる。親に position を付けておく。
  fill?: boolean;
  // 最初の画面に映る大きな画像に付けると、ほかより先に読み込む。
  priority?: boolean;
  loading?: "eager" | "lazy";
};

export function Picture({ src, alt, sizes, fill = false, priority = false, loading = "lazy" }: PictureProps) {
  const image = getImage(src);
  const widths = usefulWidths(image.width, sizes);
  const fallbackFormat = IMAGE_FORMATS[IMAGE_FORMATS.length - 1];
  const fallbackWidth = widths.find((width) => width >= 640) ?? widths[widths.length - 1];

  return (
    <picture>
      {IMAGE_FORMATS.slice(0, -1).map((format) => (
        <source key={format} type={`image/${format}`} srcSet={srcSet(image, widths, format)} sizes={sizes} />
      ))}
      <img
        src={variantPath(image, fallbackWidth, fallbackFormat)}
        srcSet={srcSet(image, widths, fallbackFormat)}
        sizes={sizes}
        alt={alt}
        width={fill ? undefined : image.width}
        height={fill ? undefined : image.height}
        loading={priority ? "eager" : loading}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        style={fill ? FILL_STYLE : undefined}
      />
    </picture>
  );
}
