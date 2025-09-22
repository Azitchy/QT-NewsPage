import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ArrowLeft, 
  FileText, 
  Users, 
  TrendingUp, 
  Calendar, 
  Eye, 
  Edit, 
  X, 
  Upload, 
  Trash2,
  Shield,
  Zap,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Heart,
  Clock
} from 'lucide-react';
import { useWeb3Auth } from '../../../contexts/Web3AuthContext';
import { useBlockchain } from '../../../contexts/BlockchainContext';
import { 
  createProposal, 
  updateProposal, 
  getProposalByUserId, 
  getAllGame,
  gameRating,
  gameContributed,
  type Game,
  type GameProposal
} from '../../../lib/gameApi';
import { 
  getOverviewData, 
  fetchStakeTransactions,
  fetchContractInfo,
  fetchConsensusContractList,
  getCoinCurrency,
  fetchUserTreatyList
} from '../../../lib/webApi';

// Storage keys for state persistence
const COMMUNITY_STATE_KEY = 'community_proposal_state';
const COMMUNITY_FORM_KEY = 'community_form_data';
const GAME_FORM_KEY = 'game_form_data';

interface CommunityState {
  activeTab: 'participate' | 'initiated' | 'recovery';
  statusFilter: string;
  searchTitle: string;
  currentPage: number;
  lastUpdated: number;
  recoveryTransactionTab: 'buying' | 'investing';
  recoveryTransactionPage: number;
}

interface CommunityFormData {
  title: string;
  content: string;
  votingOptions: VotingOption[];
  lastModified: number;
}

interface GameFormData {
  title: string;
  overview: string;
  gameplay: string;
  funds: string;
  lucaAmount: string;
  lockDays: string;
  categories: string[];
  lastModified: number;
}

// Extend types to include missing properties
type Proposal = (Game | GameProposal) & {
  rating?: number;
  likes?: number;
  totalRatings?: number;
};

interface Milestone {
  id: string;
  title: string;
  description: string;
  deadline: string;
  funds: number;
}

interface ContactDetail {
  name: string;
  description: string;
  link: string;
  images?: string;
}

interface VotingOption {
  id: string;
  text: string;
  image?: string;
}

interface RecoveryTransaction {
  time: string;
  lucaAmount: string;
  usdcAmount: string;
  txHash: string;
  type: 'buy' | 'burn' | 'invest';
  status?: string;
}

interface RecoveryData {
  balance: { usdc: string; luca: string };
  target: string;
  completed: boolean;
  transactions: RecoveryTransaction[];
  totalRaised?: string;
  participantCount?: number;
}

// Status mapping from Vue project
const PROPOSAL_STATUSES = [
  { value: '', label: 'All' },
  { value: '0', label: 'Inactive' },
  { value: '1', label: 'Under review' },
  { value: '2', label: 'Changes required' },
  { value: '3', label: 'Approved' },
  { value: '4', label: 'Rejected' },
  { value: '5', label: 'Contribution stage' },
  { value: '6', label: 'Rejected after contribution' },
  { value: '7', label: 'In development' },
  { value: '8', label: 'Released' }
];

const GAME_CATEGORIES = [
  'Action', 'Adventure', 'Arcade', 'Board games', 'Card games', 'Card battle', 'Casual',
  'Fighting', 'Horror', 'Life simulation', 'MMORPG', 'MOBA', 'Music and Rhythm',
  'Party games', 'Platformer', 'Puzzle', 'Racing', 'Role-playing', 'RPG', 'Sandbox',
  'Shooter', 'Simulation', 'Sports', 'Stealth', 'Strategy', 'Survival', 'Tower Defense',
  'Trivia', 'Tycoon', 'Visual Novel'
];

