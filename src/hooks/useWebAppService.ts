import { useState, useCallback, useEffect } from 'react';
import {
  authService,
  withdrawalService,
  proposalService,
  connectionService,
  connectionCreationService,
  incomeService,
  gameService,
  webAPIService,
  encryptionService,
  authorizationService,
  recoveryPlanService,
  agfGameProposalService,
  linkConnectionService,
  crosschainService,
  // Types

  // Types
  type WithdrawalResult,
  type ProposalListResponse,
  type Proposal,
  type LinkConnection,
  type ConsensusConnection,
  type IncomeRecord,
  type WithdrawalRecord,
  type JoinATMFormData,
  type GameProposal,
  type Game,
  type GameRating,
  type GameInvestment,
  type BattleData,
  type UpdateBattleData,
  type UserStarsData,
  type NewsItem,
  type NewsListResponse,
  type OverviewData,
  type CoinCurrency,
  type PRNodeItem,
  type StakeTransactionItem,
  type ContractInfoItem,
  type RankingItem,
  type NFTProject,
  type NFTLinkConnection,
  type ContactFormData,
  type ApiResponse,
  type TokenInfo,
  type TokenApproval,
  type ContractSection,
  type AGFGameProposal,
  type AGFProposalResponse,
  type CrosschainTransferResult,
} from '../lib/webAppService';

/* ============================================================================
   BASE HOOK TYPES
   ============================================================================ */

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T, P = any> extends UseApiState<T> {
  execute: (params?: P) => Promise<T>;
  reset: () => void;
}

/* ============================================================================
   CORE HOOK UTILITIES
   ============================================================================ */

/**
 * Generic API call hook with loading, error, and data states
 */
export const useApiCall = <T = any, P = any>(
  apiFunction: (params: P) => Promise<T>
): UseApiReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (params?: P) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(params!);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

/**
 * Hook for API calls that auto-execute on mount or when dependencies change
 */
export const useApiQuery = <T = any, P = any>(
  apiFunction: (params: P) => Promise<T>,
  params?: P,
  dependencies: any[] = []
): UseApiState<T> & { refetch: () => Promise<T> } => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(params!);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, params]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

/* ============================================================================
   AUTHENTICATION HOOKS
   ============================================================================ */

/**
 * Hook for wallet authentication
 * @returns Authentication state and methods
 */
