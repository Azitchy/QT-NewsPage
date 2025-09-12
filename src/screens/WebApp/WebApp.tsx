// WebApp.tsx
import React, { useState, useEffect } from "react";
import { useWeb3Auth } from "../../contexts/Web3AuthContext";
import { Wallet, LogOut, Plus, Info, Clock, Shield, RefreshCw, Zap } from "lucide-react";

export const WebApp = (): JSX.Element => {
  const { wallet, session, disconnectWallet, refreshSession } = useWeb3Auth();
  const [activeTab, setActiveTab] = useState("Income");
  const [activeSubTab, setActiveSubTab] = useState("User income");
  const [withdrawAmount, setWithdrawAmount] = useState("");
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

  const incomeSubTabs = [
    "User income",
    "Income details", 
    "Withdrawal record"
  ];

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

      {/* Content Area */}
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {activeTab === "Income" && (
            <>
              {/* Income Sub Navigation */}
              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {incomeSubTabs.map((subTab) => (
                      <button
                        key={subTab}
                        onClick={() => setActiveSubTab(subTab)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeSubTab === subTab
                            ? 'border-teal-500 text-teal-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {subTab}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {activeSubTab === "User income" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Available Income Card */}
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-r from-teal-400 to-teal-500 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Available Income</h2>
                        {session && (
                          <div className="flex items-center gap-2 bg-teal-600 bg-opacity-50 rounded-lg px-3 py-1">
                            <Shield className="w-4 h-4" />
                            <span className="text-xs font-medium">Secured by Web3</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm mb-6 leading-relaxed">
                        The total available revenue can be withdrawn directly to your Ethereum wallet, and the corresponding gas 
                        fee will be deducted from the withdrawal revenue. Every time you withdraw, all proceeds will be withdrawn to 
                        the wallet address, and you must wait for the withdrawn funds to arrive in your account before a new 
                        withdrawal operation can be performed.
                      </p>

                      <div className="text-4xl font-bold mb-4">
                        0 LUCA
                      </div>
                      
                      {/* LUCA Token Info */}
                      <div className="bg-teal-600 bg-opacity-30 rounded-lg p-3 mb-6">
                        <div className="flex items-center gap-2 text-sm font-medium mb-2">
                          <Zap className="w-4 h-4" />
                          <span>LUCA Token Details</span>
                        </div>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span>Contract:</span>
                            <span className="font-mono">0x51E6...bfa0</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Network:</span>
                            <span>
                              BSC {((wallet as any)?.chainId === '0x38' ? 'Connected' : 'Wrong Chain')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Decimals:</span>
                            <span>18</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-teal-300 pt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Info className="w-4 h-4" />
                          <span className="font-medium">Notes of withdraw</span>
                        </div>
                        <p className="text-sm mt-2 leading-relaxed">
                          Binance Smart Chain is the only way to withdraw income. The withdrawn LUCA income can be transferred to 
                          other chains through cross-chain transfer in the trading tool, or it can be exchanged through Swap.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Withdraw Panel */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Withdraw</h3>
                      {session && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Shield className="w-3 h-3" />
                          <span>Session Active</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Withdraw Steps */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-medium mb-2">
                          1
                        </div>
                        <span className="text-xs text-gray-600 text-center">Withdraw</span>
                      </div>
                      
                      <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                      
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium mb-2">
                          2
                        </div>
                        <span className="text-xs text-gray-600 text-center">PR server signature</span>
                      </div>
                      
                      <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                      
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium mb-2">
                          3
                        </div>
                        <span className="text-xs text-gray-600 text-center">Withdraw result</span>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Receive address
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={wallet?.address}
                            readOnly
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                          />
                          <Wallet className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Connected wallet address
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amount to withdraw
                        </label>
                        <input
                          type="text"
                          placeholder="Enter the amount"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>

                      {/* Session Token Display */}
                      {session && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <div className="flex items-center gap-2 text-xs font-medium text-blue-800 mb-1">
                            <Shield className="w-3 h-3" />
                            Session Token
                          </div>
                          <div className="text-xs font-mono text-blue-600">
                            {formatSessionToken(session.token)}
                          </div>
                          <div className="text-xs text-blue-500 mt-1">
                            Expires in {sessionTimeLeft}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Button */}
                    <button 
                      className={`w-full mt-6 py-3 rounded-md font-medium transition-colors ${
                        session && wallet 
                          ? 'bg-teal-500 hover:bg-teal-600 text-white cursor-pointer'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!session || !wallet}
                    >
                      {session && wallet ? 'Confirm Withdrawal' : 'Requires Authentication'}
                    </button>
                  </div>
                </div>
              )}

              {activeSubTab === "Income details" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Income Details</h3>
                    {session && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Shield className="w-4 h-4" />
                        <span>Authenticated Access</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center py-12 text-gray-500">
                    <p>No income details available</p>
                    <p className="text-xs mt-2">Connect your wallet to view transaction history</p>
                  </div>
                </div>
              )}

              {activeSubTab === "Withdrawal record" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Withdrawal Record</h3>
                    {session && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Shield className="w-4 h-4" />
                        <span>Authenticated Access</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center py-12 text-gray-500">
                    <p>No withdrawal records found</p>
                    <p className="text-xs mt-2">Your withdrawal history will appear here</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Other Tab Content */}
          {activeTab !== "Income" && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {activeTab}
                </h3>
                <p className="text-gray-500 mb-4">
                  This section is under development and will be available soon.
                </p>
                {session && (
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                    <Shield className="w-4 h-4" />
                    <span>Authenticated and ready for access</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};