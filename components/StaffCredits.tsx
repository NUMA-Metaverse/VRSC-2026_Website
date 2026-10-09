import { Picture } from "./ui/Picture";
import { staff } from "@/data/staff";
import { MotionReveal } from "./ui/MotionReveal";

export function StaffCredits() {
  return (
    <section className="staff section-space" id="credits" aria-labelledby="staff-title">
      <div className="page-container">
        <MotionReveal>
          <h2 id="staff-title">制作、運営</h2>
          <p className="staff-description">この大会の企画、会場、配信、Webサイトなどを担当したメンバーです。</p>
        </MotionReveal>
        <ul className="staff-grid">
          {staff.map((member) => {
            const card = (
              <>
                <div className="staff-icon">
                  <Picture src={member.icon} alt="" sizes="56px" />
                </div>
                <div className="staff-copy">
                  <p className="staff-name">{member.name}{member.link && <span aria-hidden="true"> ↗</span>}</p>
                  <p className="staff-roles">{member.roles.join("、")}</p>
                </div>
              </>
            );
            return (
              <li key={member.id} id={member.id} className="staff-card">
                {member.link ? <a href={member.link} target="_blank" rel="noreferrer" aria-label={`${member.name}（${member.roles.join("、")}）のリンクを新しいタブで開く`}>{card}</a> : <div>{card}</div>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
