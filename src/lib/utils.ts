import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(imagePath: string): string {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
    return imagePath;
  const base = (import.meta.env.VITE_NODE_BACKEND as string) || "";
  console.log(`${base}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`);
  return `${base}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}
