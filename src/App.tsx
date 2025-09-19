// App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Web3AuthProvider } from "./contexts/Web3AuthContext";
import { ApiProvider } from "./contexts/ApiContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HeaderSection } from "./components/HeaderSection";
import { Homepage } from "./screens/Homepage/Homepage";
import { Technology } from "./screens/Technology";
import { Ecosystem } from "./screens/Ecosystem";
import { Community } from "./screens/Community";
import { Explorer } from "./screens/Explorer/Explorer";
import { News } from "./screens/News/News";
import { Help } from "./screens/Help/Help";
import { WebApp } from "./screens/WebApp";
import { ApiDemo } from "./components/ApiDemo";
import { ThemeProvider } from "./components/theme-provider";
import { Travel } from "./screens/Travel";
import { Roadmap } from "./screens/Roadmap/Roadmap";
import { Games } from "./screens/Games/Games";

export const App = (): JSX.Element => {
  return (
    <ApiProvider>
      <Web3AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <div className="flex flex-col w-full min-h-screen">
            <HeaderSection />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/technology" element={<Technology />} />
                <Route path="/ecosystem" element={<Ecosystem />} />
                <Route path="/ecosystem/travel" element={<Travel />} />
                <Route path="/community" element={<Community />} />
                <Route path="/explorer" element={<Explorer />} />
                <Route path="/news" element={<News />} />
                <Route path="/help" element={<Help />} />
                <Route path="/games" element={<Games />} />
                <Route path="/api-demo" element={<ApiDemo />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route 
                  path="/webapp" 
                  element={
                    <ProtectedRoute>
                      <WebApp />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </Web3AuthProvider>
    </ApiProvider>
  );
};
