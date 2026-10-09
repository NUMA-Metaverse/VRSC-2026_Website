import { Picture } from "./ui/Picture";
import { heroPhotos } from "@/data/activityPhotos";
import { PhotoStrip } from "./PhotoStrip";
import { MotionReveal } from "./ui/MotionReveal";
import { SITE_NAME } from "@/lib/site";

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="event-title">
      <h1 id="event-title" className="sr-only">{SITE_NAME}</h1>
      <MotionReveal className="hero-art" effect="hero">
        <Picture src="/event-2026/hero.webp" alt={`世界を拡張せよ。${SITE_NAME}`} sizes="100vw" priority />
      </MotionReveal>
      <PhotoStrip photos={heroPhotos} label="メインビジュアル下の活動写真" direction="right" eager />
    </section>
  );
}
