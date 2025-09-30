import './i18n'; 
import './polyfills';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";

const rootElement = document.getElementById("app") as HTMLElement;

createRoot(rootElement).render(
  <StrictMode>
    {/* English preloaded */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </StrictMode>
);
