"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { staff } from "@/data/staff";
import { getPeekEnabled, getPeekQuietMs, subscribePeekEnabled } from "@/lib/peekEnabled";
import { publicAsset } from "@/lib/site";
import { PEEK_RUSH_EVENT } from "@/lib/peekEnabled";

// ぶいなびの記事ページと同じように、時間をおいて左右どちらかの画面の端から、
// 制作と運営に関わった人のアバターがランダムに1体ずつ顔を出す。
// アバターを押すと、その人の「制作、運営」の一覧の欄へ移動する。

const members = staff.flatMap((member) => (member.avatar ? [{ ...member, avatar: member.avatar }] : []));
type Member = (typeof members)[number];

const FIRST_DELAY_MS = 10_000;
const INTERVAL_MIN_MS = 3_000;
const INTERVAL_MAX_MS = 6_000;
const VISIBLE_MS = 5_000;
// マウスを外した(キーボードの選択を外した)あとも、これだけは出したままにする。
const RELEASE_MS = 1_500;
const HIDE_MS = 900;

// 画像ごとの、頭(髪、耳、帽子、頭に乗せた物まで含む)が収まる枠と、足元の横の位置。
// どれも画像の幅と高さに対する割合。顔が画面の端で切れないようにする計算と、体の傾きの軸に使う。
// 上げた腕や翼は枠に入れない。枠の中でも透過している所は計算に入らない。
type FigureGuide = { head: { left: number; right: number; top: number; bottom: number }; footX: number };
const FIGURE_GUIDES: Record<string, FigureGuide> = {
  "/staff/01.webp": { head: { left: 0.46, right: 0.93, top: 0, bottom: 0.28 }, footX: 0.59 },
  "/staff/02.webp": { head: { left: 0.34, right: 0.7, top: 0, bottom: 0.3 }, footX: 0.495 },
  "/staff/03.webp": { head: { left: 0.21, right: 0.7, top: 0, bottom: 0.31 }, footX: 0.34 },
  "/staff/04.webp": { head: { left: 0.28, right: 0.69, top: 0, bottom: 0.37 }, footX: 0.48 },
  "/staff/05.webp": { head: { left: 0.31, right: 0.72, top: 0, bottom: 0.4 }, footX: 0.45 },
  "/staff/06.webp": { head: { left: 0.2, right: 0.72, top: 0, bottom: 0.42 }, footX: 0.53 },
  "/staff/07.webp": { head: { left: 0.26, right: 0.7, top: 0, bottom: 0.37 }, footX: 0.535 },
  "/staff/08.webp": { head: { left: 0.4, right: 0.75, top: 0, bottom: 0.21 }, footX: 0.55 },
  "/staff/09.webp": { head: { left: 0, right: 0.33, top: 0, bottom: 0.21 }, footX: 0.45 },
  "/staff/11.webp": { head: { left: 0.16, right: 0.64, top: 0, bottom: 0.24 }, footX: 0.49 },
  "/staff/12.webp": { head: { left: 0.17, right: 0.65, top: 0, bottom: 0.22 }, footX: 0.43 },
  "/staff/14.webp": { head: { left: 0.14, right: 0.67, top: 0, bottom: 0.26 }, footX: 0.467 },
};

// 押せる範囲の判定に使う、アバター画像の形の粗い地図。
// 透過していない部分を少し太らせ、周りを囲まれた透過の穴は埋める。
// こうすると、髪の隙間や1ピクセルだけ透けた所を押しても反応が途切れない。
// head は頭の枠の中の、透過していない升目の中心(画像に対する割合で x, y の順に並べたもの)。
// body は画像全体の透過していない升目の中心で、画面の外へ隠すときの距離を決めるのに使う。
type HitMask = {
  cols: number;
  rows: number;
  cells: Uint8Array;
  head: Float32Array;
  headCenter: { x: number; y: number };
  body: Float32Array;
  footX: number;
};
const MASK_COLS = 96;
const ALPHA_THRESHOLD = 24;
const DILATE_CELLS = 2;

