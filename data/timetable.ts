import type { TimetableDay } from "./types";

export const timetable: TimetableDay[] = [
  {
    id: "day1",
    label: "Day 1",
    date: "10月10日（土）",
    dateTime: "2026-10-10",
    venue: "Resonite",
    image: "/event-2026/day1.webp",
    imageAlt: "10月10日（土） Resoniteの登壇順。19:00開場、19:10開会式・団体活動報告、22:20 XRプレゼン、22:40閉会式。",
  },
  {
    id: "day2",
    label: "Day 2",
    date: "10月11日（日）",
    dateTime: "2026-10-11",
    venue: "VRChat",
    image: "/event-2026/day2.webp",
    imageAlt: "10月11日（日） VRChatの登壇順。19:00開場、19:10開会式・団体活動報告、22:20 XRプレゼン、22:40閉会式。",
  },
];
