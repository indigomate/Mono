import { createRoot } from "react-dom/client";
import App from "./App";
import { Authentication } from "./auth/Authentication";
import "./styles.css";
createRoot(document.getElementById("root")!).render(
  <Authentication>
    <App />
  </Authentication>,
);