// 枠を用意していない画像のための目安。
// 人の上から8%から22%の帯(おおむね頭の高さ)の各行で、透過していない所がいちばん長く続く区間の中心を取り、
// その中央値を頭の位置とする。いちばん長い区間だけを見るので、頭の横に離れて上げた腕や翼に引っ張られない。
function findHeadX(opaque: Uint8Array, cols: number, rows: number) {
  let top = -1;
  let bottom = -1;
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!opaque[y * cols + x]) continue;
      if (top < 0) top = y;
      bottom = y;
      break;
    }
  }
  if (top < 0) return 0.5;
  const span = bottom - top;
  const centers: number[] = [];
  for (let y = top + Math.floor(span * 0.08); y <= top + Math.floor(span * 0.22); y += 1) {
    let best = 0;
    let center = -1;
    let run = 0;
    for (let x = 0; x <= cols; x += 1) {
      if (x < cols && opaque[y * cols + x]) {
        run += 1;
        continue;
      }
      if (run > best) {
        best = run;
        center = x - run / 2;
      }
      run = 0;
    }
    if (center >= 0) centers.push(center);
  }
  if (centers.length === 0) return 0.5;
  centers.sort((a, b) => a - b);
  return centers[Math.floor(centers.length / 2)] / cols;
}

// 一番下の8%の行で、透過していない所の横の重心を足元とする。
function findFootX(opaque: Uint8Array, cols: number, rows: number) {
  let sum = 0;
  let count = 0;
  for (let y = Math.floor(rows * 0.92); y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!opaque[y * cols + x]) continue;
      sum += x + 0.5;
      count += 1;
    }
  }
  return count ? sum / count / cols : 0.5;
}

function buildHitMask(image: HTMLImageElement, src: string): HitMask | null {
  const cols = MASK_COLS;
  const rows = Math.max(1, Math.round((cols * image.naturalHeight) / image.naturalWidth));
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  context.drawImage(image, 0, 0, cols, rows);
  const pixels = context.getImageData(0, 0, cols, rows).data;

  const opaque = new Uint8Array(cols * rows);
  for (let i = 0; i < opaque.length; i += 1) opaque[i] = pixels[i * 4 + 3] > ALPHA_THRESHOLD ? 1 : 0;

  // 太らせる(半径 DILATE_CELLS の円の範囲)。
  const dilated = new Uint8Array(cols * rows);
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!opaque[y * cols + x]) continue;
      for (let dy = -DILATE_CELLS; dy <= DILATE_CELLS; dy += 1) {
        for (let dx = -DILATE_CELLS; dx <= DILATE_CELLS; dx += 1) {
          if (dx * dx + dy * dy > DILATE_CELLS * DILATE_CELLS) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) dilated[ny * cols + nx] = 1;
        }
      }
    }
  }

  // 外側から塗りつぶして届かなかった透過の部分は、囲まれた穴なので押せる範囲に含める。
  const outside = new Uint8Array(cols * rows);
  const stack: number[] = [];
  const push = (x: number, y: number) => {
    const index = y * cols + x;
    if (!dilated[index] && !outside[index]) {
      outside[index] = 1;
      stack.push(index);
    }
  };
  for (let x = 0; x < cols; x += 1) {
    push(x, 0);
    push(x, rows - 1);
  }
  for (let y = 0; y < rows; y += 1) {
    push(0, y);
    push(cols - 1, y);
  }
  while (stack.length) {
    const index = stack.pop()!;
    const x = index % cols;
    const y = (index - x) / cols;
    if (x > 0) push(x - 1, y);
    if (x < cols - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < rows - 1) push(x, y + 1);
  }
  const cells = new Uint8Array(cols * rows);
  for (let i = 0; i < cells.length; i += 1) cells[i] = outside[i] ? 0 : 1;

  let guide = FIGURE_GUIDES[src];
  if (!guide) {
    const headX = findHeadX(opaque, cols, rows);
    guide = {
      head: { left: Math.max(0, headX - 0.22), right: Math.min(1, headX + 0.22), top: 0, bottom: 0.26 },
      footX: findFootX(opaque, cols, rows),
    };
  }
  const head: number[] = [];
  const body: number[] = [];
  let centerX = 0;
  let centerY = 0;
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!opaque[y * cols + x]) continue;
      const u = (x + 0.5) / cols;
      const v = (y + 0.5) / rows;
      body.push(u, v);
      if (u < guide.head.left || u > guide.head.right || v < guide.head.top || v > guide.head.bottom) continue;
      head.push(u, v);
      centerX += u;
      centerY += v;
    }
  }
  const headCount = head.length / 2;
  return {
    cols,
    rows,
    cells,
    head: new Float32Array(head),
    headCenter: headCount
      ? { x: centerX / headCount, y: centerY / headCount }
      : { x: (guide.head.left + guide.head.right) / 2, y: (guide.head.top + guide.head.bottom) / 2 },
    body: new Float32Array(body),
    footX: guide.footX,
  };
}

