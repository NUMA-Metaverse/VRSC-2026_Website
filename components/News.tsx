import { news } from "@/data/news";
import { officialLinks } from "@/data/links";
import { MotionReveal } from "./ui/MotionReveal";

export function News() {
  return (
    <section className="news section-space" id="news" aria-labelledby="news-title">
      <MotionReveal className="page-container news-layout">
        <div>
          <h2 id="news-title">お知らせ</h2>
          <p className="news-description">最新の情報は大会公式Xでもお知らせします。</p>
          <a className="news-x-link" href={officialLinks.x.href} target="_blank" rel="noreferrer">
            {officialLinks.x.label}をフォロー <span>{officialLinks.x.note}</span> <span aria-hidden="true">↗</span>
          </a>
        </div>
        <ul className="news-list">
          {news.map((item) => {
            const body = (
              <>
                <time dateTime={item.date.replaceAll(".", "-")}>{item.date}</time>
                <span className="news-category">{item.category}</span>
                <span className="news-title">{item.title}</span>
              </>
            );
            return (
              <li key={item.title}>
                {"href" in item ? <a href={item.href}>{body}</a> : <div>{body}</div>}
              </li>
            );
          })}
        </ul>
      </MotionReveal>
    </section>
  );
}
