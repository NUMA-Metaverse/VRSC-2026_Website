import Image from "next/image";
import { publicAsset } from "@/lib/site";
import { MotionReveal } from "./ui/MotionReveal";

const days = [
  { id: "day1", label: "Day 1", date: "10月10日（土）", dateTime: "2026-10-10", venue: "Resonite", width: 1920, height: 1080 },
  { id: "day2", label: "Day 2", date: "10月11日（日）", dateTime: "2026-10-11", venue: "VRChat", width: 1921, height: 1081 },
];

export function Timetable() {
  return (
    <section className="timetable section-space" id="timetable" aria-labelledby="timetable-title">
      <div className="page-container">
        <MotionReveal>
          <h2 id="timetable-title">タイムテーブル</h2>
          <p className="timetable-intro">両日とも19:00開場、19:10開会。画像をタップすると拡大してご覧いただけます。</p>
        </MotionReveal>
        <div className="timetable-days">
          {days.map((day) => (
            <MotionReveal key={day.id}>
              <figure>
                <figcaption className="timetable-caption">
                  <h3><span>{day.label}</span><time dateTime={day.dateTime}>{day.date}</time></h3>
                  <p>{day.venue}</p>
                </figcaption>
                <a className="timetable-image" href={publicAsset(`/event-2026/${day.id}.webp`)} target="_blank" rel="noopener noreferrer" aria-label={`${day.label}のタイムテーブルを拡大表示（新しいタブ）`}>
                  <Image
                    src={publicAsset(`/event-2026/${day.id}.webp`)}
                    alt={`${day.date} ${day.venue}の登壇順。19:00開場、19:10開会式・団体活動報告、22:20 XRプレゼン、22:40閉会式。`}
                    width={day.width}
                    height={day.height}
                    sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 64px), (max-width: 1296px) calc(100vw - 96px), 1200px"
                  />
                </a>
              </figure>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
