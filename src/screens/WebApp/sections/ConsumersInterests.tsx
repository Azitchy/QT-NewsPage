import React, { useState, useEffect } from "react";
import { useWeb3Auth } from "@/contexts/Web3AuthContext";
import { Shield, Zap, TrendingUp, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchUserTreatyList, fetchCoinPriceTrend } from "@/lib/webApi";

// Storage keys for state persistence
const CONSUMERS_STATE_KEY = 'consumers_interests_state';

interface ConsumersState {
  activeTab: "agt" | "pr";
  chartTimeframe: '7d' | '30d' | '90d';
  lastUpdated: number;
}

interface Transaction {
  time: string;
  type: string;
  amount: string;
  status: string;
}

interface PriceData {
  date: string;
  value: number;
  timestamp: number;
}

export const ConsumersInterests = (): JSX.Element => {
  const { session, checkLUCASupport, wallet } = useWeb3Auth();

  // Persistent state management
  const [state, setState] = useState<ConsumersState>(() => {
    try {
      const saved = localStorage.getItem(CONSUMERS_STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          activeTab: "agt",
          chartTimeframe: '30d',
          lastUpdated: Date.now(),
          ...parsed
        };
      }
    } catch (error) {
      console.warn('Failed to load consumers state:', error);
    }
    return {
      activeTab: "agt",
      chartTimeframe: '30d',
      lastUpdated: Date.now()
    };
  });

  const [agtBalance, setAgtBalance] = useState<string>("0");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(CONSUMERS_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save consumers state:', error);
    }
  }, [state]);

  // State updater
  const updateState = (updates: Partial<ConsumersState>) => {
    setState(prev => ({
      ...prev,
      ...updates,
      lastUpdated: Date.now()
    }));
  };

  const isNetworkSupported = checkLUCASupport();

  // Fetch AGT data (transactions and balance)
  const fetchAGTData = async () => {
    if (!wallet?.address) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchUserTreatyList({
        pageIndex: 1,
        pageSize: 50,
        type: 1,
        ledgeAddress: wallet.address,
        ...(wallet.chainId && { chainId: wallet.chainId })
      });

      if (result.success && result.data) {
        const transformedTransactions = result.data.map((item: any) => ({
          time: item.createdAt || item.timestamp || new Date().toISOString(),
          type: item.type || item.treatyType || 'AGT Transaction',
          amount: `${item.amount || item.value || '0'} AGT`,
          status: item.status || 'Completed'
        }));
        
        setTransactions(transformedTransactions);
        
        const balance = result.data.reduce((acc: number, item: any) => {
          return acc + parseFloat(item.amount || item.value || '0');
        }, 0).toString();
        
        setAgtBalance(balance);
      } else {
        setAgtBalance("0");
        setTransactions([]);
      }
      
    } catch (err) {
      console.error('Error fetching AGT data:', err);
      setAgtBalance("0");
      setTransactions([]);
      if (err instanceof Error && !err.message.includes('404')) {
        setError('Failed to load AGT records. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch PR value data
  const fetchPRData = async () => {
    if (!wallet?.address) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const priceData = await fetchCoinPriceTrend('AGT', state.chartTimeframe);
      
      if (priceData && Array.isArray(priceData)) {
        const chartData = priceData.map((item: any) => ({
          date: new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
          value: parseFloat(item.price || item.value || 0),
          timestamp: item.timestamp
        }));
        
        setPriceData(chartData);
      } else {
        // Generate sample data structure
        const sampleData: PriceData[] = [];
        const days = state.chartTimeframe === '7d' ? 7 : state.chartTimeframe === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        for (let i = 0; i < days; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          sampleData.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
            value: 0,
            timestamp: date.getTime()
          });
        }
        setPriceData(sampleData);
      }
      
    } catch (err) {
      console.error('Error fetching PR data:', err);
      // Generate empty chart structure
      const sampleData: PriceData[] = [];
      const days = state.chartTimeframe === '7d' ? 7 : state.chartTimeframe === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        sampleData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
          value: 0,
          timestamp: date.getTime()
        });
      }
      setPriceData(sampleData);
      
      if (err instanceof Error && !err.message.includes('404')) {
        setError('Failed to load PR value records. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load data based on active tab
  useEffect(() => {
    if (session && wallet) {
      if (state.activeTab === "agt") {
        fetchAGTData();
      } else {
        fetchPRData();
      }
    }
  }, [state.activeTab, state.chartTimeframe, session, wallet]);

  const handleRefresh = () => {
    if (state.activeTab === "agt") {
      fetchAGTData();
    } else {
      fetchPRData();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'failed':
      case 'error':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30';
      default:
        return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-white dark:bg-card rounded-lg shadow-sm">
          {/* Header with status indicators */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-foreground">
                  Consumer Interests
                </h3>
                {session && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                    <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-800 dark:text-green-300">
                      Authenticated
                    </span>
                  </div>
                )}
                {isNetworkSupported && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-blue-800 dark:text-blue-300">
                      LUCA Network
                    </span>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-card-foreground hover:text-gray-900 dark:hover:text-foreground hover:bg-gray-50 dark:hover:bg-background/50 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-border">
            {/* Desktop Navigation */}
            <nav className="hidden sm:flex px-4 sm:px-6 space-x-8">
              <button
                onClick={() => updateState({ activeTab: "pr" })}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  state.activeTab === "pr"
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 dark:text-card-foreground hover:text-gray-700 dark:hover:text-foreground hover:border-gray-300 dark:hover:border-border'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                PR value record
              </button>
              <button
                onClick={() => updateState({ activeTab: "agt" })}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  state.activeTab === "agt"
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 dark:text-card-foreground hover:text-gray-700 dark:hover:text-foreground hover:border-gray-300 dark:hover:border-border'
                }`}
              >
                <Clock className="w-4 h-4" />
                AGT record
              </button>
            </nav>

            {/* Mobile Navigation */}
            <div className="sm:hidden p-4">
              <select
                value={state.activeTab}
                onChange={(e) => updateState({ activeTab: e.target.value as "agt" | "pr" })}
                className="w-full px-3 py-2 bg-white dark:bg-background border border-gray-300 dark:border-border rounded-lg text-gray-900 dark:text-foreground focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="pr">📊 PR value record</option>
                <option value="agt">⏰ AGT record</option>
              </select>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mx-4 sm:mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {state.activeTab === "agt" ? (
              <div className="space-y-6">
                {/* AGT Balance */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-base sm:text-lg">
                  <span className="text-gray-600 dark:text-card-foreground">Current AGT balance:</span>
                  <span className="font-semibold text-gray-900 dark:text-foreground">{agtBalance}AGT</span>
                </div>

                {/* Transaction Table */}
                <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    {/* Desktop Table */}
                    <div className="hidden md:block">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-background/50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                              Transaction time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                              Transaction type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                              Transaction amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                              Transaction status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-card divide-y divide-gray-200 dark:divide-border">
                          {loading ? (
                            <tr>
                              <td colSpan={4} className="px-6 py-12 text-center">
                                <div className="flex items-center justify-center">
                                  <RefreshCw className="w-5 h-5 animate-spin text-gray-400 mr-2" />
                                  <span className="text-gray-500 dark:text-card-foreground">Loading transactions...</span>
                                </div>
                              </td>
                            </tr>
                          ) : transactions.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-card-foreground">
                                No data
                              </td>
                            </tr>
                          ) : (
                            transactions.map((transaction, index) => (
                              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-background/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-foreground">
                                  {formatDate(transaction.time)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-foreground">
                                  {transaction.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-foreground">
                                  {transaction.amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                                    {transaction.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-gray-200 dark:divide-border">
                      {loading ? (
                        <div className="p-6 text-center">
                          <div className="flex items-center justify-center">
                            <RefreshCw className="w-5 h-5 animate-spin text-gray-400 mr-2" />
                            <span className="text-gray-500 dark:text-card-foreground">Loading transactions...</span>
                          </div>
                        </div>
                      ) : transactions.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 dark:text-card-foreground">
                          No data
                        </div>
                      ) : (
                        transactions.map((transaction, index) => (
                          <div key={index} className="p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900 dark:text-foreground">{transaction.amount}</span>
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                                {transaction.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-card-foreground">
                              <div>Type: {transaction.type}</div>
                              <div>Time: {formatDate(transaction.time)}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Chart Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-foreground">PR Value Trends</h4>
                  <div className="flex gap-2">
                    {(['7d', '30d', '90d'] as const).map((timeframe) => (
                      <button
                        key={timeframe}
                        onClick={() => updateState({ chartTimeframe: timeframe })}
                        className={`px-3 py-1 text-sm rounded transition-colors ${
                          state.chartTimeframe === timeframe
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-200 dark:bg-background text-gray-700 dark:text-card-foreground hover:bg-gray-300 dark:hover:bg-background/50'
                        }`}
                      >
                        {timeframe}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PR Value Chart */}
                <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg p-4 sm:p-6">
                  {loading ? (
                    <div className="h-80 flex items-center justify-center">
                      <div className="flex items-center">
                        <RefreshCw className="w-5 h-5 animate-spin text-gray-400 mr-2" />
                        <span className="text-gray-500 dark:text-card-foreground">Loading chart data...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            domain={[0, 1]}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #E5E7EB',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#0DAEB9" 
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: '#0DAEB9' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* Chart Info */}
                <div className="text-sm text-gray-600 dark:text-card-foreground bg-gray-50 dark:bg-background/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>PR value trends over the last {state.chartTimeframe}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};