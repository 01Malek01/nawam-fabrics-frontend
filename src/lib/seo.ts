// Auto-generated SEO text (titles + meta descriptions) for product, category,
// and last-piece pages. Centralized so metadata stays consistent and keyword
// targeting can be tuned in one place.
import { SITE_NAME } from "./schema";

/** High-intent keyword most customers search with. Adjust here as needed. */
const TARGET_KEYWORD = "قماش رجالي";

const TITLE_MAX = 70;
const DESCRIPTION_MAX = 160;

function clean(value?: string | null): string {
  return (value || "").trim();
}

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return value.slice(0, max - 1).trimEnd();
}

/** Joins non-empty parts with " - " (used for titles). */
function joinCore(parts: (string | undefined | null)[]): string {
  return parts.map((p) => clean(p)).filter(Boolean).join(" - ");
}

/** Builds a natural "keyword type name" lead phrase for descriptions. */
function keywordLead(type: string | undefined | null, name: string): string {
  return [TARGET_KEYWORD, clean(type), clean(name)].filter(Boolean).join(" ");
}

function withSiteTitle(core: string): string {
  return truncate(`${core} | ${SITE_NAME}`, TITLE_MAX);
}

export interface ProductSeoInput {
  name: string;
  /** Type/mark (usually SubCategory.Name or MainCategory.Name). */
  type?: string | null;
  price?: number | string | null;
  description?: string | null;
}

/** `{name} - {type} | النوام للأقمشة` (name first, type second). */
export function buildProductTitle(
  name: string,
  type?: string | null,
): string {
  return withSiteTitle(joinCore([name, type]));
}

/** Keyword-rich product description that leads with the target keyword. */
export function buildProductDescription(input: ProductSeoInput): string {
  const { name, type, price, description } = input;
  const lead = keywordLead(type, name);
  const detail = clean(description)
    ? clean(description)
    : "قماش عالي الجودة متوفر لدى النوام للأقمشة";
  const priceText =
    price !== null && price !== undefined && price !== ""
      ? `سعر المتر ${price} جنيه`
      : "بأفضل الأسعار";
  return truncate(
    `${lead} - ${detail}. ${priceText} مع شحن لجميع المحافظات.`,
    DESCRIPTION_MAX,
  );
}

export function buildCategoryTitle(
  categoryName: string,
  subName?: string | null,
): string {
  return withSiteTitle(joinCore([categoryName, subName]));
}

export function buildCategoryDescription(
  categoryName: string,
  subName?: string | null,
): string {
  const name = clean(subName) || clean(categoryName);
  return truncate(
    `تصفح ${TARGET_KEYWORD} ${name} - ${categoryName} من النوام للأقمشة بأسعار مميزة مع شحن لجميع المحافظات.`,
    DESCRIPTION_MAX,
  );
}

export function buildLastPieceTitle(
  name: string,
  type?: string | null,
): string {
  return withSiteTitle(joinCore([name, type]));
}

export function buildLastPieceDescription(input: ProductSeoInput): string {
  const { name, type, price, description } = input;
  const lead = keywordLead(type, name);
  const detail = clean(description)
    ? clean(description)
    : "قطعة أخيرة متوفرة بكمية محدودة";
  const priceText =
    price !== null && price !== undefined && price !== ""
      ? `بسعر ${price} جنيه`
      : "بسعر مميز";
  return truncate(
    `${lead} - ${detail}. ${priceText} اطلب الآن قبل نفاد الكمية من النوام للأقمشة.`,
    DESCRIPTION_MAX,
  );
}
