import type { TimetableDay } from "./types";

export const timetable: TimetableDay[] = [
  {
    label: "1日目",
    date: "10月10日（土）",
    venue: "Resonite 特設会場",
    isPlaceholder: true,
    slots: [
      { time: "--:--", title: "開場・接続確認", kind: "open" },
      { time: "--:--", title: "開会" },
      { time: "--:--", title: "学生VR/XR団体活動報告" },
      { time: "--:--", title: "ゲスト講演", kind: "talk" },
      { time: "--:--", title: "交流会" },
    ],
  },
  {
    label: "2日目",
    date: "10月11日（日）",
    venue: "VRChat 特設会場",
    isPlaceholder: true,
    slots: [
      { time: "--:--", title: "開場・接続確認", kind: "open" },
      { time: "--:--", title: "XR作品紹介" },
      { time: "--:--", title: "作品発表" },
      { time: "--:--", title: "休憩", kind: "break" },
      { time: "--:--", title: "閉会・集合写真" },
    ],
  },
];