// 画像の形を読めなかったとき(canvas が使えないときなど)の代わり。画像の四隅だけを体として扱う。
const FALLBACK_MASK: HitMask = {
  cols: 1,
  rows: 1,
  cells: new Uint8Array([1]),
  head: new Float32Array(),
  headCenter: { x: 0.5, y: 0.15 },
  body: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
  footX: 0.5,
};

type Side = "is-left" | "is-right";
type VerticalZone = "top" | "middle" | "bottom";

// 顔を画面の端からこれだけ内側に収める(白い縁と影の分も含む)。
const FACE_MARGIN = 14;
// 出てくるとき、引っ込むときに、止まっている姿勢よりこれだけ深く体を傾けておく。
// 傾きが浅いと腰から下が端からのぞくので、動いている間も止まっている姿勢より浅くはしない。
const ENTER_EXTRA_LEAN = 9;
// 止まっている間に、ゆっくり行き来する傾きの幅。こちらも深くする向きにだけ揺らす。
const SWAY_LEAN = 1.6;

type Layout = {
  top: number;
  width: number;
  height: number;
  rotation: number; // 止まっている姿勢での画像の回転(CSS の向き、度)
  hiddenRotation: number; // 画面の外にいるときの回転
  sway: number; // 揺れの幅(CSS の向き、度)
  pivotX: number; // 回転の中心(画像の幅に対する割合)
  originY: number; // 回転の中心(画像の高さに対する割合)
  containerX: number; // 外側の要素を、回転の中心が画面の端に来るように動かす量(px)
  hideX: number; // 画面の外へ隠すときの、画像の横の移動量(px)
};

type LayoutInput = {
  mask: HitMask;
  aspect: number; // 幅 / 高さ
  zone: VerticalZone;
  side: Side;
  viewport: number;
  safeTop: number;
  mobile: boolean;
  random: () => number;
};

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

