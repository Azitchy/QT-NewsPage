// src/contexts/ATMContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import type { Provider } from '@reown/appkit/react';
import { useSignMessage } from 'wagmi';
import { authService, withdrawalService } from '../lib/webappservice';

interface ATMContextType {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  authError: string | null;
  withdrawalBalance: number | null;
  isLoadingBalance: boolean;
  balanceError: string | null;
  isWithdrawing: boolean;
  withdrawError: string | null;
  lastTransactionHash: string | null;
  authenticate: () => Promise<boolean>;
  refreshBalance: () => Promise<void>;
  withdrawLUCA: (amount: number) => Promise<{ success: boolean; transactionHash?: string; error?: string }>;
  clearAuth: () => void;
}

const ATMContext = createContext<ATMContextType | undefined>(undefined);

interface ATMProviderProps {
  children: ReactNode;
}

export const ATMProvider: React.FC<ATMProviderProps> = ({ children }) => {
  const { address, status } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  const { signMessageAsync } = useSignMessage();

  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [withdrawalBalance, setWithdrawalBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [lastTransactionHash, setLastTransactionHash] = useState<string | null>(null);

  const hasInitialized = useRef(false);
  const balanceFetchRef = useRef(false);
  const authFailedRef = useRef(false);
  const authRetryCountRef = useRef(0);
  const MAX_AUTH_RETRIES = 3;
  const lastAttemptedAddressRef = useRef<string | null>(null);

  const clearAuth = useCallback(() => {
    authService.clearAuth();
    withdrawalService.clearBalanceCache();
    authFailedRef.current = false;
    authRetryCountRef.current = 0;
    lastAttemptedAddressRef.current = null;
    setIsAuthenticated(false);
    setAuthError(null);
    setWithdrawalBalance(null);
    setBalanceError(null);
    setWithdrawError(null);
    setLastTransactionHash(null);
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!isAuthenticated || !walletProvider || balanceFetchRef.current) return;

    balanceFetchRef.current = true;
    setIsLoadingBalance(true);
    setBalanceError(null);

    try {
      const balance = await withdrawalService.getWithdrawalBalance(walletProvider);
      setWithdrawalBalance(balance);
    } catch (error: any) {
      setBalanceError(error?.message || 'Failed to load balance');
    } finally {
      setIsLoadingBalance(false);
      balanceFetchRef.current = false;
    }
  }, [isAuthenticated, walletProvider]);

  const authenticate = useCallback(async (): Promise<boolean> => {
    // For embedded wallets (Google/social), address + walletProvider may be
    // available while isConnected is still false (status = 'reconnecting').
    // address + walletProvider is the minimal sufficient condition.
    if (!address || !walletProvider || isAuthenticating) return false;
    if (authFailedRef.current && lastAttemptedAddressRef.current === address.toLowerCase()) return false;

    lastAttemptedAddressRef.current = address.toLowerCase();
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      // Verify the provider is actually ready before signing.
      // Embedded wallets (Google/social) have a provider object available
      // while the internal iframe bridge is still settling after OAuth.
      try {
        await walletProvider.request({ method: 'eth_accounts' });
      } catch (readyErr: any) {
        console.warn('[ATMContext] Provider not ready yet:', readyErr?.message);
        // Self-schedule a retry — the provider isn't ready but that's transient.
        // No effect dependency will change to re-trigger the main effect,
        // so we MUST use a timer here or auth is permanently dead.
        authRetryCountRef.current += 1;
        if (authRetryCountRef.current < MAX_AUTH_RETRIES) {
          const retryDelay = 2000 * authRetryCountRef.current;
          console.log(`[ATMContext] Provider not ready, retry ${authRetryCountRef.current}/${MAX_AUTH_RETRIES} in ${retryDelay}ms`);
          authScheduledForRef.current = address.toLowerCase();
          authTimerRef.current = setTimeout(() => {
            authTimerRef.current = null;
            authScheduledForRef.current = null;
            authenticateRef.current();
          }, retryDelay);
        } else {
          authFailedRef.current = true;
          setAuthError('Wallet provider failed to initialize');
        }
        setIsAuthenticating(false);
        return false;
      }

      authService.setUserAddress(address);
      await authService.authenticate(walletProvider, signMessageAsync);

      authFailedRef.current = false;
      authRetryCountRef.current = 0;
      setIsAuthenticated(true);
      refreshBalance();
      return true;
    } catch (error: any) {
      const msg = error?.message || 'Authentication failed';
      authRetryCountRef.current += 1;
      console.error(`[ATMContext] authenticate failed (attempt ${authRetryCountRef.current}/${MAX_AUTH_RETRIES}):`, msg);

      const isTransient = /abort|denied|reject|cancel|retrieving/i.test(msg);
      if (!isTransient || authRetryCountRef.current >= MAX_AUTH_RETRIES) {
        authFailedRef.current = true;
        setAuthError(msg);
      } else if (address) {
        const retryDelay = 3000 * authRetryCountRef.current;
        console.log(`[ATMContext] Transient error, retrying in ${retryDelay}ms`);
        authScheduledForRef.current = address.toLowerCase();
        authTimerRef.current = setTimeout(() => {
          authTimerRef.current = null;
          authScheduledForRef.current = null;
          if (!authFailedRef.current) authenticateRef.current();
        }, retryDelay);
      }

      setIsAuthenticated(false);
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, [address, walletProvider, isAuthenticating, signMessageAsync, refreshBalance]);

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

  // Keep a stable ref to authenticate so the timer closure always calls
  // the latest version (timer outlives re-renders).
  const authenticateRef = useRef(authenticate);
  authenticateRef.current = authenticate;

  // Ref-based timer that survives re-renders without being cancelled.
  const authTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const authScheduledForRef = useRef<string | null>(null);

  // Detect embedded wallets settling after OAuth.
  // `status === 'reconnecting'` with an address present is the reliable
  // early signal. embeddedWalletInfo arrives too late in the wave sequence
  // to be useful for the initial scheduling delay decision.
  const isEmbeddedSettling = status === 'reconnecting' && !!address;

  // ─── Main wallet-state effect ───────────────────────────────────────
  //
  // Embedded wallets (Google/social) emit state in multiple waves:
  //   1. status → 'reconnecting', address appears
  //   2. walletProvider object exists (but iframe may not be ready)
  //   3. embeddedWalletInfo populates
  //   4. status → 'connected', isConnected → true
  //
  // We CANNOT gate on isConnected — it arrives last and would block
  // embedded wallets entirely.  Gate on address + walletProvider instead.
  // Only clear auth on explicit 'disconnected'.
  useEffect(() => {
    // Explicit disconnect — clean up everything.
    if (status === 'disconnected') {
      if (isAuthenticated) clearAuth();
      if (authTimerRef.current) { clearTimeout(authTimerRef.current); authTimerRef.current = null; }
      authScheduledForRef.current = null;
      return;
    }

    // Still waiting for address or provider — nothing to do yet.
    if (!address || !walletProvider) return;

    if (!hasInitialized.current) hasInitialized.current = true;

    const normalizedAddress = address.toLowerCase();
    const storedAddress = authService.getUserAddress();
    const isTokenValid = authService.isTokenValid();

    authService.setUserAddress(address);

    // Reset failure flag if address changed (new wallet/account connected)
    if (lastAttemptedAddressRef.current && lastAttemptedAddressRef.current !== normalizedAddress) {
      authFailedRef.current = false;
      authRetryCountRef.current = 0;
      authScheduledForRef.current = null;
      if (authTimerRef.current) { clearTimeout(authTimerRef.current); authTimerRef.current = null; }
    }

    if (isTokenValid && storedAddress === normalizedAddress) {
      if (!isAuthenticated) {
        setIsAuthenticated(true);
        refreshBalance();
      }
    } else if (!isAuthenticated && !isAuthenticating && !authFailedRef.current) {
      // Already scheduled for this address — don't re-schedule.
      if (authScheduledForRef.current === normalizedAddress) return;

      // Embedded wallets need more time for the iframe to settle.
      // We detect this via status='reconnecting' + address (isEmbeddedSettling)
      // because embeddedWalletInfo hasn't arrived yet at this point.
      // For injected wallets, status goes straight to 'connected'.
      const delay = isEmbeddedSettling ? 3500 : 1500;
      authScheduledForRef.current = normalizedAddress;
      console.log(`[ATMContext] Scheduling auto-auth in ${delay}ms (settling=${isEmbeddedSettling}, status=${status}) for ${normalizedAddress}`);

      if (authTimerRef.current) clearTimeout(authTimerRef.current);
      authTimerRef.current = setTimeout(() => {
        authTimerRef.current = null;
        authScheduledForRef.current = null;
        if (!authFailedRef.current) authenticateRef.current();
      }, delay);
    }
  }, [status, address, walletProvider, isAuthenticated, isAuthenticating, isEmbeddedSettling]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (authTimerRef.current) clearTimeout(authTimerRef.current); };
  }, []);

  // Balance refresh interval
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => refreshBalance(), 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, refreshBalance]);

  const value: ATMContextType = {
    isAuthenticated,
    isAuthenticating,
    authError,
    withdrawalBalance,
    isLoadingBalance,
    balanceError,
    isWithdrawing,
    withdrawError,
    lastTransactionHash,
    authenticate,
    refreshBalance,
    withdrawLUCA,
    clearAuth,
  };

  return <ATMContext.Provider value={value}>{children}</ATMContext.Provider>;
};

export const useATM = (): ATMContextType => {
  const context = useContext(ATMContext);
  if (context === undefined) throw new Error('useATM must be used within an ATMProvider');
  return context;
};
