import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Copy,
  Eye,
  UserCheck,
  UserX,
  Unlink,
  RefreshCw
} from 'lucide-react';
import { useWeb3Auth } from '../../../contexts/Web3AuthContext';
import { useBlockchain } from '../../../contexts/BlockchainContext';
import {
  fetchUserConsensusConnections,
  createConsensusConnection,
  getConsensusConnectionDetail,
  updateConsensusConnectionStatus,
  searchConsensusConnectionByAddress,
  type ConsensusConnectionItem,
  type CreateConnectionRequest,
  type ConnectionDetailResponse
} from '../../../lib/webApi';

interface CreateConnectionFormData {
  connectionAddress: string;
  connectionToken: string;
  totalLockedAmount: string;
  lockedPositionProperties: string;
  lockupTime: string;
  counterpartyLockedAmount: string;
  connectionType: string;
}

export const ConsensusConnection: React.FC = () => {
  const { wallet, isAuthenticated } = useWeb3Auth();
  const { isInitialized } = useBlockchain();

  // State management
  const [activeTab, setActiveTab] = useState<string>('Connected');
  const [connections, setConnections] = useState<ConsensusConnectionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [searchResults, setSearchResults] = useState<ConsensusConnectionItem[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({});

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<ConsensusConnectionItem | null>(null);
  const [connectionDetail, setConnectionDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Form state
  const [createForm, setCreateForm] = useState<CreateConnectionFormData>({
    connectionAddress: '',
    connectionToken: 'LUCA',
    totalLockedAmount: '',
    lockedPositionProperties: '',
    lockupTime: '2',
    counterpartyLockedAmount: '',
    connectionType: 'standard'
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const tabs = [
    { key: 'Connected', label: 'Connected', icon: CheckCircle, color: 'text-green-600' },
    { key: 'Pending', label: 'Pending', icon: Clock, color: 'text-yellow-600' },
    { key: 'Waiting', label: 'Waiting', icon: AlertCircle, color: 'text-blue-600' },
    { key: 'Cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-600' },
    { key: 'Disconnected', label: 'Disconnected', icon: Unlink, color: 'text-gray-600' }
  ];

  // Load connections and counts on mount and when wallet changes
  useEffect(() => {
    if (isAuthenticated && wallet) {
      loadConnections();
      loadTabCounts();
    }
  }, [activeTab, currentPage, isAuthenticated, wallet]);

  // Load tab counts on mount
  useEffect(() => {
    if (isAuthenticated && wallet) {
      loadTabCounts();
    }
  }, [isAuthenticated, wallet]);

  const loadConnections = async () => {
    setLoading(true);
    try {
      const response = await fetchUserConsensusConnections({
        pageNo: currentPage,
        pageSize: itemsPerPage,
        status: activeTab,
        userAddress: wallet?.address
      });

      if (response.success) {
        setConnections(response.data?.list || []);
        setTotalCount(response.data?.total || 0);
      }
    } catch (error) {
      console.error('Error loading connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTabCounts = async () => {
    if (!wallet?.address) return;

    const tabKeys = ['Connected', 'Pending', 'Waiting', 'Cancelled', 'Disconnected'];
    const counts: Record<string, number> = {};

    try {
      await Promise.all(
        tabKeys.map(async (status) => {
          try {
            const response = await fetchUserConsensusConnections({
              pageNo: 1,
              pageSize: 1,
              status,
              userAddress: wallet?.address
            });
            counts[status] = response.success ? (response.data?.total || 0) : 0;
          } catch (error) {
            console.error(`Error loading ${status} count:`, error);
            counts[status] = 0;
          }
        })
      );
      setTabCounts(counts);
    } catch (error) {
      console.error('Error loading tab counts:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchAddress.trim()) {
      setIsSearchMode(false);
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await searchConsensusConnectionByAddress(searchAddress.trim());
      if (response.success) {
        setSearchResults(response.data?.list || []);
        setIsSearchMode(true);
      }
    } catch (error) {
      console.error('Error searching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConnection = async () => {
    setLoading(true);
    try {
      const response = await createConsensusConnection(createForm);
      if (response.success) {
        setShowCreateModal(false);
        setCreateForm({
          connectionAddress: '',
          connectionToken: 'LUCA',
          totalLockedAmount: '',
          lockedPositionProperties: '',
          lockupTime: '2',
          counterpartyLockedAmount: '',
          connectionType: 'standard'
        });
        loadConnections(); // Refresh the list
        alert('Connection created successfully! Please confirm the transaction in MetaMask.');
      } else {
        alert('Error creating connection: ' + response.message);
      }
    } catch (error: any) {
      console.error('Error creating connection:', error);
      alert('Error creating connection: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (connection: ConsensusConnectionItem) => {
    setSelectedConnection(connection);
    setDetailLoading(true);
    setShowDetailModal(true);

    try {
      const response = await getConsensusConnectionDetail(connection.id);
      if (response.success) {
        setConnectionDetail(response.data);
      }
    } catch (error) {
      console.error('Error loading connection details:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleConnectionAction = async (connectionId: string, action: 'approve' | 'reject' | 'disconnect') => {
    const actionLabels = {
      approve: 'approve connection',
      reject: 'reject connection', 
      disconnect: 'disconnect connection'
    };

    if (!confirm(`Are you sure you want to ${actionLabels[action]}?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await updateConsensusConnectionStatus(connectionId, action);
      if (response.success) {
        alert(`Connection ${action}d successfully! Please confirm the transaction in MetaMask.`);
        loadConnections(); // Refresh the list
        setShowDetailModal(false);
      } else {
        alert(`Error ${action}ing connection: ` + response.message);
      }
    } catch (error: any) {
      console.error(`Error ${action}ing connection:`, error);
      alert(`Error ${action}ing connection: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Connected: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      Pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      Waiting: { color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
      Cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
      Disconnected: { color: 'bg-gray-100 text-gray-800', icon: Unlink }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Waiting;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const displayedConnections = isSearchMode ? searchResults : connections;

  if (!isAuthenticated) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please connect your wallet to manage consensus connections.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Consensus Connection</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create connection
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search user address..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
          >
            Search
          </button>
          {isSearchMode && (
            <button
              onClick={() => {
                setIsSearchMode(false);
                setSearchAddress('');
                setSearchResults([]);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                  setIsSearchMode(false);
                  setSearchAddress('');
                }}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-teal-500 text-teal-600 bg-teal-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab.key ? tab.color : 'text-gray-400'}`} />
                {tab.label}
                {tabCounts[tab.key] > 0 && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs rounded-full px-2 py-1">
                    {tabCounts[tab.key]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Connection List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-teal-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading connections...</p>
          </div>
        ) : displayedConnections.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isSearchMode ? 'No connections found' : `No ${activeTab.toLowerCase()} connections`}
            </h3>
            <p className="text-gray-600">
              {isSearchMode 
                ? 'Try searching for a different address'
                : `You don't have any ${activeTab.toLowerCase()} connections yet.`
              }
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Connection Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lockup Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Connection Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Connection Details
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedConnections.map((connection) => (
                    <tr key={connection.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatAddress(connection.userAddress)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {connection.totalConnectionAmount} {connection.linkCurrency}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {connection.lockupTime}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(connection.connectionStatus)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {connection.connectionDetails}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewDetails(connection)}
                          className="text-teal-600 hover:text-teal-900 text-sm font-medium"
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!isSearchMode && totalCount > itemsPerPage && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded text-sm">
                    {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage * itemsPerPage >= totalCount}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Connection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Create a connection</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Connection address *
                </label>
                <input
                  type="text"
                  value={createForm.connectionAddress}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, connectionAddress: e.target.value }))}
                  placeholder="Please enter the connection address to be connected"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Connection token *
                </label>
                <select
                  value={createForm.connectionToken}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, connectionToken: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="LUCA">LUCA</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  The locked amount *
                </label>
                <input
                  type="number"
                  value={createForm.totalLockedAmount}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, totalLockedAmount: e.target.value }))}
                  placeholder="Enter the locked amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Locked position properties
                </label>
                <input
                  type="text"
                  value={createForm.lockedPositionProperties}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, lockedPositionProperties: e.target.value }))}
                  placeholder="Enter properties"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  My locked amount *
                </label>
                <input
                  type="number"
                  value={createForm.counterpartyLockedAmount}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, counterpartyLockedAmount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  The other party locked position amount *
                </label>
                <input
                  type="text"
                  value={createForm.counterpartyLockedAmount}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, counterpartyLockedAmount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lockup time *
                </label>
                <select
                  value={createForm.lockupTime}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, lockupTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="1">1 day</option>
                  <option value="2">2 days</option>
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Connection Instructions</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. After the connection is successfully created this time, it is expected to get 0 AGT</li>
                  <li>2. It will ensure all position-locked-in funds match as expected of each party to the connection</li>
                  <li>3. To the success of maintaining a connection, the locked position amount of each party matters</li>
                  <li>4. The funds will be returned to the original ownership and connection closure after</li>
                </ol>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateConnection}
                disabled={loading || !createForm.connectionAddress || !createForm.totalLockedAmount}
                className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Creating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connection Details Modal */}
      {showDetailModal && selectedConnection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Connection details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            {detailLoading ? (
              <div className="p-8 text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-teal-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading connection details...</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Connection object</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {formatAddress(connectionDetail?.connectionObject || selectedConnection.connectionAddress)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Lockup time</label>
                    <span className="text-sm text-gray-900">{connectionDetail?.lockupTime || selectedConnection.lockupTime}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Locked position amount</label>
                    <div className="text-sm text-gray-900">
                      {connectionDetail?.lockedPositionAmount || selectedConnection.lockedPositionAmount} LUCA
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      After the connection is successfully created this time, it is expected to get 0 AGT
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Creation time</label>
                    <span className="text-sm text-gray-900">
                      {connectionDetail?.creationTime || selectedConnection.creationTime}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">The counterparty's locked position amount</label>
                    <div className="text-sm text-gray-900">
                      {connectionDetail?.counterpartyLockedAmount || selectedConnection.counterpartyLockedAmount} LUCA
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Connection details</label>
                    <span className="text-sm text-gray-900">
                      {connectionDetail?.connectionDetails || selectedConnection.connectionDetails}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-gray-600 mb-1">hash</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded flex-1">
                      {connectionDetail?.hash || selectedConnection.hash}
                    </span>
                    <button
                      onClick={() => copyToClipboard(connectionDetail?.hash || selectedConnection.hash)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Copy"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a
                      href={`https://bscscan.com/tx/${connectionDetail?.hash || selectedConnection.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-teal-600 hover:text-teal-800 text-sm"
                    >
                      Go to Etherscan to query
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-gray-600 mb-1">Liquidated damage</label>
                  <div className="text-sm text-gray-900 mb-2">
                    {connectionDetail?.liquidatedDamage || selectedConnection.liquidatedDamage} LUCA
                  </div>
                  <p className="text-xs text-gray-500">
                    Liquidated damage calculation: remaining time / lockup time * 0.2 *
                    lockup quantity after maximum liquidated damage shall not exceed 20%
                    of the lockup amount; and the minimum liquidated damage shall not be
                    less than 1% of the lockup amount.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {selectedConnection.connectionStatus === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleConnectionAction(selectedConnection.id, 'approve')}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                      >
                        <UserCheck className="w-4 h-4" />
                        Agree to connect
                      </button>
                      <button
                        onClick={() => handleConnectionAction(selectedConnection.id, 'reject')}
                        className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <UserX className="w-4 h-4" />
                        Reject to connect
                      </button>
                    </>
                  )}
                  
                  {selectedConnection.connectionStatus === 'Connected' && (
                    <>
                      <button
                        onClick={() => handleConnectionAction(selectedConnection.id, 'disconnect')}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                      >
                        <Unlink className="w-4 h-4" />
                        Agree to disconnect
                      </button>
                      <button
                        onClick={() => alert('Reject to disconnect functionality would be implemented here')}
                        className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <UserX className="w-4 h-4" />
                        Reject to disconnect
                      </button>
                    </>
                  )}

                  {(selectedConnection.connectionStatus === 'Waiting' || selectedConnection.connectionStatus === 'Cancelled') && (
                    <button
                      onClick={() => alert('Cancel request functionality would be implemented here')}
                      className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                    >
                      Cancel request
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};