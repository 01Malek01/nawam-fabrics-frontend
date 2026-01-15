import React, { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useHistoryContext } from "./HistoryContext";

type CartDrawerContextValue = {
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  setCartDrawerOpen: (v: boolean) => void;
};

const CartDrawerContext = createContext<CartDrawerContextValue | undefined>(
  undefined
);

export const CartDrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);
  const history = (() => {
    try {
      return useHistoryContext();
    } catch (e) {
      return null;
    }
  })();

  const openCartDrawer = () => {
    setCartDrawerOpen(true);
    try {
      history?.pushModal("cart-drawer", () => setCartDrawerOpen(false));
    } catch (e) {}
  };

  const closeCartDrawer = () => {
    setCartDrawerOpen(false);
    try {
      history?.popModal();
    } catch (e) {}
  };

  const value = useMemo(
    () => ({
      isCartDrawerOpen,
      openCartDrawer,
      closeCartDrawer,
      setCartDrawerOpen,
    }),
    [isCartDrawerOpen]
  );

  return (
    <CartDrawerContext.Provider value={value}>
      {children}
    </CartDrawerContext.Provider>
  );
};

export const useCartDrawer = (): CartDrawerContextValue => {
  const ctx = useContext(CartDrawerContext);
  if (!ctx)
    throw new Error("useCartDrawer must be used within a CartDrawerProvider");
  return ctx;
};

export default CartDrawerContext;
