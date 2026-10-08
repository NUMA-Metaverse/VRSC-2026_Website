"use client";

import { useEffect } from "react";
import { staff } from "@/data/staff";
import { PEEK_RUSH_EVENT, subscribePeekEnabled } from "@/lib/peekEnabled";
import { publicAsset } from "@/lib/site";

// アバター表示のボタンを短い間に何度も押されたら、全員のアバターが
// 画面の外のあらゆる方向から、ロケットのように頭を先にして飛び出してくる。

const avatars = staff.flatMap((member) => (member.avatar ? [member.avatar] : []));

// この時間の間にこの回数押されたら、連打とみなす。
const BURST_WINDOW_MS = 1_800;
const BURST_TAPS = 5;
const FLIGHT_MIN_MS = 900;
const FLIGHT_MAX_MS = 1_600;
const STAGGER_MS = 700;

const between = (min: number, max: number) => min + Math.random() * (max - min);

export function RocketAvatars() {
  useEffect(() => {
    if (avatars.length === 0) return;

    const layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    layer.style.cssText = "position:fixed;inset:0;z-index:90;pointer-events:none;overflow:hidden;";
    document.body.appendChild(layer);

    const animations = new Set<Animation>();

    const launch = (avatar: (typeof avatars)[number], delay: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const size = Math.round(between(width < 760 ? 110 : 160, width < 760 ? 190 : 280));
      const imageWidth = Math.round((size * avatar.width) / avatar.height);

      // 画面の中心を通る向きをランダムに決め、その両端の画面の外から外へ飛ばす。
      // 少し横にずらして、全員が真ん中だけを通らないようにする。
      const angle = Math.random() * Math.PI * 2;
      const reach = Math.hypot(width, height) / 2 + size;
      const dirX = Math.cos(angle);
      const dirY = Math.sin(angle);
      const offset = between(-0.4, 0.4) * Math.min(width, height);
      const centerX = width / 2 - dirY * offset;
      const centerY = height / 2 + dirX * offset;
      const startX = centerX - dirX * reach;
      const startY = centerY - dirY * reach;
      const endX = centerX + dirX * reach;
      const endY = centerY + dirY * reach;
      // 頭が進む向きを向くように回す(画像は頭が上)。
      const rotation = (Math.atan2(dirX, -dirY) * 180) / Math.PI + between(-12, 12);
      const spin = between(-40, 40);

      const image = document.createElement("img");
      image.src = publicAsset(avatar.src);
      image.alt = "";
      image.draggable = false;
      image.style.cssText = `position:absolute;left:0;top:0;width:${imageWidth}px;height:${size}px;max-width:none;opacity:0;will-change:transform;filter:drop-shadow(0 4px 10px rgba(0,0,0,.35));`;
      layer.appendChild(image);

      const pose = (x: number, y: number, turn: number, scale: number) =>
        `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${turn}deg) scale(${scale})`;
      const animation = image.animate(
        [
          { transform: pose(startX, startY, rotation, 0.7), opacity: 1, easing: "cubic-bezier(.55,0,.85,.45)" },
          { transform: pose(centerX, centerY, rotation + spin * 0.5, 1.15), opacity: 1, offset: 0.55 },
          { transform: pose(endX, endY, rotation + spin, 1.3), opacity: 1 },
        ],
        { duration: between(FLIGHT_MIN_MS, FLIGHT_MAX_MS), delay, fill: "both", easing: "cubic-bezier(.3,.1,.7,.9)" },
      );
      animations.add(animation);
      animation.onfinish = () => {
        animations.delete(animation);
        image.remove();
      };
    };

    const launchAll = () => {
      window.dispatchEvent(new Event(PEEK_RUSH_EVENT));
      // 並び順で出る時間が偏らないよう、順番を混ぜる。
      const order = [...avatars].sort(() => Math.random() - 0.5);
      order.forEach((avatar) => launch(avatar, Math.random() * STAGGER_MS));
    };

    let taps: number[] = [];
    const unsubscribe = subscribePeekEnabled(() => {
      const now = performance.now();
      taps = taps.filter((time) => now - time < BURST_WINDOW_MS);
      taps.push(now);
      if (taps.length < BURST_TAPS) return;
      // 打ち上げたら数え直す。そのまま連打し続ければ、数回ごとにまた打ち上がる。
      taps = [];
      launchAll();
    });

    return () => {
      unsubscribe();
      animations.forEach((animation) => animation.cancel());
      layer.remove();
    };
  }, []);

  return null;
}
