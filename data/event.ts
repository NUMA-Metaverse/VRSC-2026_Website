export const event = {
  name: "全国学生VRサークル活動報告大会&XR制作物プレゼン2026",
  year: "2026",
  description:
    "全国の学生VR/XR団体やクリエイターが、活動内容や制作した作品を紹介・共有するイベントです。",
  date: {
    label: "2026年10月10日（土）・11日（日）",
    detail: "各日19:00〜22:50（登壇者集合18:30）",
  },
  venue: {
    label: "Day1: Resonite / Day2: VRChat 特設会場",
    detail: "各日オンライン開催（YouTube Live配信あり）",
  },
} as const;

export const aboutPoints = [
  { number: "01", title: "活動報告", text: "各団体の活動内容や運営方法、取り組みを共有します。" },
  { number: "02", title: "作品紹介", text: "学生が制作したVR/XR作品を紹介します。" },
  { number: "03", title: "交流", text: "大学や地域を越えて学生同士が交流します。" },
] as const;

export const presentationDates = [
  { dateTime: "2026-10-10T19:00:00+09:00", label: "10月10日（土）19:00〜22:50（Day1: Resonite特設会場）" },
  { dateTime: "2026-10-11T19:00:00+09:00", label: "10月11日（日）19:00〜22:50（Day2: VRChat特設会場）" },
] as const;
