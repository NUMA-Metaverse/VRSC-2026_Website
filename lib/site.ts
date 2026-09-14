const fallbackSiteUrl = "https://vrsc-2026.numa-meta.com";

export const SITE_NAME = "全国学生VRサークル活動報告大会 2026";
export const SITE_DESCRIPTION =
  "全国学生VRサークル活動報告大会＆XR制作物プレゼン2026。全国の学生VR/XR団体やクリエイターが活動報告と作品発表を行う、2026年10月10日・11日オンライン開催の公式イベントサイトです。";
export const SITE_SHORT_NAME = "VRサークル大会2026";
export const SITE_LAST_MODIFIED = "2026-09-14T19:00:00+09:00";
export const SITE_KEYWORDS = [
  "全国学生VRサークル活動報告大会",
  "VRサークル",
  "XR制作物プレゼン",
  "学生VR",
  "学生XR",
  "Resonite",
  "VRChat",
  "cluster",
  "メタバース",
  "オンラインイベント",
  "2026",
];

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl
).replace(/\/+$/, "");

export function siteUrl(path = "") {
  const normalizedPath = path && !path.startsWith("/") ? `/${path}` : path;
  return `${SITE_URL}${normalizedPath}`;
}

export function publicAsset(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function optionalEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}
