// Income.tsx
import React, { useState, useEffect } from "react";
import { useWeb3Auth } from "@/contexts/Web3AuthContext";
import { Wallet, Info, RefreshCw, Zap, AlertTriangle, Shield } from "lucide-react";

export const Income = (): JSX.Element => {
  const { 
    wallet, 
    session, 
    getUserBalance, 
    checkLUCASupport,
  } = useWeb3Auth();
  
  const [activeSubTab, setActiveSubTab] = useState("User income");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [lucaBalance, setLucaBalance] = useState<string>("0");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  // Load LUCA balance on component mount and when wallet changes
  useEffect(() => {
    if (wallet && checkLUCASupport()) {
      loadLucaBalance();
    }
  }, [wallet]);

  const loadLucaBalance = async () => {
    setBalanceLoading(true);
    setBalanceError(null);
    
    try {
      const balance = await getUserBalance();
      setLucaBalance(balance);
    } catch (error: any) {
      console.error('Failed to load LUCA balance:', error);
      setBalanceError(error.message || 'Failed to load balance');
      setLucaBalance('0');
    } finally {
      setBalanceLoading(false);
    }
  };

  const formatSessionToken = (token: string) => {
    return `${token.slice(0, 8)}...${token.slice(-4)}`;
  };

  const handleRefreshBalance = () => {
    if (wallet && checkLUCASupport()) {
      loadLucaBalance();
    }
  };

  const isNetworkSupported = checkLUCASupport();

  const incomeSubTabs = [
    "User income",
    "Income details", 
    "Withdrawal record"
  ];

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
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
                  <div className="flex items-center gap-2">
                    {session && (
                      <div className="flex items-center gap-2 bg-teal-600 bg-opacity-50 rounded-lg px-3 py-1">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs font-medium">Secured by Web3</span>
                      </div>
                    )}
                    {isNetworkSupported && (
                      <button
                        onClick={handleRefreshBalance}
                        disabled={balanceLoading}
                        className="p-1 bg-teal-600 bg-opacity-50 rounded hover:bg-opacity-70 transition-all"
                        title="Refresh balance"
                      >
                        <RefreshCw className={`w-3 h-3 ${balanceLoading ? 'animate-spin' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>
                
                <p className="text-sm mb-6 leading-relaxed">
                  The total available revenue can be withdrawn directly to your Ethereum wallet, and the corresponding gas 
                  fee will be deducted from the withdrawal revenue. Every time you withdraw, all proceeds will be withdrawn to 
                  the wallet address, and you must wait for the withdrawn funds to arrive in your account before a new 
                  withdrawal operation can be performed.
                </p>

                <div className="text-4xl font-bold mb-4">
                  {balanceLoading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-8 h-8 animate-spin" />
                      Loading...
                    </div>
                  ) : balanceError ? (
                    <div className="text-2xl text-red-200">
                      Error loading balance
                    </div>
                  ) : (
                    `${lucaBalance} LUCA`
                  )}
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
                      <span className={isNetworkSupported ? 'text-green-200' : 'text-red-200'}>
                        BSC {isNetworkSupported ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Decimals:</span>
                      <span>18</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Balance:</span>
                      <span className="font-mono">{lucaBalance} LUCA</span>
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
                <div className="flex items-center gap-2">
                  {session && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Shield className="w-3 h-3" />
                      <span>Session Active</span>
                    </div>
                  )}
                  {isNetworkSupported && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Zap className="w-3 h-3" />
                      <span>BSC Ready</span>
                    </div>
                  )}
                </div>
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

              {/* Network Status */}
              {!isNetworkSupported && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                  <div className="flex items-center gap-2 text-orange-800 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Please switch to Binance Smart Chain to withdraw LUCA tokens</span>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Receive address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={wallet?.address || ''}
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Amount to withdraw
                    </label>
                    <div className="text-xs text-gray-500">
                      Available: {lucaBalance} LUCA
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Enter the amount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      max={lucaBalance}
                      step="0.0001"
                      className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      disabled={!isNetworkSupported}
                    />
                    <div className="absolute right-3 top-2.5 text-sm text-gray-500 font-medium">
                      LUCA
                    </div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-500">
                      Minimum: 0.0001 LUCA
                    </p>
                    <button
                      onClick={() => setWithdrawAmount(lucaBalance)}
                      className="text-xs text-teal-600 hover:text-teal-800"
                      disabled={!isNetworkSupported}
                    >
                      Max
                    </button>
                  </div>
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
                      Expires in {session ? Math.floor((session.expiresAt - Date.now()) / 1000) : 0}s
                    </div>
                  </div>
                )}

                {/* Balance Error */}
                {balanceError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center gap-2 text-red-800 text-xs">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{balanceError}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Button */}
              <button 
                className={`w-full mt-6 py-3 rounded-md font-medium transition-colors ${
                  session && wallet && isNetworkSupported && parseFloat(lucaBalance) > 0
                    ? 'bg-teal-500 hover:bg-teal-600 text-white cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!session || !wallet || !isNetworkSupported || parseFloat(lucaBalance) === 0}
              >
                {!session || !wallet 
                  ? 'Requires Authentication'
                  : !isNetworkSupported 
                  ? 'Switch to BSC Network'
                  : parseFloat(lucaBalance) === 0
                  ? 'No LUCA Balance'
                  : 'Confirm Withdrawal'}
              </button>

              {/* Gas Fee Notice */}
              {isNetworkSupported && (
                <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    <span>Network fees will be deducted from withdrawal amount</span>
                  </div>
                </div>
              )}
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
            
            {/* Balance Summary */}
            {isNetworkSupported && (
              <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-teal-800">Current LUCA Balance</div>
                    <div className="text-2xl font-bold text-teal-900">
                      {balanceLoading ? 'Loading...' : `${lucaBalance} LUCA`}
                    </div>
                  </div>
                  <button
                    onClick={handleRefreshBalance}
                    disabled={balanceLoading}
                    className="p-2 text-teal-600 hover:text-teal-800 transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${balanceLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            )}

            <div className="text-center py-12 text-gray-500">
              <p>No income details available</p>
              <p className="text-xs mt-2">Transaction history will appear here when available</p>
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

            {/* Network Info */}
            {isNetworkSupported && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800 text-sm">
                  <Zap className="w-4 h-4" />
                  <span>Connected to {wallet?.chainId === '0x38' ? 'BSC Mainnet' : 'BSC Testnet'} for LUCA withdrawals</span>
                </div>
              </div>
            )}

            <div className="text-center py-12 text-gray-500">
              <p>No withdrawal records found</p>
              <p className="text-xs mt-2">Your LUCA withdrawal history will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};