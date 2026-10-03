// JSON-LD structured data helpers for SEO (schema.org).

export const SITE_URL = "https://elnawamfabrics.com";
export const SITE_NAME = "النوام للأقمشة";

export const ORGANIZATION = {
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
};

/** Shape of a raw product record as returned by the API. */
export interface ProductApiRecord {
  _id: string;
  Name?: string;
  PricePerMeter?: number | string;
  Description?: string;
  Image?: string[];
  mainCategoryName?: string;
  subCategoryName?: string;
  MainCategory?: { _id?: string; Name?: string; name?: string };
  SubCategory?: { _id?: string; Name?: string; name?: string };
  isOutOfStock?: boolean;
}

/** Minimal, schema-ready product data. */
export interface ProductSchemaInput {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  image: string;
  images?: string[];
  category?: string;
  isOutOfStock?: boolean;
}

/**
 * Turns a stored image path into an absolute public URL.
 * Relative paths (e.g. "uploads/products/x.jpg") are prefixed with SITE_URL
 * so crawlers always receive crawlable absolute URLs regardless of the
 * client-side VITE_NODE_BACKEND base.
 */
export function toAbsoluteImageUrl(imagePath: string | undefined | null): string {
  if (!imagePath) return "";
  const normalized = imagePath.replace(/\\/g, "/");
  if (/^https?:\/\//i.test(normalized)) return normalized;
  return `${SITE_URL}/${normalized.replace(/^\/+/, "")}`;
}

/** Converts a raw API product record into schema-ready input. */
export function productFromApiRecord(record: ProductApiRecord): ProductSchemaInput {
  const categoryName =
    record.mainCategoryName ||
    record.MainCategory?.Name ||
    record.subCategoryName ||
    record.SubCategory?.Name ||
    "";
  const rawImages = Array.isArray(record.Image) ? record.Image : [];
  const images = rawImages.map(toAbsoluteImageUrl).filter(Boolean);

  return {
    id: record._id,
    name: record.Name || "",
    description: record.Description || "",
    price: record.PricePerMeter ?? 0,
    image: images[0] || "",
    images,
    category: categoryName,
    isOutOfStock: !!record.isOutOfStock,
  };
}

/** Builds a schema.org Product object for a single product. */
export function buildProductSchema(
  p: ProductSchemaInput,
  path?: string,
) {
  const url =
    path ??
    `${SITE_URL}/fabric/${encodeURIComponent(p.id)}`;
  const priceValue = Number(p.price);
  const image = [p.image, ...(p.images || [])].filter(Boolean);
  const description = p.description?.trim();

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": url,
    name: p.name,
    url,
    image,
    sku: p.id,
    brand: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
      logo: ORGANIZATION.logo,
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "EGP",
      price: Number.isFinite(priceValue) ? priceValue : undefined,
      availability: p.isOutOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: ORGANIZATION.name,
        url: ORGANIZATION.url,
      },
    },
  };

  if (description) schema.description = description;
  if (p.category) schema.category = p.category;

  return schema;
}

/** Builds a schema.org ItemList object for a listing page. */
export function buildItemListSchema(
  items: ProductSchemaInput[],
  url: string = `${SITE_URL}/products`,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "المنتجات",
    url,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: buildProductSchema(item),
    })),
  };
}

/** A single breadcrumb item (trail, not the current page). */
export interface BreadcrumbItem {
  name: string;
  path: string;
}

/** Builds a schema.org BreadcrumbList for a page's navigation trail. */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  const list = items.map((item, index) => {
    const isLast = index === items.length - 1;
    return {
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(isLast ? {} : { item: `${SITE_URL}${item.path}` }),
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list,
  };
}

/** Builds a schema.org BlogPosting object from a public blog post. */
export function buildBlogPostingSchema(post: {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  publishedAt?: string;
  createdAt?: string;
  author?: { username?: string; name?: string };
}) {
  const url = `${SITE_URL}/blogs/${encodeURIComponent(post.slug || "")}`;
  const datePublished = post.publishedAt || post.createdAt || "";

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: post.coverImage
      ? [toAbsoluteImageUrl(post.coverImage)]
      : undefined,
    datePublished,
    author: {
      "@type": "Organization",
      name: post.author?.name || post.author?.username || ORGANIZATION.name,
    },
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      logo: {
        "@type": "ImageObject",
        url: ORGANIZATION.logo,
      },
    },
  };
}

/** Builds a schema.org FAQPage object from a list of questions/answers. */
export function buildFaqSchema(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
