"use client";

import { useEffect, useState } from "react";
import { event } from "@/data/event";
import { AvatarToggle } from "@/components/AvatarToggle";

const links = [
  { href: "#about", label: "大会について" },
  { href: "#timetable", label: "タイムテーブル" },
  { href: "#participation", label: "参加・視聴方法" },
  { href: "#guest", label: "ゲスト講演" },
  { href: "#archive", label: "過去の開催" },
  { href: "#credits", label: "制作、運営" },
];

export function Header() {
  // 狭い画面では、ナビゲーションをメニューボタンで開く。広い画面では常に並べて表示する。
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 760) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    // メニューを開いている間は、後ろのページが動かないようにする。
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className={`site-header${open ? " is-open" : ""}`}>
      <a className="skip-link" href="#main-content">本文へスキップ</a>
      <div className="header-top">
        <a className="brand" href="#top">
          <span className="brand-name">{event.name}</span>
        </a>
        <div className="header-actions">
          <AvatarToggle className="is-desktop" />
          <button
            type="button"
            className="menu-button"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="menu-icon" aria-hidden="true" />
            <span className="menu-text">{open ? "閉じる" : "メニュー"}</span>
          </button>
        </div>
      </div>
      <div className="nav-backdrop" aria-hidden="true" onClick={() => setOpen(false)} />
      <nav id="site-nav" className="site-nav" aria-label="メインナビゲーション">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
        ))}
        {/* ドロワーを閉じて、出てくるアバターが見えるようにする。 */}
        <AvatarToggle className="is-panel" onToggle={() => setOpen(false)} />
      </nav>
    </header>
  );
}
