// Shared SEO head component. Centralizes per-page <title>, meta description,
// canonical URL, Open Graph, and Twitter tags, plus optional JSON-LD.
import { Helmet } from "react-helmet";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, toAbsoluteImageUrl } from "@/lib/schema";

export interface SeoHeadProps {
  /** Full page title (used for <title>, og:title, twitter:title). */
  title: string;
  /** Meta description (also og:description / twitter:description). */
  description?: string;
  /** Canonical path on the site, e.g. "/fabric/123". Defaults to "/". */
  path?: string;
  /** Absolute image URL for og:image / twitter:image (social preview). */
  image?: string;
  /** Open Graph type. */
  type?: "website" | "article";
  /** Comma-separated keywords (optional). */
  keywords?: string;
  /** Structured data (schema.org) to inject as JSON-LD. */
  jsonLd?: object | object[];
}

function normalizePath(path?: string): string {
  if (!path) return "/";
  const trimmed = path.trim();
  if (trimmed.startsWith("/")) return trimmed;
  return `/${trimmed}`;
}

export default function SeoHead({
  title,
  description,
  path,
  image,
  type = "website",
  keywords,
  jsonLd,
}: SeoHeadProps) {
  const canonical = `${SITE_URL}${normalizePath(path)}`;
  const ogImage = image ? toAbsoluteImageUrl(image) : undefined;
  const siteName = "النوام للأقمشة";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        {description ? <meta name="description" content={description} /> : null}
        {keywords ? <meta name="keywords" content={keywords} /> : null}
        <link rel="canonical" href={canonical} />

        <meta property="og:type" content={type} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={canonical} />
        {description ? (
          <meta property="og:description" content={description} />
        ) : null}
        {ogImage ? <meta property="og:image" content={ogImage} /> : null}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        {description ? (
          <meta name="twitter:description" content={description} />
        ) : null}
        {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}
      </Helmet>
      {jsonLd ? <JsonLd data={jsonLd} /> : null}
    </>
  );
}
