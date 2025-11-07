import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/errorHandler"; // Global error handler to prevent crashes

createRoot(document.getElementById("root")!).render(<App />);
