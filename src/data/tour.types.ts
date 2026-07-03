export type ProgramStop = {
  title: string;
  description: string;
};

export type ProgramHighlight = {
  kind: "meal" | "stay" | "evening" | "activity";
  title: string;
  description: string;
};

export type TourSection = {
  id: string;
  type: "hero" | "program-intro" | "day-intro" | "location" | "pricing" | "outro";
  day?: number;
  tag?: string;
  title: string;
  subtitle?: string;
  body: string;
  image: string;
  gallery?: string[];
  lead?: string;
  stops?: ProgramStop[];
  highlights?: ProgramHighlight[];
};

export type PricingItem = {
  icon: string;
  label: string;
};

export type ContactInfo = {
  email: string;
  telegram: string;
  phone: string;
};

export type HeroStat = {
  value: string;
  label: string;
};

export type SiteContent = {
  version: number;
  sections: TourSection[];
  pricingItems: PricingItem[];
  contact: ContactInfo;
  heroStats: HeroStat[];
  trustPills: string[];
  updatedAt: string;
};

export const highlightLabels: Record<ProgramHighlight["kind"], string> = {
  meal: "Питание",
  stay: "Ночлег",
  evening: "Вечер",
  activity: "Активность",
};

export const SECTION_TYPE_LABELS: Record<TourSection["type"], string> = {
  hero: "Главный экран",
  "program-intro": "Вступление программы",
  "day-intro": "День программы",
  location: "Локация",
  pricing: "Что включено",
  outro: "Финальный экран",
};