export const useAuth = () => {
  const [userAddress, setUserAddress] = useState<string | null>(
    authService.getUserAddress()
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );

  const setAddress = useCallback((address: string) => {
    authService.setUserAddress(address);
    setUserAddress(address);
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const authenticate = useApiCall(
    async (walletProvider: any) => {
      const token = await authService.authenticate(walletProvider);
      setIsAuthenticated(true);
      return token;
    }
  );

  const getToken = useCallback(
    async (walletProvider?: any, forceRefresh = false) => {
      return await authService.getToken(walletProvider, forceRefresh);
    },
    []
  );

  const logout = useCallback(() => {
    authService.clearAuth();
    setUserAddress(null);
    setIsAuthenticated(false);
  }, []);

  return {
    userAddress,
    isAuthenticated,
    setAddress,
    authenticate: authenticate.execute,
    authenticating: authenticate.loading,
    authError: authenticate.error,
    getToken,
    logout,
  };
};

/**
 * Hook for getting sign message
 */
export const useGetSignMessage = () => {
  return useApiCall(async () => {
    return await authService.getSignMessage();
  });
};

/**
 * Hook for signing message with wallet
 */
export const useSignMessage = () => {
  return useApiCall(
    async ({ message, walletProvider }: { message: string; walletProvider: any }) => {
      return await authService.signMessage(message, walletProvider);
    }
  );
};

/* ============================================================================
   WITHDRAWAL HOOKS
   ============================================================================ */

/**
 * Hook for getting withdrawal balance
 */
export const useWithdrawalBalance = (walletProvider?: any) => {
  return useApiCall(async () => {
    return await withdrawalService.getWithdrawalBalance(walletProvider);
  });
};

/**
 * Hook for LUCA withdrawal
 */
export const useWithdrawLUCA = () => {
  return useApiCall(
    async ({ amount, walletProvider }: { amount: number; walletProvider: any }) => {
      return await withdrawalService.withdrawLUCA(amount, walletProvider);
    }
  );
};

/**
 * Hook for clearing withdrawal balance cache
 */
export const useClearBalanceCache = () => {
  return useCallback(() => {
    withdrawalService.clearBalanceCache();
  }, []);
};

/* ============================================================================
   COMMUNITY PROPOSAL HOOKS
   ============================================================================ */

/**
 * Hook for getting proposals user participated in
 */
export const useMyParticipatedProposals = () => {
  return useApiCall(
    async ({
      status,
      searchKeys,
      pageIndex = 1,
      pageSize = 20,
      walletProvider,
    }: {
      status: string | number;
      searchKeys: string;
      pageIndex?: number;
      pageSize?: number;
      walletProvider?: any;
    }) => {
      return await proposalService.getMyPartList(
        status,
        searchKeys,
        pageIndex,
        pageSize,
        walletProvider
      );
    }
  );
};

/**
 * Hook for getting proposals user initiated
 */
export const useMyInitiatedProposals = () => {
  return useApiCall(
    async ({
      status,
      searchKeys,
      pageIndex = 1,
      pageSize = 20,
      walletProvider,
    }: {
      status: string | number;
      searchKeys: string;
      pageIndex?: number;
      pageSize?: number;
      walletProvider?: any;
    }) => {
      return await proposalService.getMyInitiateList(
        status,
        searchKeys,
        pageIndex,
        pageSize,
        walletProvider
      );
    }
  );
};

/**
 * Hook for withdrawing AGT from proposal
 */
export const useWithdrawAGT = () => {
  return useApiCall(
    async ({ keyIds, walletProvider }: { keyIds: string[]; walletProvider?: any }) => {
      return await proposalService.withdrawAGT(keyIds, walletProvider);
    }
  );
};

/**
 * Hook for creating community proposal
 */
export const useCreateCommunityProposal = () => {
  return useApiCall(
    async ({ proposalData, walletProvider }: { proposalData: any; walletProvider?: any }) => {
      return await proposalService.createCommunityProposal(proposalData, walletProvider);
    }
  );
};

/**
 * Hook for getting proposal status text
 */
export const useProposalStatusText = () => {
  return useCallback((status: number, typeOfProposal?: string) => {
    return proposalService.getStatusText(status, typeOfProposal);
  }, []);
};

/* ============================================================================
   CONSENSUS CONNECTION HOOKS
   ============================================================================ */

/**
 * Hook for getting user connection links
 */
export const useConnectionLinks = () => {
  return useApiCall(
    async ({
      linkStatus,
      userWalletAddress,
      chainId,
      walletProvider,
    }: {
      linkStatus: number;
      userWalletAddress?: string;
      chainId?: string;
      walletProvider?: any;
    }) => {
      return await connectionService.getLinkList(
        linkStatus,
        userWalletAddress,
        chainId,
        walletProvider
      );
    }
  );
};

/**
 * Hook for getting pledgeable consensus connections
 */
export const usePledgeableConnections = () => {
  return useApiCall(async (walletProvider?: any) => {
    return await connectionService.getPledgeableList(walletProvider);
  });
};

/**
 * Hook for updating pledge status
 */
export const useUpdatePledgeStatus = () => {
  return useApiCall(
    async ({
      connectionId,
      nodeAddress,
      action,
      walletProvider,
    }: {
      connectionId: number;
      nodeAddress: string;
      action: 'pledge' | 'depledge';
      walletProvider?: any;
    }) => {
      return await connectionService.updatePledgeStatus(
        connectionId,
        nodeAddress,
        action,
        walletProvider
      );
    }
  );
};

/* ============================================================================
   CONNECTION CREATION HOOKS
   ============================================================================ */

export const useCheckNetworkMatch = () => {
  return useApiCall(
    async ({ selectedChainId, walletProvider }: { selectedChainId: number; walletProvider: any }) => {
      return await connectionCreationService.checkNetworkMatch(selectedChainId, walletProvider);
    }
  );
};

export const useCheckAllowance = () => {
  return useApiCall(
    async ({
      currency,
      approveAddress,
      amountBase,
      currencyList,
      walletProvider
    }: {
      currency: string;
      approveAddress: string;
      amountBase: bigint;
      currencyList: CoinCurrency[];
      walletProvider: any;
    }) => {
      return await connectionCreationService.isAllowanceV2(
        currency,
        approveAddress,
        amountBase,
        currencyList,
        walletProvider
      );
    }
  );
};

export const useApproveToken = () => {
  return useApiCall(
    async ({
      currency,
      contractForApproval,
      amount,
      currencyList,
      walletProvider
    }: {
      currency: string;
      contractForApproval: string;
      amount: number;
      currencyList: CoinCurrency[];
      walletProvider: any;
    }) => {
      return await connectionCreationService.approveSpend(
        currency,
        contractForApproval,
        amount,
        currencyList,
        walletProvider
      );
    }
  );
};

export const useCheckNFTApproval = () => {
  return useApiCall(
    async ({
      tokenId,
      nftAddress,
      factoryAddress,
      walletProvider
    }: {
      tokenId: string;
      nftAddress: string;
      factoryAddress: string;
      walletProvider: any;
    }) => {
      return await connectionCreationService.checkNFTApproval(
        tokenId,
        nftAddress,
        factoryAddress,
        walletProvider
      );
    }
  );
};

export const useApproveNFT = () => {
  return useApiCall(
    async ({
      tokenId,
      nftAddress,
      factoryAddress,
      walletProvider
    }: {
      tokenId: string;
      nftAddress: string;
      factoryAddress: string;
      walletProvider: any;
    }) => {
      return await connectionCreationService.approveNFT(
        tokenId,
        nftAddress,
        factoryAddress,
        walletProvider
      );
    }
  );
};

export const useCheckNFTOwnership = () => {
  return useApiCall(
    async ({
      tokenId,
      nftAddress,
      walletProvider
    }: {
      tokenId: string;
      nftAddress: string;
      walletProvider: any;
    }) => {
      return await connectionCreationService.checkNFTOwnership(
        tokenId,
        nftAddress,
        walletProvider
      );
    }
  );
};

export const useCreateTokenConnection = () => {
  return useApiCall(
    async ({
      toAddress,
      tokenSymbol,
      totalAmount,
      percentA,
      lockupDays,
      factoryAddress,
      walletProvider
    }: {
      toAddress: string;
      tokenSymbol: string;  // Changed from tokenGateway
      totalAmount: bigint;  // Changed from myAmount
      percentA: number;     // Changed from otherAmount
      lockupDays: number;
      factoryAddress: string;
      walletProvider: any;
    }) => {
      return await connectionCreationService.createTokenConnection(
        toAddress,
        tokenSymbol,
        totalAmount,
        percentA,
        lockupDays,
        factoryAddress,
        walletProvider
      );
    }
  );
};

export const useCreateNFTConnection = () => {
  return useApiCall(
    async ({
      nftAddress,
      toAddress,
      tokenList,
      lockupDays,
      factoryAddress,
      walletProvider
    }: {
      nftAddress: string;
      toAddress: string;
      tokenList: string[];
      lockupDays: number;
      factoryAddress: string;
      walletProvider: any;
    }) => {
      return await connectionCreationService.createNFTConnection(
        nftAddress,
        toAddress,
        tokenList,
        lockupDays,
        factoryAddress,
        walletProvider
      );
    }
  );
};

/* ============================================================================
   INCOME HOOKS
   ============================================================================ */


/**
 * Hook for getting Validating Address
 */

export const useValidateAddress = () => {
  return {
    execute: (address: string) => {
      return connectionCreationService.validateAddress(address);
    }
  };
};

/**
 * Hook for getting income history
 */
export const useIncomeHistory = () => {
  return useApiCall(
    async ({ startTimestamps, endTimestamps }: { startTimestamps?: number; endTimestamps?: number }) => {
      return await incomeService.getIncomeHistory(startTimestamps, endTimestamps);
    }
  );
};

/**
 * Hook for getting all income history
 */
export const useAllIncomeHistory = () => {
  return useApiCall(async () => {
    return await incomeService.getAllIncomeHistory();
  });
};

/**
 * Hook for getting withdrawal history
 */
export const useWithdrawalHistory = () => {
  return useApiCall(
    async ({ startTimestamps, endTimestamps }: { startTimestamps?: number; endTimestamps?: number }) => {
      return await incomeService.getWithdrawalHistory(startTimestamps, endTimestamps);
    }
  );
};

/**
 * Hook for getting all withdrawal history
 */
export const useAllWithdrawalHistory = () => {
  return useApiCall(async () => {
    return await incomeService.getAllWithdrawalHistory();
  });
};

/**
 * Hook for getting recent income history
 */
export const useRecentIncomeHistory = () => {
  return useApiCall(async (days: number = 20) => {
    return await incomeService.getRecentIncomeHistory(days);
  });
};

/**
 * Hook for getting paginated income history
 */
export const usePaginatedIncomeHistory = () => {
  return useApiCall(
    async ({ offset = 0, limit = 20 }: { offset?: number; limit?: number }) => {
      return await incomeService.getIncomeHistoryPaginated(offset, limit);
    }
  );
};

/**
 * Hook for getting recent withdrawal history
 */
export const useRecentWithdrawalHistory = () => {
  return useApiCall(async (days: number = 30) => {
    return await incomeService.getRecentWithdrawalHistory(days);
  });
};

/**
 * Hook for clearing income cache
 */
export const useClearIncomeCache = () => {
  return useCallback(() => {
    incomeService.clearCache();
  }, []);
};

/* ============================================================================
   GAME HOOKS
   ============================================================================ */

/**
 * Hook for creating game proposal
 */
// export const useCreateGameProposal = () => {
//   return useApiCall(async (data: Partial<GameProposal>) => {
//     return await gameService.createProposal(data);
//   });
// };

/**
 * Hook for updating game proposal
 */
// export const useUpdateGameProposal = () => {
//   return useApiCall(async (data: Partial<GameProposal>) => {
//     return await gameService.updateProposal(data);
//   });
// };

/**
 * Hook for getting proposal by user ID
 */
export const useGetProposalByUserId = () => {
  return useApiCall(async () => {
    return await gameService.getProposalByUserId();
  });
};

/**
 * Hook for getting admin proposals
 */
export const useGetAdminProposal = () => {
  return useApiCall(async () => {
    return await gameService.getAdminProposal();
  });
};

/**
 * Hook for updating proposal by admin
 */
export const useUpdateProposalByAdmin = () => {
  return useApiCall(async (dataObject: any) => {
    return await gameService.updateProposalByAdmin(dataObject);
  });
};

/**
 * Hook for getting all games
 */
export const useGetAllGames = () => {
  return useApiCall(async () => {
    return await gameService.getAllGame();
  });
};

/**
 * Hook for getting game by ID
 */
export const useGetGameById = () => {
  return useApiCall(async (gameId: string) => {
    return await gameService.getGameById(gameId);
  });
};

/**
 * Hook for game rating
 */
export const useGameRating = () => {
  return useApiCall(async (dataObject: GameRating) => {
    return await gameService.gameRating(dataObject);
  });
};

/**
 * Hook for game contribution/investment
 */
export const useGameContributed = () => {
  return useApiCall(async (dataObject: GameInvestment) => {
    return await gameService.gameContributed(dataObject);
  });
};

/**
 * Hook for creating battle
 */
export const useCreateBattle = () => {
  return useApiCall(async (data: BattleData) => {
    return await gameService.createBattle(data);
  });
};

/**
 * Hook for updating battle
 */
export const useUpdateBattle = () => {
  return useApiCall(async (data: UpdateBattleData) => {
    return await gameService.updateBattle(data);
  });
};

/**
 * Hook for getting stars
 */
export const useGetStars = () => {
  return useApiCall(async (data: UserStarsData) => {
    return await gameService.getStars(data);
  });
};

/**
 * Hook for submitting Join ATM application
 */
export const useSubmitJoinATM = () => {
  return useApiCall(
    async ({ formData, errorText }: { formData: JoinATMFormData; errorText?: string }) => {
      return await gameService.submitJoinATMApplication(formData, errorText);
    }
  );
};

/* ============================================================================
   WEB API HOOKS (News, Rankings, etc.)
   ============================================================================ */

/**
 * Hook for fetching news list
 */
export const useFetchNewsList = () => {
  return useApiCall(
    async ({
      pageIndex = 1,
      pageSize = 10,
      type = '',
    }: {
      pageIndex?: number;
      pageSize?: number;
      type?: string;
    }) => {
      return await webAPIService.fetchNewsList(pageIndex, pageSize, type);
    }
  );
};

/**
 * Hook for getting news detail
 */
export const useGetNewsDetail = () => {
  return useApiCall(async (newsId: string) => {
    return await webAPIService.getNewsDetail(newsId);
  });
};

/**
 * Hook for fetching PR nodes
 */
export const useFetchPRNodes = () => {
  return useApiCall(async () => {
    return await webAPIService.fetchPRNodes();
  });
};

/**
 * Hook for fetching stake transactions
 */
export const useFetchStakeTransactions = () => {
  return useApiCall(async () => {
    return await webAPIService.fetchStakeTransactions();
  });
};

/**
 * Hook for fetching stake transactions with parameters
 */
export const useFetchStakeTransactionsWithParams = () => {
  return useApiCall(
    async ({
      pageIndex = 1,
      pageSize = 10,
      chainId,
      searchKey,
      searchType,
      walletProvider,
    }: {
      pageIndex?: number;
      pageSize?: number;
      chainId?: string;
      searchKey?: string;
      searchType?: string;
      walletProvider?: any;
    }) => {
      return await webAPIService.fetchStakeTransactionsWithParams(
        pageIndex,
        pageSize,
        chainId,
        searchKey,
        searchType,
        walletProvider
      );
    }
  );
};

/**
 * Hook for getting contract info
 */
export const useGetContractInfo = () => {
  return useApiCall(
    async ({ walletProvider }: { walletProvider?: any } = {}) => {
      return await webAPIService.getContractInfo(walletProvider);
    }
  );
};

/**
 * Hook for fetching PR nodes with pagination
 */
export const useFetchPRNodesPaginated = () => {
  return useApiCall(
    async (params: {
      pageNo: number;
      pageSize?: number;
      searchKey?: string;
      searchType?: string;
    }) => {
      return await webAPIService.fetchPRNodesPaginated(
        params.pageNo,
        params.pageSize,
        params.searchKey,
        params.searchType
      );
    }
  );
};

/**
 * Hook for fetching stake transactions with pagination
 */
export const useFetchStakeTransactionsPaginated = () => {
  return useApiCall(
    async (params: {
      pageNo: number;
      pageSize?: number;
      chainId?: string | null;
      searchKey?: string;
      searchType?: string;
    }) => {
      return await webAPIService.fetchStakeTransactionsPaginated(
        params.pageNo,
        params.pageSize,
        params.chainId,
        params.searchKey,
        params.searchType
      );
    }
  );
};

/**
 * Hook for fetching user treaty list
 */
export const useFetchUserTreatyList = () => {
  return useApiCall(
    async (params: {
      ledgeAddress: string;
      chainId?: string;
      pageIndex: number;
      pageSize?: number;
      type: number;
    }) => {
      return await webAPIService.fetchUserTreatyList(params);
    }
  );
};


/**
 * Hook for fetching burn total data
 */
export const useFetchBurnTotal = () => {
  return useApiCall(
    async (params: {
      pageNo?: number;
      pageIndex?: number;
      pageSize?: number;
    }) => {
      return await webAPIService.fetchBurnTotal(
        params.pageNo,
        params.pageIndex,
        params.pageSize
      );
    }
  );
};

/**
 * Hook for getting overview data
 */
export const useGetOverview = () => {
  return useApiCall(async () => {
    return await webAPIService.getOverview();
  });
};

/**
 * Hook for getting currency list
 */
export const useGetCurrencyList = () => {
  return useApiCall(async () => {
    return await webAPIService.getCurrencyList();
  });
};

/**
 * Hook for email subscription
 */
export const useSubscribe = () => {
  return useApiCall(async (email: string) => {
    return await webAPIService.subscribe(email);
  });
};

/**
 * Hook for getting initiate list
 */
export const useGetInitiateList = () => {
  return useApiCall(async () => {
    return await webAPIService.getInitiateList();
  });
};

/**
 * Hook for sending contact mail
 */
export const useSendContactMail = () => {
  return useApiCall(
    async ({ formData, token }: { formData: ContactFormData; token: string }) => {
      return await webAPIService.sendContactMail(formData, token);
    }
  );
};

/**
 * Hook for getting NFT project list
 */
export const useGetNFTProjectList = () => {
  return useApiCall(async () => {
    return await webAPIService.getNFTProjectList();
  });
};


/**
 * Hook for getting user PR coin list
 */
export const useGetUserPRCoinList = () => {
  return useApiCall(
    async ({ walletProvider }: { walletProvider?: any } = {}) => {
      return await webAPIService.getUserPRCoinList(walletProvider);
    }
  );
};

/**
 * Hook for getting user PR curve
 */
export const useGetUserPRCurve = () => {
  return useApiCall(
    async ({ networkType, walletProvider }: { networkType: string; walletProvider?: any }) => {
      return await webAPIService.getUserPRCurve(networkType, walletProvider);
    }
  );
};

/**
 * Hook for getting user AGT record
 */
export const useGetUserAGTRecord = () => {
  return useApiCall(
    async ({ pageNo = 1, pageSize = 20, walletProvider }: { pageNo?: number; pageSize?: number; walletProvider?: any } = {}) => {
      return await webAPIService.getUserAGTRecord(pageNo, pageSize, walletProvider);
    }
  );
};

/**
 * Hook for getting NFT link list
 */
export const useGetNFTLinkList = () => {
  return useApiCall(
    async (params: {
      userWalletAddress?: string;
      linkStatus: number;
      pageIndex?: number;
      pageSize?: number;
      chainId?: string;
    }) => {
      return await webAPIService.getNFTLinkList(params);
    }
  );
};

/**
 * Hook for getting NFT link by ID
 */
export const useGetNFTLinkById = () => {
  return useApiCall(async (id: number) => {
    return await webAPIService.getNFTLinkById(id);
  });
};

/**
 * Hook for getting NFT metadata
 */
export const useGetNFTMetadata = () => {
  return useApiCall(
    async ({ nftAddress, tokenId }: { nftAddress: string; tokenId: string }) => {
      return await webAPIService.getNFTMetadata(nftAddress, tokenId);
    }
  );
};

/* ============================================================================
   UTILITY HOOKS
   ============================================================================ */

/**
 * Hook for encryption operations
 */
export const useEncryption = () => {
  const encryptData = useCallback(async (data: any) => {
    return await encryptionService.encryptData(data);
  }, []);

  const decryptData = useCallback(async (encrypted: string) => {
    return await encryptionService.decryptData(encrypted);
  }, []);

  const setCache = useCallback(async (key: string, data: any, ttl?: number) => {
    return await encryptionService.setCache(key, data, ttl);
  }, []);

  const getCache = useCallback(async (key: string) => {
    return await encryptionService.getCache(key);
  }, []);

  const clearCache = useCallback((key?: string) => {
    encryptionService.clearCache(key);
  }, []);

  return {
    encryptData,
    decryptData,
    setCache,
    getCache,
    clearCache,
  };
};

/**
 * Hook for showing default image if news image is empty
 */
export const useNewsImageHelper = () => {
  return useCallback((news: NewsItem) => {
    webAPIService.showDefaultImageIfEmpty(news);
  }, []);
};

/* ============================================================================
   COMPOSITE HOOKS (Combining Multiple Operations)
   ============================================================================ */

/**
 * Hook for complete withdrawal flow
 * Handles balance check, signature collection, and withdrawal execution
 */
export const useCompleteWithdrawal = () => {
  const [step, setStep] = useState<'idle' | 'checking' | 'collecting' | 'executing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const balanceHook = useWithdrawalBalance();
  const withdrawHook = useWithdrawLUCA();

  const execute = useCallback(
    async (amount: number, walletProvider: any) => {
      try {
        setStep('checking');
        setProgress(10);

        const balance = await balanceHook.execute();

        if (balance < amount) {
          throw new Error(`Insufficient balance. Available: ${balance} LUCA`);
        }

        setStep('collecting');
        setProgress(30);

        setStep('executing');
        setProgress(60);

        const result = await withdrawHook.execute({ amount, walletProvider });

        setProgress(100);
        setStep('success');

        return result;
      } catch (error: any) {
        setStep('error');
        throw error;
      }
    },
    [balanceHook, withdrawHook]
  );

  const reset = useCallback(() => {
    setStep('idle');
    setProgress(0);
    balanceHook.reset();
    withdrawHook.reset();
  }, [balanceHook, withdrawHook]);

  return {
    execute,
    reset,
    step,
    progress,
    loading: balanceHook.loading || withdrawHook.loading,
    error: balanceHook.error || withdrawHook.error,
  };
};

/**
 * Hook for managing proposal lifecycle
 * Handles fetching, creating, updating proposals
 */
export const useProposalManager = () => {
  const fetchParticipated = useMyParticipatedProposals();
  const fetchInitiated = useMyInitiatedProposals();
  const createProposal = useCreateGameProposal();
  const updateProposal = useUpdateGameProposal();

  return {
    participated: {
      data: fetchParticipated.data,
      loading: fetchParticipated.loading,
      error: fetchParticipated.error,
      fetch: fetchParticipated.execute,
    },
    initiated: {
      data: fetchInitiated.data,
      loading: fetchInitiated.loading,
      error: fetchInitiated.error,
      fetch: fetchInitiated.execute,
    },
    create: {
      loading: createProposal.loading,
      error: createProposal.error,
      execute: createProposal.execute,
    },
    update: {
      loading: updateProposal.loading,
      error: updateProposal.error,
      execute: updateProposal.execute,
    },
  };
};

/**
 * Hook for managing consensus connections
 * Handles fetching, pledging, and updating connections
 */
export const useConnectionManager = () => {
  const fetchLinks = useConnectionLinks();
  const fetchPledgeable = usePledgeableConnections();
  const updatePledge = useUpdatePledgeStatus();

  return {
    links: {
      data: fetchLinks.data,
      loading: fetchLinks.loading,
      error: fetchLinks.error,
      fetch: fetchLinks.execute,
    },
    pledgeable: {
      data: fetchPledgeable.data,
      loading: fetchPledgeable.loading,
      error: fetchPledgeable.error,
      fetch: fetchPledgeable.execute,
    },
    updatePledge: {
      loading: updatePledge.loading,
      error: updatePledge.error,
      execute: updatePledge.execute,
    },
  };
};

/* ============================================================================
   AUTHORIZATION MANAGEMENT HOOKS
   ============================================================================ */

/**
 * Hook for loading token approvals
 */
export const useLoadApprovals = () => {
  return useApiCall(
    async ({ address, contracts, walletProvider, chainId }: {
      address: string;
      contracts: any;
      walletProvider: any;
      chainId: number
    }) => {
      return await authorizationService.loadApprovals(address, contracts, walletProvider, chainId);
    }
  );
};

/**
 * Hook for revoking approval
 */
export const useRevokeApproval = () => {
  return useApiCall(
    async ({ tokenAddress, spenderAddress, walletProvider, address }: {
      tokenAddress: string;
      spenderAddress: string;
      walletProvider: any;
      address: string
    }) => {
      return await authorizationService.revokeApproval(tokenAddress, spenderAddress, walletProvider, address);
    }
  );
};

/**
 * Hook for getting token list
 */
export const useGetTokenList = () => {
  return useCallback((chainId: number) => {
    return authorizationService.getTokenList(chainId);
  }, []);
};

/* ============================================================================
   RECOVERY PLAN HOOKS
   ============================================================================ */

/**
 * Hook for getting recovery pot balance
 */
export const useGetRecoveryPotBalance = () => {
  return useApiCall(
    async (chainId: number) => {
      return await recoveryPlanService.getRecoveryPotBalance(chainId);
    }
  );
};

/**
 * Hook for getting recovery transactions
 */
export const useGetRecoveryTransactions = () => {
  return useApiCall(
    async ({ userAddress, chainId }: { userAddress: string; chainId: number }) => {
      return await recoveryPlanService.getRecoveryTransactions(userAddress, chainId);
    }
  );
};

/* ============================================================================
   AGF GAME PROPOSAL HOOKS
   ============================================================================ */

/**
 * Hook for getting user's game proposals
 */
export const useGetUserGameProposals = () => {
  return useApiCall(
    async () => {
      return await agfGameProposalService.getProposalByUserId();
    }
  );
};

/**
 * Hook for getting all game proposals (admin only)
 */
export const useGetAdminGameProposals = () => {
  return useApiCall(
    async () => {
      return await agfGameProposalService.getAdminProposal();
    }
  );
};

/**
 * Hook for creating a new game proposal
 */
export const useCreateGameProposal = () => {
  return useApiCall(
    async (proposalData: any) => {
      return await agfGameProposalService.createProposal(proposalData);
    }
  );
};

/**
 * Hook for updating an existing game proposal
 */
export const useUpdateGameProposal = () => {
  return useApiCall(
    async (proposalData: any) => {
      return await agfGameProposalService.updateProposal(proposalData);
    }
  );
};

/**
 * Hook for updating proposal status (admin only)
 */
export const useUpdateGameProposalByAdmin = () => {
  return useApiCall(
    async (updateData: any) => {
      return await agfGameProposalService.updateProposalByAdmin(updateData);
    }
  );
};

/**
 * Hook for unwrapping AGF proposal data
 */
export const useUnwrapAGFProposal = () => {
  return {
    execute: (proposal: AGFGameProposal) => {
      agfGameProposalService.unwrapAGFProposal(proposal);
    }
  };
};

/**
 * Hook for wrapping AGF proposal data
 */
export const useWrapAGFProposal = () => {
  return {
    execute: (isEdit: boolean = false) => {
      return agfGameProposalService.wrapAGFProposal(isEdit);
    }
  };
};

/**
 * Hook for clearing AGF proposal data
 */
export const useClearProposalData = () => {
  return {
    execute: () => {
      agfGameProposalService.clearProposalData();
    }
  };
};

/* ============================================================================
   LINK CONNECTION HOOKS
   ============================================================================ */

/**
 * Hook for fetching connection details by ID
 */
export const useFetchConnectionById = () => {
  return useApiCall(
    async ({ id, isNFT }: { id: string; isNFT: boolean }) => {
      return await linkConnectionService.fetchConnectionById(id, isNFT);
    }
  );
};

/**
 * Hook for fetching NFT metadata
 */
export const useFetchNFTMetadata = () => {
  return useApiCall(
    async ({ nftAddress, tokenId }: { nftAddress: string; tokenId: string }) => {
      return await linkConnectionService.fetchNFTMetadata(nftAddress, tokenId);
    }
  );
};

/**
 * Hook for agreeing to connection
 */
export const useAgreeConnection = () => {
  return useApiCall(
    async ({
      linkAddress,
      tokenId,
      walletProvider
    }: {
      linkAddress: string;
      tokenId?: string;
      walletProvider: any
    }) => {
      return await linkConnectionService.agreeConnection(linkAddress, tokenId, walletProvider);
    }
  );
};

/**
 * Hook for canceling connection
 */
export const useCancelConnection = () => {
  return useApiCall(
    async ({ linkAddress, walletProvider }: { linkAddress: string; walletProvider: any }) => {
      return await linkConnectionService.cancelConnection(linkAddress, walletProvider);
    }
  );
};

/**
 * Hook for rejecting connection
 */
export const useRejectConnection = () => {
  return useApiCall(
    async ({ linkAddress, walletProvider }: { linkAddress: string; walletProvider: any }) => {
      return await linkConnectionService.rejectConnection(linkAddress, walletProvider);
    }
  );
};

/**
 * Hook for closing/redeeming connection
 */
export const useCloseConnection = () => {
  return useApiCall(
    async ({ linkAddress, walletProvider }: { linkAddress: string; walletProvider: any }) => {
      return await linkConnectionService.closeConnection(linkAddress, walletProvider);
    }
  );
};

/**
 * Hook for executing cross-chain token transfer
 */
export const useExecuteCrosschainTransfer = () => {
  return useApiCall(
    async (params: {
      amount: string;
      destinationChain: string;
      receivingAddress: string;
      selectedToken: string;
      crosschainAddress: string;
      tokenAddress: string;
      userAddress: string;
      walletProvider: any;
    }) => {
      return await crosschainService.executeCrosschainTransfer(params);
    }
  );
};


/* ============================================================================
   EXPORTS
   ============================================================================ */

// Export all hooks
export default {
  // Core utilities
  useApiCall,
  useApiQuery,

  // Authentication
  useAuth,
  useGetSignMessage,
  useSignMessage,

  // Withdrawal
  useWithdrawalBalance,
  useWithdrawLUCA,
  useClearBalanceCache,
  useCompleteWithdrawal,

  // Community Proposals
  useMyParticipatedProposals,
  useMyInitiatedProposals,
  useWithdrawAGT,
  useProposalStatusText,
  useCreateCommunityProposal,

  // Consensus Connections
  useConnectionLinks,
  usePledgeableConnections,
  useUpdatePledgeStatus,
  useConnectionManager,

  // Create Connections
  useCheckNetworkMatch,
  useCheckAllowance,
  useApproveToken,
  useCheckNFTApproval,
  useApproveNFT,
  useCheckNFTOwnership,
  useCreateTokenConnection,
  useCreateNFTConnection,

  // Income
  useIncomeHistory,
  useAllIncomeHistory,
  useWithdrawalHistory,
  useAllWithdrawalHistory,
  useRecentIncomeHistory,
  usePaginatedIncomeHistory,
  useRecentWithdrawalHistory,
  useClearIncomeCache,
  useValidateAddress,

  // Authorization
  useLoadApprovals,
  useRevokeApproval,
  useGetTokenList,

  // Recovery Plan
  useGetRecoveryPotBalance,
  useGetRecoveryTransactions,

  // Link Connections
  useFetchConnectionById,
  useFetchNFTMetadata,
  useAgreeConnection,
  useCancelConnection,
  useRejectConnection,
  useCloseConnection,

  // Crosschain
  useExecuteCrosschainTransfer,

  // AGF Game Proposals
  useGetUserGameProposals,
  useGetAdminGameProposals,
  useCreateGameProposal,
  useUpdateGameProposal,
  useUpdateGameProposalByAdmin,
  useUnwrapAGFProposal,
  useWrapAGFProposal,
  useClearProposalData,

  // Games
  useGetProposalByUserId,
  useGetAdminProposal,
  useFetchBurnTotal,
  useUpdateProposalByAdmin,
  useGetAllGames,
  useGetGameById,
  useGameRating,
  useGameContributed,
  useCreateBattle,
  useUpdateBattle,
  useGetStars,
  useSubmitJoinATM,
  useProposalManager,

  // Web API
  useFetchNewsList,
  useGetNewsDetail,
  useFetchPRNodes,
  useFetchStakeTransactions,
  useFetchPRNodesPaginated,
  useFetchStakeTransactionsPaginated,
  useFetchUserTreatyList,
  useGetOverview,
  useGetCurrencyList,
  useSubscribe,
  useGetInitiateList,
  useSendContactMail,
  useGetNFTProjectList,
  useGetNFTLinkList,
  useGetNFTLinkById,
  useGetNFTMetadata,

  // Utilities
  useEncryption,
  useNewsImageHelper,
};

// Re-export all types so components can import them from the hooks file
export type {
  WithdrawalResult,
  ProposalListResponse,
  Proposal,
  LinkConnection,
  ConsensusConnection,
  IncomeRecord,
  WithdrawalRecord,
  JoinATMFormData,
  GameProposal,
  Game,
  GameRating,
  GameInvestment,
  BattleData,
  UpdateBattleData,
  UserStarsData,
  NewsItem,
  NewsListResponse,
  OverviewData,
  CoinCurrency,
  PRNodeItem,
  StakeTransactionItem,
  ContractInfoItem,
  RankingItem,
  NFTProject,
  NFTLinkConnection,
  ContactFormData,
  ApiResponse,
  TokenInfo,
  TokenApproval,
  ContractSection,
  RecoveryTransaction,
  AGFGameProposal,
  AGFProposalResponse,
  CrosschainTransferResult,
} from '../lib/webAppService';