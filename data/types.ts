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
  name: string;
  affiliation: string;
  profile: string;
  image: string;
  url?: string;
  referenceYear?: number;
};

export type TimetableDay = {
  label: string;
  date: string;
  venue: string;
  isPlaceholder?: boolean;
  slots: Array<{ time: string; title: string; kind?: "talk" | "break" | "open" }>;
};
