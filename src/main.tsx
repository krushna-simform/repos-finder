import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SearchProvider } from "./context/SearchContext.tsx";
import { RepoRefreshProvider } from "./context/RepoContext.tsx";
import { ThemeProvider } from "./context/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="repos-finder-ui-theme">
      <SearchProvider>
        <RepoRefreshProvider>
          <App />
        </RepoRefreshProvider>
      </SearchProvider>
    </ThemeProvider>
  </StrictMode>
);
