// WebApp.tsx
import * as React from "react";
import { useState, useEffect } from "react";
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

// Define the webapp state interface
interface WebAppState {
  activeTab: string;
  userPreferences: {
    theme: string;
    language: string;
  };
  lastVisited: number;
}

// Default state
const defaultState: WebAppState = {
  activeTab: "Income",
  userPreferences: {
    theme: "light",
    language: "en"
  },
  lastVisited: Date.now()
};

// Storage key for persisting state
const WEBAPP_STATE_KEY = "webapp_state";

export const WebApp = (): JSX.Element => {
  const { 
    wallet, 
    session, 
    disconnectWallet, 
    refreshSession, 
    checkLUCASupport,
    error: authError 
  } = useWeb3Auth();
  
  // State management with persistence
  const [webAppState, setWebAppState] = useState<WebAppState>(() => {
    // Load state from localStorage on initialization
    try {
      const savedState = localStorage.getItem(WEBAPP_STATE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Validate the parsed state has required properties
        if (parsed.activeTab && parsed.userPreferences) {
          return { ...defaultState, ...parsed };
        }
      }
    } catch (error) {
      console.warn('Failed to load webapp state from localStorage:', error);
    }
    return defaultState;
  });

  const [sessionTimeLeft, setSessionTimeLeft] = useState<string>("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      const stateToSave = {
        ...webAppState,
        lastVisited: Date.now()
      };
      localStorage.setItem(WEBAPP_STATE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Failed to save webapp state to localStorage:', error);
    }
  }, [webAppState]);

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

  const setActiveTab = (tab: string) => {
    setWebAppState(prev => ({
      ...prev,
      activeTab: tab
    }));
    setShowMobileMenu(false); // Close mobile menu when tab changes
  };

  // Utility functions
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
    switch (webAppState.activeTab) {
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
    <main className="flex flex-col min-h-screen w-full bg-background dark:bg-background transition-colors duration-200">
      {/* Enhanced Header with better responsiveness */}
      <div className="w-full bg-background dark:bg-background border-b border-border dark:border-border px-4 sm:px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground dark:text-foreground">Dashboard</h1>
            {session && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-800 dark:text-green-300">
                  Authenticated
                </span>
              </div>
            )}
            {!isNetworkSupported && wallet && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-xs font-medium text-orange-800 dark:text-orange-300">
                  Switch to BSC
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile menu button - visible on small screens */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden p-2 text-foreground dark:text-foreground hover:bg-card dark:hover:bg-card transition-colors rounded-lg"
            >
              <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${showMobileMenu ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${showMobileMenu ? 'opacity-0' : ''}`}></div>
                <div className={`w-5 h-5 h-0.5 bg-current transition-all duration-300 ${showMobileMenu ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>


            {/* Session Status - hidden on mobile */}
            {session && (
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div className="text-xs">
                  <div className="text-blue-800 dark:text-blue-300 font-medium">Session expires in</div>
                  <div className="text-blue-600 dark:text-blue-400 font-mono">{sessionTimeLeft}</div>
                </div>
                <button
                  onClick={handleRefreshSession}
                  className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  title="Refresh session"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Wallet Info */}
            {wallet && (
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-card rounded-lg border border-gray-200 dark:border-border">
                <Wallet className="w-4 h-4 text-gray-600 dark:text-card-foreground" />
                <div className="text-xs">
                  <div className="font-medium text-gray-900 dark:text-foreground">
                    {formatAddress(wallet.address)}
                  </div>
                  {session && (
                    <div className="text-gray-500 dark:text-card-foreground font-mono">
                      Token: {formatSessionToken(session.token)}
                    </div>
                  )}
                  <div className="text-gray-500 dark:text-card-foreground">
                    Chain: {wallet.chainId === '0x38' ? 'BSC' : wallet.chainId === '0x61' ? 'BSC Testnet' : 'Unknown'}
                  </div>
                </div>
              </div>
            )}
            
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Create connection</span>
            </button>
            
            <button
              onClick={disconnectWallet}
              className="p-2 text-gray-500 dark:text-card-foreground hover:text-red-600 transition-colors"
              title="Disconnect wallet and clear session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Session Info */}
        {session && (
          <div className="sm:hidden mt-3 flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs text-blue-800 dark:text-blue-300">
                Session expires in <strong className="font-mono">{sessionTimeLeft}</strong>
              </span>
            </div>
            <button
              onClick={handleRefreshSession}
              className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              title="Refresh session"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Network Warning */}
        {!isNetworkSupported && wallet && (
          <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-center gap-2 text-orange-800 dark:text-orange-300">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Please switch to Binance Smart Chain to access LUCA tokens and full functionality.
              </span>
            </div>
          </div>
        )}

        {/* Auth Error */}
        {authError && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">{authError}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation Tabs - Desktop */}
      <div className="hidden sm:block w-full bg-white dark:bg-background border-b border-gray-200 dark:border-border">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8 overflow-x-auto">
            {mainTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  webAppState.activeTab === tab
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 dark:text-card-foreground hover:text-gray-700 dark:hover:text-foreground hover:border-gray-300 dark:hover:border-border'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="sm:hidden bg-white dark:bg-background border-b border-gray-200 dark:border-border">
          <nav className="px-4 py-2 space-y-1 max-h-60 overflow-y-auto">
            {mainTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
                  webAppState.activeTab === tab
                    ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800'
                    : 'text-gray-500 dark:text-card-foreground hover:bg-gray-50 dark:hover:bg-card'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Content Area - Render Active Tab Component */}
      <div className="flex-1 bg-gray-50 dark:bg-background">
        {renderActiveTab()}
      </div>
    </main>
  );
};