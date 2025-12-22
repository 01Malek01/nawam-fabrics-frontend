import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type OrderDialogContextValue = {
  isOrderDialogOpen: boolean;
  openOrderDialog: () => void;
  closeOrderDialog: () => void;
  setOrderDialogOpen: (open: boolean) => void;
  selectedFabricId?: string | null;
  openOrderDialogFor: (fabricId: string) => void;
};

const OrderDialogContext = createContext<OrderDialogContextValue | undefined>(
  undefined
);

export const OrderDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOrderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedFabricId, setSelectedFabricId] = useState<string | null>(null);

  const value = useMemo<OrderDialogContextValue>(() => {
    return {
      isOrderDialogOpen,
      // open for a specific fabric id
      openOrderDialog: () => setOrderDialogOpen(true),
      openOrderDialogFor: (fabricId: string) => {
        setSelectedFabricId(fabricId);
        setOrderDialogOpen(true);
      },
      closeOrderDialog: () => {
        setOrderDialogOpen(false);
        setSelectedFabricId(null);
      },
      setOrderDialogOpen,
      selectedFabricId,
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
