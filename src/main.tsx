import { ThemeProvider } from "@/lib/theme-provider";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./styles/globals.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find root element");
}

createRoot(rootElement).render(
  <HelmetProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </HelmetProvider>,
);

// Clean up any legacy Monetag service workers registered on previous visits
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => {
      for (const registration of registrations) {
        const scriptURL =
          registration.active?.scriptURL ||
          registration.waiting?.scriptURL ||
          registration.installing?.scriptURL ||
          "";
        if (
          scriptURL.includes("sw.js") ||
          scriptURL.includes("3nbf4") ||
          scriptURL.includes("monetag")
        ) {
          registration.unregister().catch(() => {});
        }
      }
    })
    .catch(() => {});
}
