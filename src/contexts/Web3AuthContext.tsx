// contexts/Web3AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Wallet {
  address: string;
  provider: any;
}

interface AuthSession {
  token: string;
  expiresAt: number;
  walletAddress: string;
}

interface Web3AuthContextType {
  isAuthenticated: boolean;
  isConnecting: boolean;
  wallet: Wallet | null;
  error: string | null;
  session: AuthSession | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshSession: () => Promise<void>;
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'web3_auth_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const Web3AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);

  // Load session from memory on mount
  useEffect(() => {
    loadStoredSession();
  }, []);

  // Session validation effect
  useEffect(() => {
    if (session) {
      const now = Date.now();
      if (now >= session.expiresAt) {
        handleSessionExpiry();
      } else {
        setIsAuthenticated(true);
        // Set up auto-refresh before expiry
        const timeUntilExpiry = session.expiresAt - now;
        const refreshTime = Math.max(timeUntilExpiry - 60000, 30000); // Refresh 1 min before expiry or at least after 30s
        
        const refreshTimer = setTimeout(() => {
          refreshSession();
        }, refreshTime);

        return () => clearTimeout(refreshTimer);
      }
    }
  }, [session]);

  const loadStoredSession = () => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const parsedSession: AuthSession = JSON.parse(stored);
        const now = Date.now();
        
        if (now < parsedSession.expiresAt) {
          setSession(parsedSession);
          // Restore wallet info
          setWallet({
            address: parsedSession.walletAddress,
            provider: null // Will be reconnected if needed
          });
        } else {
          // Session expired, clear it
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to load stored session:', error);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  };

  const storeSession = (sessionData: AuthSession) => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      setSession(sessionData);
    } catch (error) {
      console.error('Failed to store session:', error);
    }
  };

  const handleSessionExpiry = () => {
    setIsAuthenticated(false);
    setSession(null);
    setWallet(null);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setError('Session expired. Please reconnect your wallet.');
  };

  const generateSessionToken = (walletAddress: string): string => {
    // Generate a secure session token
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    const addressHash = walletAddress.substring(2, 8);
    return `${timestamp}-${addressHash}-${random}`;
  };

  const connectWallet = async (): Promise<void> => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setError(null);

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please make sure your wallet is unlocked.');
      }

      const address = accounts[0];

      // Create wallet instance
      const walletInstance: Wallet = {
        address,
        provider: window.ethereum
      };

      // Generate session token
      const token = generateSessionToken(address);
      const expiresAt = Date.now() + SESSION_DURATION;

      const sessionData: AuthSession = {
        token,
        expiresAt,
        walletAddress: address
      };

      // Store session and update state
      storeSession(sessionData);
      setWallet(walletInstance);
      setIsAuthenticated(true);

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

    } catch (err: any) {
      console.error('Wallet connection failed:', err);
      setError(err.message || 'Failed to connect wallet. Please try again.');
      setIsAuthenticated(false);
      setWallet(null);
      setSession(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = (): void => {
    // Clean up event listeners
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('disconnect', handleDisconnect);
    }

    // Clear state and storage
    setIsAuthenticated(false);
    setWallet(null);
    setSession(null);
    setError(null);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const refreshSession = async (): Promise<void> => {
    if (!wallet || !session) return;

    try {
      // Verify wallet is still connected
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (!accounts || accounts.length === 0 || accounts[0] !== wallet.address) {
        throw new Error('Wallet disconnected');
      }

      // Generate new session token
      const token = generateSessionToken(wallet.address);
      const expiresAt = Date.now() + SESSION_DURATION;

      const newSessionData: AuthSession = {
        token,
        expiresAt,
        walletAddress: wallet.address
      };

      storeSession(newSessionData);
      setError(null);

    } catch (err: any) {
      console.error('Session refresh failed:', err);
      handleSessionExpiry();
    }
  };

  const handleAccountsChanged = (accounts: string[]): void => {
    if (!accounts || accounts.length === 0) {
      disconnectWallet();
    } else if (wallet && accounts[0] !== wallet.address) {
      // Account changed, need to re-authenticate
      disconnectWallet();
      setError('Account changed. Please reconnect your wallet.');
    }
  };

  const handleChainChanged = (chainId: string): void => {
    // For now, just refresh the session
    // You might want to handle specific chain requirements here
    if (session) {
      refreshSession();
    }
  };

  const handleDisconnect = (): void => {
    disconnectWallet();
  };

  const contextValue: Web3AuthContextType = {
    isAuthenticated,
    isConnecting,
    wallet,
    error,
    session,
    connectWallet,
    disconnectWallet,
    refreshSession
  };

  return (
    <Web3AuthContext.Provider value={contextValue}>
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = (): Web3AuthContextType => {
  const context = useContext(Web3AuthContext);
  if (context === undefined) {
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
  }
  return context;
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}