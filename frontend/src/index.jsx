import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { StudentProvider } from "./StudentContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StudentProvider>
      <App />
    </StudentProvider>
  </React.StrictMode>
);
