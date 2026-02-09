import { Routes, Route, Navigate } from "react-router-dom";
import LoginLayout from "@/layouts/LoginLayout";
import AppLayout from "@/layouts/AppLayout";
import { TooltipProvider } from "@/components/ui/atm/tooltip";

import Connect from "@/screens/Connect";
import Page from "./screens/Page";

import Portfolio from "@/screens/dashboard/Portfolio";
import Income from "@/screens/dashboard/Income";

import TokenConnection from "@/screens/connections/TokenConnection";
import NftConnection from "@/screens/connections/NftConnection";
import PrNode from "@/screens/connections/PrNode";

import ProposalParticipate from "@/screens/proposals/ProposalParticipate";
import ProposalInitiated from "@/screens/proposals/ProposalInitiated";
import RecoveryPlan from "@/screens/proposals/RecoveryPlan";
import AgfContribution from "@/screens/proposals/AgfContribution";
import YourContribution from "@/screens/proposals/YourContribution";

import AtmCrossChainTransfer from "@/screens/trading/AtmCrossChainTransfer";

import ChatIndex from "@/screens/chat/Index";

import Lucy from "@/screens/avatar/Lucy";
import Alex from "@/screens/avatar/Alex";

import GamesDashboard from "@/screens/games/Dashboard";
import Games from "@/screens/games/Games";
import Contributions from "@/screens/games/Contributions";
import ProposeGame from "@/screens/games/ProposeGame";

import SettingsIndex from "@/screens/settings/Index";
import CreateConnection from "@/screens/create-connection/Index";
import DashboardLayout from "@/layouts/DashboardLayout";


function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route element={<LoginLayout />}>
          <Route path="/connect" element={<Connect />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Create Connection */}
          <Route path="/create-connection" element={<CreateConnection />} />

          {/* Dashboard — wrapped with DashboardLayout for cross-tab data caching */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route element={<Page title="Dashboard" showOutlet />}>
              <Route index element={<Navigate to="portfolio" replace />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="income" element={<Income />} />
            </Route>
          </Route>

          {/* Connections */}
          <Route path="/connections" element={<Page title="Connections" showOutlet />}>
            <Route index element={<Navigate to="token-connection" replace />} />
            <Route path="token-connection" element={<TokenConnection />} />
            <Route path="nft-connection" element={<NftConnection />} />
            <Route path="pr-node" element={<PrNode />} />
          </Route>

          {/* Proposals */}
          <Route path="/proposals" element={<Page title="Proposals" showOutlet />}>
            <Route index element={<Navigate to="proposal-participate" replace />} />
            <Route path="proposal-participate" element={<ProposalParticipate />} />
            <Route path="proposal-initiated" element={<ProposalInitiated />} />
            <Route path="recovery-plan" element={<RecoveryPlan />} />
            <Route path="agf-contribution" element={<AgfContribution />} />
            <Route path="your-contribution" element={<YourContribution />} />
          </Route>

          {/* Trading */}
          <Route path="/trading" element={<Page title="Trading tools" showOutlet />}>
            <Route index element={<Navigate to="atm-cross-chain-transfer" replace />} />
            <Route path="atm-cross-chain-transfer" element={<AtmCrossChainTransfer />} />
          </Route>

          {/* Chat */}
          <Route path="/chat" element={<Page title="Chat" showOutlet />}>
            <Route index element={<ChatIndex />} />
          </Route>

          {/* Avatar */}
          <Route path="/avatar" element={<Page title="Avatar" showOutlet />}>
            <Route index element={<Navigate to="lucy" replace />} />
            <Route path="lucy" element={<Lucy />} />
            <Route path="alex" element={<Alex />} />
          </Route>

          {/* Games */}
          <Route path="/games" element={<Page title="Games" showOutlet />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<GamesDashboard />} />
            <Route path="games" element={<Games />} />
            <Route path="contributions" element={<Contributions />} />
            <Route path="propose-game" element={<ProposeGame />} />
          </Route>

          {/* Settings */}
          <Route path="/settings" element={<Page title="Settings" showOutlet />}>
            <Route index element={<SettingsIndex />} />
          </Route>
        </Route>
      </Routes>
    </TooltipProvider>
  );
}

export default App

