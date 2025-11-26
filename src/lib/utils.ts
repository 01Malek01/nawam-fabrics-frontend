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

export const checkSubcategoryBelongsToCategory = (
  categoryId: string,
  subCategoryId: string,
  categories: Array<{
    id: string;
    subCategories: Array<{ id: string }>;
  }>
): boolean => {
  const category = categories.find((cat) => cat.id === categoryId);
  if (!category) return false;
  return category.subCategories.some((sub) => sub.id === subCategoryId);
};
