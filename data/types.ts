export type LinkItem = {
  label: string;
  href?: string;
  note?: string;
};

export type Circle = {
  day: 1 | 2;
  order: number;
  name: string;
  shortName: string;
  university?: string;
  icon?: string;
  url?: string;
  referenceYear?: number;
};

export type Work = {
  day: 1 | 2;
  order: number;
  title: string;
  creator?: string;
  image: string;
  url?: string;
  referenceYear?: number;
};

export type Guest = {
  day: 1 | 2;
  name: string;
  honorific: string;
  role: string;
  profile: string[];
  image: string;
};

export type TimetableDay = {
  id: "day1" | "day2";
  label: string;
  date: string;
  dateTime: string;
  venue: string;
  image: string;
  imageAlt: string;
};

export type StaffMember = {
  // 一覧の各人の要素のid。左右から出るアバターを押したときの移動先になる。
  id: string;
  name: string;
  roles: string[];
  // 一覧に出すアイコン(正方形)。クレジット収集フォームで提出されたアイコンから作る。
  icon: string;
  // 全身のアバター画像。提出した人だけ持ち、ページ左右の演出に使う。
  avatar?: { src: string; width: number; height: number };
  link?: string;
};
