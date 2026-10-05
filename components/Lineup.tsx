"use client";

import Image from "next/image";
import { useState } from "react";
import { circles } from "@/data/circles";
import { works } from "@/data/works";
import { publicAsset } from "@/lib/site";

const days = [
  { day: 1, date: "10.10 SAT", venue: "Resonite" },
  { day: 2, date: "10.11 SUN", venue: "VRChat" },
] as const;

export function Lineup() {
  const [selectedDay, setSelectedDay] = useState<1 | 2>(1);
  const dayCircles = circles.filter((circle) => circle.day === selectedDay);
  const dayWorks = works.filter((work) => work.day === selectedDay);

  return (
    <section className="lineup section-space" id="lineup" aria-labelledby="lineup-title">
      <div className="page-container">
        <h2 id="lineup-title">参加団体・XR制作物</h2>
        <div className="lineup-switch" role="group" aria-label="表示する開催日">
          {days.map(({ day, date, venue }) => (
            <button key={day} type="button" aria-pressed={selectedDay === day} aria-controls="lineup-content" onClick={() => setSelectedDay(day)}>
              <span>DAY {day} <b>{date}</b></span>
              <span>{venue}</span>
            </button>
          ))}
        </div>
        <div id="lineup-content">
          <section className="lineup-group" aria-labelledby="circles-title">
            <div className="lineup-subheading">
              <h3 id="circles-title">参加団体一覧 <span>{dayCircles.length}団体</span></h3>
              <p>DAY {selectedDay} · 登壇順</p>
            </div>
            <ol className="circle-grid">
              {dayCircles.map((circle) => (
                <li key={`${circle.day}-${circle.order}`} className="circle-card">
                  <span className="lineup-number" aria-label={`登壇順${circle.order}`}>{String(circle.order).padStart(2, "0")}</span>
                  <div className="circle-icon">
                    {circle.icon ? <Image src={publicAsset(circle.icon)} alt="" fill sizes="48px" /> : <span aria-hidden="true">{circle.shortName.slice(0, 2)}</span>}
                  </div>
                  <div className="circle-copy"><p>{circle.name}</p>{circle.university && <small>{circle.university}</small>}</div>
                </li>
              ))}
            </ol>
          </section>
          <section className="lineup-group" aria-labelledby="works-title">
            <div className="lineup-subheading">
              <h3 id="works-title">XR制作物プレゼン <span>{dayWorks.length}作品</span></h3>
              <p>DAY {selectedDay} · 登壇順</p>
            </div>
            <ol className="work-grid">
              {dayWorks.map((work) => (
                <li key={`${work.day}-${work.order}`} className="work-card">
                  <a className="work-image" href={publicAsset(work.image)} target="_blank" rel="noopener noreferrer" aria-label={`${work.title}のサムネイルを拡大（新しいタブ）`}>
                    <Image src={publicAsset(work.image)} alt={work.title} fill sizes="(max-width: 560px) calc((100vw - 52px) / 2), (max-width: 900px) calc((100vw - 96px) / 3), 282px" />
                    <span className="work-number" aria-label={`登壇順${work.order}`}>{String(work.order).padStart(2, "0")}</span>
                  </a>
                  <div className="work-copy"><h4>{work.title}</h4>{work.creator && <p>{work.creator}</p>}</div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </section>
  );
}
