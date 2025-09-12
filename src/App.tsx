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

export const App = (): JSX.Element => {
  return (
    <ApiProvider>
      <Web3AuthProvider>
        <div className="flex flex-col w-full min-h-screen bg-white">
          <HeaderSection />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/technology" element={<Technology />} />
              <Route path="/ecosystem" element={<Ecosystem />} />
              <Route path="/community" element={<Community />} />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/news" element={<News />} />
              <Route path="/help" element={<Help />} />
              <Route path="/api-demo" element={<ApiDemo />} />
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
      </Web3AuthProvider>
    </ApiProvider>
  );
};