export const CommunityProposal: React.FC = () => {
  const { wallet, session, isAuthenticated } = useWeb3Auth();
  const { } = useBlockchain();

  // Persistent state management
  const [state, setState] = useState<CommunityState>(() => {
    try {
      const saved = localStorage.getItem(COMMUNITY_STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          activeTab: 'participate',
          statusFilter: '',
          searchTitle: '',
          currentPage: 1,
          lastUpdated: Date.now(),
          recoveryTransactionTab: 'buying',
          recoveryTransactionPage: 1,
          ...parsed
        };
      }
    } catch (error) {
      console.warn('Failed to load community state:', error);
    }
    return {
      activeTab: 'participate',
      statusFilter: '',
      searchTitle: '',
      currentPage: 1,
      lastUpdated: Date.now(),
      recoveryTransactionTab: 'buying',
      recoveryTransactionPage: 1
    };
  });

  const [communityForm, setCommunityForm] = useState<CommunityFormData>(() => {
    try {
      const saved = localStorage.getItem(COMMUNITY_FORM_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only restore if modified recently (within 1 hour)
        if (Date.now() - parsed.lastModified < 3600000) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load community form:', error);
    }
    return {
      title: '',
      content: '',
      votingOptions: [{ id: '1', text: 'Yes' }, { id: '2', text: 'No' }],
      lastModified: Date.now()
    };
  });

  const [gameForm, setGameForm] = useState<GameFormData>(() => {
    try {
      const saved = localStorage.getItem(GAME_FORM_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only restore if modified recently (within 1 hour)
        if (Date.now() - parsed.lastModified < 3600000) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load game form:', error);
    }
    return {
      title: '',
      overview: '',
      gameplay: '',
      funds: '',
      lucaAmount: '',
      lockDays: '',
      categories: [],
      lastModified: Date.now()
    };
  });

  // Component state
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showInitiateModal, setShowInitiateModal] = useState(false);
  const [showCommunityForm, setShowCommunityForm] = useState(false);
  const [showGameForm, setShowGameForm] = useState(false);
  const [recoveryData, setRecoveryData] = useState<RecoveryData>({
    balance: { usdc: '2.00', luca: '857995.98' },
    target: '900000',
    completed: true,
    transactions: []
  });
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [totalTransactionPages, setTotalTransactionPages] = useState(1);

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(COMMUNITY_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save community state:', error);
    }
  }, [state]);

  useEffect(() => {
    try {
      localStorage.setItem(COMMUNITY_FORM_KEY, JSON.stringify(communityForm));
    } catch (error) {
      console.warn('Failed to save community form:', error);
    }
  }, [communityForm]);

  useEffect(() => {
    try {
      localStorage.setItem(GAME_FORM_KEY, JSON.stringify(gameForm));
    } catch (error) {
      console.warn('Failed to save game form:', error);
    }
  }, [gameForm]);

  // State updaters
  const updateState = (updates: Partial<CommunityState>) => {
    setState(prev => ({
      ...prev,
      ...updates,
      lastUpdated: Date.now()
    }));
  };

  const updateCommunityForm = (updates: Partial<CommunityFormData>) => {
    setCommunityForm(prev => ({
      ...prev,
      ...updates,
      lastModified: Date.now()
    }));
  };

  const updateGameForm = (updates: Partial<GameFormData>) => {
    setGameForm(prev => ({
      ...prev,
      ...updates,
      lastModified: Date.now()
    }));
  };

  // Load data based on active tab
  useEffect(() => {
    if (state.activeTab !== 'recovery') {
      loadProposals();
    }
  }, [state.activeTab, state.statusFilter, state.searchTitle]);

  // Load recovery data when tab changes
  useEffect(() => {
    if (state.activeTab === 'recovery') {
      loadRecoveryData();
    }
  }, [state.activeTab, state.recoveryTransactionPage, state.recoveryTransactionTab]);

  const loadProposals = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (state.activeTab === 'participate') {
        response = await getAllGame();
      } else if (state.activeTab === 'initiated') {
        if (isAuthenticated) {
          response = await getProposalByUserId();
        } else {
          setProposals([]);
          setLoading(false);
          return;
        }
      }

      if (response?.isSuccess) {
        let filteredProposals: Proposal[] = response.data || [];
        
        // Apply filters
        if (state.statusFilter) {
          filteredProposals = filteredProposals.filter((proposal: Proposal) => {
            const status = getProposalStatus(proposal);
            return status === state.statusFilter;
          });
        }
        
        if (state.searchTitle) {
          filteredProposals = filteredProposals.filter((proposal: Proposal) =>
            proposal.title.toLowerCase().includes(state.searchTitle.toLowerCase())
          );
        }

        setProposals(filteredProposals);
      } else {
        setError(response?.message || 'Failed to load proposals');
      }
    } catch (err: any) {
      console.error('Error loading proposals:', err);
      setError('Failed to load proposals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadRecoveryData = async () => {
    setRecoveryLoading(true);
    setRecoveryError(null);
    
    try {
      const overviewResponse = await getOverviewData();
      
      let transactionResponse;
      const pageSize = 10;
      
      if (state.recoveryTransactionTab === 'buying') {
        if (wallet?.address) {
          transactionResponse = await fetchUserTreatyList({
            pageIndex: state.recoveryTransactionPage,
            pageSize,
            type: 1,
            ledgeAddress: wallet.address,
            chainId: '0x38'
          });
        }
      } else {
        transactionResponse = await fetchConsensusContractList({
          pageNo: state.recoveryTransactionPage,
          pageSize,
          linkCurrency: 'LUCA',
          chainId: '0x38',
          consensusType: '',
          searchType: 'userAddress',
          searchKey: wallet?.address
        });
      }

      const formattedTransactions: RecoveryTransaction[] = [];
      
      if (transactionResponse?.success || transactionResponse?.data) {
        let transactions = [];
        
        if (state.recoveryTransactionTab === 'buying') {
          transactions = transactionResponse?.data?.list || transactionResponse?.data || [];
          
          transactions.forEach((tx: any) => {
            formattedTransactions.push({
              time: new Date(tx.createTime || tx.creationTime || Date.now()).toLocaleDateString('en-GB'),
              lucaAmount: tx.burnAmount || tx.amount || '0',
              usdcAmount: tx.useAmount || tx.payAmount || '',
              txHash: tx.hash || '',
              type: tx.burnAmount ? 'burn' : 'buy',
              status: tx.status || 'Completed'
            });
          });
        } else {
          transactions = transactionResponse?.data?.list || transactionResponse?.data || [];
          
          transactions.forEach((tx: any) => {
            formattedTransactions.push({
              time: new Date(tx.creationTime || tx.createTime || Date.now()).toLocaleDateString('en-GB'),
              lucaAmount: tx.totalConnectionAmount || tx.lockedPositionAmount || '0',
              usdcAmount: tx.counterpartyLockedAmount || tx.payAmount || '',
              txHash: tx.hash || '',
              type: 'invest',
              status: tx.connectionStatus || tx.status || 'Unknown'
            });
          });
        }

        const total = transactionResponse?.total || 0;
        setTotalTransactionPages(Math.ceil(total / pageSize));
      }

      const contractInfo = await fetchContractInfo();
      
      setRecoveryData({
        balance: {
          usdc: overviewResponse?.totalValue || '2.00',
          luca: contractInfo?.data?.totalSupply || '857995.98'
        },
        target: '900000',
        completed: true,
        transactions: formattedTransactions,
        totalRaised: contractInfo?.data?.totalRaised || '9000000',
        participantCount: contractInfo?.total || 0
      });

    } catch (err: any) {
      console.error('Error loading recovery data:', err);
      setRecoveryError('Failed to load recovery data. Please try again.');
      
      setRecoveryData({
        balance: { usdc: '0', luca: '0' },
        target: '900000',
        completed: false,
        transactions: []
      });
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleSubmitCommunityProposal = async () => {
    if (!communityForm.title.trim() || !communityForm.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (!isAuthenticated) {
      alert('Please authenticate to submit a proposal');
      return;
    }

    setLoading(true);
    try {
      const proposalData = {
        title: communityForm.title,
        description: communityForm.content,
        category: 'Community'
      };

      const response = await createProposal(proposalData);
      
      if (response.isSuccess) {
        alert('Community proposal submitted successfully!');
        setShowCommunityForm(false);
        updateCommunityForm({
          title: '',
          content: '',
          votingOptions: [{ id: '1', text: 'Yes' }, { id: '2', text: 'No' }],
          lastModified: Date.now()
        });
        
        updateState({ activeTab: 'initiated' });
        loadProposals();
      } else {
        alert('Error submitting proposal: ' + response.message);
      }
    } catch (error: any) {
      console.error('Error submitting community proposal:', error);
      alert('Error submitting proposal: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitGameProposal = async () => {
    if (!gameForm.title.trim() || !gameForm.overview.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (!isAuthenticated) {
      alert('Please authenticate to submit a proposal');
      return;
    }

    setLoading(true);
    try {
      const proposalData = {
        title: gameForm.title,
        description: gameForm.overview,
        category: gameForm.categories[0] || 'General'
      };

      const response = await createProposal(proposalData);
      
      if (response.isSuccess) {
        alert('Game proposal submitted successfully!');
        setShowGameForm(false);
        resetGameForm();
        
        updateState({ activeTab: 'initiated' });
        loadProposals();
      } else {
        alert('Error submitting proposal: ' + response.message);
      }
    } catch (error: any) {
      console.error('Error submitting game proposal:', error);
      alert('Error submitting proposal: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeProposal = async (proposal: Proposal) => {
    if (!proposal.id) return;

    try {
      const likeKey = `liked_game_${proposal.id}`;
      const isCurrentlyLiked = localStorage.getItem(likeKey) === 'true';
      
      const data = {
        gameId: proposal.id,
        rating: isCurrentlyLiked ? 0 : 5,
      };

      const response = await gameRating(data);
      
      if (response.isSuccess) {
        localStorage.setItem(likeKey, (!isCurrentlyLiked).toString());
        
        setProposals(prevProposals => 
          prevProposals.map(p => 
            p.id === proposal.id 
              ? { 
                  ...p, 
                  likes: isCurrentlyLiked ? (p.likes || 0) - 1 : (p.likes || 0) + 1,
                  rating: isCurrentlyLiked ? (p.rating || 0) - 1 : (p.rating || 0) + 1
                }
              : p
          )
        );
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  // Helper functions
  const getProposalStatus = (proposal: Proposal): string => {
    if ('status' in proposal) {
      return proposal.status?.toString() || '1';
    }
    return '1';
  };

  const getStatusLabel = (statusValue: string) => {
    const status = PROPOSAL_STATUSES.find(s => s.value === statusValue);
    return status?.label || 'Unknown';
  };

  const getStatusBadgeClass = (statusValue: string) => {
    const statusClasses: { [key: string]: string } = {
      '0': 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300',
      '1': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      '2': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
      '3': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      '4': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      '5': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      '6': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      '7': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
      '8': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
    };
    return statusClasses[statusValue] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
  };

  const resetGameForm = () => {
    updateGameForm({
      title: '',
      overview: '',
      gameplay: '',
      funds: '',
      lucaAmount: '',
      lockDays: '',
      categories: [],
      lastModified: Date.now()
    });
  };

  const addVotingOption = () => {
    updateCommunityForm({
      votingOptions: [...communityForm.votingOptions, { id: Date.now().toString(), text: '' }]
    });
  };

  const updateVotingOption = (index: number, text: string) => {
    const newOptions = communityForm.votingOptions.map((option, i) => 
      i === index ? { ...option, text } : option
    );
    updateCommunityForm({ votingOptions: newOptions });
  };

  const removeVotingOption = (index: number) => {
    if (communityForm.votingOptions.length > 2) {
      const newOptions = communityForm.votingOptions.filter((_, i) => i !== index);
      updateCommunityForm({ votingOptions: newOptions });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleTransactionTabChange = (tab: 'buying' | 'investing') => {
    updateState({ recoveryTransactionTab: tab, recoveryTransactionPage: 1 });
  };

  const handlePageChange = (page: number) => {
    updateState({ recoveryTransactionPage: page });
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-foreground">Community Proposal</h1>
          {session && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-800 dark:text-green-300">Authenticated</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-border mb-4 sm:mb-6">
          {/* Desktop Tabs */}
          <div className="hidden sm:flex w-full">
            <button
              onClick={() => updateState({ activeTab: 'participate' })}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                state.activeTab === 'participate'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 dark:text-card-foreground hover:text-gray-700 dark:hover:text-foreground'
              }`}
            >
              Proposal participate
            </button>
            <button
              onClick={() => updateState({ activeTab: 'initiated' })}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                state.activeTab === 'initiated'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 dark:text-card-foreground hover:text-gray-700 dark:hover:text-foreground'
              }`}
            >
              Proposal initiated
            </button>
            <button
              onClick={() => updateState({ activeTab: 'recovery' })}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                state.activeTab === 'recovery'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 dark:text-card-foreground hover:text-gray-700 dark:hover:text-foreground'
              }`}
            >
              Recovery plan
            </button>
          </div>

          {/* Mobile Tab Selector */}
          <div className="sm:hidden w-full">
            <select
              value={state.activeTab}
              onChange={(e) => updateState({ activeTab: e.target.value as any })}
              className="w-full px-3 py-2 bg-white dark:bg-background border border-gray-300 dark:border-border rounded-lg text-gray-900 dark:text-foreground focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="participate">📋 Proposal participate</option>
              <option value="initiated">📝 Proposal initiated</option>
              <option value="recovery">💼 Recovery plan</option>
            </select>
          </div>
        </div>

        {state.activeTab === 'recovery' ? (
          /* Recovery Plan Content */
          <div className="space-y-4 sm:space-y-6">
            {/* Recovery Summary Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 sm:p-6 text-white">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">The recovery plan</h2>
                  <p className="text-blue-100 mb-4 text-sm sm:text-base">
                    The community will release an additional 8 million LUCA into the rewards wallet so users can retrieve their rewards.
                  </p>
                  <p className="text-blue-100 mb-6 text-sm sm:text-base">
                    All LUCA investors are encouraged to join this round of recovery investment and contribute to the community.
                  </p>
                  
                  <div className="mb-4">
                    <div className="text-xs sm:text-sm text-blue-200 mb-1">Recovery address: 0x3a0D4cb0A6aaDaaJ79559282524Cc3e67GGdl</div>
                    <div className="text-xl sm:text-2xl font-bold mb-2">{recoveryData.totalRaised || '9000000'} USDC</div>
                    <div className="bg-blue-500 bg-opacity-50 rounded-full h-2 mb-2">
                      <div className="bg-white h-2 rounded-full" style={{ width: recoveryData.completed ? '100%' : '85%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span>{recoveryData.target} USDC stretch target</span>
                      <span>20.11.2023</span>
                    </div>
                  </div>
                  
                  <div className="text-base sm:text-lg font-medium">
                    {recoveryData.completed ? 'Successfully completed' : 'In progress'}
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg p-4 lg:ml-6 min-w-0 lg:min-w-[200px]">
                  <h3 className="text-base sm:text-lg font-semibold mb-4">Balance</h3>
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold">{recoveryData.balance.usdc}</div>
                      <div className="text-blue-200 text-xs sm:text-sm">USDC</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold">{recoveryData.balance.luca}</div>
                      <div className="text-blue-200 text-xs sm:text-sm">LUCA</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Tabs */}
            <div className="bg-white dark:bg-card rounded-lg shadow">
              <div className="border-b border-gray-200 dark:border-border">
                {/* Desktop Tabs */}
                <div className="hidden sm:flex">
                  <button 
                    onClick={() => handleTransactionTabChange('buying')}
                    className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                      state.recoveryTransactionTab === 'buying'
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-gray-500 dark:text-card-foreground hover:text-gray-700 dark:hover:text-foreground'
                    }`}
                  >
                    Transaction of buying and burning LUCA
                  </button>
                  <button 
                    onClick={() => handleTransactionTabChange('investing')}
                    className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                      state.recoveryTransactionTab === 'investing'
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-gray-500 dark:text-card-foreground hover:text-gray-700 dark:hover:text-foreground'
                    }`}
                  >
                    Transaction records of investing
                  </button>
                </div>

                {/* Mobile Tab Selector */}
                <div className="sm:hidden p-4">
                  <select
                    value={state.recoveryTransactionTab}
                    onChange={(e) => handleTransactionTabChange(e.target.value as 'buying' | 'investing')}
                    className="w-full px-3 py-2 bg-white dark:bg-background border border-gray-300 dark:border-border rounded-lg text-gray-900 dark:text-foreground focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="buying">💰 Buying and burning LUCA</option>
                    <option value="investing">📈 Investment records</option>
                  </select>
                </div>
              </div>
              
              {/* Transaction Table */}
              <div className="overflow-x-auto">
                {recoveryLoading ? (
                  <div className="p-8 text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-teal-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-card-foreground">Loading transactions...</p>
                  </div>
                ) : recoveryError ? (
                  <div className="p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-foreground mb-2">Error Loading Transactions</h3>
                    <p className="text-red-600 dark:text-red-400 mb-4">{recoveryError}</p>
                    <button
                      onClick={loadRecoveryData}
                      className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-background/50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                              Transaction time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                              LUCA
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                              USDC
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                              Transaction hash
                            </th>
                            {state.recoveryTransactionTab === 'investing' && (
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                                Status
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-border">
                          {recoveryData.transactions.length === 0 ? (
                            <tr>
                              <td colSpan={state.recoveryTransactionTab === 'investing' ? 5 : 4} className="px-6 py-12 text-center">
                                <div className="text-gray-400 text-lg">
                                  {wallet?.address ? 'No transactions found for your address' : 'Please connect wallet to view transactions'}
                                </div>
                              </td>
                            </tr>
                          ) : (
                            recoveryData.transactions.map((transaction, index) => (
                              <tr key={`${transaction.txHash}-${index}`} className="hover:bg-gray-50 dark:hover:bg-background/50">
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-foreground">
                                  {transaction.time}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    {transaction.type === 'burn' ? (
                                      <>
                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                        <span className="text-red-600 font-medium">→ {parseFloat(transaction.lucaAmount).toLocaleString()} LUCA</span>
                                        <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">BURN</span>
                                      </>
                                    ) : transaction.type === 'invest' ? (
                                      <>
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        <span className="text-blue-600 font-medium">→ {parseFloat(transaction.lucaAmount).toLocaleString()} LUCA</span>
                                        <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded">INVEST</span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        <span className="text-green-600 font-medium">← {parseFloat(transaction.lucaAmount).toLocaleString()} LUCA</span>
                                        <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded">BUY</span>
                                      </>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-foreground">
                                  {transaction.usdcAmount ? (
                                    <span className="font-medium">{parseFloat(transaction.usdcAmount).toLocaleString()} USDC</span>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                  {transaction.txHash ? (
                                    <div className="flex items-center gap-2">
                                      <a
                                        href={`https://bscscan.com/tx/${transaction.txHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline font-mono text-xs break-all max-w-32 truncate block"
                                        title={transaction.txHash}
                                      >
                                        {transaction.txHash}
                                      </a>
                                      <ExternalLink className="w-3 h-3 text-gray-400" />
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">Pending</span>
                                  )}
                                </td>
                                {state.recoveryTransactionTab === 'investing' && (
                                  <td className="px-6 py-4 text-sm">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      transaction.status === 'Connected' ? 'bg-green-100 text-green-800' :
                                      transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {transaction.status || 'Unknown'}
                                    </span>
                                  </td>
                                )}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-gray-200 dark:divide-border">
                      {recoveryData.transactions.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="text-gray-400 text-lg">
                            {wallet?.address ? 'No transactions found for your address' : 'Please connect wallet to view transactions'}
                          </div>
                        </div>
                      ) : (
                        recoveryData.transactions.map((transaction, index) => (
                          <div key={`${transaction.txHash}-${index}`} className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-500 dark:text-card-foreground">{transaction.time}</div>
                              {transaction.type === 'burn' ? (
                                <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">BURN</span>
                              ) : transaction.type === 'invest' ? (
                                <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded">INVEST</span>
                              ) : (
                                <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded">BUY</span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-500 dark:text-card-foreground">LUCA:</span>
                                <div className="font-medium text-gray-900 dark:text-foreground">{parseFloat(transaction.lucaAmount).toLocaleString()}</div>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-card-foreground">USDC:</span>
                                <div className="font-medium text-gray-900 dark:text-foreground">
                                  {transaction.usdcAmount ? parseFloat(transaction.usdcAmount).toLocaleString() : '-'}
                                </div>
                              </div>
                            </div>
                            {transaction.txHash && (
                              <div>
                                <span className="text-gray-500 dark:text-card-foreground text-sm">Hash:</span>
                                <div className="flex items-center gap-2">
                                  <a
                                    href={`https://bscscan.com/tx/${transaction.txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline font-mono text-xs break-all"
                                    title={transaction.txHash}
                                  >
                                    {transaction.txHash.slice(0, 20)}...
                                  </a>
                                  <ExternalLink className="w-3 h-3 text-gray-400" />
                                </div>
                              </div>
                            )}
                            {state.recoveryTransactionTab === 'investing' && (
                              <div className="text-sm">
                                <span className="text-gray-500 dark:text-card-foreground">Status:</span>
                                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  transaction.status === 'Connected' ? 'bg-green-100 text-green-800' :
                                  transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {transaction.status || 'Unknown'}
                                </span>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Pagination */}
              {!recoveryLoading && !recoveryError && totalTransactionPages > 1 && (
                <div className="px-6 py-3 bg-gray-50 dark:bg-background/50 border-t border-gray-200 dark:border-border flex items-center justify-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(Math.max(1, state.recoveryTransactionPage - 1))}
                      disabled={state.recoveryTransactionPage === 1}
                      className="px-3 py-1 border border-gray-300 dark:border-border rounded text-sm hover:bg-gray-50 dark:hover:bg-background disabled:opacity-50 text-gray-900 dark:text-foreground"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <span className="px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded text-sm font-medium">
                      {state.recoveryTransactionPage}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(Math.min(totalTransactionPages, state.recoveryTransactionPage + 1))}
                      disabled={state.recoveryTransactionPage === totalTransactionPages}
                      className="px-3 py-1 border border-gray-300 dark:border-border rounded text-sm hover:bg-gray-50 dark:hover:bg-background disabled:opacity-50 text-gray-900 dark:text-foreground"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Proposals Content */
          <div className="space-y-4 sm:space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-1">Proposal status</label>
                  <select
                    value={state.statusFilter}
                    onChange={(e) => updateState({ statusFilter: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-background text-gray-900 dark:text-foreground"
                  >
                    {PROPOSAL_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-1">Search</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Proposal title"
                      value={state.searchTitle}
                      onChange={(e) => updateState({ searchTitle: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-background text-gray-900 dark:text-foreground"
                    />
                    <button
                      onClick={loadProposals}
                      className="px-4 sm:px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      <span className="hidden sm:inline">Search</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-0 lg:pt-6">
                <button
                  onClick={() => setShowInitiateModal(true)}
                  className="w-full lg:w-auto px-4 sm:px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Initiate proposal
                </button>
              </div>
            </div>

            {/* Proposals Table */}
            <div className="bg-white dark:bg-card rounded-lg shadow overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-teal-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-card-foreground">Loading proposals...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-foreground mb-2">Error Loading Proposals</h3>
                  <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                  <button
                    onClick={loadProposals}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : proposals.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-foreground mb-2">No data</h3>
                  <p className="text-gray-600 dark:text-card-foreground">
                    {state.activeTab === 'participate' 
                      ? 'No proposals available for participation' 
                      : 'You haven\'t created any proposals yet'
                    }
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-background/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                            Proposal time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                            Proposal title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                            Proposal status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-card-foreground uppercase tracking-wider">
                            Operate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-border">
                        {proposals.map((proposal) => (
                          <tr key={proposal.id} className="hover:bg-gray-50 dark:hover:bg-background/50">
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-foreground">
                              {formatDate(proposal.createdAt || '')}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-foreground">
                              <div className="flex items-center gap-2">
                                <span>{proposal.title}</span>
                                {state.activeTab === 'participate' && (
                                  <button
                                    onClick={() => handleLikeProposal(proposal)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                  >
                                    <Heart 
                                      className="w-4 h-4" 
                                      fill={localStorage.getItem(`liked_game_${proposal.id}`) === 'true' ? 'currentColor' : 'none'}
                                    />
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(getProposalStatus(proposal))}`}>
                                {getStatusLabel(getProposalStatus(proposal))}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm space-x-2">
                              <button
                                onClick={() => setSelectedProposal(proposal)}
                                className="text-teal-600 hover:text-teal-900 font-medium"
                              >
                                View
                              </button>
                              {state.activeTab === 'initiated' && (
                                <>
                                  <span className="text-gray-300">|</span>
                                  <button
                                    onClick={() => setSelectedProposal(proposal)}
                                    className="text-teal-600 hover:text-teal-900 font-medium"
                                  >
                                    Edit
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden divide-y divide-gray-200 dark:divide-border">
                    {proposals.map((proposal) => (
                      <div key={proposal.id} className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900 dark:text-foreground">{proposal.title}</h3>
                              {state.activeTab === 'participate' && (
                                <button
                                  onClick={() => handleLikeProposal(proposal)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <Heart 
                                    className="w-4 h-4" 
                                    fill={localStorage.getItem(`liked_game_${proposal.id}`) === 'true' ? 'currentColor' : 'none'}
                                  />
                                </button>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-card-foreground">{formatDate(proposal.createdAt || '')}</p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(getProposalStatus(proposal))}`}>
                            {getStatusLabel(getProposalStatus(proposal))}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedProposal(proposal)}
                            className="flex-1 px-3 py-2 text-teal-600 hover:text-teal-900 font-medium border border-teal-300 rounded hover:bg-teal-50 transition-colors text-center"
                          >
                            View
                          </button>
                          {state.activeTab === 'initiated' && (
                            <button
                              onClick={() => setSelectedProposal(proposal)}
                              className="flex-1 px-3 py-2 text-teal-600 hover:text-teal-900 font-medium border border-teal-300 rounded hover:bg-teal-50 transition-colors text-center"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Modals - keeping existing modal implementations */}
        {/* Initiate Proposal Modal */}
        {showInitiateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-card rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-foreground">What proposal do you want to initiate?</h3>
                <button
                  onClick={() => setShowInitiateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    setShowInitiateModal(false);
                    setShowCommunityForm(true);
                  }}
                  className="flex-1 px-4 py-3 border-2 border-teal-500 text-teal-500 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors text-center"
                >
                  Community proposal
                </button>
                <button
                  onClick={() => {
                    setShowInitiateModal(false);
                    setShowGameForm(true);
                  }}
                  className="flex-1 px-4 py-3 border-2 border-teal-500 text-teal-500 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors text-center"
                >
                  Game Proposal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Community Form Modal */}
        {showCommunityForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowCommunityForm(false)}
                      className="text-teal-500 hover:text-teal-700"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground">Community proposal</h2>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row">
                <div className="flex-1 p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-2">Proposal title</label>
                    <input
                      type="text"
                      value={communityForm.title}
                      onChange={(e) => updateCommunityForm({ title: e.target.value })}
                      placeholder="Enter proposal title"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-background text-gray-900 dark:text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-2">Proposal content</label>
                    <textarea
                      value={communityForm.content}
                      onChange={(e) => updateCommunityForm({ content: e.target.value })}
                      placeholder="Enter proposal content"
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-background text-gray-900 dark:text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-2">
                      Please set proposal voting options
                    </label>
                    <div className="space-y-3">
                      {communityForm.votingOptions.map((option, index) => (
                        <div key={option.id} className="flex items-center gap-3">
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => updateVotingOption(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-background text-gray-900 dark:text-foreground"
                          />
                          {communityForm.votingOptions.length > 2 && (
                            <button
                              onClick={() => removeVotingOption(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        onClick={addVotingOption}
                        className="px-4 py-2 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                      >
                        Add option
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitCommunityProposal}
                    disabled={loading || !communityForm.title.trim() || !communityForm.content.trim()}
                    className="w-full px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Submitting...' : 'Submit community proposal'}
                  </button>
                </div>

                <div className="lg:w-80 p-6 bg-gray-50 dark:bg-background/50 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-border">
                  <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
                    <h3 className="flex items-center gap-2 text-sm font-medium text-teal-800 dark:text-teal-300 mb-3">
                      <FileText className="w-4 h-4" />
                      Community proposal rules
                    </h3>
                    <ol className="text-xs text-teal-700 dark:text-teal-300 space-y-2">
                      <li>1. Some amount of LUCA must be staked for each proposal application.</li>
                      <li>2. After making an application it will be reviewed by community management members.</li>
                      <li>3. Community members can vote FOR and AGAINST the proposal.</li>
                      <li>4. Voting results will be recorded in the smart contract.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Form Modal */}
        {showGameForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-card rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-border">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowGameForm(false)}
                    className="text-teal-500 hover:text-teal-700"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground">Share your game concept</h2>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row">
                <div className="flex-1 p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-2">Game title</label>
                    <input
                      type="text"
                      value={gameForm.title}
                      onChange={(e) => updateGameForm({ title: e.target.value })}
                      placeholder="Enter game title"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-background text-gray-900 dark:text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-2">Game overview</label>
                    <textarea
                      value={gameForm.overview}
                      onChange={(e) => updateGameForm({ overview: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-background text-gray-900 dark:text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-2">Categories</label>
                    <select
                      value={gameForm.categories[0] || ''}
                      onChange={(e) => updateGameForm({ categories: [e.target.value] })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-background text-gray-900 dark:text-foreground"
                    >
                      <option value="">Select a category</option>
                      {GAME_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleSubmitGameProposal}
                    disabled={loading || !gameForm.title.trim() || !gameForm.overview.trim()}
                    className="w-full px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Submitting...' : 'Submit game proposal'}
                  </button>
                </div>

                <div className="lg:w-80 p-6 bg-gray-50 dark:bg-background/50 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-border">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">How does it work?</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-teal-600 dark:text-teal-400">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-foreground mb-1">Share Your Game Concept</h4>
                          <p className="text-sm text-gray-600 dark:text-card-foreground">
                            Submit your game concept with details and funding requirements.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-teal-600 dark:text-teal-400">2</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-foreground mb-1">Community Engagement</h4>
                          <p className="text-sm text-gray-600 dark:text-card-foreground">
                            Everyone in the ATM community can see and engage with your game.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-teal-600 dark:text-teal-400">3</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-foreground mb-1">Community Interaction</h4>
                          <p className="text-sm text-gray-600 dark:text-card-foreground">
                            Stay in touch and communicate with the community.
                          </p>
                        </div>
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