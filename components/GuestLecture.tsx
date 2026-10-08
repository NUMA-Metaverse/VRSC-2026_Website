import Image from "next/image";
import { guests } from "@/data/guests";
import { publicAsset } from "@/lib/site";
import { MotionReveal } from "./ui/MotionReveal";

const dayLabels = {
  1: "Day1 10月10日（土） Resonite会場",
  2: "Day2 10月11日（日） VRChat会場",
} as const;

export function GuestLecture() {
  return (
    <section
      className="guest section-space"
      id="guest"
      aria-labelledby="guest-title"
    >
      <div className="page-container">
        <MotionReveal className="guest-heading">
          <h2 id="guest-title">ゲスト講演</h2>
        </MotionReveal>
        <div className="guest-list">
          {guests.map((guest) => (
            <div className="guest-layout" key={guest.day}>
              <MotionReveal className="guest-portrait" effect="photo">
                <figure>
                  <Image
                    src={publicAsset(guest.image)}
                    alt={`${guest.name}${guest.honorific}のプロフィール写真`}
                    width={guest.imageWidth}
                    height={guest.imageHeight}
                    sizes="(max-width: 760px) calc(100vw - 60px), 440px"
                  />
                  <figcaption>
                    <p className="guest-day">{dayLabels[guest.day]}</p>
                    <p className="guest-role">{guest.role}</p>
                    <h3>{guest.name}<span className="guest-honorific">{guest.honorific}</span></h3>
                  </figcaption>
                </figure>
              </MotionReveal>
              <MotionReveal className="guest-profile" delay={0.12}>
                {guest.profile.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </MotionReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
