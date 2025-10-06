import * as React from "react";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSignMessage, getLoginToken } from '../lib/webApi';

// Import wallet providers
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

export type WalletType = 'metamask' | 'walletconnect' | 'coinbase';

interface Wallet {
  address: string;
  provider: any;
  chainId?: string;
  type: WalletType;
}

interface AuthSession {
  token: string;
  expiresAt: number;
  walletAddress: string;
  userData: any;
  walletType: WalletType;
}

interface Web3AuthContextType {
  isAuthenticated: boolean;
  isConnecting: boolean;
  wallet: Wallet | null;
  error: string | null;
  session: AuthSession | null;
  connectWallet: (walletType: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  refreshSession: () => Promise<void>;
  getUserBalance: () => Promise<string>;
  checkLUCASupport: () => boolean;
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'web3_auth_session';
const WALLET_CACHE_KEY = 'WEB3_CONNECT_CACHED_PROVIDER';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const BSC_CHAIN_ID = '0x38'; // BSC Mainnet
const BSC_TESTNET_CHAIN_ID = '0x61'; // BSC Testnet

// LUCA token contract addresses
const LUCA_CONTRACTS = {
  [BSC_CHAIN_ID]: '0x51E6Ac1533032E72e92094867fD5921e3ea1bfa0',
  [BSC_TESTNET_CHAIN_ID]: '0xD7a1cA21D73ff98Cc64A81153eD8eF89C2a1EfEF'
};

// BSC Network Config
const BSC_CONFIG = {
  chainId: BSC_CHAIN_ID,
  chainName: 'Binance Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: ['https://bsc-dataseed.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com/'],
};

export const Web3AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  
  // Store WalletConnect and Coinbase providers
  const [walletConnectProvider, setWalletConnectProvider] = useState<WalletConnectProvider | null>(null);
  const [coinbaseProvider, setCoinbaseProvider] = useState<any>(null);

  useEffect(() => {
    loadStoredSession();
  }, []);

  useEffect(() => {
    if (session) {
      const now = Date.now();
      if (now >= session.expiresAt) {
        handleSessionExpiry();
      } else {
        setIsAuthenticated(true);
        const timeUntilExpiry = session.expiresAt - now;
        const refreshTime = Math.max(timeUntilExpiry - 60000, 30000);
        
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
          // Attempt to restore wallet based on type
          reconnectWallet(parsedSession.walletType, parsedSession.walletAddress);
        } else {
          clearStoredData();
        }
      }
    } catch (error) {
      console.error('Failed to load stored session:', error);
      clearStoredData();
    }
  };

  const reconnectWallet = async (walletType: WalletType, address: string) => {
    try {
      if (walletType === 'metamask' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0 && accounts[0].toLowerCase() === address.toLowerCase()) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setWallet({
            address: accounts[0],
            provider: window.ethereum,
            chainId,
            type: 'metamask'
          });
        }
      }
      // WalletConnect and Coinbase will need to reconnect manually
    } catch (error) {
      console.error('Failed to reconnect wallet:', error);
    }
  };

  const storeSession = (sessionData: AuthSession) => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      localStorage.setItem('token', sessionData.token);
      localStorage.setItem('userData', JSON.stringify(sessionData.userData));
      localStorage.setItem(WALLET_CACHE_KEY, `"${sessionData.walletType}"`);
      setSession(sessionData);
    } catch (error) {
      console.error('Failed to store session:', error);
    }
  };

  const clearStoredData = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem(WALLET_CACHE_KEY);
  };

  const handleSessionExpiry = () => {
    setIsAuthenticated(false);
    setSession(null);
    setWallet(null);
    clearStoredData();
    setError('Session expired. Please reconnect your wallet.');
  };

  const checkNetworkCompatibility = async (provider: any): Promise<boolean> => {
    try {
      const chainId = await provider.request({ method: 'eth_chainId' });
      return chainId === BSC_CHAIN_ID || chainId === BSC_TESTNET_CHAIN_ID;
    } catch (error) {
      console.error('Failed to check network:', error);
      return false;
    }
  };

  const switchToBSC = async (provider: any): Promise<boolean> => {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_CHAIN_ID }],
      });
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [BSC_CONFIG],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add BSC network:', addError);
          return false;
        }
      }
      console.error('Failed to switch to BSC:', switchError);
      return false;
    }
  };

  const performSIWEAuth = async (address: string, provider: any): Promise<any> => {
    try {
      const signMessageResponse = await getSignMessage(address);
      if (signMessageResponse.isError || !signMessageResponse.data) {
        throw new Error(signMessageResponse.message || 'Failed to get sign message');
      }

      const signature = await provider.request({
        method: 'personal_sign',
        params: [signMessageResponse.data, address],
      });

      if (!signature) {
        throw new Error('Failed to sign message');
      }

      const loginResponse = await getLoginToken(address, signature);
      if (loginResponse.isError || !loginResponse.data) {
        throw new Error(loginResponse.message || 'Failed to authenticate');
      }

      return loginResponse.data;
    } catch (error) {
      console.error('SIWE authentication failed:', error);
      throw error;
    }
  };

  const connectMetaMask = async (): Promise<void> => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    }) as string[];

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please make sure your wallet is unlocked.');
    }

    const address = accounts[0];
    const provider = window.ethereum;

    const isCompatible = await checkNetworkCompatibility(provider);
    if (!isCompatible) {
      const switched = await switchToBSC(provider);
      if (!switched) {
        throw new Error('Please switch to Binance Smart Chain to access LUCA tokens.');
      }
    }

    const chainId = await provider.request({ method: 'eth_chainId' });
    const userData = await performSIWEAuth(address, provider);

    const walletInstance: Wallet = {
      address,
      provider,
      chainId,
      type: 'metamask'
    };

    const sessionData: AuthSession = {
      token: userData.loginToken,
      expiresAt: Date.now() + SESSION_DURATION,
      walletAddress: address,
      userData,
      walletType: 'metamask'
    };

    storeSession(sessionData);
    setWallet(walletInstance);
    setIsAuthenticated(true);
  };

  const connectWalletConnect = async (): Promise<void> => {
    const provider = new WalletConnectProvider({
      rpc: {
        56: 'https://bsc-dataseed.binance.org/',
        97: 'https://data-seed-prebsc-1-s1.binance.org:8545'
      },
      chainId: 56, // BSC Mainnet
      qrcode: true,
      qrcodeModalOptions: {
        mobileLinks: [
          "metamask",
          "trust",
          "rainbow",
        ],
      },
    });

    await provider.enable();
    setWalletConnectProvider(provider);

    const accounts = await provider.request({ method: 'eth_accounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found.');
    }

    const address = accounts[0];
    const chainId = await provider.request({ method: 'eth_chainId' });
    
    const userData = await performSIWEAuth(address, provider);

    const walletInstance: Wallet = {
      address,
      provider,
      chainId: typeof chainId === 'number' ? '0x' + chainId.toString(16) : typeof chainId === 'string' ? chainId : undefined,
      type: 'walletconnect'
    };

    const sessionData: AuthSession = {
      token: userData.loginToken,
      expiresAt: Date.now() + SESSION_DURATION,
      walletAddress: address,
      userData,
      walletType: 'walletconnect'
    };

    // Setup disconnect listener
    provider.on("disconnect", () => {
      disconnectWallet();
    });

    storeSession(sessionData);
    setWallet(walletInstance);
    setIsAuthenticated(true);
  };

  const connectCoinbase = async (): Promise<void> => {
    const coinbaseWallet = new CoinbaseWalletSDK({
      appName: 'ATM Network',
      appLogoUrl: window.location.origin + '/atm-logo.png',
      darkMode: false
    });

    const provider = coinbaseWallet.makeWeb3Provider(
      'https://bsc-dataseed.binance.org/',
      56 // BSC Mainnet
    );

    setCoinbaseProvider(provider);

    const accounts = await provider.request({
      method: 'eth_requestAccounts',
    }) as string[];

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found.');
    }

    const address = accounts[0];
    const chainId = await provider.request({ method: 'eth_chainId' });

    const userData = await performSIWEAuth(address, provider);

    const walletInstance: Wallet = {
      address,
      provider,
      chainId: typeof chainId === 'number' ? '0x' + chainId.toString(16) : typeof chainId === 'string' ? chainId : undefined,
      type: 'coinbase'
    };

    const sessionData: AuthSession = {
      token: userData.loginToken,
      expiresAt: Date.now() + SESSION_DURATION,
      walletAddress: address,
      userData,
      walletType: 'coinbase'
    };

    storeSession(sessionData);
    setWallet(walletInstance);
    setIsAuthenticated(true);
  };

  const connectWallet = async (walletType: WalletType): Promise<void> => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setError(null);

    try {
      switch (walletType) {
        case 'metamask':
          await connectMetaMask();
          break;
        case 'walletconnect':
          await connectWalletConnect();
          break;
        case 'coinbase':
          await connectCoinbase();
          break;
        default:
          throw new Error('Unsupported wallet type');
      }
    } catch (err: any) {
      console.error('Wallet connection failed:', err);
      let errorMessage = 'Failed to connect wallet. Please try again.';
      
      if (err.message.includes('User rejected') || err.message.includes('User closed')) {
        errorMessage = 'Connection cancelled by user.';
      } else if (err.message.includes('MetaMask')) {
        errorMessage = err.message;
      } else if (err.message.includes('network') || err.message.includes('chain')) {
        errorMessage = 'Please connect to Binance Smart Chain to access LUCA tokens.';
      } else if (err.message.includes('sign')) {
        errorMessage = 'Authentication failed. Please try signing the message again.';
      }
      
      setError(errorMessage);
      setIsAuthenticated(false);
      setWallet(null);
      setSession(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async (): Promise<void> => {
    // Disconnect wallet-specific providers
    if (walletConnectProvider) {
      try {
        await walletConnectProvider.disconnect();
      } catch (error) {
        console.error('Error disconnecting WalletConnect:', error);
      }
      setWalletConnectProvider(null);
    }

    if (coinbaseProvider) {
      try {
        await coinbaseProvider.close();
      } catch (error) {
        console.error('Error disconnecting Coinbase:', error);
      }
      setCoinbaseProvider(null);
    }

    setIsAuthenticated(false);
    setWallet(null);
    setSession(null);
    setError(null);
    clearStoredData();
  };

  const refreshSession = async (): Promise<void> => {
    if (!wallet || !session) return;

    try {
      const accounts = await wallet.provider.request({
        method: 'eth_accounts',
      });

      if (!accounts || accounts.length === 0 || accounts[0] !== wallet.address) {
        throw new Error('Wallet disconnected');
      }

      const userData = await performSIWEAuth(wallet.address, wallet.provider);

      const newSessionData: AuthSession = {
        token: userData.loginToken,
        expiresAt: Date.now() + SESSION_DURATION,
        walletAddress: wallet.address,
        userData,
        walletType: wallet.type
      };

      storeSession(newSessionData);
      setError(null);

    } catch (err: any) {
      console.error('Session refresh failed:', err);
      handleSessionExpiry();
    }
  };

  const getUserBalance = async (): Promise<string> => {
    if (!wallet?.provider || !wallet?.chainId) {
      throw new Error('Wallet not connected');
    }

    const contractAddress = LUCA_CONTRACTS[wallet.chainId as keyof typeof LUCA_CONTRACTS];
    if (!contractAddress) {
      throw new Error('LUCA contract not available on this network');
    }

    try {
      const paddedAddress = wallet.address.slice(2).toLowerCase().padStart(64, '0');
      const data = '0x70a08231' + paddedAddress;
      
      const balance = await wallet.provider.request({
        method: 'eth_call',
        params: [{
          to: contractAddress,
          data: data
        }, 'latest']
      });

      if (!balance || balance === '0x' || balance === '0x0') {
        return '0.0000';
      }

      try {
        const balanceInWei = BigInt(balance);
        const balanceInTokens = Number(balanceInWei) / Math.pow(10, 18);
        
        if (isNaN(balanceInTokens) || !isFinite(balanceInTokens)) {
          return '0.0000';
        }
        
        return balanceInTokens.toFixed(4);
      } catch (conversionError) {
        console.error('Error converting balance:', conversionError);
        return '0.0000';
      }
    } catch (error: any) {
      console.error('Failed to get LUCA balance:', error);
      throw new Error('Failed to fetch LUCA balance');
    }
  };

  const checkLUCASupport = (): boolean => {
    if (!wallet?.chainId) return false;
    return wallet.chainId === BSC_CHAIN_ID || wallet.chainId === BSC_TESTNET_CHAIN_ID;
  };

  const contextValue: Web3AuthContextType = {
    isAuthenticated,
    isConnecting,
    wallet,
    error,
    session,
    connectWallet,
    disconnectWallet,
    refreshSession,
    getUserBalance,
    checkLUCASupport
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

declare global {
  interface Window {
    ethereum?: any;
  }
}