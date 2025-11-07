import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Email service validation in development
if (import.meta.env.DEV) {
  import('./lib/emailTestUtils').then(({ validateEmailSetup }) => {
    validateEmailSetup();
  });
}

createRoot(document.getElementById("root")!).render(<App />);
