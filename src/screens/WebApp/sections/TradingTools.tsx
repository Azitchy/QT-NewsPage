import * as React from "react";
import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  ArrowUpDown, 
  ExternalLink, 
  History, 
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  Snowflake,
  Network,
  Send,
  X
} from 'lucide-react';
import { useWeb3Auth } from '../../../contexts/Web3AuthContext';
import { useBlockchain } from '../../../contexts/BlockchainContext';
import { 
  getOverviewData,
  getCoinCurrency,
  fetchStakeTransactions,
  fetchConsensusContractList,
  fetchContractInfo
} from '../../../lib/webApi';

interface TransferForm {
  amount: string;
  destinationChain: string;
  receivingAddress: string;
  selectedToken: string;
}

interface TransferHistory {
  id: string;
  amount: string;
  token: string;
  fromChain: string;
  toChain: string;
  receivingAddress: string;
  status: 'pending' | 'completed' | 'failed';
  txHash: string;
  timestamp: string;
  estimatedAmount: string;
  fee: string;
  operateType?: number;
}

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  aloneCalculateFlag: number;
}

const SUPPORTED_CHAINS = [
  { id: 'bsc', name: 'BSC (Binance Smart Chain)', chainId: '0x38' },
  { id: 'ethereum', name: 'Ethereum', chainId: '0x1' },
  { id: 'polygon', name: 'Polygon', chainId: '0x89' },
  { id: 'arbitrum', name: 'Arbitrum', chainId: '0xa4b1' },
  { id: 'optimism', name: 'Optimism', chainId: '0xa' },
];

