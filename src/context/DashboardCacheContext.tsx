import React, { createContext, useContext, useCallback, useState, useRef, type ReactNode } from 'react';
import {
  webAPIService,
  connectionService,
  incomeService,
} from '@/lib/webAppService';
import { authService } from '@/lib/webAppService';
import type { OverviewData, IncomeRecord, WithdrawalRecord } from '@/lib/webAppService';

/* ============================================================================
   TYPES
   ============================================================================ */

interface TokenRowData {
  icon: string;
  symbol: string;
  name: string;
  balance: string;
  balanceUsd: string;
  price: string;
  change24h: number;
  isDefault?: boolean;
}

interface PortfolioData {
  overview: OverviewData | null;
  userBalance: string;
  prValue: string;
  atmStars: number;
  agtBalance: number;
  tokens: TokenRowData[];
  lockedMine: number;
  lockedOthers: number;
  activeConns: number;
  pendingConns: number;
  inactiveConns: number;
  totalConnections: number;
  userName: string;
}

interface IncomeData {
  incomeRecords: IncomeRecord[];
  withdrawalRecords: WithdrawalRecord[];
}

interface DashboardCacheContextType {
  // Portfolio cache
  portfolioData: PortfolioData | null;
  portfolioLoading: boolean;
  portfolioError: string | null;
  fetchPortfolioData: (walletProvider: any, getUserBalance: () => Promise<string>) => Promise<void>;
  updateUserName: (name: string) => void;
  invalidatePortfolio: () => void;

  // Income cache
  incomeData: IncomeData | null;
  incomeLoading: boolean;
  incomeError: string | null;
  fetchIncomeData: () => Promise<void>;
  invalidateIncome: () => void;

  // Imported tokens (persist across navigations)
  importedTokens: TokenRowData[];
  setImportedTokens: React.Dispatch<React.SetStateAction<TokenRowData[]>>;
}

const DashboardCacheContext = createContext<DashboardCacheContextType | undefined>(undefined);

/* ============================================================================
   CACHE TTL CONFIG (ms)
   ============================================================================ */

const PORTFOLIO_CACHE_TTL = 60_000;  // 60 seconds
const INCOME_CACHE_TTL = 60_000;     // 60 seconds

/* ============================================================================
   PROVIDER
   ============================================================================ */

