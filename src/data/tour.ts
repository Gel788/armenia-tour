export type {
  ProgramStop,
  ProgramHighlight,
  TourSection,
  PricingItem,
  ContactInfo,
  HeroStat,
  SiteContent,
} from "./tour.types";

export { highlightLabels, SECTION_TYPE_LABELS } from "./tour.types";

import type { SiteContent } from "./tour.types";
import fallbackContent from "../../public/data/site-content.json";

const defaults = fallbackContent as SiteContent;

/** Статический fallback — сайт и админка используют TourContentContext */
export const tourSections = defaults.sections;
export const pricingItems = defaults.pricingItems;
export const contact = defaults.contact;
export const heroStats = defaults.heroStats;
export const trustPills = defaults.trustPills;

export const defaultSiteContent: SiteContent = defaults;
