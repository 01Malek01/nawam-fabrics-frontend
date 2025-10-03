import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type OrderDialogContextValue = {
  isOrderDialogOpen: boolean;
  openOrderDialog: () => void;
  closeOrderDialog: () => void;
  setOrderDialogOpen: (open: boolean) => void;
};

const OrderDialogContext = createContext<OrderDialogContextValue | undefined>(
  undefined
);

export const OrderDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOrderDialogOpen, setOrderDialogOpen] = useState(false);

  const value = useMemo<OrderDialogContextValue>(() => {
    return {
      isOrderDialogOpen,
      openOrderDialog: () => setOrderDialogOpen(true),
      closeOrderDialog: () => setOrderDialogOpen(false),
      setOrderDialogOpen,
    };
  }, [isOrderDialogOpen]);

  return (
    <OrderDialogContext.Provider value={value}>
      {children}
    </OrderDialogContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOrderDialog = (): OrderDialogContextValue => {
  const ctx = useContext(OrderDialogContext);
  if (!ctx) {
    throw new Error(
      "useOrderDialog must be used within an OrderDialogProvider"
    );
  }
  return ctx;
};
