/// <reference types="node" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import Pages from "vite-plugin-pages";
import ViteSitemap from "vite-plugin-sitemap";
import { createHtmlPlugin } from "vite-plugin-html";

const SITE_URL = "https://elnawamfabrics.com";
const API_BASE = `${SITE_URL}/api`;

// Static routes that are not real .html files (the SPA serves them client-side),
// so they would otherwise be missing from the build-time sitemap.
const STATIC_ROUTES = [
  "/about",
  "/contact",
  "/blogs",
  "/lastpieces",
  "/faq",
  "/terms",
  "/return-policy",
  "/privacy-policy",
  "/shipping",
  "/complaints",
  "/fabric-types",
  "/branches",
  "/washing-instructions",
];

interface ApiRecord {
  _id?: string;
  slug?: string;
  isSubCategory?: boolean;
  ParentCategory?: { _id?: string } | string | null;
}

async function fetchJson(pathName: string): Promise<ApiRecord[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(`${API_BASE}${pathName}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!res.ok) return [];
    return (await res.json()) as ApiRecord[];
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Builds the full route list for the sitemap by pulling products, categories,
 * posts and last pieces from the public API. Falls back to static routes only
 * if the API is unreachable during the build.
 */
async function getDynamicRoutes(): Promise<string[]> {
  const routes = new Set<string>(STATIC_ROUTES);

  const [products, categories, posts, lastPieces] = await Promise.all([
    fetchJson("/products"),
    fetchJson("/categories"),
    fetchJson("/blogs"),
    fetchJson("/lastpieces"),
  ]);

  for (const product of products) {
    if (product._id) routes.add(`/fabric/${product._id}`);
  }

  for (const category of categories) {
    if (!category._id) continue;
    if (category.isSubCategory) {
      const parent =
        typeof category.ParentCategory === "object"
          ? category.ParentCategory?._id
          : category.ParentCategory;
      if (parent) routes.add(`/categories/${parent}/${category._id}`);
    } else {
      routes.add(`/categories/${category._id}`);
    }
  }

  for (const post of posts) {
    if (post.slug) routes.add(`/blogs/${encodeURIComponent(post.slug)}`);
  }

  for (const piece of lastPieces) {
    if (piece._id) routes.add(`/lastpieces/${piece._id}`);
  }

  return [...routes];
}

// https://vite.dev/config/
export default defineConfig(async () => {
  const dynamicRoutes = await getDynamicRoutes();

  return {
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
      tailwindcss(),
      Pages(),
      createHtmlPlugin({
        minify: true,
      }),
      ViteSitemap({
        hostname: SITE_URL,
        dynamicRoutes,
        generateRobotsTxt: true,
        robots: [
          { userAgent: "*", allow: "/" },
          { userAgent: "Googlebot", disallow: "/private" },
        ],
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
