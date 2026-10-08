import Image from "next/image";
import { publicAsset } from "@/lib/site";
import { MotionReveal } from "./ui/MotionReveal";

import { timetable } from "@/data/timetable";

export function Timetable() {
  return (
    <section className="timetable section-space" id="timetable" aria-labelledby="timetable-title">
      <div className="page-container">
        <MotionReveal>
          <h2 id="timetable-title">タイムテーブル</h2>
        </MotionReveal>
        <div className="timetable-days">
          {timetable.map((day) => (
            <MotionReveal key={day.id}>
              <figure>
                <figcaption className="timetable-caption">
                  <h3><span>{day.label}</span><time dateTime={day.dateTime}>{day.date}</time></h3>
                  <p>{day.venue}</p>
                </figcaption>
                <a className="timetable-image" href={publicAsset(day.image)} target="_blank" rel="noopener noreferrer" aria-label={`${day.label}のタイムテーブルを拡大表示（新しいタブ）`}>
                  <Image
                    src={publicAsset(day.image)}
                    alt={day.imageAlt}
                    width={day.imageWidth}
                    height={day.imageHeight}
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