export const DashboardCacheProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ── Portfolio state ──
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const portfolioFetchedAt = useRef<number>(0);
  const portfolioFetching = useRef(false);

  // ── Income state ──
  const [incomeData, setIncomeData] = useState<IncomeData | null>(null);
  const [incomeLoading, setIncomeLoading] = useState(false);
  const [incomeError, setIncomeError] = useState<string | null>(null);
  const incomeFetchedAt = useRef<number>(0);
  const incomeFetching = useRef(false);

  // ── Imported tokens (persists across tab switches) ──
  const [importedTokens, setImportedTokens] = useState<TokenRowData[]>([]);

  // ── Portfolio fetch ──
  const fetchPortfolioData = useCallback(async (walletProvider: any, getUserBalance: () => Promise<string>) => {
    // Return cached if still fresh
    const now = Date.now();
    if (portfolioData && (now - portfolioFetchedAt.current) < PORTFOLIO_CACHE_TTL) {
      return;
    }

    // Prevent concurrent fetches
    if (portfolioFetching.current) return;
    portfolioFetching.current = true;

    setPortfolioLoading(true);
    setPortfolioError(null);

    try {
      // Fetch overview
      let overviewData: OverviewData | null = null;
      try {
        overviewData = await webAPIService.getOverview();
      } catch {
        // Non-critical
      }

      // Fetch PR coin list
      let prData: any = null;
      try {
        prData = await webAPIService.getUserPRCoinList(walletProvider);
      } catch {
        // Non-critical
      }

      let userBalance = '0.0000';
      let prValue = '0.00';
      let atmStars = 0;
      let userName = 'User';
      let tokens: TokenRowData[] = [];
      let lockedMine = 0;
      let lockedOthers = 0;

      if (prData) {
        const prTotal = prData.prCoinList?.reduce(
          (sum: number, coin: any) => sum + (coin.nowPr || 0),
          0
        ) || 0;
        prValue = prTotal.toFixed(2);
        atmStars = prData.star || 0;
        userName = prData.nickName || 'User';

        if (prData.prCoinList && Array.isArray(prData.prCoinList)) {
          tokens = prData.prCoinList.map((coin: any) => ({
            icon: coin.currencyLogo || `/img/currency/${coin.currencyKey?.toLowerCase()}.png`,
            symbol: coin.currencyKey || 'Unknown',
            name: coin.currencyName || coin.currencyKey || 'Unknown',
            balance: (coin.amount || 0).toFixed(2),
            balanceUsd: ((coin.amount || 0) * (coin.nowPrice || 0)).toFixed(2),
            price: (coin.nowPrice || 0).toFixed(2),
            change24h: coin.priceChange24h || 0,
            isDefault: true,
          }));

          const lucaCoin = prData.prCoinList.find(
            (c: any) => c.currencyKey === 'LUCA' || c.currencyName === 'LUCA'
          );
          if (lucaCoin) {
            userBalance = (lucaCoin.amount || 0).toFixed(2);
          }

          const myLocked = prData.prCoinList.reduce(
            (sum: number, c: any) => sum + (c.lockAmount || 0),
            0
          );
          lockedMine = myLocked;
          lockedOthers = (overviewData?.contractTotalAmount || 0) - myLocked;
        }
      }

      // Try on-chain balance
      try {
        const onChainBalance = await getUserBalance();
        if (onChainBalance && onChainBalance !== '0.0000') {
          userBalance = onChainBalance;
        }
      } catch {
        // Use API balance
      }

      // Fetch AGT
      let agtBalance = 0;
      try {
        const agtData = await webAPIService.getUserAGTRecord(1, 20, walletProvider);
        if (agtData) {
          agtBalance = agtData.agtTotal || 0;
        }
      } catch {
        // Non-critical
      }

      // Fetch connections
      let activeConns = 0;
      let pendingConns = 0;
      let inactiveConns = 0;
      try {
        const activeData = await connectionService.getLinkList(2, undefined, undefined, walletProvider);
        activeConns = activeData?.linkList?.length || 0;

        const pendingData = await connectionService.getLinkList(1, undefined, undefined, walletProvider);
        pendingConns = pendingData?.linkList?.length || 0;

        const closedData = await connectionService.getLinkList(3, undefined, undefined, walletProvider);
        inactiveConns = closedData?.linkList?.length || 0;
      } catch {
        // Non-critical
      }

      const result: PortfolioData = {
        overview: overviewData,
        userBalance,
        prValue,
        atmStars,
        agtBalance,
        tokens,
        lockedMine,
        lockedOthers,
        activeConns,
        pendingConns,
        inactiveConns,
        totalConnections: activeConns + pendingConns + inactiveConns,
        userName,
      };

      setPortfolioData(result);
      portfolioFetchedAt.current = Date.now();
    } catch (error: any) {
      console.error('Portfolio data fetch error:', error);
      setPortfolioError(error?.message || 'Failed to load portfolio data');
    } finally {
      setPortfolioLoading(false);
      portfolioFetching.current = false;
    }
  }, [portfolioData]);

  const updateUserName = useCallback((name: string) => {
    setPortfolioData(prev => prev ? { ...prev, userName: name } : prev);
  }, []);

  const invalidatePortfolio = useCallback(() => {
    portfolioFetchedAt.current = 0;
  }, []);

  // ── Income fetch ──
  const fetchIncomeData = useCallback(async () => {
    // Return cached if still fresh
    const now = Date.now();
    if (incomeData && (now - incomeFetchedAt.current) < INCOME_CACHE_TTL) {
      return;
    }

    // Prevent concurrent fetches
    if (incomeFetching.current) return;
    incomeFetching.current = true;

    setIncomeLoading(true);
    setIncomeError(null);

    try {
      let incomeRecords: IncomeRecord[] = [];
      let withdrawalRecords: WithdrawalRecord[] = [];

      try {
        const data = await incomeService.getAllIncomeHistory();
        if (data && Array.isArray(data)) {
          incomeRecords = data;
        }
      } catch (err: any) {
        console.error('Failed to fetch income records:', err);
      }

      try {
        const data = await incomeService.getAllWithdrawalHistory();
        if (data && Array.isArray(data)) {
          withdrawalRecords = data;
        }
      } catch (err: any) {
        console.error('Failed to fetch withdrawal records:', err);
      }

      setIncomeData({ incomeRecords, withdrawalRecords });
      incomeFetchedAt.current = Date.now();
    } catch (error: any) {
      console.error('Income data fetch error:', error);
      setIncomeError(error?.message || 'Failed to load income data');
    } finally {
      setIncomeLoading(false);
      incomeFetching.current = false;
    }
  }, [incomeData]);

  const invalidateIncome = useCallback(() => {
    incomeFetchedAt.current = 0;
  }, []);

  const contextValue: DashboardCacheContextType = {
    portfolioData,
    portfolioLoading,
    portfolioError,
    fetchPortfolioData,
    updateUserName,
    invalidatePortfolio,

    incomeData,
    incomeLoading,
    incomeError,
    fetchIncomeData,
    invalidateIncome,

    importedTokens,
    setImportedTokens,
  };

  return (
    <DashboardCacheContext.Provider value={contextValue}>
      {children}
    </DashboardCacheContext.Provider>
  );
};

export const useDashboardCache = (): DashboardCacheContextType => {
  const context = useContext(DashboardCacheContext);
  if (!context) throw new Error('useDashboardCache must be used within DashboardCacheProvider');
  return context;
};

export type { TokenRowData, PortfolioData, IncomeData };