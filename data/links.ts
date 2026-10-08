import type { LinkItem } from "./types";
import { participationLinks } from "./participation";

export const venueLinks: LinkItem[] = [
  { label: "Resonite", note: "Day1 会場情報は近日公開" },
  { label: "VRChat", note: "Day2 会場情報は近日公開" },
  { label: "YouTube Day1", href: participationLinks.youtubeDay1, note: "10月10日（土）のライブ配信" },
  { label: "YouTube Day2", href: participationLinks.youtubeDay2, note: "10月11日（日）のライブ配信" },
];

export const archives: LinkItem[] = [
  { label: "2025", href: "https://vrsc-2025.utvirtual.tech/", note: "活動報告大会 & XR制作物プレゼン" },
  { label: "2024", href: "https://vrsc-2024.utvirtual.tech/", note: "全国学生VRサークル活動報告大会" },
  { label: "2023", href: "https://vrsc-2023.utvirtual.tech/", note: "全国学生VRサークル活動報告大会" },
  { label: "2022", href: "https://vrsc-2022.utvirtual.tech/", note: "全国学生VRサークル活動報告大会" },
  { label: "2018", href: "https://www.moguravr.com/vr-student-circle/", note: "第1回 全国学生VRサークル活動報告大会（10月27日開催、clusterとYouTube Live、12団体が登壇。当時の記事）" },
];

export const officialLinks = {
  x: { label: "大会公式X", href: "https://x.com/vrsc_jp", note: "@vrsc_jp" },
  organizers: [
    { label: "全日本大学メタバース連盟 NUMA", href: "https://numa-meta.com/" },
    { label: "東京大学VRサークル UT-virtual", href: "https://utvirtual.tech/" },
  ],
} as const;
