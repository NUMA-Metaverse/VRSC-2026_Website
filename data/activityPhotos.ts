export type ActivityPhoto = {
  file: string;
  alt: string;
};

// 4本の写真帯には異なる写真を割り当てる。ファイル名は public/images 内のもの。
export const heroPhotos: readonly ActivityPhoto[] = [
  { file: "image", alt: "青空の下で集まった大勢のアバターの集合写真" },
  { file: "kait-vr", alt: "星空のワールドでの団体集合写真" },
  { file: "neptunity", alt: "室内ワールドで集まる団体のメンバー" },
  { file: "2026-09-05-17-48-01", alt: "月を背景にしたステージでの記念撮影" },
  { file: "yuvr", alt: "花で飾られたワールドでの集合写真" },
  { file: "ku-virtual", alt: "展示の前に集まる団体のメンバー" },
  { file: "43343", alt: "夕暮れの花畑のワールドでの記念撮影" },
  { file: "hit-metaverse", alt: "団体紹介のクイズパネルの前での活動風景" },
  { file: "kasou-kuukan-kenkyukai", alt: "食事をテーマにしたワールドでの交流風景" },
  { file: "svrc", alt: "団体のメンバーによる集合写真" },
];

export const preGuestPhotos: readonly ActivityPhoto[] = [
  { file: "1", alt: "室内で笑顔のポーズを取る3人のアバター" },
  { file: "6446", alt: "水中を見渡せるワールドでの集合写真" },
  { file: "525525", alt: "青空のワールドに集まる学生たち" },
  { file: "hit04", alt: "和室のテーブルを囲んで交流するメンバー" },
  { file: "vrchat-2026-04-23-21-59-18-007-3840x2160-1", alt: "星空のワールドでポーズを取るアバター" },
];

export const preEntryPhotos: readonly ActivityPhoto[] = [
  { file: "33232", alt: "円になって集まったアバターを上から撮影した写真" },
  { file: "1213", alt: "ワールド内の自動販売機の前での記念撮影" },
  { file: "6565564", alt: "テーブル上の展示を囲んで集まるメンバー" },
  { file: "64644", alt: "星空の広がるワールドを見上げるメンバー" },
];

export const postEntryPhotos: readonly ActivityPhoto[] = [
  { file: "2", alt: "野球場のワールドで遊ぶメンバー" },
  { file: "5656", alt: "バーチャル空間でのメンバー同士の記念撮影" },
  { file: "3232", alt: "2026年の文字の前でポーズを取るメンバー" },
  { file: "1212212", alt: "椅子を並べて話し合う団体の活動風景" },
  { file: "6354", alt: "夜の森のワールドで集まるメンバー" },
  { file: "hokudai-metaken", alt: "アバター姿で記念撮影をする学生たち" },
  { file: "nu-digital", alt: "室内に集まって撮影したアバターの集合写真" },
  { file: "yamato-university-vr", alt: "夜の自然を背景にしたワールドでの記念撮影" },
  { file: "vrchat-2026-04-10-23-50-47-947-1920x1080", alt: "チェス盤を囲んで遊ぶメンバー" },
];
