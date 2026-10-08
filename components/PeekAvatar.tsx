"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { staff } from "@/data/staff";
import { publicAsset } from "@/lib/site";

// ぶいなびの記事ページと同じように、時間をおいて左右どちらかの画面の端から、
// 制作と運営に関わった人のアバターがランダムに1体ずつ顔を出す。
// アバターを押すと、その人の「制作、運営」の一覧の欄へ移動する。

const members = staff.flatMap((member) => (member.avatar ? [{ ...member, avatar: member.avatar }] : []));
type Member = (typeof members)[number];

const FIRST_DELAY_MS = 10_000;
const INTERVAL_MIN_MS = 3_000;
const INTERVAL_MAX_MS = 6_000;
const VISIBLE_MS = 7_000;
const HIDE_MS = 900;

// 画面の幅で大きさと出し方を変える。スマートフォンでは小さくし、本文を隠しにくい下寄りに出す。
const LAYOUTS = {
  desktop: { sizeMin: 160, sizeMax: 240, exposure: 0.6, rotationMax: 15, topMin: 0.08, topMax: 1 },
  mobile: { sizeMin: 92, sizeMax: 128, exposure: 0.5, rotationMax: 10, topMin: 0.35, topMax: 1 },
} as const;

// 押せる範囲の判定に使う、アバター画像の形の粗い地図。
// 透過していない部分を少し太らせ、周りを囲まれた透過の穴は埋める。
// こうすると、髪の隙間や1ピクセルだけ透けた所を押しても反応が途切れない。
type HitMask = { cols: number; rows: number; cells: Uint8Array };
const MASK_COLS = 96;
const ALPHA_THRESHOLD = 24;
const DILATE_CELLS = 2;

function buildHitMask(image: HTMLImageElement): HitMask | null {
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
  return { cols, rows, cells };
}

type Peek = {
  id: number;
  member: Member;
  side: "is-left" | "is-right";
  top: number;
  size: number;
  rotation: number;
  exposure: number;
  active: boolean;
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
    const image = imageRef.current;
    if (!current?.active || !image) return false;
    const mask = masks.current.get(current.member.avatar.src);
    if (!mask) return false;
    const rect = image.getBoundingClientRect();
    const width = image.offsetWidth;
    const height = image.offsetHeight;
    if (!width || !height) return false;
    // 画像は中心を軸に回しているので、中心からのずれを逆向きに回して元の座標に戻す。
    const angle = (current.side === "is-left" ? current.rotation : -current.rotation) * (Math.PI / 180);
    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top + rect.height / 2);
    const u = (dx * Math.cos(angle) + dy * Math.sin(angle)) / width + 0.5;
    const v = (-dx * Math.sin(angle) + dy * Math.cos(angle)) / height + 0.5;
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
    const timers = new Set<number>();
    let hideTimer: number | undefined;
    let queue: Member[] = [];
    let last: Member | undefined;

    const later = (callback: () => void, delay: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        callback();
      }, delay);
      timers.add(id);
      return id;
    };
    const scheduleNext = (delay = randomBetween(INTERVAL_MIN_MS, INTERVAL_MAX_MS)) => later(show, delay);

    // 全員が1回ずつ出てから次の周に入る。周の変わり目で同じ人が続かないようにする。
    const nextMember = () => {
      if (queue.length === 0) {
        queue = shuffled(members);
        if (queue.length > 1 && queue[queue.length - 1] === last) queue.unshift(queue.pop()!);
      }
      last = queue.pop()!;
      return last;
    };

    const hide = () => {
      if (hideTimer !== undefined) {
        window.clearTimeout(hideTimer);
        timers.delete(hideTimer);
        hideTimer = undefined;
      }
      const current = peekRef.current;
      if (!current?.active) return;
      holding.current.hover = false;
      document.documentElement.classList.remove("is-over-peek-avatar");
      update({ ...current, active: false });
      later(() => scheduleNext(), HIDE_MS);
    };
    hideRef.current = hide;

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
      if (peekRef.current?.active) scheduleHide(HIDE_MS);
    };

    function show() {
      if (document.hidden) {
        scheduleNext();
        return;
      }
      const member = nextMember();
      const layout = mobile.matches ? LAYOUTS.mobile : LAYOUTS.desktop;
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        if (!masks.current.has(member.avatar.src)) masks.current.set(member.avatar.src, buildHitMask(image));
        const size = Math.round(randomBetween(layout.sizeMin, layout.sizeMax));
        const height = (size * member.avatar.height) / member.avatar.width;
        const viewport = window.innerHeight;
        const header = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
        const minTop = Math.max(header + 12, viewport * layout.topMin);
        const maxTop = Math.max(minTop, viewport * layout.topMax - height - 16);
        const next: Peek = {
          id: (peekRef.current?.id ?? 0) + 1,
          member,
          side: Math.random() < 0.5 ? "is-left" : "is-right",
          top: Math.round(randomBetween(minTop, maxTop)),
          size,
          rotation: Math.round(randomBetween(0, layout.rotationMax)),
          exposure: layout.exposure,
          active: false,
        };
        // 出るたびに新しい要素にする。前の要素を使い回すと、左右が入れ替わったときに、
        // 前の位置から滑り出して画面を横切ってしまう。
        flushSync(() => update(next));
        // 画面の外に置いてから、次のフレームで滑り込ませる。
        window.requestAnimationFrame(() =>
          window.requestAnimationFrame(() => {
            update({ ...next, active: true });
            scheduleHide(VISIBLE_MS);
          }),
        );
      };
      image.onerror = () => scheduleNext();
      image.src = publicAsset(member.avatar.src);
    }

    scheduleNext(FIRST_DELAY_MS);
    return () => {
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
      href={`#${member.id}`}
      className={`peek-avatar ${side}${active ? " is-active" : ""}`}
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
        "--peek-size": `${peek.size}px`,
        "--peek-rotation": `${side === "is-left" ? peek.rotation : -peek.rotation}deg`,
        "--peek-hidden": `${(1 - peek.exposure) * 100}%`,
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
