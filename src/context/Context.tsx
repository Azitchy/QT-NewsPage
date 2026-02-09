import React, { createContext, useContext, useCallback, useState, useEffect, useRef, type ReactNode } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider, useDisconnect } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { useAppKitAccount, useAppKitProvider, useAppKitNetwork } from '@reown/appkit/react';
import type { Provider } from '@reown/appkit/react';
import { http } from 'viem';
import { authService, withdrawalService } from '@/lib/webAppService';
import { defineChain } from '@reown/appkit/networks';
import { activeChains, getLucaContract, supportedChains } from '@/config/chains';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || 'YOUR_PROJECT_ID';
const metadata = {
  name: 'ATM Network',
  description: 'ATM - Autonomous Trust Momentum Platform',
  url: window.location.origin,
  icons: [window.location.origin + '/atm-logo.png']
};

const transports = activeChains.reduce((acc, config) => {
  acc[config.chain.id] = http(config.rpcUrl);
  return acc;
}, {} as Record<number, ReturnType<typeof http>>);

const wagmiAdapter = new WagmiAdapter({
  networks: supportedChains,
  projectId,
  ssr: false,
  transports
});

const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: supportedChains as [ReturnType<typeof defineChain>, ...ReturnType<typeof defineChain>[]],
  projectId,
  metadata,
  features: { analytics: false },
  themeMode: 'light',
  themeVariables: { '--w3m-accent': '#0DAEB9' }
});

const ERC20_ABI = [
  { constant: true, inputs: [{ name: '_owner', type: 'address' }], name: 'balanceOf', outputs: [{ name: 'balance', type: 'uint256' }], type: 'function' },
  { constant: true, inputs: [], name: 'decimals', outputs: [{ name: '', type: 'uint8' }], type: 'function' }
] as const;

export type WalletType = 'metamask' | 'walletconnect' | 'coinbase' | 'reown';

interface UnifiedContextType {
  // Wallet state
  address: string | undefined;
  isConnected: boolean;
  chainId: number | undefined;
  caipAddress: string | undefined;
  status: 'connected' | 'disconnected' | 'connecting' | 'reconnecting' | undefined;
  walletProvider: Provider | undefined;

  // Wallet actions
  openModal: () => void;
  disconnectWallet: () => Promise<void>;
  getUserBalance: () => Promise<string>;
  checkLUCASupport: () => boolean;
  switchToSupportedChain: () => Promise<void>;

  // ATM Authentication
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  authError: string | null;
  authenticate: () => Promise<boolean>;
  clearAuth: () => void;

  // ATM Withdrawal
  withdrawalBalance: number | null;
  isLoadingBalance: boolean;
  balanceError: string | null;
  isWithdrawing: boolean;
  withdrawError: string | null;
  lastTransactionHash: string | null;
  refreshBalance: () => Promise<void>;
  withdrawLUCA: (amount: number) => Promise<{ success: boolean; transactionHash?: string; error?: string }>;
}

const UnifiedContext = createContext<UnifiedContextType | undefined>(undefined);

