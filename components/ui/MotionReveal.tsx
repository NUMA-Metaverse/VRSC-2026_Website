"use client";

import { useEffect, useRef, type ReactNode } from "react";

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  effect?: "rise" | "photo" | "hero";
};

// 画面に入ったときに一度だけ、下から浮かび上がるように出す。
// ライブラリを使わず、ブラウザの Web Animations API で動かす。
const EFFECTS = {
  rise: { from: { opacity: 0.35, transform: "translateY(10px)" }, duration: 550 },
  photo: { from: { opacity: 0.35, transform: "translateY(14px)" }, duration: 550 },
  hero: { from: { opacity: 0.7, transform: "scale(0.99)" }, duration: 700 },
} satisfies Record<NonNullable<MotionRevealProps["effect"]>, { from: Keyframe; duration: number }>;

export function MotionReveal({ children, className, delay = 0, effect = "rise" }: MotionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || reducedMotion.matches) return;

    // サーバーで描いた内容は見えたままにしておき、画面に入る境界で滑らかに動かす。
    let animation: Animation | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const { from, duration } = EFFECTS[effect];
      element.style.willChange = "transform, opacity";
      animation = element.animate([from, { opacity: 1, transform: "none" }], {
        duration,
        delay: delay * 1000,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "backwards",
      });
      animation.onfinish = () => {
        element.style.willChange = "auto";
      };
    }, { rootMargin: "0px 0px -20px 0px", threshold: 0.02 });
    observer.observe(element);

    // 動いている途中で動きを減らす設定にされたら、すぐ止めて元の見た目に戻す。
    const stop = () => {
      animation?.cancel();
      if (element) element.style.willChange = "auto";
    };
    reducedMotion.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", stop);
      stop();
    };
  }, [delay, effect]);

  return <div ref={ref} className={className} data-motion-reveal={effect}>{children}</div>;
}
