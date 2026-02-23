/**
 * Unified context – thin composition layer over the split contexts.
 *
 * All screens that were using `useUnified()` keep working unchanged.
 * The actual state lives in AppKitProvider (wallet) and ATMProvider (auth/withdrawal).
 */

import React, { useCallback, type ReactNode } from 'react';
import { AppKitProvider, useAppKit } from './AppKitProvider';
import { ATMProvider, useATM } from './ATMContext';
import { ApiProvider } from './ApiContext';

export interface UnifiedContextValue {
  // Wallet state (from AppKit)
  address: string | undefined;
  isConnected: boolean;
  chainId: number | undefined;
  caipAddress: string | undefined;
  status: 'connected' | 'disconnected' | 'connecting' | 'reconnecting' | undefined;
  walletProvider: any;

  // Wallet actions
  openModal: () => void;
  disconnectWallet: () => Promise<void>;
  logout: () => Promise<void>;
  getUserBalance: () => Promise<string>;
  checkLUCASupport: () => boolean;
  switchToSupportedChain: () => Promise<void>;

  // ATM Authentication (from ATMContext)
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  authError: string | null;
  authenticate: () => Promise<boolean>;
  clearAuth: () => void;

  // ATM Withdrawal (from ATMContext)
  withdrawalBalance: number | null;
  isLoadingBalance: boolean;
  balanceError: string | null;
  isWithdrawing: boolean;
  withdrawError: string | null;
  lastTransactionHash: string | null;
  refreshBalance: () => Promise<void>;
  withdrawLUCA: (amount: number) => Promise<{ success: boolean; transactionHash?: string; error?: string }>;
}

/**
 * Hook that merges AppKit + ATM contexts into the single shape
 * every screen already destructures.
 */
export const useUnified = (): UnifiedContextValue => {
  const appKit = useAppKit();
  const atm = useATM();

  const logout = useCallback(async () => {
    atm.clearAuth();
    await appKit.disconnectWallet();
  }, [atm, appKit]);

  return {
    // Wallet
    address: appKit.address,
    isConnected: appKit.isConnected,
    chainId: appKit.chainId,
    caipAddress: appKit.caipAddress,
    status: appKit.status,
    walletProvider: appKit.walletProvider,
    openModal: appKit.openModal,
    disconnectWallet: appKit.disconnectWallet,
    logout,
    getUserBalance: appKit.getUserBalance,
    checkLUCASupport: appKit.checkLUCASupport,
    switchToSupportedChain: appKit.switchToSupportedChain,

    // Auth
    isAuthenticated: atm.isAuthenticated,
    isAuthenticating: atm.isAuthenticating,
    authError: atm.authError,
    authenticate: atm.authenticate,
    clearAuth: atm.clearAuth,

    // Withdrawal
    withdrawalBalance: atm.withdrawalBalance,
    isLoadingBalance: atm.isLoadingBalance,
    balanceError: atm.balanceError,
    isWithdrawing: atm.isWithdrawing,
    withdrawError: atm.withdrawError,
    lastTransactionHash: atm.lastTransactionHash,
    refreshBalance: atm.refreshBalance,
    withdrawLUCA: atm.withdrawLUCA,
  };
};

/**
 * Top-level provider tree.  Wraps the app with all context providers
 * in the correct nesting order.
 *
 *   AppKitProvider  (wagmi + react-query + Reown modal)
 *     → ATMProvider   (auth + withdrawal – needs wallet hooks)
 *       → ApiProvider   (gameApi + webApi references)
 *         → NewsProvider  (news cache)
 */
export const UnifiedProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <AppKitProvider>
    <ATMProvider>
      <ApiProvider>
          {children}
      </ApiProvider>
    </ATMProvider>
  </AppKitProvider>
);