// 左右どちらでも、画面の端を x = 0、内側を x の正の向きとして考える。
// 右から出るときは画像を左右に反転した形で計算し、最後に回転の向きを戻す。
function computeLayout({ mask, aspect, zone, side, viewport, safeTop, mobile, random }: LayoutInput): Layout {
  const between = (min: number, max: number) => min + random() * (max - min);
  const mirror = (u: number) => (side === "is-left" ? u : 1 - u);

  let height: number;
  let top: number;
  let lean: number; // 体の軸の傾き(内側へ頭を出す向きが正、度)
  let maxLean: number;
  let originY: number;
  let shift: number; // 回転の中心を画面の端から内側へずらす量(px)。負なら外側。
  let sink = 0;

  if (zone === "bottom") {
    // 画面下端の角から身を乗り出す。足元は画面下端に隠れる。
    const heightMin = mobile ? 240 : 400;
    const heightMax = mobile ? 290 : 500;
    lean = Math.round(between(mobile ? 14 : 16, mobile ? 18 : 22));
    maxLean = lean + 10;
    sink = between(mobile ? 0.28 : 0.26, mobile ? 0.4 : 0.38);
    const fit = (viewport - safeTop) / (Math.cos(toRadians(lean)) - sink);
    height = Math.round(Math.max(120, Math.min(between(heightMin, heightMax), fit)));
    top = Math.round(viewport + sink * height - height);
    originY = 1;
    shift = 0;
  } else if (zone === "middle") {
    // 画面中央付近の壁から顔と上半身を覗き込む。
    // 腰(originY: 0.52)を中心に傾けることで、足元は壁の向こう(画面外)に隠れる。
    lean = Math.round(between(mobile ? 10 : 12, mobile ? 14 : 16));
    maxLean = lean + 8;
    height = Math.round(between(mobile ? 220 : 340, mobile ? 270 : 430));
    const jitter = between(-viewport * 0.08, viewport * 0.08);
    top = Math.round(Math.max(safeTop + 16, Math.min(viewport - height * 0.5, viewport * 0.5 + jitter - height * 0.4)));
    originY = 0.52;
    shift = -18;
  } else {
    // 上部ゾーン: ヘッダー下〜中央上の壁から顔を覗き込む。
    lean = Math.round(between(mobile ? 9 : 11, mobile ? 13 : 15));
    maxLean = lean + 8;
    height = Math.round(between(mobile ? 200 : 320, mobile ? 250 : 400));
    const zoneTop = safeTop + 16;
    const zoneBottom = Math.max(zoneTop + 30, viewport * 0.36);
    top = Math.round(between(zoneTop, zoneBottom));
    originY = 0.52;
    shift = -18;
  }
  const width = Math.round(height * aspect);

  // 足元から頭へ向かう線を体の軸とし、その傾きを、画像の中で人がもともと傾いている分として差し引く。
  // こうすると、画像の中で体が斜めになっていても、画面の上ではどの人も同じくらい傾いて見える。
  const footX = mirror(mask.footX) * width;
  const headX = mirror(mask.headCenter.x) * width;
  const headY = mask.headCenter.y * height;
  const ownLean = (Math.atan2(headX - footX, height - headY) * 180) / Math.PI;
  // 回転の中心は、体の軸の上で、高さが originY の所。
  const pivotX = footX + ((headX - footX) * (height - originY * height)) / Math.max(1, height - headY);
  const pivotY = originY * height;

  // 回転の中心を画面の端(から shift だけ内側)に置いて、体を lean だけ傾けたときの、点の位置。
  const place = (points: Float32Array, leanDegrees: number, offset: number) => {
    const angle = toRadians(leanDegrees - ownLean);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < points.length; i += 2) {
      const dx = mirror(points[i]) * width - pivotX;
      const dy = points[i + 1] * height - pivotY;
      const x = offset + dx * cos - dy * sin;
      const y = pivotY + dx * sin + dy * cos;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    return { minX, maxX, minY, maxY };
  };

  // 升目の中心で計算しているので、升目の半分の大きさを余白に足す。
  const cellHalf = (Math.max(width / mask.cols, height / mask.rows) / 2) * 1.5;
  const margin = FACE_MARGIN + cellHalf;

  // 顔が端で切れるなら、まず体をもう少し深く傾け、それでも足りなければ全体を内側へずらす。
  if (mask.head.length) {
    while (lean < maxLean && place(mask.head, lean, shift).minX < margin) lean += 0.5;
    const face = place(mask.head, lean, shift);
    if (face.minX < margin) shift += margin - face.minX;

    // 頭がヘッダーの下に潜ったり、画面の下にはみ出したりしないように上下を直す。
    const settled = place(mask.head, lean, shift);
    const faceTop = top + settled.minY;
    const faceBottom = top + settled.maxY;
    if (faceTop < safeTop + 6) top += Math.ceil(safeTop + 6 - faceTop);
    else if (zone !== "bottom" && faceBottom > viewport - 12) top -= Math.ceil(faceBottom - viewport + 12);
  }

  // 画面の外では、白い縁と影ごと見えなくなる所まで外へ出しておく。
  // 出てくる前は止まっている姿勢より深く傾け、引っ込むときは止まっている姿勢(と揺れの分)のまま外へ出る。
  const reach = Math.max(
    place(mask.body, lean + ENTER_EXTRA_LEAN, shift).maxX,
    place(mask.body, lean, shift).maxX,
    place(mask.body, lean + SWAY_LEAN, shift).maxX,
  );
  const hideX = -(Math.max(0, reach) + 40);

  const sign = side === "is-left" ? 1 : -1;
  const pivotFromLeft = mirror(pivotX / width) * width;
  return {
    top,
    width,
    height,
    rotation: sign * (lean - ownLean),
    hiddenRotation: sign * (lean + ENTER_EXTRA_LEAN - ownLean),
    sway: sign * SWAY_LEAN,
    pivotX: pivotFromLeft / width,
    originY,
    containerX: side === "is-left" ? -pivotFromLeft + shift : width - pivotFromLeft - shift,
    hideX: sign * hideX,
  };
}

