import { event } from "@/data/event";
import { credits } from "@/data/credits";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container footer-content">
        <div>
          <p className="footer-event">{event.name}</p>
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
