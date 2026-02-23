import React, { createContext, useContext, useCallback, type ReactNode } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider, useDisconnect } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { useAppKitAccount, useAppKitProvider, useAppKitNetwork } from '@reown/appkit/react';
import type { Provider } from '@reown/appkit/react';
import { http } from 'viem';
import { supportedChains, activeChains, getLucaContract } from '@/config/chains';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 60_000,
      gcTime: 5 * 60_000,
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

// Build transports dynamically from chain config
const transports = activeChains.reduce((acc, config) => {
  acc[config.chain.id] = http(config.rpcUrl);
  return acc;
}, {} as Record<number, ReturnType<typeof http>>);

// Configure Wagmi with multi-chain support
const wagmiAdapter = new WagmiAdapter({
  networks: supportedChains,
  projectId,
  ssr: false,
  transports
});

const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: supportedChains,
  projectId,
  metadata,
  features: {
    analytics: false,
    email: true,
    socials: ['google', 'apple', 'discord', 'x'],
  },
  // Force embedded wallets (Google/social login) to use EOA accounts by default
  // instead of smart accounts. Smart accounts produce ERC-6492 signatures that
  // the ATM backend cannot verify with standard ecrecover.
  defaultAccountTypes: { eip155: 'eoa' },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#0DAEB9',
  }
});

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function'
  }
] as const;

interface AppKitContextType {
  address: string | undefined;
  isConnected: boolean;
  chainId: number | undefined;
  caipAddress: string | undefined;
  status: 'connected' | 'disconnected' | 'connecting' | 'reconnecting' | undefined;
  walletProvider: Provider | undefined;
  openModal: () => void;
  disconnectWallet: () => Promise<void>;
  getUserBalance: () => Promise<string>;
  checkLUCASupport: () => boolean;
  switchToSupportedChain: () => Promise<void>;
}

const AppKitContext = createContext<AppKitContextType | undefined>(undefined);

const AppKitInner: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { address, isConnected, caipAddress, status } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  const { chainId: rawChainId, switchNetwork } = useAppKitNetwork();
  const { disconnect } = useDisconnect();

  // Normalize chainId to number | undefined
  const chainId: number | undefined = typeof rawChainId === 'string'
    ? parseInt(rawChainId, 10)
    : rawChainId;

  const openModal = () => {
    modal.open({ view: 'Connect' });
  };

  const disconnectWallet = async () => {
    await disconnect();
  };

  const getUserBalance = useCallback(async (): Promise<string> => {
    if (!isConnected || !address || !chainId) {
      return '0.0000';
    }

    const contractAddress = getLucaContract(chainId);
    if (!contractAddress) {
      return '0.0000';
    }

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
      return isNaN(balanceInTokens) || !isFinite(balanceInTokens)
        ? '0.0000'
        : balanceInTokens.toFixed(4);
    } catch {
      return '0.0000';
    }
  }, [isConnected, address, chainId]);

  const checkLUCASupport = (): boolean => {
    return !!getLucaContract(chainId ?? 0);
  };

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

  const contextValue: AppKitContextType = {
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
  };

  return (
    <AppKitContext.Provider value={contextValue}>
      {children}
    </AppKitContext.Provider>
  );
};

interface AppKitProviderProps {
  children: ReactNode;
}

export const AppKitProvider: React.FC<AppKitProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AppKitInner>{children}</AppKitInner>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export const useAppKit = (): AppKitContextType => {
  const context = useContext(AppKitContext);
  if (context === undefined) {
    throw new Error('useAppKit must be used within an AppKitProvider');
  }
  return context;
};

export { modal, wagmiAdapter };