type Peek = Layout & {
  id: number;
  member: Member;
  side: Side;
  zone: VerticalZone;
  active: boolean;
  leaving: boolean;
  rushing?: boolean;
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function shuffled<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function PeekAvatar() {
  const [peek, setPeek] = useState<Peek | null>(null);
  const peekRef = useRef<Peek | null>(null);
  const containerRef = useRef<HTMLAnchorElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const masks = useRef(new Map<string, HitMask | null>());
  const holding = useRef({ hover: false, focus: false });
  const hideRef = useRef<() => void>(() => {});
  const releaseRef = useRef<() => void>(() => {});

  const update = useCallback((next: Peek | null) => {
    peekRef.current = next;
    setPeek(next);
  }, []);

  // 画面上の点が、いま出ているアバターの押せる範囲に入っているか。
  const hitTest = useCallback((clientX: number, clientY: number) => {
    const current = peekRef.current;
    const container = containerRef.current;
    if (!current?.active || !container) return false;
    const mask = masks.current.get(current.member.avatar.src);
    if (!mask) return false;
    const rect = container.getBoundingClientRect();
    const width = current.width;
    const height = current.height;
    if (!width || !height) return false;

    // container は画面端に配置されており、img は container 内で (originX, originY) を中心に回転している。
    const theta = current.rotation * (Math.PI / 180);
    const originX = width * current.pivotX;
    const originY = height * current.originY;

    // container 左上からの相対座標
    const relX = clientX - rect.left;
    const relY = clientY - rect.top;

    // 回転中心からのベクトルを逆回転してテクスチャ座標 (u, v) を逆算
    const dx = relX - originX;
    const dy = relY - originY;
    const px = dx * Math.cos(-theta) - dy * Math.sin(-theta) + originX;
    const py = dx * Math.sin(-theta) + dy * Math.cos(-theta) + originY;

    const u = px / width;
    const v = py / height;
    if (u < 0 || u >= 1 || v < 0 || v >= 1) return false;
    return mask.cells[Math.floor(v * mask.rows) * mask.cols + Math.floor(u * mask.cols)] === 1;
  }, []);

  const goToMember = useCallback((member: Member) => {
    hideRef.current();
    const target = document.getElementById(member.id);
    if (!target) return;
    // ハッシュを変えると、ヘッダーの高さを考えた位置へ移動し、:target で欄が目立つ。
    if (window.location.hash === `#${member.id}`) {
      target.scrollIntoView({ block: "start" });
      target.classList.remove("is-flashing");
      void target.offsetWidth;
      target.classList.add("is-flashing");
    } else {
      window.location.hash = member.id;
    }
  }, []);

  // アバターの上に重なるクリックやタップは、透過していない所(とその周り)だけ受け取る。
  // それ以外は下にあるページへそのまま通す。
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const current = peekRef.current;
      if (!current || !hitTest(event.clientX, event.clientY)) return;
      event.preventDefault();
      event.stopPropagation();
      goToMember(current.member);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const over = hitTest(event.clientX, event.clientY);
      if (over === holding.current.hover) return;
      holding.current.hover = over;
      document.documentElement.classList.toggle("is-over-peek-avatar", over);
      if (!over) releaseRef.current();
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointermove", onPointerMove);
      document.documentElement.classList.remove("is-over-peek-avatar");
    };
  }, [goToMember, hitTest]);

  useEffect(() => {
    if (members.length === 0) return;
    const mobile = window.matchMedia("(max-width: 1023px)");
    const drawer = window.matchMedia("(max-width: 760px)");
    const isDrawerOpen = () => drawer.matches && !!document.querySelector(".site-header.is-open");
    const timers = new Set<number>();
    let hideTimer: number | undefined;
    let queue: Member[] = [];
    let last: Member | undefined;

    // 上・中・下のゾーンを均等に巡回させるシャッフルバッグ
    let zoneBag: VerticalZone[] = [];
    let lastZone: VerticalZone | undefined;
    const nextZone = (): VerticalZone => {
      if (zoneBag.length === 0) {
        zoneBag = shuffled(["top", "middle", "bottom"] as VerticalZone[]);
        if (zoneBag.length > 1 && zoneBag[0] === lastZone) {
          const first = zoneBag.shift()!;
          zoneBag.push(first);
        }
      }
      lastZone = zoneBag.shift()!;
      return lastZone;
    };

    // 左右の偏りを防ぎ、交互をベースにしつつ適度な揺らぎ（連続最大2回）を保つ
    let lastSide: "is-left" | "is-right" | undefined;
    let sideRepeatCount = 0;
    const nextSide = (): "is-left" | "is-right" => {
      // 狭い画面でメニューのドロワー(右側)を開いている間だけ、アバターは必ず左側から出す。
      if (isDrawerOpen()) {
        lastSide = "is-left";
        sideRepeatCount = 1;
        return lastSide;
      }
      if (!lastSide) {
        lastSide = Math.random() < 0.5 ? "is-left" : "is-right";
        sideRepeatCount = 1;
        return lastSide;
      }
      if (sideRepeatCount >= 2) {
        lastSide = lastSide === "is-left" ? "is-right" : "is-left";
        sideRepeatCount = 1;
        return lastSide;
      }
      const flip = Math.random() < 0.75;
      if (flip) {
        lastSide = lastSide === "is-left" ? "is-right" : "is-left";
        sideRepeatCount = 1;
      } else {
        sideRepeatCount += 1;
      }
      return lastSide;
    };

    const later = (callback: () => void, delay: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        callback();
      }, delay);
      timers.add(id);
      return id;
    };
    // 次に出すための予約は常に1つだけ。新しく予約するときは前の予約を取り消す。
    let nextTimer: number | undefined;
    let loading = false;
    const scheduleNext = (delay = randomBetween(INTERVAL_MIN_MS, INTERVAL_MAX_MS)) => {
      if (nextTimer !== undefined) {
        window.clearTimeout(nextTimer);
        timers.delete(nextTimer);
      }
      nextTimer = later(() => {
        nextTimer = undefined;
        show();
      }, delay);
    };

    // 全員が1回ずつ出てから次の周に入る。周の変わり目で同じ人が続かないようにする。
    const nextMember = () => {
      if (queue.length === 0) {
        queue = shuffled(members);
        if (queue.length > 1 && queue[queue.length - 1] === last) queue.unshift(queue.pop()!);
      }
      last = queue.pop()!;
      return last;
    };

    const hide = (rushing = false) => {
      if (hideTimer !== undefined) {
        window.clearTimeout(hideTimer);
        timers.delete(hideTimer);
        hideTimer = undefined;
      }
      const current = peekRef.current;
      if (!current?.active) return;
      holding.current.hover = false;
      document.documentElement.classList.remove("is-over-peek-avatar");
      update({ ...current, active: false, leaving: true, rushing });
      scheduleNext(HIDE_MS + randomBetween(INTERVAL_MIN_MS, INTERVAL_MAX_MS));
    };
    hideRef.current = () => hide();
    // ロケットのアバターが飛び出すときは、出ているアバターがすごい速さで端へ戻る。
    // すでにゆっくり引っ込み始めているもの(5回目のボタンでオフになった場合など)も、速い引っ込みに切り替える。
    const onRush = () => {
      const current = peekRef.current;
      if (current?.leaving) {
        if (!current.rushing) update({ ...current, rushing: true });
        return;
      }
      hide(true);
    };
    window.addEventListener(PEEK_RUSH_EVENT, onRush);

    const scheduleHide = (delay: number) => {
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
      hideTimer = later(() => {
        hideTimer = undefined;
        // マウスを乗せている間とキーボードで選んでいる間は引っ込めない。
        if (holding.current.hover || holding.current.focus) return;
        hide();
      }, delay);
    };
    releaseRef.current = () => {
      if (peekRef.current?.active) scheduleHide(RELEASE_MS);
    };

    function show() {
      if (document.hidden || !getPeekEnabled()) {
        scheduleNext();
        return;
      }
      // アバターが飛んでくる間とその直後は出さない。終わった頃にまた確かめる。
      const quiet = getPeekQuietMs();
      if (quiet > 0) {
        scheduleNext(quiet + randomBetween(200, 600));
        return;
      }
      if (loading) return;
      loading = true;
      const member = nextMember();
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        loading = false;
        // 読み込んでいる間にオフにされたら、出さない。
        if (!getPeekEnabled() || getPeekQuietMs() > 0) {
          scheduleNext(getPeekQuietMs() + randomBetween(200, 600));
          return;
        }
        if (!masks.current.has(member.avatar.src)) masks.current.set(member.avatar.src, buildHitMask(image, member.avatar.src));
        const header = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
        const zone = nextZone();
        const side = nextSide();
        const layout = computeLayout({
          mask: masks.current.get(member.avatar.src) ?? FALLBACK_MASK,
          aspect: member.avatar.width / member.avatar.height,
          zone,
          side,
          viewport: window.innerHeight,
          safeTop: Math.max(header + 16, 72),
          mobile: mobile.matches,
          random: Math.random,
        });

        const next: Peek = {
          ...layout,
          id: (peekRef.current?.id ?? 0) + 1,
          member,
          side,
          zone,
          active: false,
          leaving: false,
        };
        // 出るたびに新しい要素にする。前の要素を使い回すと、左右が入れ替わったときに、
        // 前の位置から滑り出して画面を横切ってしまう。
        flushSync(() => update(next));
        // 画面の外に置いてから、次のフレームで滑り込ませる。
        window.requestAnimationFrame(() =>
          window.requestAnimationFrame(() => {
            // 滑り込む直前に演出が始まったら、出さずに引っ込める。
            if (getPeekQuietMs() > 0 || !getPeekEnabled()) {
              update(null);
              scheduleNext(getPeekQuietMs() + randomBetween(200, 600));
              return;
            }
            update({ ...next, active: true });
            scheduleHide(VISIBLE_MS);
          }),
        );
      };
      image.onerror = () => {
        loading = false;
        scheduleNext();
      };
      image.src = publicAsset(member.avatar.src);
    }

    // ヘッダーのボタンでオフにしたとき、出ているアバターをすぐ引っ込める。
    const unsubscribe = subscribePeekEnabled(() => {
      if (!getPeekEnabled()) {
        hide();
        return;
      }
      // オンにしたときは、次の順番を待たずにすぐ誰かを出す。
      // 読み込み中なら、そのまま出てくる。いま出ているなら、そのままにする。
      if (loading || peekRef.current?.active) return;
      scheduleNext(0);
    });

    scheduleNext(FIRST_DELAY_MS);
    return () => {
      unsubscribe();
      window.removeEventListener(PEEK_RUSH_EVENT, onRush);
      timers.forEach((id) => window.clearTimeout(id));
      hideRef.current = () => {};
      releaseRef.current = () => {};
    };
  }, [update]);

  if (!peek) return null;
  const { member, side, active } = peek;

  return (
    <a
      key={peek.id}
      ref={containerRef}
      href={`#${member.id}`}
      className={`peek-avatar ${side}${active ? " is-active" : ""}${peek.leaving ? " is-leaving" : ""}${peek.rushing ? " is-rushing" : ""}`}
      aria-label={`${member.name}を制作、運営の一覧で見る`}
      aria-hidden={!active}
      tabIndex={active ? 0 : -1}
      onClick={(event) => {
        // キーボードで選んで押したとき。マウスとタップは上のクリックの判定で扱う。
        event.preventDefault();
        goToMember(member);
      }}
      onFocus={() => {
        holding.current.focus = true;
      }}
      onBlur={() => {
        holding.current.focus = false;
        releaseRef.current();
      }}
      style={{
        top: peek.top,
        width: peek.width,
        height: peek.height,
        "--peek-x": `${peek.containerX}px`,
        "--peek-rotation": `${peek.rotation}deg`,
        "--peek-hidden-rotation": `${peek.hiddenRotation}deg`,
        "--peek-hide-x": `${peek.hideX}px`,
        "--peek-sway": `${peek.sway}deg`,
        "--peek-pivot": `${peek.pivotX * 100}%`,
        "--peek-origin-y": `${peek.originY * 100}%`,
      } as React.CSSProperties}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={publicAsset(member.avatar.src)}
        alt=""
        width={member.avatar.width}
        height={member.avatar.height}
        draggable={false}
      />
    </a>
  );
}