const UnifiedContextInner: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { address, isConnected, caipAddress, status } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  const { chainId: rawChainId, switchNetwork } = useAppKitNetwork();
  const { disconnect } = useDisconnect();

  // Normalize chainId to number | undefined
  const chainId: number | undefined = typeof rawChainId === 'string'
    ? parseInt(rawChainId, 10)
    : rawChainId;

  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [withdrawalBalance, setWithdrawalBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [lastTransactionHash, setLastTransactionHash] = useState<string | null>(null);

  const balanceFetchRef = useRef(false);
  const autoOpenTriggered = useRef(false);

  const openModal = () => modal.open({ view: 'Connect' });

  // Auto-open Reown AppKit connect modal on first load if not connected
  useEffect(() => {
    if (autoOpenTriggered.current) return;
    if (status === 'connecting' || status === 'reconnecting') return;
    const timer = setTimeout(() => {
      if (!autoOpenTriggered.current && !isConnected) {
        autoOpenTriggered.current = true;
        modal.open({ view: 'Connect' });
      } else {
        autoOpenTriggered.current = true;
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [status, isConnected]);

  const disconnectWallet = async () => {
    await disconnect();
  };

  const getUserBalance = useCallback(async (): Promise<string> => {
    if (!isConnected || !address || !chainId) return '0.0000';
    const contractAddress = getLucaContract(chainId);
    if (!contractAddress) return '0.0000';

    try {
      const { readContract } = await import('viem/actions');
      const client = wagmiAdapter.wagmiConfig.getClient({ chainId });

      const balance = await readContract(client, {
        address: contractAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address as `0x${string}`]
      });

      const decimals = await readContract(client, {
        address: contractAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'decimals'
      });

      const balanceInTokens = Number(balance) / Math.pow(10, Number(decimals));
      return isNaN(balanceInTokens) || !isFinite(balanceInTokens) ? '0.0000' : balanceInTokens.toFixed(4);
    } catch {
      return '0.0000';
    }
  }, [isConnected, address, chainId]);

  const checkLUCASupport = (): boolean => !!getLucaContract(chainId ?? 0);

  const switchToSupportedChain = async () => {
    if (switchNetwork && chainId) {
      const primaryChain = activeChains.find(c => c.lucaContract)?.chain;
      if (primaryChain && chainId !== primaryChain.id) {
        try {
          await switchNetwork(primaryChain);
        } catch (error) {
          console.error('Failed to switch network:', error);
        }
      }
    }
  };

  // ── clearAuth ──
  const clearAuth = useCallback(() => {
    authService.clearAuth();
    withdrawalService.clearBalanceCache();
    setIsAuthenticated(false);
    setAuthError(null);
    setWithdrawalBalance(null);
    setBalanceError(null);
    setWithdrawError(null);
    setLastTransactionHash(null);
  }, []);

  // ── refreshBalance ──
  // Matches reference: guards on isAuthenticated + walletProvider + balanceFetchRef
  const refreshBalance = useCallback(async () => {
    if (!isAuthenticated || !walletProvider || balanceFetchRef.current) return;

    balanceFetchRef.current = true;
    setIsLoadingBalance(true);
    setBalanceError(null);

    try {
      const balance = await withdrawalService.getWithdrawalBalance(walletProvider);
      setWithdrawalBalance(balance);
    } catch (error: any) {
      console.error('Balance fetch error:', error);
      setBalanceError(error?.message || 'Failed to load balance');
    } finally {
      setIsLoadingBalance(false);
      balanceFetchRef.current = false;
    }
  }, [isAuthenticated, walletProvider]);

  // ── authenticate ──
  // Matches reference: guards on isAuthenticating state, calls refreshBalance() after success
  const authenticate = useCallback(async (): Promise<boolean> => {
    if (!address || !isConnected || !walletProvider || isAuthenticating) return false;

    setIsAuthenticating(true);
    setAuthError(null);

    try {
      authService.setUserAddress(address);
      await authService.authenticate(walletProvider);
      setIsAuthenticated(true);
      // refreshBalance will be triggered by the auth effect re-running
      // after isAuthenticated changes, or we call it directly here.
      // Since refreshBalance guards on isAuthenticated which is not yet
      // updated in this tick, we schedule it for next tick.
      setTimeout(() => refreshBalance(), 0);
      return true;
    } catch (error: any) {
      setAuthError(error?.message || 'Authentication failed');
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, [address, isConnected, walletProvider, isAuthenticating, refreshBalance]);

  // ── withdrawLUCA ──
  const withdrawLUCA = useCallback(async (amount: number): Promise<{ success: boolean; transactionHash?: string; error?: string }> => {
    if (!isAuthenticated || !walletProvider) return { success: false, error: 'Not authenticated' };
    if (amount <= 0) return { success: false, error: 'Invalid amount' };
    if (withdrawalBalance !== null && amount > withdrawalBalance) return { success: false, error: 'Insufficient balance' };

    setIsWithdrawing(true);
    setWithdrawError(null);
    setLastTransactionHash(null);

    try {
      const result = await withdrawalService.withdrawLUCA(amount, walletProvider);
      if (result.success && result.transactionHash) {
        setLastTransactionHash(result.transactionHash);
        withdrawalService.clearBalanceCache();
        setTimeout(() => refreshBalance(), 2000);
      } else if (result.error) {
        setWithdrawError(result.error);
      }
      return result;
    } catch (error: any) {
      const errorMsg = error?.message || 'Withdrawal failed';
      setWithdrawError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsWithdrawing(false);
    }
  }, [isAuthenticated, walletProvider, withdrawalBalance, refreshBalance]);

  // ── Main auth flow effect ──
  // Wallet Connection → Authentication → LUCA Balance
  // Matches reference: includes isAuthenticated and isAuthenticating in deps
  useEffect(() => {
    // Skip during connection transitions
    if (status === 'connecting' || status === 'reconnecting') return;

    // Handle disconnection — clear everything
    if (!isConnected || !address) {
      if (isAuthenticated) clearAuth();
      return;
    }

    // Wallet is connected, check auth state
    const normalizedAddress = address.toLowerCase();
    const storedAddress = authService.getUserAddress();
    const isTokenValid = authService.isTokenValid();

    // Always keep authService in sync with current address
    authService.setUserAddress(address);

    // Case 1: Valid token exists for this address — restore session
    if (isTokenValid && storedAddress === normalizedAddress) {
      if (!isAuthenticated) {
        setIsAuthenticated(true);
        refreshBalance();
      }
      return;
    }

    // Case 2: No valid token — need to authenticate
    // Only attempt if not already authenticated/authenticating and walletProvider is available
    if (!isAuthenticated && !isAuthenticating && walletProvider) {
      authenticate();
    }
  }, [status, isConnected, address, walletProvider, isAuthenticated, isAuthenticating]);

  // ── Periodic balance refresh (30s) ──
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => refreshBalance(), 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, refreshBalance]);

  const contextValue: UnifiedContextType = {
    address,
    isConnected,
    chainId,
    caipAddress,
    status,
    walletProvider,
    openModal,
    disconnectWallet,
    getUserBalance,
    checkLUCASupport,
    switchToSupportedChain,
    isAuthenticated,
    isAuthenticating,
    authError,
    authenticate,
    clearAuth,
    withdrawalBalance,
    isLoadingBalance,
    balanceError,
    isWithdrawing,
    withdrawError,
    lastTransactionHash,
    refreshBalance,
    withdrawLUCA,
  };

  return <UnifiedContext.Provider value={contextValue}>{children}</UnifiedContext.Provider>;
};

export const UnifiedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <UnifiedContextInner>{children}</UnifiedContextInner>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export const useUnified = (): UnifiedContextType => {
  const context = useContext(UnifiedContext);
  if (!context) throw new Error('useUnified must be used within UnifiedProvider');
  return context;
};

export { wagmiAdapter };
