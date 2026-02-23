import * as React from "react";
import { useAppKit } from "./AppKitProvider";

// Define original WalletType to maintain compatibility
export type WalletType = 'metamask' | 'walletconnect' | 'coinbase' | 'reown';

// Create a compatibility layer for old Web3Auth consumers
export interface Web3AuthContextType {
  isAuthenticated: boolean;
  isConnecting: boolean;
  wallet: {
    address: string;
    provider: any;
    chainId?: string;
    type: WalletType;
  } | null;
  error: string | null;
  session: {
    token: string;
    expiresAt: number;
    walletAddress: string;
    userData: any;
    walletType: WalletType;
  } | null;
  connectWallet: (walletType: WalletType) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  refreshSession: () => Promise<void>;
  getUserBalance: () => Promise<string>;
  checkLUCASupport: () => boolean;
}

// Create a compatibility hook that wraps AppKit and provides the old interface
export const useWeb3Auth = (): Web3AuthContextType => {
  const appKit = useAppKit();

  // Map AppKit state to Web3Auth format
  const isAuthenticated = appKit.isConnected;
  const isConnecting = appKit.status === 'connecting' || appKit.status === 'reconnecting';

  // Create a compatible wallet object
  const wallet = appKit.address ? {
    address: appKit.address,
    provider: appKit.walletProvider || window.ethereum || {},
    chainId: appKit.chainId ? `0x${appKit.chainId.toString(16)}` : undefined,
    type: 'reown' as WalletType
  } : null;

  // Create a compatible session object
  const session = appKit.address ? {
    token: localStorage.getItem('atm_token') || 'appkit-session',
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    walletAddress: appKit.address,
    userData: { address: appKit.address },
    walletType: 'reown' as WalletType
  } : null;

  // Create compatible async connectWallet function
  const connectWallet = async (_walletType: WalletType): Promise<void> => {
    appKit.openModal();
    return Promise.resolve();
  };

  // Create compatible refreshSession function
  const refreshSession = async (): Promise<void> => {
    if (appKit.isConnected && session) {
      session.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    }
    return Promise.resolve();
  };

  return {
    isAuthenticated,
    isConnecting,
    wallet,
    error: null,
    session,
    connectWallet,
    disconnectWallet: appKit.disconnectWallet,
    refreshSession,
    getUserBalance: appKit.getUserBalance,
    checkLUCASupport: appKit.checkLUCASupport
  };
};

// Export a dummy provider for compatibility
export const Web3AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>; // This is a pass-through since AppKitProvider is used instead
};
