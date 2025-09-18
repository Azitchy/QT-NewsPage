// WebApp.tsx
import React, { useState, useEffect } from "react";
import { useWeb3Auth } from "../../contexts/Web3AuthContext";
import { Wallet, LogOut, Plus, Clock, Shield, RefreshCw, AlertTriangle } from "lucide-react";

// Import section components
import { Income } from "./sections/Income";
import { ConsensusConnection } from "./sections/ConsensusConnection";
import { PRNode } from "./sections/PRnode";
import { CommunityProposal } from "./sections/CommunityProposal";
import { ConsumersInterests } from "./sections/ConsumersInterests";
import { TradingTools } from "./sections/TradingTools";
import { AuthorizationManagement } from "./sections/AuthorizationManagement";
import { Avatar } from "./sections/Avatar";

export const WebApp = (): JSX.Element => {
  const { 
    wallet, 
    session, 
    disconnectWallet, 
    refreshSession, 
    checkLUCASupport,
    error: authError 
  } = useWeb3Auth();
  
  const [activeTab, setActiveTab] = useState("Income");
  const [sessionTimeLeft, setSessionTimeLeft] = useState<string>("");

  // Session countdown timer
  useEffect(() => {
    if (!session) return;

    const updateTimer = () => {
      const now = Date.now();
      const timeLeft = session.expiresAt - now;
      
      if (timeLeft <= 0) {
        setSessionTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      if (hours > 0) {
        setSessionTimeLeft(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setSessionTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setSessionTimeLeft(`${seconds}s`);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [session]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatSessionToken = (token: string) => {
    return `${token.slice(0, 8)}...${token.slice(-4)}`;
  };

  const handleRefreshSession = async () => {
    try {
      await refreshSession();
    } catch (error) {
      console.error('Failed to refresh session:', error);
    }
  };

  const isNetworkSupported = checkLUCASupport();

  const mainTabs = [
    "Income",
    "Consensus Connection", 
    "PR node",
    "Community proposal",
    "Consumers interests",
    "Trading tools",
    "Authorization management",
    "Avatar"
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Income":
        return <Income />;
      case "Consensus Connection":
        return <ConsensusConnection />;
      case "PR node":
        return <PRNode />;
      case "Community proposal":
        return <CommunityProposal />;
      case "Consumers interests":
        return <ConsumersInterests />;
      case "Trading tools":
        return <TradingTools />;
      case "Authorization management":
        return <AuthorizationManagement />;
      case "Avatar":
        return <Avatar />;
      default:
        return <Income />;
    }
  };

  return (
    <main className="flex flex-col min-h-screen w-full bg-white">
      {/* Enhanced Header with Session Info */}
      <div className="w-full bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            {session && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-800">
                  Authenticated
                </span>
              </div>
            )}
            {!isNetworkSupported && wallet && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-medium text-orange-800">
                  Switch to BSC
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Session Status */}
            {session && (
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600" />
                <div className="text-xs">
                  <div className="text-blue-800 font-medium">Session expires in</div>
                  <div className="text-blue-600 font-mono">{sessionTimeLeft}</div>
                </div>
                <button
                  onClick={handleRefreshSession}
                  className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                  title="Refresh session"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Wallet Info */}
            {wallet && (
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                <Wallet className="w-4 h-4 text-gray-600" />
                <div className="text-xs">
                  <div className="font-medium text-gray-900">
                    {formatAddress(wallet.address)}
                  </div>
                  {session && (
                    <div className="text-gray-500 font-mono">
                      Token: {formatSessionToken(session.token)}
                    </div>
                  )}
                  <div className="text-gray-500">
                    Chain: {wallet.chainId === '0x38' ? 'BSC' : wallet.chainId === '0x61' ? 'BSC Testnet' : 'Unknown'}
                  </div>
                </div>
              </div>
            )}
            
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
              <Plus className="w-4 h-4" />
              Create connection
            </button>
            
            <button
              onClick={disconnectWallet}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              title="Disconnect wallet and clear session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Session Info */}
        {session && (
          <div className="md:hidden mt-3 flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-800">
                Session expires in <strong className="font-mono">{sessionTimeLeft}</strong>
              </span>
            </div>
            <button
              onClick={handleRefreshSession}
              className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
              title="Refresh session"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Network Warning */}
        {!isNetworkSupported && wallet && (
          <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Please switch to Binance Smart Chain to access LUCA tokens and full functionality.
              </span>
            </div>
          </div>
        )}

        {/* Auth Error */}
        {authError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">{authError}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation Tabs */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {mainTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area - Render Active Tab Component */}
      {renderActiveTab()}
    </main>
  );
};