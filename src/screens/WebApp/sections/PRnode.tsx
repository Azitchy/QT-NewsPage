import * as React from "react";
import { useState, useEffect } from "react";
import { 
  Search, 
  Eye, 
  ArrowLeft, 
  Zap, 
  Shield, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Server,
  Globe,
  Hash,
  Award,
  Coins,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Clock,
  User,
  Link,
  Filter,
  X,
  AlertTriangle
} from 'lucide-react';
import { useWeb3Auth } from '../../../contexts/Web3AuthContext';
import { useBlockchain } from '../../../contexts/BlockchainContext';
import { fetchPRNodes, fetchStakeTransactions } from '../../../lib/webApi';

// Storage keys for state persistence
const PRNODE_STATE_KEY = 'prnode_state';
const STAKE_FORM_KEY = 'prnode_stake_form';

interface PRNodeState {
  activeTab: 'nodes' | 'transactions';
  searchKey: string;
  searchType: 'serverAddress' | 'serverNickname' | 'serverIp' | 'hash' | 'userAddress';
  chainFilter: string | null;
  currentPage: number;
  lastUpdated: number;
}

interface StakeForm {
  amount: string;
  method: string;
  lastModified: number;
}

interface PRNode {
  id: string;
  serverAddress: string;
  serverUrl: string;
  serverIp: string;
  serverNickname: string;
  ledgeAmount: string;
  rank: number;
  status?: string;
  totalStakers?: number;
  lastUpdate?: string;
}

interface StakeTransaction {
  hash: string;
  userAddress: string;
  serverAddress: string;
  ledgeAmount: string;
  createTime: string;
  chainId?: string;
  status?: string;
  currency?: string;
}

