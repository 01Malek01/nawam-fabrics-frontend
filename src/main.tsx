import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { OrderDialogProvider } from "./context/OrderDialogContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OrderDialogProvider>
      <App />
    </OrderDialogProvider>
  </StrictMode>
);
