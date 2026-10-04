export function Header() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">本文へスキップ</a>
      <a className="brand" href="#top">
        <span className="brand-name">全国学生VRサークル<br />活動報告大会 <b>2026</b></span>
      </a>
      <nav className="site-nav" aria-label="メインナビゲーション"><a href="#about">大会について</a><a href="#guest">ゲスト講演</a><a href="#archive">過去の開催</a></nav>
    </header>
  );
}
