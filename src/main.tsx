import { createRoot } from "react-dom/client";
import App from "./App";
import { Authentication } from "./auth/Authentication";
import "./styles/untitled.css";
import "./styles.css";
import "./styles/fields.css";
import "./styles/12ui-tokens.css";
import "./styles/12ui-refinement.css";
import "./styles/scroll-layout.css";
createRoot(document.getElementById("root")!).render(
  <Authentication>
    <App />
  </Authentication>,
);
