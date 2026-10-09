// npm run build の後に自動で動き、out/_img/ のうち、どのページからも使われていない画像を消す。
// 書き出しは使われそうな幅をすべて作るが、公開するのは実際に参照されているものだけにする。
// public/_img/ (次のビルドで使い回す分)には触らない。

import { readdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import { IMAGE_OUTPUT_DIR } from "../lib/images.ts";

const OUT_DIR = path.resolve("out");
const IMAGE_DIR = path.join(OUT_DIR, IMAGE_OUTPUT_DIR);
const TEXT_EXTENSIONS = new Set([".css", ".html", ".js", ".json", ".txt", ".webmanifest", ".xml"]);
const REFERENCE = new RegExp(`/${IMAGE_OUTPUT_DIR}/([\\w.-]+)`, "g");

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(fullPath);
    else yield fullPath;
  }
}

const referenced = new Set<string>();
for await (const file of walk(OUT_DIR)) {
  if (file.startsWith(IMAGE_DIR + path.sep) || !TEXT_EXTENSIONS.has(path.extname(file))) continue;
  for (const [, name] of (await readFile(file, "utf8")).matchAll(REFERENCE)) referenced.add(name);
}

const existing = new Set(await readdir(IMAGE_DIR));

// ページが参照しているのに無い画像があれば、表示が壊れるので止める。
const missing = [...referenced].filter((name) => !existing.has(name));
if (missing.length > 0) throw new Error(`参照されている画像がありません: ${missing.join(", ")}`);

let removed = 0;
let removedBytes = 0;
for (const name of existing) {
  if (referenced.has(name)) continue;
  const file = path.join(IMAGE_DIR, name);
  removedBytes += (await stat(file)).size;
  await rm(file);
  removed += 1;
}

console.log(`images: kept ${referenced.size} referenced, removed ${removed} unused (${(removedBytes / 1024 / 1024).toFixed(1)}MB)`);
