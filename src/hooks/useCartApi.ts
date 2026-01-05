import { useCallback } from "react";

type CartItem = {
  productId: string;
  name?: string;
  quantity: number;
  meters?: number;
  pricePerMeter?: number;
  total?: number;
};

export default function useCartApi() {
  const BASE = (import.meta.env.VITE_NODE_BACKEND_URL as string) || "";

  const throwResponseError = async (
    res: Response,
    fallback = "Request failed"
  ) => {
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      const msg = data?.message || data?.error || text;
      throw new Error(msg || fallback);
    } catch (e) {
      throw new Error(text || fallback);
    }
  };

  const getCartItems = useCallback(async (): Promise<CartItem[]> => {
    const res = await fetch(`${BASE}/cart`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) await throwResponseError(res, "Failed to fetch cart");
    return res.json();
  }, [BASE]);

  const addItemToCart = useCallback(
    async (payload: {
      productId: string;
      quantity?: number;
      meters?: number;
      pricePerMeter?: number;
      images: string[];
    }) => {
      const res = await fetch(`${BASE}/cart`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) await throwResponseError(res, "Failed to add item to cart");
      return res.json();
    },
    [BASE]
  );

  const updateCartItem = useCallback(
    async (
      productId: string,
      payload: { quantity?: number; meters?: number; pricePerMeter?: number }
    ) => {
      const res = await fetch(
        `${BASE}/cart/item/${encodeURIComponent(productId)}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) await throwResponseError(res, "Failed to update cart item");
      return res.json();
    },
    [BASE]
  );

  const removeItemFromCart = useCallback(
    async (productId: string) => {
      const res = await fetch(
        `${BASE}/cart/item/${encodeURIComponent(productId)}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) await throwResponseError(res, "Failed to remove cart item");
      return res.json();
    },
    [BASE]
  );

  const clearCart = useCallback(async () => {
    const res = await fetch(`${BASE}/cart`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) await throwResponseError(res, "Failed to clear cart");
    return res.json();
  }, [BASE]);

  return {
    getCartItems,
    addItemToCart,
    updateCartItem,
    removeItemFromCart,
    clearCart,
  };
}
