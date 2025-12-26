import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type OrderDialogContextValue = {
  isOrderDialogOpen: boolean;
  openOrderDialog: () => void;
  closeOrderDialog: () => void;
  setOrderDialogOpen: (open: boolean) => void;
  selectedFabricId?: string | null;
  openOrderDialogFor: (fabricId: string) => void;
  hasSubmitted: boolean;
  setHasSubmitted: (v: boolean) => void;
};

const OrderDialogContext = createContext<OrderDialogContextValue | undefined>(
  undefined
);

export const OrderDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOrderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedFabricId, setSelectedFabricId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

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
        setHasSubmitted(false);
      },
      setOrderDialogOpen,
      selectedFabricId,
      hasSubmitted,
      setHasSubmitted,
    };
  }, [isOrderDialogOpen, selectedFabricId, hasSubmitted]);

  // Auto-close the dialog 10s after a successful submission (hasSubmitted === true)
  useEffect(() => {
    if (!hasSubmitted) return;
    const t = setTimeout(() => {
      setOrderDialogOpen(false);
      setSelectedFabricId(null);
      setHasSubmitted(false);
    }, 10000);

    return () => clearTimeout(t);
  }, [hasSubmitted]);

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
