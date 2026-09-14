import {
  entrySchedule,
  officialDiscordUrl,
  presentationDates,
  recruitment,
  regulationsUrl,
} from "@/data/recruitment";
import { MotionReveal } from "./ui/MotionReveal";

export function EntryCTA() {
  return (
    <section className="entry section-space" id="entry" aria-labelledby="entry-title">
      <div className="page-container">
        <MotionReveal className="entry-heading">
          <h2 id="entry-title">登壇エントリー</h2>
          <p>
            2つの発表枠を、同じフォームから申し込めます。<br />
            <span className="entry-status">エントリー受付中・10月2日締切（延長中）</span>
          </p>
        </MotionReveal>
        <div className="entry-grid">
          {recruitment.map((item, index) => (
            <MotionReveal key={item.id} delay={index * 0.12}>
              <article className={`entry-card ${item.id}`} id={item.id}>
                <div className="entry-card-top"><b>{item.number}</b></div>
                <h3>{item.title}</h3>
                <p className="entry-description">{item.description}</p>
                <ul className="entry-tags">
                  {item.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <div className="entry-card-bottom">
                  <a className="action-link" href={item.href} target="_blank" rel="noreferrer">
                    この枠でエントリー <span aria-hidden="true">↗</span>
                  </a>
                  <p className="entry-detail">{item.note}</p>
                </div>
              </article>
            </MotionReveal>
          ))}
        </div>

        <MotionReveal className="entry-information" delay={0.14}>
          <div className="entry-info-block">
            <p className="entry-info-kicker">EVENT</p>
            <h3>開催日時</h3>
            <div className="event-dates">
              {presentationDates.map((item) => (
                <time key={item.dateTime} dateTime={item.dateTime}>{item.label}</time>
              ))}
            </div>
            <p>登壇者は各日18:30集合。開演前に接続確認を行います。</p>
          </div>
          <div className="entry-info-block">
            <p className="entry-info-kicker">DEADLINES</p>
            <h3>提出スケジュール</h3>
            <dl className="deadline-list">
              {entrySchedule.map((item) => (
                <div key={item.dateTime} className={item.emphasis ? "is-emphasis" : undefined}>
                  <dt>{item.label}</dt>
                  <dd><time dateTime={item.dateTime}>2026年{item.date}</time></dd>
                </div>
              ))}
            </dl>
            <p>発表スライドは後日案内される提出フォームから提出します（バックアップ動画の提出は任意です）。</p>
          </div>
        </MotionReveal>

        <MotionReveal className="entry-notice" delay={0.18}>
          <div>
            <p className="entry-info-kicker">BEFORE ENTRY</p>
            <h3>応募前にご確認ください</h3>
          </div>
          <ul>
            <li>エントリー後の連絡・日程調整は、公式Discordで行います。</li>
            <li>大会の様子はYouTubeなどでライブ配信・アーカイブ公開されます。</li>
            <li>発表資料・展示物は、第三者の権利を侵害しないものに限ります。</li>
            <li>各プラットフォームの規約を守り、過度な負荷・視覚妨害・成人向け表現は使用できません。</li>
          </ul>
          <div className="entry-resource-links">
            <a href={officialDiscordUrl} target="_blank" rel="noreferrer">公式Discordに参加 <span aria-hidden="true">↗</span></a>
            <a href={regulationsUrl} target="_blank" rel="noreferrer">大会規約を確認 <span aria-hidden="true">↗</span></a>
          </div>
        </MotionReveal>

        <div className="audience-note">
          <div><h3>一般参加・視聴について</h3><p>参加方法は、詳細が決まり次第このサイトでご案内します。</p></div>
        </div>
      </div>
    </section>
  );
}
