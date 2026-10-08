import { event } from "@/data/event";
import { credits } from "@/data/credits";
import { officialLinks } from "@/data/links";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container footer-content">
        <div>
          <p className="footer-event">{event.name}</p>
          <ul className="footer-links" aria-label="公式リンク">
            <li>
              <a className="footer-x-link" href={officialLinks.x.href} target="_blank" rel="noreferrer">
                {officialLinks.x.label} {officialLinks.x.note} <span aria-hidden="true">↗</span>
              </a>
            </li>
            {officialLinks.organizers.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">{link.label} <span aria-hidden="true">↗</span></a>
              </li>
            ))}
          </ul>
          <dl className="footer-credits">
            {credits.map((credit) => (
              <div key={credit.label}>
                <dt>{credit.label}</dt>
                <dd>{credit.names.map((name) => <span key={name}>{name}</span>)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <a className="footer-top" href="#top">ページの先頭へ <span aria-hidden="true">↑</span></a>
      </div>
      <div className="page-container footer-bottom">
        <small>© {event.name}</small>
      </div>
    </footer>
  );
}
