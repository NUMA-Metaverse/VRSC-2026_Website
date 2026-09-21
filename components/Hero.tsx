import Image from "next/image";
import { heroPhotos } from "@/data/activityPhotos";
import { PhotoStrip } from "./PhotoStrip";
import { ParticipationBanner } from "./ParticipationBanner";
import { MotionReveal } from "./ui/MotionReveal";
import { publicAsset } from "@/lib/site";

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="event-title">
      <h1 id="event-title" className="sr-only">全国学生VRサークル活動報告大会 2026</h1>
      <MotionReveal className="hero-art" effect="hero">
        <Image src={publicAsset("/event-2026/hero.webp")} alt="世界を拡張せよ。全国学生VRサークル活動報告大会 2026" width={2560} height={1440} sizes="100vw" preload />
      </MotionReveal>
      <ParticipationBanner />
      <PhotoStrip photos={heroPhotos} label="メインビジュアル下の活動写真" direction="right" />
    </section>
  );
}