export const PRNode: React.FC = () => {
  const { wallet, session, isAuthenticated, checkLUCASupport, getUserBalance } = useWeb3Auth();
  const { isInitialized, switchToSupportedChain, getContract, getTokenContract, executeContractMethod, getTokenBalance, approveToken } = useBlockchain();

  // Persistent state management
  const [state, setState] = useState<PRNodeState>(() => {
    try {
      const saved = localStorage.getItem(PRNODE_STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          activeTab: 'nodes',
          searchKey: '',
          searchType: 'serverNickname',
          chainFilter: null,
          currentPage: 1,
          lastUpdated: Date.now(),
          ...parsed
        };
      }
    } catch (error) {
      console.warn('Failed to load PRNode state:', error);
    }
    return {
      activeTab: 'nodes',
      searchKey: '',
      searchType: 'serverNickname',
      chainFilter: null,
      currentPage: 1,
      lastUpdated: Date.now()
    };
  });

  const [stakeForm, setStakeForm] = useState<StakeForm>(() => {
    try {
      const saved = localStorage.getItem(STAKE_FORM_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only restore if modified recently (within 1 hour)
        if (Date.now() - parsed.lastModified < 3600000) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load stake form:', error);
    }
    return { amount: '', method: 'LUCA', lastModified: Date.now() };
  });

  // Component state
  const [nodes, setNodes] = useState<PRNode[]>([]);
  const [nodesLoading, setNodesLoading] = useState(false);
  const [nodesError, setNodesError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<StakeTransaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedNode, setSelectedNode] = useState<PRNode | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<StakeTransaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [userBalance, setUserBalance] = useState('0');

  const itemsPerPage = 10;

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(PRNODE_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save PRNode state:', error);
    }
  }, [state]);

  useEffect(() => {
    try {
      localStorage.setItem(STAKE_FORM_KEY, JSON.stringify(stakeForm));
    } catch (error) {
      console.warn('Failed to save stake form:', error);
    }
  }, [stakeForm]);

  // State updaters
  const updateState = (updates: Partial<PRNodeState>) => {
    setState(prev => ({
      ...prev,
      ...updates,
      lastUpdated: Date.now()
    }));
  };

  const updateStakeForm = (updates: Partial<StakeForm>) => {
    setStakeForm(prev => ({
      ...prev,
      ...updates,
      lastModified: Date.now()
    }));
  };

  // Load data based on active tab
  useEffect(() => {
    if (state.activeTab === 'nodes') {
      loadNodes();
    } else {
      loadTransactions();
    }
  }, [state.activeTab, state.currentPage, state.searchKey, state.searchType, state.chainFilter]);

  // Load user balance when wallet connects
  useEffect(() => {
    if (wallet && checkLUCASupport() && isAuthenticated) {
      loadUserBalance();
    }
  }, [wallet, isAuthenticated]);

  const loadNodes = async () => {
    setNodesLoading(true);
    setNodesError(null);
    
    try {
      const response = await fetchPRNodes(
        state.currentPage,
        itemsPerPage,
        state.searchKey || undefined,
        state.searchKey ? state.searchType : undefined
      );

      if (response.success) {
        setNodes(response.data || []);
        setTotalCount(response.total || 0);
      } else {
        setNodesError(response.message || 'Failed to load PR nodes');
      }
    } catch (err: any) {
      console.error('Error loading PR nodes:', err);
      setNodesError('Failed to load PR nodes. Please try again.');
    } finally {
      setNodesLoading(false);
    }
  };

  const loadTransactions = async () => {
    setTransactionsLoading(true);
    setTransactionsError(null);
    
    try {
      const response = await fetchStakeTransactions(
        state.currentPage,
        itemsPerPage,
        state.chainFilter,
        state.searchKey || undefined,
        state.searchKey ? state.searchType : undefined
      );

      if (response.success) {
        setTransactions(response.data || []);
        setTotalCount(response.total || 0);
      } else {
        setTransactionsError(response.message || 'Failed to load stake transactions');
      }
    } catch (err: any) {
      console.error('Error loading stake transactions:', err);
      setTransactionsError('Failed to load stake transactions. Please try again.');
    } finally {
      setTransactionsLoading(false);
    }
  };

  const loadUserBalance = async () => {
    try {
      const balance = await getUserBalance();
      setUserBalance(balance);
    } catch (error: any) {
      console.error('Failed to load user balance:', error);
    }
  };

  const handleStake = async () => {
    if (!isAuthenticated || !selectedNode || !wallet) {
      alert('Please connect your wallet first');
      return;
    }

    if (!checkLUCASupport()) {
      const switched = await switchToSupportedChain();
      if (!switched) {
        alert('Please switch to Binance Smart Chain to stake LUCA tokens');
        return;
      }
    }

    if (!stakeForm.amount || parseFloat(stakeForm.amount) <= 0 || parseFloat(stakeForm.amount) < 0.0001) {
      alert('Please enter a valid stake amount (minimum 0.0001 LUCA)');
      return;
    }

    if (parseFloat(stakeForm.amount) > parseFloat(userBalance)) {
      alert('Insufficient LUCA balance');
      return;
    }

    setIsStaking(true);

    try {
      const userManager = getContract('UserManager');
      const lucaToken = getTokenContract('LUCA');
      
      if (!userManager || !lucaToken) {
        throw new Error('Failed to get contracts');
      }

      const userManagerAddress = userManager.options.address;
      const amountInWei = (parseFloat(stakeForm.amount) * Math.pow(10, 18)).toString();

      const allowance = await lucaToken.methods.allowance(wallet.address, userManagerAddress).call();
      
      if (parseFloat(allowance) < parseFloat(amountInWei)) {
        console.log('Approving LUCA tokens...');
        await approveToken(lucaToken.options.address, userManagerAddress, stakeForm.amount);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      console.log('Staking on PR node...');
      const result = await executeContractMethod(
        userManager,
        'registerUser',
        [selectedNode.serverAddress]
      );

      console.log('Staking transaction result:', result);

      alert(`Successfully staked ${stakeForm.amount} LUCA on ${selectedNode.serverNickname}!`);
      setShowStakeModal(false);
      updateStakeForm({ amount: '', method: 'LUCA', lastModified: Date.now() });
      
      loadUserBalance();
      if (state.activeTab === 'transactions') {
        loadTransactions();
      }

    } catch (error: any) {
      console.error('Staking failed:', error);
      let errorMessage = 'Staking failed. Please try again.';
      
      if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction cancelled by user.';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for gas fees.';
      }
      
      alert(errorMessage);
    } finally {
      setIsStaking(false);
    }
  };

  const handleSearch = () => {
    updateState({ currentPage: 1 });
    if (state.activeTab === 'nodes') {
      loadNodes();
    } else {
      loadTransactions();
    }
  };

  const handleClearSearch = () => {
    updateState({ searchKey: '', currentPage: 1 });
    if (state.activeTab === 'nodes') {
      loadNodes();
    } else {
      loadTransactions();
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  };

  const isNetworkSupported = checkLUCASupport();
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const isLoading = state.activeTab === 'nodes' ? nodesLoading : transactionsLoading;
  const error = state.activeTab === 'nodes' ? nodesError : transactionsError;

  const chainOptions = [
    { value: null, label: 'All Chains' },
    { value: '0x38', label: 'BSC Mainnet' },
    { value: '0x61', label: 'BSC Testnet' },
    { value: '0x1', label: 'Ethereum' }
  ];

  return (
    <div className="flex-1 bg-gray-50 dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-foreground">PR Node</h1>
            <div className="flex items-center gap-3">
              {session && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-800 dark:text-green-300">Authenticated</span>
                </div>
              )}
              {isAuthenticated && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <Coins className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium text-blue-800 dark:text-blue-300">{userBalance} LUCA</span>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-border mb-4 sm:mb-6">
            {/* Desktop Tabs */}
            <div className="hidden sm:flex">
              <button
                onClick={() => updateState({ activeTab: 'nodes', currentPage: 1 })}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  state.activeTab === 'nodes'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 dark:text-card-foreground hover:text-gray-700 dark:hover:text-foreground'
                }`}
              >
                <Server className="w-4 h-4" />
                PR Nodes
              </button>
              <button
                onClick={() => updateState({ activeTab: 'transactions', currentPage: 1 })}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  state.activeTab === 'transactions'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 dark:text-card-foreground hover:text-gray-700 dark:hover:text-foreground'
                }`}
              >
                <Hash className="w-4 h-4" />
                Stake Transactions
              </button>
            </div>

            {/* Mobile Tab Selector */}
            <div className="sm:hidden w-full">
              <select
                value={state.activeTab}
                onChange={(e) => updateState({ activeTab: e.target.value as 'nodes' | 'transactions', currentPage: 1 })}
                className="w-full px-3 py-2 bg-white dark:bg-background border border-gray-300 dark:border-border rounded-lg text-gray-900 dark:text-foreground focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="nodes">🖥️ PR Nodes</option>
                <option value="transactions"># Stake Transactions</option>
              </select>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-3 mb-4">
            <select
              value={state.searchType}
              onChange={(e) => updateState({ searchType: e.target.value as any })}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-background text-gray-900 dark:text-foreground"
            >
              {state.activeTab === 'nodes' ? (
                <>
                  <option value="serverNickname">Server Nickname</option>
                  <option value="serverAddress">Server Address</option>
                  <option value="serverIp">Server IP</option>
                </>
              ) : (
                <>
                  <option value="hash">Transaction Hash</option>
                  <option value="userAddress">User Address</option>
                  <option value="serverAddress">PR Node Address</option>
                </>
              )}
            </select>

            {state.activeTab === 'transactions' && (
              <select
                value={state.chainFilter || ''}
                onChange={(e) => updateState({ chainFilter: e.target.value || null })}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-background text-gray-900 dark:text-foreground"
              >
                {chainOptions.map((option) => (
                  <option key={option.value || 'all'} value={option.value || ''}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search by ${state.searchType.replace('server', '').toLowerCase()}...`}
                value={state.searchKey}
                onChange={(e) => updateState({ searchKey: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-background text-gray-900 dark:text-foreground"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-4 sm:px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span className="hidden sm:inline">Search</span>
              </button>
              {state.searchKey && (
                <button
                  onClick={handleClearSearch}
                  className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-border rounded-lg hover:bg-gray-50 dark:hover:bg-card transition-colors text-gray-900 dark:text-foreground"
                >
                  <span className="sm:hidden">✕</span>
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-card rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-teal-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-card-foreground">Loading {state.activeTab === 'nodes' ? 'PR nodes' : 'stake transactions'}...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-foreground mb-2">Error Loading Data</h3>
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => state.activeTab === 'nodes' ? loadNodes() : loadTransactions()}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : state.activeTab === 'nodes' ? (
            // PR Nodes Content
            nodes.length === 0 ? (
              <div className="p-8 text-center">
                <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-foreground mb-2">No PR Nodes Found</h3>
                <p className="text-gray-600 dark:text-card-foreground">
                  {state.searchKey ? 'Try adjusting your search criteria' : 'No PR nodes available at the moment'}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-background/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                          PR Node
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                          Server Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                          Server IP
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                          Server Nickname
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                          Stake Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-border">
                      {nodes.map((node, index) => (
                        <tr key={node.id || index} className="hover:bg-gray-50 dark:hover:bg-background/50">
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Hash className="w-4 h-4 text-gray-400" />
                              <span className="font-mono text-gray-900 dark:text-foreground">
                                {formatAddress(node.serverAddress)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-900 dark:text-foreground">{node.serverUrl}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-foreground">
                            {node.serverIp}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Server className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-900 dark:text-foreground">{node.serverNickname}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Coins className="w-4 h-4 text-teal-500" />
                              <span className="font-medium text-gray-900 dark:text-foreground">{node.ledgeAmount} LUCA</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm space-x-2">
                            <button
                              onClick={() => {
                                setSelectedNode(node);
                                setShowStakeModal(true);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-teal-500 text-white text-xs rounded hover:bg-teal-600 transition-colors"
                            >
                              <Zap className="w-3 h-3" />
                              Stake
                            </button>
                            <button
                              onClick={() => {
                                setSelectedNode(node);
                                setShowDetailModal(true);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 dark:border-border text-gray-700 dark:text-foreground text-xs rounded hover:bg-gray-50 dark:hover:bg-background/50 transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards for Nodes */}
                <div className="md:hidden divide-y divide-gray-200 dark:divide-border">
                  {nodes.map((node, index) => (
                    <div key={node.id || index} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-foreground">{node.serverNickname}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-teal-500" />
                          <span className="text-sm text-gray-600 dark:text-card-foreground">#{node.rank}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-card-foreground">Address:</span>
                          <div className="font-mono text-xs text-gray-900 dark:text-foreground">{formatAddress(node.serverAddress)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-card-foreground">IP:</span>
                          <div className="text-gray-900 dark:text-foreground">{node.serverIp}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-teal-500" />
                          <span className="font-medium text-gray-900 dark:text-foreground">{node.ledgeAmount} LUCA</span>
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() => {
                              setSelectedNode(node);
                              setShowStakeModal(true);
                            }}
                            className="px-3 py-1 bg-teal-500 text-white text-xs rounded hover:bg-teal-600 transition-colors"
                          >
                            Stake
                          </button>
                          <button
                            onClick={() => {
                              setSelectedNode(node);
                              setShowDetailModal(true);
                            }}
                            className="px-3 py-1 border border-gray-300 dark:border-border text-gray-700 dark:text-foreground text-xs rounded hover:bg-gray-50 dark:hover:bg-background/50 transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : (
            // Stake Transactions Content
            transactions.length === 0 ? (
              <div className="p-8 text-center">
                <Hash className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-foreground mb-2">No Transactions Found</h3>
                <p className="text-gray-600 dark:text-card-foreground">
                  {state.searchKey ? 'Try adjusting your search criteria' : 'No stake transactions available'}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table for Transactions */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-background/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                          Hash
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                          Initiator
                        </th>
                        <th className="px-4 py-3"></th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                          PR Node
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                          Stake Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-border">
                      {transactions.map((transaction, index) => (
                        <tr key={transaction.hash || index} className="hover:bg-gray-50 dark:hover:bg-background/50">
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Hash className="w-4 h-4 text-gray-400" />
                              <span className="font-mono text-gray-900 dark:text-foreground">
                                {formatAddress(transaction.hash)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="font-mono text-gray-900 dark:text-foreground">
                                {formatAddress(transaction.userAddress)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Server className="w-4 h-4 text-gray-400" />
                              <span className="font-mono text-gray-900 dark:text-foreground">
                                {formatAddress(transaction.serverAddress)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Coins className="w-4 h-4 text-teal-500" />
                              <span className="font-medium text-gray-900 dark:text-foreground">
                                {transaction.ledgeAmount} {transaction.currency || 'LUCA'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-900 dark:text-foreground">
                                {formatTime(transaction.createTime)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => {
                                setSelectedTransaction(transaction);
                                setShowTransactionModal(true);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 dark:border-border text-gray-700 dark:text-foreground text-xs rounded hover:bg-gray-50 dark:hover:bg-background/50 transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              More
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards for Transactions */}
                <div className="md:hidden divide-y divide-gray-200 dark:divide-border">
                  {transactions.map((transaction, index) => (
                    <div key={transaction.hash || index} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <span className="font-mono text-sm text-gray-900 dark:text-foreground">{formatAddress(transaction.hash)}</span>
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-foreground">
                          {transaction.ledgeAmount} {transaction.currency || 'LUCA'}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 dark:text-card-foreground">Initiator:</span>
                          <span className="font-mono text-gray-900 dark:text-foreground">{formatAddress(transaction.userAddress)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 dark:text-card-foreground">Receiver:</span>
                          <span className="font-mono text-gray-900 dark:text-foreground">{formatAddress(transaction.serverAddress)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 dark:text-card-foreground">Time:</span>
                          <span className="text-gray-900 dark:text-foreground">{formatTime(transaction.createTime)}</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowTransactionModal(true);
                          }}
                          className="w-full px-3 py-1 border border-gray-300 dark:border-border text-gray-700 dark:text-foreground text-xs rounded hover:bg-gray-50 dark:hover:bg-background/50 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 bg-gray-50 dark:bg-background/50 border-t border-gray-200 dark:border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-gray-700 dark:text-card-foreground text-center sm:text-left">
                Showing {((state.currentPage - 1) * itemsPerPage) + 1} to {Math.min(state.currentPage * itemsPerPage, totalCount)} of {totalCount} results
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => updateState({ currentPage: Math.max(state.currentPage - 1, 1) })}
                  disabled={state.currentPage === 1}
                  className="p-2 border border-gray-300 dark:border-border rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-background transition-colors disabled:cursor-not-allowed text-gray-900 dark:text-foreground"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded text-sm font-medium">
                  {state.currentPage}
                </span>
                <button
                  onClick={() => updateState({ currentPage: Math.min(state.currentPage + 1, totalPages) })}
                  disabled={state.currentPage === totalPages}
                  className="p-2 border border-gray-300 dark:border-border rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-background transition-colors disabled:cursor-not-allowed text-gray-900 dark:text-foreground"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stake Modal */}
        {showStakeModal && selectedNode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-card rounded-lg max-w-md w-full">
              <div className="p-6 border-b border-gray-200 dark:border-border flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-foreground">PR Node Stake</h3>
                <button
                  onClick={() => setShowStakeModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-1">Stake Node</label>
                  <div className="text-sm text-gray-900 dark:text-foreground font-mono bg-gray-50 dark:bg-background p-2 rounded">
                    {formatAddress(selectedNode.serverAddress)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-1">Rankings</label>
                  <div className="text-sm text-gray-900 dark:text-foreground">{selectedNode.rank}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-1">Stake Method</label>
                  <select
                    value={stakeForm.method}
                    onChange={(e) => updateStakeForm({ method: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-background text-gray-900 dark:text-foreground"
                  >
                    <option value="LUCA">LUCA</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-foreground">Stake Amount</label>
                    <div className="text-xs text-gray-500 dark:text-card-foreground">Balance: {userBalance} LUCA</div>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={stakeForm.amount}
                      onChange={(e) => updateStakeForm({ amount: e.target.value })}
                      placeholder="1"
                      min="0.0001"
                      step="0.0001"
                      max={userBalance}
                      className="w-full px-3 py-2 pr-16 border border-gray-300 dark:border-border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-background text-gray-900 dark:text-foreground"
                    />
                    <div className="absolute right-3 top-2.5 text-sm text-gray-500 dark:text-card-foreground font-medium">
                      LUCA
                    </div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      Tips: The pledge deposit amount needs to be greater than 0.0001 LUCA to get rewards.
                    </p>
                    <button
                      onClick={() => updateStakeForm({ amount: userBalance })}
                      className="text-xs text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                    >
                      Max
                    </button>
                  </div>
                </div>

                {!isNetworkSupported && (
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-md">
                    <div className="flex items-center gap-2 text-orange-800 dark:text-orange-300 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Please switch to Binance Smart Chain to stake LUCA tokens</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-border flex gap-3">
                <button
                  onClick={() => {
                    setShowStakeModal(false);
                    updateStakeForm({ amount: '', method: 'LUCA', lastModified: Date.now() });
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-foreground bg-gray-100 dark:bg-background rounded-md hover:bg-gray-200 dark:hover:bg-background/50 transition-colors"
                  disabled={isStaking}
                >
                  Cancel
                </button>
                <button
                  onClick={handleStake}
                  disabled={!isAuthenticated || !isNetworkSupported || !stakeForm.amount || parseFloat(stakeForm.amount) <= 0 || isStaking}
                  className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  {isStaking ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      Staking...
                    </>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Node Detail Modal */}
        {showDetailModal && selectedNode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-border flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-foreground">PR Node Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-card-foreground mb-1">PR Node</label>
                    <div className="text-sm font-mono bg-gray-50 dark:bg-background p-2 rounded break-all text-gray-900 dark:text-foreground">
                      {selectedNode.serverAddress}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-card-foreground mb-1">Server Name</label>
                    <div className="text-sm text-gray-900 dark:text-foreground">{selectedNode.serverUrl}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-card-foreground mb-1">Server IP</label>
                    <div className="text-sm text-gray-900 dark:text-foreground">{selectedNode.serverIp}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-card-foreground mb-1">Server Nickname</label>
                    <div className="text-sm text-gray-900 dark:text-foreground">{selectedNode.serverNickname}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-card-foreground mb-1">Node Ranking</label>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-teal-500" />
                      <span className="text-sm text-gray-900 dark:text-foreground">#{selectedNode.rank}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-card-foreground mb-1">Stake Amount</label>
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-teal-500" />
                      <span className="text-sm text-gray-900 dark:text-foreground">{selectedNode.ledgeAmount} LUCA</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-border">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowStakeModal(true);
                    }}
                    disabled={!isAuthenticated || !isNetworkSupported}
                    className="w-full md:w-auto px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" />
                      Stake on this Node
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Detail Modal */}
        {showTransactionModal && selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-border flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-foreground">Stake Transaction Details</h3>
                <button
                  onClick={() => setShowTransactionModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-card-foreground mb-1">Transaction Hash</label>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-mono bg-gray-50 dark:bg-background p-2 rounded break-all flex-1 text-gray-900 dark:text-foreground">
                        {selectedTransaction.hash}
                      </div>
                      <a
                        href={`https://bscscan.com/tx/${selectedTransaction.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-2 text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 text-sm border border-gray-300 dark:border-border rounded"
                      >
                        <ExternalLink className="w-3 h-3" />
                        BSCScan
                      </a>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-card-foreground mb-1">Initiator</label>
                      <div className="text-sm font-mono bg-gray-50 dark:bg-background p-2 rounded break-all text-gray-900 dark:text-foreground">
                        {selectedTransaction.userAddress}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-card-foreground mb-1">PR Node</label>
                      <div className="text-sm font-mono bg-gray-50 dark:bg-background p-2 rounded break-all text-gray-900 dark:text-foreground">
                        {selectedTransaction.serverAddress}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-card-foreground mb-1">Stake Amount</label>
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-teal-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-foreground">
                          {selectedTransaction.ledgeAmount} {selectedTransaction.currency || 'LUCA'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-card-foreground mb-1">Transaction Time</label>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-foreground">{formatTime(selectedTransaction.createTime)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};