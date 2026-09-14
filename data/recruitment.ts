type Recruitment = {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  note: string;
};

export const entryFormUrl = "https://forms.gle/kvjtve2VHyw4dwWy6";

export const recruitment: Recruitment[] = [
  {
    id: "circle-entry",
    number: "01",
    title: "活動報告",
    description: "学生VR団体による年間の活動成果や、イベント、団体運営の取り組みなどを報告する枠です。",
    tags: ["学生VR団体向け", "発表7分", "質疑応答2分"],
    href: entryFormUrl,
    note: "発表7分＋質疑応答2分（計9分）",
  },
  {
    id: "xr-entry",
    number: "02",
    title: "XR制作物プレゼン",
    description: "学生が制作したXR作品・ワールド・ギミックを、団体または個人で発表する枠です。東京大学VRセンター主催「メタバースコンペティション」予選を兼ねており、優秀賞にはMeta Quest 3Sが進呈されます。",
    tags: ["学生団体・個人", "発表1分", "副賞: Meta Quest 3S"],
    href: entryFormUrl,
    note: "1人/1団体あたり発表1分（ショートプレゼン形式、質疑応答なし）",
  },
];

export const entrySchedule = [
  {
    label: "登壇エントリー締切",
    dateTime: "2026-10-02T23:59:00+09:00",
    date: "10月2日（金）23:59",
    emphasis: true,
  },
  {
    label: "発表スライド提出締切",
    dateTime: "2026-10-02T23:59:00+09:00",
    date: "10月2日（金）23:59",
    emphasis: false,
  },
] as const;

export const presentationDates = [
  { dateTime: "2026-10-10T19:00:00+09:00", label: "10月10日（土）19:00〜22:50（Day1: Resonite特設会場）" },
  { dateTime: "2026-10-11T19:00:00+09:00", label: "10月11日（日）19:00〜22:50（Day2: VRChat特設会場）" },
] as const;

export const officialDiscordUrl = "https://discord.gg/zJHzDRpfA3";
export const regulationsUrl =
  "https://docs.google.com/presentation/d/1B4UaKNYpaIoS0D0ExpMnFJZ64BV4EWoPrDK7CaUyZDo/preview";
