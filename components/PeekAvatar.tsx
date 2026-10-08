"use client";

import { useEffect, useRef, useState } from "react";
import { staff } from "@/data/staff";
import { publicAsset } from "@/lib/site";

const avatars = staff.flatMap((member) => (member.avatar ? [member.avatar] : []));

// ぶいなびの記事ページと同じように、時間をおいて左右どちらかの画面の端から、
// 制作と運営に関わった人のアバターがランダムに1体ずつ顔を出す。
const FIRST_DELAY_MS = 10_000;
const INTERVAL_MIN_MS = 3_000;
const INTERVAL_MAX_MS = 6_000;
const VISIBLE_MS = 7_000;
const HIDE_MS = 900;
const SIZE_MIN = 160;
const SIZE_MAX = 240;
const ROTATION_MAX_DEG = 15;

type Peek = {
  avatar: (typeof avatars)[number];
  side: "is-left" | "is-right";
  top: number;
  size: number;
  rotation: number;
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
  const queue = useRef<typeof avatars>([]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timers = new Set<number>();
    let last: (typeof avatars)[number] | undefined;

    const later = (callback: () => void, delay: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        callback();
      }, delay);
      timers.add(id);
    };

    // 全員が1回ずつ出てから次の周に入る。周の変わり目で同じ人が続かないようにする。
    const nextAvatar = () => {
      if (queue.current.length === 0) {
        queue.current = shuffled(avatars);
        if (queue.current.length > 1 && queue.current[queue.current.length - 1] === last) {
          queue.current.unshift(queue.current.pop()!);
        }
      }
      last = queue.current.pop();
      return last!;
    };

    const schedule = (delay: number) => later(show, delay);

    function show() {
      if (!desktop.matches || reducedMotion.matches || document.hidden) {
        schedule(randomBetween(INTERVAL_MIN_MS, INTERVAL_MAX_MS));
        return;
      }
      const avatar = nextAvatar();
      const size = Math.round(randomBetween(SIZE_MIN, SIZE_MAX));
      const height = (size * avatar.height) / avatar.width;
      const margin = 24;
      const maxTop = Math.max(margin, window.innerHeight - height - margin);
      const image = new Image();
      image.onload = () => {
        const next: Peek = {
          avatar,
          side: Math.random() < 0.5 ? "is-left" : "is-right",
          top: Math.round(randomBetween(margin, maxTop)),
          size,
          rotation: Math.round(randomBetween(0, ROTATION_MAX_DEG)),
          active: false,
        };
        setPeek(next);
        // 画面の外に置いてから、次のフレームで滑り込ませる。
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => setPeek({ ...next, active: true })));
        later(() => {
          setPeek((current) => (current ? { ...current, active: false } : current));
          later(() => schedule(randomBetween(INTERVAL_MIN_MS, INTERVAL_MAX_MS)), HIDE_MS);
        }, VISIBLE_MS);
      };
      image.onerror = () => schedule(randomBetween(INTERVAL_MIN_MS, INTERVAL_MAX_MS));
      image.src = publicAsset(avatar.src);
    }

    if (avatars.length > 0) schedule(FIRST_DELAY_MS);
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  if (!peek) return null;

  return (
    <div
      className={`peek-avatar ${peek.side}${peek.active ? " is-active" : ""}`}
      aria-hidden="true"
      style={{
        top: peek.top,
        "--peek-size": `${peek.size}px`,
        "--peek-rotation": `${peek.rotation}deg`,
      } as React.CSSProperties}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={publicAsset(peek.avatar.src)} alt="" width={peek.avatar.width} height={peek.avatar.height} />
    </div>
  );
}
