import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { OrderDialogProvider } from "./context/OrderDialogContext.tsx";

export const createApp = () => (
  <StrictMode>
    <OrderDialogProvider>
      <App />
    </OrderDialogProvider>
  </StrictMode>
);

if (typeof window !== "undefined") {
  createRoot(document.getElementById("root")!).render(createApp());
}
