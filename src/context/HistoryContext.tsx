import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  type ReactNode,
} from "react";

type ModalEntry = {
  key: string;
  onClose?: () => void;
};

type HistoryContextType = {
  pushModal: (key: string, onClose?: () => void) => void;
  popModal: () => boolean;
  hasModals: () => boolean;
};

const HistoryContext = createContext<HistoryContextType | null>(null);

export const useHistoryContext = () => {
  const ctx = useContext(HistoryContext);
  if (!ctx)
    throw new Error("useHistoryContext must be used within HistoryProvider");
  return ctx;
};

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const stack = useRef<ModalEntry[]>([]);
  const suppressNextPop = useRef(false);

  const pushModal = (key: string, onClose?: () => void) => {
    // avoid duplicate consecutive keys
    const top = stack.current[stack.current.length - 1];
    if (top && top.key === key) return;
    stack.current.push({ key, onClose });
    try {
      window.history.pushState({ modalKey: key }, "", window.location.href);
    } catch (e) {
      // ignore
    }
  };

  const popModal = () => {
    if (stack.current.length === 0) return false;
    // remove top entry
    stack.current.pop();
    // programmatic back: suppress the next popstate handler run
    suppressNextPop.current = true;
    try {
      window.history.back();
    } catch (e) {
      // ignore
    }
    return true;
  };

  const handlePopState = () => {
    if (suppressNextPop.current) {
      suppressNextPop.current = false;
      return;
    }

    const entry = stack.current.pop();
    if (entry && typeof entry.onClose === "function") {
      try {
        entry.onClose();
      } catch (e) {
        // ignore
      }
    }
    // if no entry, do nothing — allow browser to navigate
  };

  useEffect(() => {
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: HistoryContextType = {
    pushModal,
    popModal,
    hasModals: () => stack.current.length > 0,
  };

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
};

export default HistoryContext;
