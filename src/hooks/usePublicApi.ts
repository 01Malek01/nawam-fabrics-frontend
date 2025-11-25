import { useCallback } from "react";

export default function usePublicApi() {
  const BASE = (import.meta.env.VITE_NODE_BACKEND_URL as string) || "";
  const getProducts = useCallback(
    async (params: Record<string, string | number | boolean> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        query.append(key, String(value));
      });
      const res = await fetch(`${BASE}/products?${query.toString()}`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) return [];
      return res.json();
    },
    [BASE]
  );

  const getCategories = useCallback(async () => {
    const res = await fetch(`${BASE}/categories`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    return res.json();
  }, [BASE]);

  const getProductById = useCallback(
    async (id: string) => {
      const res = await fetch(`${BASE}/products/${id}`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) return null;
      return res.json();
    },
    [BASE]
  );

  return { getProducts, getCategories, getProductById };
}
