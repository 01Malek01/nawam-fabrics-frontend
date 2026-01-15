import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { OrderDialogProvider } from "./context/OrderDialogContext.tsx";
import { HistoryProvider } from "./context/HistoryContext";
import { CartDrawerProvider } from "./context/CartDrawerContext";
export const createApp = () => (
  <StrictMode>
    <HistoryProvider>
      <CartDrawerProvider>
        <OrderDialogProvider>
          <App />
        </OrderDialogProvider>
      </CartDrawerProvider>
    </HistoryProvider>
  </StrictMode>
);

if (typeof window !== "undefined") {
  try {
    // Prevent browser automatic scroll restoration so we can control it
    if (window.history && "scrollRestoration" in window.history) {
      // set to manual so pop/forward navigation does not restore previous scroll
      // position automatically
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.history.scrollRestoration = "manual";
    }
  } catch (e) {
    // ignore
  }

  createRoot(document.getElementById("root")!).render(createApp());
}
