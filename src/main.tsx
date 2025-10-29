import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  // Use Vite's BASE_URL so the router basename matches the built base.
  // This allows deploying either at site root or a subpath without
  // hardcoding "/StatCalc-Pro" which caused the app to render blank
  // when the URL didn't start with that basename.
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <App />
  </BrowserRouter>
);
