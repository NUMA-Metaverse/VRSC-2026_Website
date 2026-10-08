import { event } from "@/data/event";

export function Header() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">本文へスキップ</a>
      <a className="brand" href="#top">
        <span className="brand-name">{event.name}</span>
      </a>
      <nav className="site-nav" aria-label="メインナビゲーション"><a href="#about">大会について</a><a href="#news">お知らせ</a><a href="#timetable">タイムテーブル</a><a href="#participation">参加・視聴方法</a><a href="#guest">ゲスト講演</a><a href="#archive">過去の開催</a><a href="#credits">制作、運営</a></nav>
    </header>
  );
}
