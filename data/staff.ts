import type { StaffMember } from "./types";

// 「NUMA VRSC2026 クレジット収集」フォームの回答をもとにした、制作と運営に関わった人の一覧。
// 連絡先は、回答のうちWebページやSNSのリンクだけを載せる。
export const staff: StaffMember[] = [
  {
    name: "まるまさ",
    roles: ["運営", "企画", "ディレクション", "渉外", "司会"],
    icon: "/staff/icons/01.webp",
    avatar: { src: "/staff/01.webp", width: 464, height: 900 },
    link: "https://x.com/MarumasaVR",
  },
  {
    name: "落雁.jp",
    roles: ["運営", "企画", "プロデュース", "配信"],
    icon: "/staff/icons/02.webp",
    avatar: { src: "/staff/02.webp", width: 700, height: 704 },
    link: "https://rakugan.jp",
  },
  {
    name: "たこらぼ",
    roles: ["運営", "空間デザイン", "プログラム", "モデリング"],
    icon: "/staff/icons/03.webp",
    avatar: { src: "/staff/03.webp", width: 443, height: 900 },
    link: "https://x.com/takolabo",
  },
  {
    name: "ひつじ",
    roles: ["空間デザイン"],
    icon: "/staff/icons/04.webp",
    avatar: { src: "/staff/04.webp", width: 700, height: 748 },
    link: "https://vrchat.com/home/user/usr_bc0d6ba5-1b79-4a8c-bb5b-28b054dab89c",
  },
  {
    name: "おぼろぐも",
    roles: ["空間デザイン", "プログラム"],
    icon: "/staff/icons/05.webp",
    avatar: { src: "/staff/05.webp", width: 616, height: 900 },
    link: "https://x.com/0boronron",
  },
  {
    name: "Ogajum / Jumu",
    roles: ["撮影"],
    icon: "/staff/icons/06.webp",
    avatar: { src: "/staff/06.webp", width: 470, height: 900 },
    link: "https://x.com/Jumu_VRC",
  },
  {
    name: "yurarara",
    roles: ["Web"],
    icon: "/staff/icons/07.webp",
    avatar: { src: "/staff/07.webp", width: 403, height: 900 },
  },
  {
    name: "Bismuth_83",
    roles: ["広報"],
    icon: "/staff/icons/08.webp",
    avatar: { src: "/staff/08.webp", width: 485, height: 900 },
    link: "https://x.com/Bismuth_83617",
  },
  {
    name: "ツバメ",
    roles: ["運営", "渉外", "司会"],
    icon: "/staff/icons/09.webp",
    avatar: { src: "/staff/09.webp", width: 537, height: 900 },
  },
  {
    name: "ohasi",
    roles: ["グラフィックデザイン"],
    icon: "/staff/icons/10.webp",
  },
  {
    name: "Neo",
    roles: ["空間デザイン"],
    icon: "/staff/icons/11.webp",
    avatar: { src: "/staff/11.webp", width: 339, height: 900 },
  },
  {
    name: "Rera*C",
    roles: ["プログラム"],
    icon: "/staff/icons/12.webp",
    avatar: { src: "/staff/12.webp", width: 312, height: 900 },
  },
  {
    name: "ベル",
    roles: ["空間デザイン", "プログラム"],
    icon: "/staff/icons/13.webp",
  },
  {
    name: "T-fc",
    roles: ["配信"],
    icon: "/staff/icons/14.webp",
    avatar: { src: "/staff/14.webp", width: 396, height: 900 },
    link: "https://x.com/t_fc171",
  },
  {
    name: "とば",
    roles: ["配信"],
    icon: "/staff/icons/15.webp",
  },
];
