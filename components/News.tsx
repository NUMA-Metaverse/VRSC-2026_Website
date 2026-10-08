import { officialLinks } from "@/data/links";
import { MotionReveal } from "./ui/MotionReveal";

export function News() {
  return (
    <section className="news section-space" id="news" aria-labelledby="news-title">
      <MotionReveal className="page-container">
        <h2 id="news-title">お知らせ</h2>
        <p className="news-description">最新の情報は大会公式Xでもお知らせします。</p>
        <a className="news-x-link" href={officialLinks.x.href} target="_blank" rel="noreferrer">
          {officialLinks.x.label}をフォロー <span>{officialLinks.x.note}</span> <span aria-hidden="true">↗</span>
        </a>
      </MotionReveal>
    </section>
  );
}
