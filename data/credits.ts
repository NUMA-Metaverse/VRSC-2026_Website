// 「NUMA 2026 全国学生VRサークル活動報告大会 クレジット」20260928。
// ユーザー提供のシート内容に基づく団体表記。
export const organizers = [
  "NUMA 全日本大学メタバース連盟",
  "東京大学VRサークル UT-virtual",
] as const;

export const credits = [
  { label: "主催", names: organizers },
  {
    label: "UT-virtual 協賛",
    names: ["Born Digital, Inc./株式会社ボーンデジタル", "株式会社ambr", "GATARI Inc./株式会社GATARI"],
  },
  {
    label: "NUMA コミュニティパートナー",
    names: ["Iwaken Lab.", "JVSL/日本仮想学生連盟", "VRC就活生集会"],
  },
  { label: "NUMA コミュニティサポーター", names: ["MyDearest"] },
  { label: "協力", names: ["東京大学VRセンター"] },
] as const;