export const TradingTools: React.FC = () => {
  const { wallet, isAuthenticated, getUserBalance } = useWeb3Auth();
  const { getTokenBalance, currentChainId, getContract } = useBlockchain();
  
  // Active tool state
  const [activeTool, setActiveTool] = useState<'exchange' | 'bridge' | 'transfer'>('exchange');
  
  // Transfer form state
  const [transferForm, setTransferForm] = useState<TransferForm>({
    amount: '',
    destinationChain: '',
    receivingAddress: '',
    selectedToken: 'LUCA'
  });
  
  // Data state
  const [availableTokens, setAvailableTokens] = useState<CoinData[]>([]);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [estimatedReceived, setEstimatedReceived] = useState<string>('0');
  const [transferFee, setTransferFee] = useState<string>('0');
  const [showHistory, setShowHistory] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  
  // Transfer history state
  const [transferHistory, setTransferHistory] = useState<TransferHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Overview data
  const [overviewData, setOverviewData] = useState<any>(null);
  const [contractInfo, setContractInfo] = useState<any>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load token balance when wallet or token changes
  useEffect(() => {
    if (isAuthenticated && wallet && transferForm.selectedToken) {
      loadTokenBalance();
    }
  }, [isAuthenticated, wallet, transferForm.selectedToken]);

  // Calculate estimated amounts when form changes
  useEffect(() => {
    calculateEstimatedAmounts();
  }, [transferForm.amount, transferForm.destinationChain, transferForm.selectedToken, contractInfo]);

  const loadInitialData = async () => {
    try {
      // Load available tokens from API
      const coinData = await getCoinCurrency();
      setAvailableTokens(coinData || []);

      // Load overview data
      const overview = await getOverviewData();
      setOverviewData(overview);

      // Load contract info for fee calculations
      const contractData = await fetchContractInfo();
      setContractInfo(contractData);

    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const loadTokenBalance = async () => {
    if (!wallet?.address) return;
    
    setIsLoadingBalance(true);
    setBalanceError(null);
    
    try {
      if (transferForm.selectedToken === 'LUCA') {
        // Use Web3Auth's built-in LUCA balance method
        const balance = await getUserBalance();
        setTokenBalance(balance);
      } else {
        // For other tokens, try to use blockchain context
        try {
          const tokenContract = getTokenBalance ? await getTokenBalance('', wallet.address) : '0';
          setTokenBalance(tokenContract);
        } catch {
          // Fallback: set to 0 if contract not available
          setTokenBalance('0');
        }
      }
    } catch (error) {
      console.error('Failed to load token balance:', error);
      setBalanceError('Failed to load balance');
      setTokenBalance('0');
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const loadTransferHistory = async () => {
    if (!wallet?.address) return;
    
    setIsLoadingHistory(true);
    setHistoryError(null);
    
    try {
      // Load stake transactions as transfer history
      const stakeResponse = await fetchStakeTransactions(
        1, // pageNo
        50, // pageSize  
        currentChainId, // chainId
        wallet.address, // searchKey
        'ledgeAddress' // searchType
      );

      // Load consensus contract transactions
      const consensusResponse = await fetchConsensusContractList({
        pageNo: 1,
        pageSize: 50,
        linkCurrency: transferForm.selectedToken,
        chainId: currentChainId,
        consensusType: '',
        searchType: 'userAddress',
        searchKey: wallet.address
      });

      // Format and combine both types of transactions
      const formattedHistory: TransferHistory[] = [];

      // Process stake transactions
      if (stakeResponse?.data?.list) {
        stakeResponse.data.list.forEach((tx: any, index: number) => {
          formattedHistory.push({
            id: `stake-${tx.id || index}`,
            amount: tx.amount || tx.lucaAmount || '0',
            token: tx.currency || 'LUCA',
            fromChain: 'BSC',
            toChain: 'BSC',
            receivingAddress: tx.ledgeAddress || wallet.address,
            status: tx.status === 1 ? 'completed' : tx.status === 0 ? 'pending' : 'failed',
            txHash: tx.hash || '',
            timestamp: tx.creationTime || tx.createTime || new Date().toISOString(),
            estimatedAmount: tx.amount || '0',
            fee: tx.payAmount || '0',
            operateType: tx.operateType
          });
        });
      }

      // Process consensus contract transactions
      if (consensusResponse?.data?.list) {
        consensusResponse.data.list.forEach((tx: any, index: number) => {
          formattedHistory.push({
            id: `consensus-${tx.id || index}`,
            amount: tx.totalConnectionAmount || tx.lockedPositionAmount || '0',
            token: tx.linkCurrency || 'LUCA',
            fromChain: 'BSC',
            toChain: tx.consensusType || 'Unknown',
            receivingAddress: tx.connectionAddress || '',
            status: tx.connectionStatus === 'Connected' ? 'completed' : 
                   tx.connectionStatus === 'Pending' ? 'pending' : 'failed',
            txHash: tx.hash || '',
            timestamp: tx.creationTime || new Date().toISOString(),
            estimatedAmount: tx.counterpartyLockedAmount || '0',
            fee: tx.liquidatedDamage || '0'
          });
        });
      }

      // Sort by timestamp (newest first)
      formattedHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setTransferHistory(formattedHistory);

    } catch (error) {
      console.error('Failed to load transfer history:', error);
      setHistoryError('Failed to load transfer history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const calculateEstimatedAmounts = async () => {
    if (!transferForm.amount || !transferForm.destinationChain) {
      setEstimatedReceived('0');
      setTransferFee('0');
      return;
    }

    const amount = parseFloat(transferForm.amount);
    if (isNaN(amount) || amount <= 0) {
      setEstimatedReceived('0');
      setTransferFee('0');
      return;
    }

    try {
      // Calculate fees based on contract info and overview data
      let feePercentage = 0.001; // 0.1% base fee
      
      if (contractInfo?.data) {
        // Use actual contract data to calculate more accurate fees
        const contractFeeRate = contractInfo.data.feeRate || 0.001;
        feePercentage = contractFeeRate;
      }

      // Different fees for different chains
      if (transferForm.destinationChain === 'ethereum') {
        feePercentage += 0.01; // Additional 1% for Ethereum gas costs
      } else if (transferForm.destinationChain === 'polygon') {
        feePercentage += 0.002; // Additional 0.2% for Polygon
      }

      const fee = amount * feePercentage;
      const estimated = Math.max(0, amount - fee);

      setTransferFee(fee.toFixed(6));
      setEstimatedReceived(estimated.toFixed(6));

    } catch (error) {
      console.error('Failed to calculate fees:', error);
      setTransferFee('0');
      setEstimatedReceived('0');
    }
  };

  const handleConfirmTransfer = async () => {
    if (!transferForm.amount || !transferForm.destinationChain || !transferForm.receivingAddress) {
      alert('Please fill in all required fields');
      return;
    }

    if (!isAuthenticated) {
      alert('Please connect your wallet to proceed');
      return;
    }

    const amount = parseFloat(transferForm.amount);
    const balance = parseFloat(tokenBalance);
    
    if (amount > balance) {
      alert('Insufficient balance');
      return;
    }

    if (amount < 1) {
      alert('Transfer amount cannot be less than 1');
      return;
    }

    setIsProcessing(true);
    try {
      // Try to get cross-chain contract
      const crossChainContract = getContract('CreateConnectionFactory');
      
      if (!crossChainContract) {
        throw new Error('Cross-chain transfer functionality not available. Please use external bridges.');
      }

      // This would be the actual implementation
      // For now, show that the contract is available but implementation needed
      alert('Cross-chain transfer contract is available but transfer method needs implementation. Please use external bridges for now.');
      
    } catch (error) {
      console.error('Transfer failed:', error);
      alert(`Transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAmountChange = (value: string) => {
    // Only allow valid number input
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTransferForm(prev => ({ ...prev, amount: value }));
    }
  };

  const setMaxAmount = () => {
    const balance = parseFloat(tokenBalance);
    if (balance > 0) {
      // Reserve some for gas fees
      const maxTransferable = Math.max(0, balance - 0.01);
      setTransferForm(prev => ({ ...prev, amount: maxTransferable.toString() }));
    }
  };

  const getAvailableTokenSymbols = () => {
    const defaultTokens = ['LUCA', 'USDC', 'USDT', 'BNB'];
    const apiTokens = availableTokens.map(token => token.symbol);
    return [...new Set([...defaultTokens, ...apiTokens])];
  };

  const renderExchangeContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Luca exchange</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Different blockchain networks have corresponding Swap that provides the function of Luca exchange. 
          You can use other currency pairs to exchange Luca in Swap. Below are the Swaps of each blockchain network.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
          <span className="font-medium">BSC (Binance Smart Chain)</span>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg hover:border-teal-300 dark:hover:border-teal-600 transition-colors">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Snowflake className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="font-medium text-lg text-gray-900 dark:text-gray-100">PancakeSwap</span>
            </div>
            
            <ArrowRight className="w-6 h-6 text-teal-500 dark:text-teal-400 rotate-90 sm:rotate-0" />
            
            <a
              href="https://pancakeswap.finance/swap"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-teal-500 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors"
            >
              <span>Trade LUCA</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBridgeContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Cross-chain bridge</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          There are many technical solutions that can help you make cross-chain transfers. 
          You can use cross-chain enabled apps to make cross-chain transfers. Some cross-chain bridges 
          also provide liquidity to earn service charges.
        </p>
      </div>

      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-orange-900 dark:text-orange-400 mb-1">Risk Warning</h3>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              When you use the cross-chain bridge function, please be aware of the financial risks of providing liquidity. 
              Because some cross-chain bridges have rolled out the function of providing liquidity to earn service charges, 
              and very few of them have experienced asset theft.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-teal-300 dark:hover:border-teal-600 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Network className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">AnySwap</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Multi-chain bridge</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Decentralized cross-chain bridge supporting multiple networks and tokens.
          </p>
          
          <a
            href="https://bsc.anyswap.exchange/bridge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
          >
            <span>Open AnySwap</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-teal-300 dark:hover:border-teal-600 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <Network className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Celer Bridge</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fast & secure bridge</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            High-speed cross-chain bridge with low fees and fast confirmation times.
          </p>
          
          <a
            href="https://cbridge.celer.network/1/10/USDC"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
          >
            <span>Open Celer Bridge</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );

  const renderTransferContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">ATM cross-chain transfer</h2>
          <p className="text-gray-600 dark:text-gray-400">
            You can transfer assets to any address on different chains through the ATM cross-chain transfer tool
          </p>
        </div>
        
        <button
          onClick={() => {
            setShowHistory(!showHistory);
            if (!showHistory) {
              loadTransferHistory();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
        >
          <History className="w-4 h-4" />
          <span className="text-sm">History</span>
        </button>
      </div>

      <div className="max-w-md space-y-6">
        {/* Transfer Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            The transfer amount
          </label>
          <div className="relative">
            <input
              type="text"
              value={transferForm.amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="cannot be less than 1"
              className="w-full px-3 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <select
                value={transferForm.selectedToken}
                onChange={(e) => setTransferForm(prev => ({ ...prev, selectedToken: e.target.value }))}
                className="border-none bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                {getAvailableTokenSymbols().map(symbol => (
                  <option key={symbol} value={symbol}>
                    {symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-sm">
            <div className="flex items-center gap-2">
              {balanceError ? (
                <span className="text-red-600 dark:text-red-400">{balanceError}</span>
              ) : (
                <span className="text-teal-600 dark:text-teal-400">
                  Balance: {isLoadingBalance ? '...' : tokenBalance}
                </span>
              )}
              {isLoadingBalance && <RefreshCw className="w-3 h-3 animate-spin" />}
            </div>
            <button
              onClick={setMaxAmount}
              disabled={isLoadingBalance || balanceError !== null}
              className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium disabled:text-gray-400 dark:disabled:text-gray-500"
            >
              Max
            </button>
          </div>
        </div>

        {/* Swap Icon */}
        <div className="flex justify-center">
          <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
            <ArrowUpDown className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
        </div>

        {/* Destination Chain */}
        <div>
          <div className="relative">
            <select
              value={transferForm.destinationChain}
              onChange={(e) => setTransferForm(prev => ({ ...prev, destinationChain: e.target.value }))}
              className="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select destination chain</option>
              {SUPPORTED_CHAINS.map(chain => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Receiving Address */}
        <div>
          <input
            type="text"
            value={transferForm.receivingAddress}
            onChange={(e) => setTransferForm(prev => ({ ...prev, receivingAddress: e.target.value }))}
            placeholder="Please enter receiving address"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Estimated Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Estimated amount to be received
          </label>
          <div className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">{estimatedReceived}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{transferForm.selectedToken}</span>
            </div>
          </div>
        </div>

        {/* Transfer Fee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cross-chain transfer fee
          </label>
          <div className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">{transferFee}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{transferForm.selectedToken}</span>
            </div>
          </div>
          {contractInfo?.data && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Fee calculated using contract data (Base rate: {((contractInfo.data.feeRate || 0.001) * 100).toFixed(3)}%)
            </p>
          )}
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirmTransfer}
          disabled={!transferForm.amount || !transferForm.destinationChain || !transferForm.receivingAddress || isProcessing}
          className="w-full px-6 py-3 bg-teal-500 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            'Confirm transfer'
          )}
        </button>
      </div>

      {/* Transfer History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Transfer History</h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {isLoadingHistory ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Loading transfer history...</p>
                </div>
              ) : historyError ? (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-red-400 dark:text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 dark:text-red-400">{historyError}</p>
                  <button
                    onClick={loadTransferHistory}
                    className="mt-3 px-4 py-2 bg-teal-500 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700"
                  >
                    Retry
                  </button>
                </div>
              ) : transferHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Send className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No transfer history found</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Your transactions will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transferHistory.map(transfer => (
                    <div key={transfer.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{parseFloat(transfer.amount).toFixed(4)} {transfer.token}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {transfer.fromChain} → {transfer.toChain}
                          </span>
                          {transfer.operateType && (
                            <span className={`text-xs px-2 py-1 rounded ${
                              transfer.operateType === 2 ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                            }`}>
                              {transfer.operateType === 2 ? 'BURN' : 'STAKE'}
                            </span>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          transfer.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                          transfer.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                        }`}>
                          {transfer.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>To: {transfer.receivingAddress}</p>
                        <p>Fee: {parseFloat(transfer.fee).toFixed(4)} {transfer.token}</p>
                        <p>Date: {new Date(transfer.timestamp).toLocaleDateString()}</p>
                        {transfer.txHash && (
                          <p>
                            TX: 
                            <a 
                              href={`https://bscscan.com/tx/${transfer.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                            >
                              {transfer.txHash.slice(0, 10)}...
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64 space-y-2">
            <button
              onClick={() => setActiveTool('exchange')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTool === 'exchange'
                  ? 'bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Snowflake className="w-5 h-5" />
              <span>Luca exchange</span>
            </button>

            <button
              onClick={() => setActiveTool('bridge')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTool === 'bridge'
                  ? 'bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Network className="w-5 h-5" />
              <span>Cross-chain bridge</span>
            </button>

            <button
              onClick={() => setActiveTool('transfer')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTool === 'transfer'
                  ? 'bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Send className="w-5 h-5" />
              <span>ATM cross-chain transfer</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
            {activeTool === 'exchange' && renderExchangeContent()}
            {activeTool === 'bridge' && renderBridgeContent()}
            {activeTool === 'transfer' && renderTransferContent()}
          </div>
        </div>
      </div>
    </div>
  );
};