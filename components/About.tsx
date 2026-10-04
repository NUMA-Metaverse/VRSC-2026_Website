import Image from "next/image";
import { presentationDates } from "@/data/event";
import { publicAsset } from "@/lib/site";
import { MotionReveal } from "./ui/MotionReveal";

export function About() {
  return (
    <section
      className="about section-space"
      id="about"
      aria-labelledby="about-title"
    >
      <div className="page-container">
        <div className="about-layout">
          <MotionReveal className="about-copy">
            <h2 id="about-title">大会について</h2>
            <p>
              全国学生VRサークル活動報告大会では、各団体の活動報告、学生によるVR/XR制作物の発表、参加者同士の交流を行います。
            </p>
            <p>
              活動内容や運営方法、制作の技術や工夫を共有し、大学・学生団体間の交流を深めることを目的としています。
            </p>
            <h3>XR制作物プレゼン</h3>
            <p>
              XR制作物プレゼンは、東京大学VRセンター主催「メタバースコンペティション」の予選を兼ねています。優秀賞の副賞は Meta Quest 3S です。本戦は2026年12月18日（金）・19日（土）に開催されます。
            </p>
            <div className="event-dates">
              <h3>開催日時・会場</h3>
              {presentationDates.map((item) => (
                <time key={item.dateTime} dateTime={item.dateTime}>{item.label}</time>
              ))}
            </div>
          </MotionReveal>
          <MotionReveal className="photo-collage" effect="photo" delay={0.12}>
            <figure className="collage-main">
              <div>
                <Image
                  src={publicAsset("/images/kait-vr.webp")}
                  alt="星空が広がるワールドに集まる団体の仲間たち"
                  fill
                  sizes="(max-width: 760px) 80vw, 38vw"
                />
              </div>
            </figure>
            <figure className="collage-small">
              <div>
                <Image
                  src={publicAsset("/images/hokudai-metaken.webp")}
                  alt="アバター姿で記念撮影を楽しむ学生たち"
                  fill
                  sizes="(max-width: 760px) 48vw, 22vw"
                />
              </div>
            </figure>
          </MotionReveal>
        </div>
        <p className="photo-credit">掲載写真は各団体の活動風景です。</p>
      </div>
    </section>
  );
}
