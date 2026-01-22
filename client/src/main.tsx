import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { SerialProvider } from "./context/SerialContext";

createRoot(document.getElementById("root")!).render(
  <SerialProvider>
    <App />
  </SerialProvider>
);
