// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { getImageUrl } from "@/lib/utils";

/**
 * Rewrites relative `/uploads/...` image sources inside a post's rich-text HTML
 * so they resolve against the API base URL in both dev and production.
 */
export function renderBlogContent(html: string): string {
  if (!html) return "";
  return html.replace(
    /src=(["'])(?!https?:|data:|\/\/)([^"']+)\1/gi,
    (_match, quote, src) => `src=${quote}${getImageUrl(src)}${quote}`
  );
}

/** Builds a plain-text excerpt from rich-text HTML (used for cards and meta tags). */
export function stripHtml(html: string, maxLength = 160): string {
  if (!html) return "";
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

/** Formats a date for display, falling back gracefully when absent. */
export function formatPostDate(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}