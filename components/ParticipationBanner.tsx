import { AnimatedLink } from "./ui/AnimatedLink";
import { MotionReveal } from "./ui/MotionReveal";

export function ParticipationBanner() {
  return (
    <div className="participation-banner">
      <MotionReveal className="participation-entrance">
        <AnimatedLink className="participation-link" href="#entry">
          <span className="participation-copy">
            <strong>登壇エントリー受付中</strong>
            <span>活動報告・XR制作物プレゼン／10月2日（金）23:59締切（延長中）</span>
          </span>
          <span className="participation-arrow" aria-hidden="true">↓</span>
        </AnimatedLink>
      </MotionReveal>
      <p>2つの発表枠を同じフォームから申し込めます</p>
    </div>
  );
}
