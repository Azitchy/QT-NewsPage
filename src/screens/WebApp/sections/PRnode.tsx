import React, { useState, useEffect } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { useWeb3Auth } from '../../../contexts/Web3AuthContext';
import { useBlockchain } from '../../../contexts/BlockchainContext';
import { fetchPRNodes } from '../../../lib/webApi';

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

interface StakeModalData {
  nodeId: string;
  serverAddress: string;
  serverNickname: string;
  currentStake: string;
  rank: number;
}

export const PRNode: React.FC = () => {
  const { wallet, session, isAuthenticated, checkLUCASupport } = useWeb3Auth();
  const { isInitialized, switchToSupportedChain } = useBlockchain();

  // State management
  const [nodes, setNodes] = useState<PRNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState('');
  const [searchType, setSearchType] = useState<'serverAddress' | 'serverNickname' | 'serverIp'>('serverNickname');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [selectedNode, setSelectedNode] = useState<PRNode | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakeMethod, setStakeMethod] = useState('LUCA');

  // Load nodes on component mount and when dependencies change
  useEffect(() => {
    loadNodes();
  }, [currentPage, searchKey, searchType]);

  const loadNodes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchPRNodes(
        currentPage,
        itemsPerPage,
        searchKey || undefined,
        searchKey ? searchType : undefined
      );

      if (response.success) {
        setNodes(response.data || []);
        setTotalCount(response.total || 0);
      } else {
        setError(response.message || 'Failed to load PR nodes');
      }
    } catch (err: any) {
      console.error('Error loading PR nodes:', err);
      setError('Failed to load PR nodes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadNodes();
  };

  const handleClearSearch = () => {
    setSearchKey('');
    setCurrentPage(1);
    loadNodes();
  };

  const handleStake = async () => {
    if (!isAuthenticated || !selectedNode) {
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

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      alert('Please enter a valid stake amount');
      return;
    }

    try {
      // This would integrate with your staking contract
      alert(`Staking ${stakeAmount} ${stakeMethod} on ${selectedNode.serverNickname}. This feature will be implemented with smart contract integration.`);
      setShowStakeModal(false);
      setStakeAmount('');
    } catch (error: any) {
      console.error('Staking failed:', error);
      alert(`Staking failed: ${error.message}`);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isNetworkSupported = checkLUCASupport();
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">PR Node</h1>
            <div className="flex items-center gap-3">
              {session && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-800">Authenticated</span>
                </div>
              )}
              {!isNetworkSupported && wallet && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-medium text-orange-800">Switch to BSC</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-2">PR Node Information</h3>
                <p className="text-sm text-blue-700">
                  PR nodes are selected to jointly execute PageRank algorithm and calculate the PR value of all peers in the ATM network. 
                  Users and server operators who participate in the PageRank computing can stake rewards.
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3 mb-4">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="serverNickname">Server Nickname</option>
              <option value="serverAddress">Server Address</option>
              <option value="serverIp">Server IP</option>
            </select>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search by ${searchType.replace('server', '').toLowerCase()}...`}
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
            {searchKey && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* PR Nodes Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-teal-500 mx-auto mb-4" />
              <p className="text-gray-600">Loading PR nodes...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Nodes</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadNodes}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : nodes.length === 0 ? (
            <div className="p-8 text-center">
              <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No PR Nodes Found</h3>
              <p className="text-gray-600">
                {searchKey ? 'Try adjusting your search criteria' : 'No PR nodes available at the moment'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PR Node
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Server Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Server IP
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Server Nickname
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stake Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {nodes.map((node, index) => (
                      <tr key={node.id || index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-gray-400" />
                            <span className="font-mono text-gray-900">
                              {formatAddress(node.serverAddress)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{node.serverUrl}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {node.serverIp}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Server className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{node.serverNickname}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-teal-500" />
                            <span className="font-medium text-gray-900">{node.ledgeAmount} LUCA</span>
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
                            className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            View details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {nodes.map((node, index) => (
                  <div key={node.id || index} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{node.serverNickname}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-teal-500" />
                        <span className="text-sm text-gray-600">#{node.rank}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Address:</span>
                        <div className="font-mono text-xs">{formatAddress(node.serverAddress)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">IP:</span>
                        <div>{node.serverIp}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-teal-500" />
                        <span className="font-medium">{node.ledgeAmount} LUCA</span>
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
                          className="px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded text-sm font-medium">
                      {currentPage}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Stake Modal */}
        {showStakeModal && selectedNode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">PR Node Stake</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stake Node</label>
                  <div className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                    {formatAddress(selectedNode.serverAddress)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rankings</label>
                  <div className="text-sm text-gray-900">{selectedNode.rank}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stake Method</label>
                  <select
                    value={stakeMethod}
                    onChange={(e) => setStakeMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="LUCA">LUCA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stake Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="1"
                      min="0.0001"
                      step="0.0001"
                      className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <div className="absolute right-3 top-2.5 text-sm text-gray-500 font-medium">
                      LUCA
                    </div>
                  </div>
                  <p className="text-xs text-orange-600 mt-1">
                    Tips: The pledge deposit amount needs to be greater than 0.0001 LUCA to get rewards.
                  </p>
                </div>

                {!isNetworkSupported && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                    <div className="flex items-center gap-2 text-orange-800 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Please switch to Binance Smart Chain to stake LUCA tokens</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => {
                    setShowStakeModal(false);
                    setStakeAmount('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStake}
                  disabled={!isAuthenticated || !isNetworkSupported || !stakeAmount || parseFloat(stakeAmount) <= 0}
                  className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:opacity-50 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedNode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">PR Node Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">PR Node</label>
                    <div className="text-sm font-mono bg-gray-50 p-2 rounded break-all">
                      {selectedNode.serverAddress}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Server Name</label>
                    <div className="text-sm text-gray-900">{selectedNode.serverUrl}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Server IP</label>
                    <div className="text-sm text-gray-900">{selectedNode.serverIp}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Server Nickname</label>
                    <div className="text-sm text-gray-900">{selectedNode.serverNickname}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Node Ranking</label>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-teal-500" />
                      <span className="text-sm text-gray-900">#{selectedNode.rank}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Stake Amount</label>
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-teal-500" />
                      <span className="text-sm text-gray-900">{selectedNode.ledgeAmount} LUCA</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
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
      </div>
    </div>
  );
};