// assets/ の元の画像から、表示する大きさに合った幅のAVIFとWebPを public/_img/ に書き出す。
// npm run dev と npm run build の前に自動で動く。前回から変わっていない画像は作り直さない。
// assets/ は公開されず、書き出したものだけが公開される。
//
//   assets/images/a.webp → public/_img/<hash>-{96,160,...}.{avif,webp}
//
// ファビコンなど決まった名前で使う画像は、lib/images.ts の FIXED_PNGS に従ってPNGでも書き出す。
// 元の画像のパスと、幅・高さ・hash の対応は lib/generated/image-manifest.json に書き、<Picture> がそれを読む。

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { availableParallelism } from "node:os";
import path from "node:path";
import sharp from "sharp";
import {
  FIXED_PNGS,
  fixedPngPath,
  IMAGE_FORMATS,
  IMAGE_OUTPUT_DIR,
  IMAGE_SOURCE_DIR,
  IMAGE_WIDTHS,
  type ImageFormat,
  type ImageInfo,
  type ImageManifest,
  variantPath,
  variantWidths,
} from "../lib/images.ts";

const SOURCE_DIR = path.resolve(IMAGE_SOURCE_DIR);
const PUBLIC_DIR = path.resolve("public");
const OUTPUT_DIR = path.join(PUBLIC_DIR, IMAGE_OUTPUT_DIR);
const MANIFEST_PATH = path.resolve("lib/generated/image-manifest.json");
const SOURCE_EXTENSIONS = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);

const ENCODER_OPTIONS = {
  avif: { quality: 55, effort: 4 },
  webp: { quality: 78, effort: 5 },
} satisfies Record<ImageFormat, object>;

// 書き出しの設定を変えたら、すべての画像を作り直す。
const SETTINGS = JSON.stringify({ IMAGE_WIDTHS, IMAGE_FORMATS, ENCODER_OPTIONS, versions: sharp.versions });

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(fullPath);
    else yield fullPath;
  }
}

// 元の画像は、assets/ からの位置("/images/a.webp")で呼ぶ。
const toSourceKey = (file: string) => `/${path.relative(SOURCE_DIR, file).split(path.sep).join("/")}`;
const toSourceFile = (key: string) => path.join(SOURCE_DIR, ...key.split("/"));
// 書き出したものは、サイトでのURL("/_img/...")から public/ の中の位置にする。
const toPublicFile = (url: string) => path.join(PUBLIC_DIR, ...url.split("/"));

const variantsOf = (image: ImageInfo) =>
  variantWidths(image.width).flatMap((width) =>
    IMAGE_FORMATS.map((format) => ({ width, format, file: toPublicFile(variantPath(image, width, format)) })),
  );

async function readManifest(): Promise<ImageManifest> {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  } catch {
    return {};
  }
}

// 同じ中身の画像が複数あっても、書き出しは1回だけにする。
const writing = new Map<string, Promise<void>>();

async function buildImage(src: string, previous: ImageInfo | undefined): Promise<{ info: ImageInfo; built: boolean }> {
  // sharp にパスを渡すと、Windowsでは元の画像を開いたままになることがあるので、中身を読んで渡す。
  const input = await readFile(toSourceFile(src));
  const hash = createHash("sha256").update(SETTINGS).update(input).digest("hex").slice(0, 16);
  if (previous?.hash === hash && variantsOf(previous).every(({ file }) => existsSync(file))) {
    return { info: previous, built: false };
  }

  // 撮影時の向きの情報があれば、その向きに直してから書き出す。
  const { autoOrient } = await sharp(input).metadata();
  const info: ImageInfo = { width: autoOrient.width, height: autoOrient.height, hash };
  if (!writing.has(hash)) {
    const source = sharp(input).autoOrient();
    writing.set(hash, Promise.all(variantsOf(info).map(({ width, format, file }) =>
      source.clone().resize({ width }).toFormat(format, ENCODER_OPTIONS[format]).toFile(file),
    )).then(() => {}));
  }
  await writing.get(hash);
  return { info, built: true };
}

async function main() {
  const startedAt = performance.now();
  const previous = await readManifest();
  await mkdir(OUTPUT_DIR, { recursive: true });

  const sources: string[] = [];
  for await (const file of walk(SOURCE_DIR)) {
    if (SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase())) sources.push(toSourceKey(file));
  }
  sources.sort();

  // sharp は1枚の処理の中でも並列に動くので、同時に扱う枚数は控えめにする。
  const manifest: ImageManifest = {};
  let built = 0;
  const queue = [...sources];
  const workers = Array.from({ length: Math.max(1, Math.floor(availableParallelism() / 2)) }, async () => {
    for (let src = queue.shift(); src; src = queue.shift()) {
      const result = await buildImage(src, previous[src]);
      manifest[src] = result.info;
      if (result.built) {
        built += 1;
        console.log(`  built ${src}`);
      }
    }
  });
  await Promise.all(workers);

  // 決まった名前のPNG。小さく軽いので、毎回作り直す。
  await Promise.all(FIXED_PNGS.map(async ({ src, width, name }) => {
    const input = await readFile(toSourceFile(src));
    await sharp(input).autoOrient().resize({ width }).png({ palette: true, effort: 10 }).toFile(toPublicFile(fixedPngPath(name)));
  }));

  // 元の画像を消したり差し替えたりしたときに残る、古い書き出しを片付ける。
  const expected = new Set([
    ...sources.flatMap((src) => variantsOf(manifest[src]).map(({ file }) => file)),
    ...FIXED_PNGS.map(({ name }) => toPublicFile(fixedPngPath(name))),
  ]);
  for (const name of await readdir(OUTPUT_DIR)) {
    const file = path.join(OUTPUT_DIR, name);
    if (!expected.has(file)) await rm(file, { recursive: true });
  }

  const sorted = Object.fromEntries(sources.map((src) => [src, manifest[src]]));
  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await writeFile(MANIFEST_PATH, `${JSON.stringify(sorted, null, 2)}\n`);

  const seconds = ((performance.now() - startedAt) / 1000).toFixed(1);
  console.log(`images: ${sources.length} sources, ${built} built, ${sources.length - built} unchanged (${seconds}s)`);
}

await main();
