import * as React from "react";
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import { ThemeProvider } from "./components/theme-provider";
import { Travel } from "./screens/Travel";
import { Roadmap } from "./screens/Roadmap/Roadmap";
import { Games } from "./screens/Games/Games";
import { BlockchainProvider } from "./contexts/BlockchainContext";
import { ContentSection } from "./screens/Explorer/sections/ContentSection/ContentSection";
import GalaxyGraph from "./screens/Explorer/sections/ContentSection/GalaxyGraph";
import OverallRankingTable from "./screens/Explorer/sections/ContentSection/OverallRankingTable";
import ConsensusConnectionTable from "./screens/Explorer/sections/ContentSection/ConsensusConnectionTable";
import PRNodeTable from "./screens/Explorer/sections/ContentSection/PRNodeTable";
import StakeTransactionTable from "./screens/Explorer/sections/ContentSection/StakeTransactionTable";
import UserInformationTable from "./screens/Explorer/sections/ContentSection/UserInformationTable";
import ContractInformation from "./screens/Explorer/sections/ContentSection/ContractInformation";
import JoinATMForm from "./screens/Ecosystem/sections/JoinAtm";

export const App = (): JSX.Element => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ApiProvider>
      <Web3AuthProvider>
        <BlockchainProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <div className="flex flex-col w-full min-h-screen">
              <HeaderSection />
              <main className="flex-1">
                <Routes>
                  {/* Main routes */}
                  <Route path="/" element={<Homepage />} />
                  <Route path="/technology" element={<Technology />} />
                  <Route path="/ecosystem" element={<Ecosystem />} />
                  <Route path="/ecosystem/travel" element={<Travel />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/joinATM" element={<JoinATMForm />} />
                  {/* Explorer with nested routes */}
                  <Route path="/explorer" element={<Explorer />}>
                    <Route index element={<ContentSection />} />{" "}
                    {/* Default tab */}
                    <Route path="galaxy" element={<GalaxyGraph />} />
                    <Route path="ranking" element={<OverallRankingTable />} />
                    <Route
                      path="consensus"
                      element={<ConsensusConnectionTable />}
                    />
                    <Route path="pr-node" element={<PRNodeTable />} />
                    <Route path="stake" element={<StakeTransactionTable />} />
                    <Route path="user" element={<UserInformationTable />} />
                    <Route path="contract" element={<ContractInformation />} />
                  </Route>
                  {/* Other pages */}
                  <Route path="/news" element={<News />} />
                  <Route path="/news/*" element={<News />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/games" element={<Games />} />
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
        </BlockchainProvider>
      </Web3AuthProvider>
    </ApiProvider>
  );
};
