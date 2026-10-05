import { participationLinks } from "@/data/participation";
import { MotionReveal } from "./ui/MotionReveal";

export function Participation() {
  return (
    <section className="participation section-space" id="participation" aria-labelledby="participation-title">
      <div className="page-container">
        <MotionReveal>
          <h2 id="participation-title">参加・視聴方法</h2>
          <p className="participation-intro">両日とも会場への一般参加と、YouTube Liveでの視聴ができます。</p>
        </MotionReveal>
        <div className="participation-grid">
          <article className="participation-card">
            <h3>Day1：Resonite会場</h3>
            <p><time dateTime="2026-10-10">10月10日（土）</time></p>
            <p>誰でも入れるセッションで開催します。Resoniteのインストールが必要です。アカウントがなくても参加できます。</p>
            <h4>会場への入り方</h4>
            <ol>
              <li>当日、大会公式Discordで共有するセッションのURLから入る。</li>
              <li>Resoniteで <strong>marumasa</strong> にフレンド申請して入る。</li>
            </ol>
            <p>フレンド申請にはアカウントが必要です。アカウントのない方は、セッションのURLからお入りください。</p>
            <a className="text-link" href={participationLinks.discord} target="_blank" rel="noreferrer">大会公式Discordに参加 <span aria-hidden="true">↗</span></a>
          </article>
          <article className="participation-card">
            <h3>Day2：VRChat会場</h3>
            <p><time dateTime="2026-10-11">10月11日（日）</time></p>
            <p>VRChatの公式グループ「全国学生VRサークル活動報告大会 GROUP」に参加し、グループの Group+ インスタンスからお入りください。</p>
            <a className="text-link" href={participationLinks.vrchatGroup} target="_blank" rel="noreferrer">VRChat公式グループに参加 <span aria-hidden="true">↗</span></a>
          </article>
          <article className="participation-card">
            <h3>YouTube Liveで視聴</h3>
            <p>Day1はNUMA公式YouTubeチャンネル、Day2はUT-virtual公式YouTubeチャンネルでライブ配信します。</p>
            <p>Day1・Day2の各配信URLは未定です。決まり次第、このページに掲載します。</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
              <a className="text-link" href={participationLinks.youtubeDay1} target="_blank" rel="noreferrer">Day1：NUMA公式YouTubeチャンネル <span aria-hidden="true">↗</span></a>
              <a className="text-link" href={participationLinks.youtubeDay2} target="_blank" rel="noreferrer">Day2：UT-virtual公式YouTubeチャンネル <span aria-hidden="true">↗</span></a>
            </div>
          </article>
          <article className="participation-card">
            <h3>困ったとき・お問い合わせ</h3>
            <p>大会公式Discordの「運営に質問」チャンネルへお問い合わせください。当日のセッションのリンクも大会公式Discordでご案内します。</p>
            <a className="text-link" href={participationLinks.discord} target="_blank" rel="noreferrer">大会公式Discordに参加 <span aria-hidden="true">↗</span></a>
          </article>
        </div>
      </div>
    </section>
  );
}
