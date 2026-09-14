export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container footer-content">
        <div>
          <p className="footer-event">全国学生VRサークル活動報告大会 2026</p>
          <div className="footer-credits" style={{ marginTop: "12px", fontSize: "11px", lineHeight: "1.8", color: "#c4c3bc" }}>
            <p>主催：全日本大学メタバース連盟 NUMA</p>
            <p>共催：東京大学VRサークル UT-virtual</p>
            <p>協力：東京大学VRセンター</p>
          </div>
        </div>
        <a className="footer-top" href="#top">ページの先頭へ <span aria-hidden="true">↑</span></a>
      </div>
      <div className="page-container footer-bottom">
        <small>© 2026 全国学生VRサークル活動報告大会</small>
      </div>
    </footer>
  );
}
