import { defineChain } from '@reown/appkit/networks';
import { mainnet, polygon, avalanche, bsc, bscTestnet, polygonAmoy, avalancheFuji, sepolia } from '@reown/appkit/networks';

export interface ChainContracts {
  consensusFactory?: string;
  prNodeStake?: string;
  privateContract?: string;
  luca?: string;
  trader?: string;
  pledger?: string;
  agt?: string;
  factory?: string;
  crosschain?: string;
}

export interface ChainConfig {
  chain: ReturnType<typeof defineChain>;
  atmId: number;
  lucaContract?: string;
  rpcUrl: string;
  explorerUrl: string;
  contracts: ChainContracts;
}

// Production chains
const productionChains: ChainConfig[] = [
  {
    chain: bsc,
    atmId: 1,
    lucaContract: '0x51E6Ac1533032E72e92094867fD5921e3ea1bfa0',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    contracts: {
      consensusFactory: '0x7b749e4d4C23556a772Aca4E00E283BEFd575b9B',
      prNodeStake: '0xEC56a45abFf41DF1746fDf4dedc45E909601aa02',
      privateContract: '0x08b6FB844B40a218E44EA3a75a69634c0bbD2e5F',
      luca: '0x51E6Ac1533032E72e92094867fD5921e3ea1bfa0',
      trader: '0x7b749e4d4C23556a772Aca4E00E283BEFd575b9B',
      pledger: '0xEC56a45abFf41DF1746fDf4dedc45E909601aa02',
      agt: '0x6F8fA23bB482048A8854D4d041AAc0bef1B22eE7',
      factory: '0x8f827eCe944A0d54cfcD94D8775b23A980F37cdA',
      crosschain: '0x607194DB759dE0a4D9918Ab89a85716C995c28e8'
    }
  },
  {
    chain: polygon,
    atmId: 2,
    lucaContract: '0xb3d3e098564e5bEDCDA5c15E0f0E005560bE82c8',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    contracts: {
      luca: '0xb3d3e098564e5bEDCDA5c15E0f0E005560bE82c8',
      agt: '0x118475cEbE775092149FEd7a3F71e7f268cf0DB4',
      factory: '0x183C4cF6Adb93A34Fd15C2D3C4Dc9Be6E96B37d7',
      trader: '0x1385Cb2708004DaC1D96340f94372c94A3e92897',
      pledger: '0x2c508D88E972C30Bf5123ba9a788031a202931F5',
      crosschain: '0x82EC592952187D80BE0fd542804Bbc29B718e13f'
    }
  },
  {
    chain: mainnet,
    atmId: 4,
    lucaContract: undefined,
    rpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
    contracts: {
      consensusFactory: '0xe8c9D159D8187feAB4Cf588DCC76cd72fa933fcd',
      prNodeStake: '0x1FA5D40233e568EDE6f28236fAe2F2Ec8c62a932'
    }
  },
  {
    chain: avalanche,
    atmId: 3,
    lucaContract: undefined,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    contracts: {
      consensusFactory: '0x2c508D88E972C30Bf5123ba9a788031a202931F5',
      prNodeStake: '0x1FA5D40233e568EDE6f28236fAe2F2Ec8c62a932'
    }
  }
];

// Testnet chains
const testnetChains: ChainConfig[] = [
  // {
  //   chain: bscTestnet,
  //   atmId: 1,
  //   lucaContract: '0xD7a1cA21D73ff98Cc64A81153eD8eF89C2a1EfEF',
  //   rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  //   explorerUrl: 'https://testnet.bscscan.com',
  //   contracts: {
  //     consensusFactory: '0x7b749e4d4C23556a772Aca4E00E283BEFd575b9B',
  //     prNodeStake: '0xEC56a45abFf41DF1746fDf4dedc45E909601aa02',
  //     privateContract: '0x08b6FB844B40a218E44EA3a75a69634c0bbD2e5F',
  //     luca: '0xD7a1cA21D73ff98Cc64A81153eD8eF89C2a1EfEF'
  //   }
  // },
  // {
  //   chain: polygonAmoy,
  //   atmId: 2,
  //   lucaContract: undefined,
  //   rpcUrl: 'https://rpc-amoy.polygon.technology',
  //   explorerUrl: 'https://www.oklink.com/amoy',
  //   contracts: {}
  // },
  // {
  //   chain: sepolia,
  //   atmId: 4,
  //   lucaContract: undefined,
  //   rpcUrl: 'https://rpc.sepolia.org',
  //   explorerUrl: 'https://sepolia.etherscan.io',
  //   contracts: {}
  // },
  // {
  //   chain: avalancheFuji,
  //   atmId: 3,
  //   lucaContract: undefined,
  //   rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
  //   explorerUrl: 'https://testnet.snowtrace.io',
  //   contracts: {}
  // }
];

// Bitkub custom chains
const bitkubMainnet = defineChain({
  id: 96,
  caipNetworkId: 'eip155:96',
  chainNamespace: 'eip155',
  name: 'Bitkub Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'KUB',
    symbol: 'KUB',
  },
  rpcUrls: {
    default: { http: ['https://rpc.bitkubchain.io'] },
  },
  blockExplorers: {
    default: { name: 'BKC Scan', url: 'https://bkcscan.com' },
  },
});

const bitkubTestnet = defineChain({
  id: 25925,
  caipNetworkId: 'eip155:25925',
  chainNamespace: 'eip155',
  name: 'Bitkub Chain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'KUB',
    symbol: 'KUB',
  },
  rpcUrls: {
    default: { http: ['https://rpc-testnet.bitkubchain.io'] },
  },
  blockExplorers: {
    default: { name: 'BKC Scan Testnet', url: 'https://testnet.bkcscan.com' },
  },
});

const customProductionChains: ChainConfig[] = [
  {
    chain: bitkubMainnet,
    atmId: 6,
    lucaContract: undefined,
    rpcUrl: 'https://rpc.bitkubchain.io',
    explorerUrl: 'https://bkcscan.com',
    contracts: {
      consensusFactory: '0x2c508D88E972C30Bf5123ba9a788031a202931F5',
      prNodeStake: '0x1FA5D40233e568EDE6f28236fAe2F2Ec8c62a932'
    }
  }
];

const customTestnetChains: ChainConfig[] = [
  {
    chain: bitkubTestnet,
    atmId: 6,
    lucaContract: undefined,
    rpcUrl: 'https://rpc-testnet.bitkubchain.io',
    explorerUrl: 'https://testnet.bkcscan.com',
    contracts: {}
  }
];

// Determine environment
const isProduction = import.meta.env.VITE_IS_PRODUCTION === 'true';

// Export active chains based on environment
export const activeChains: ChainConfig[] = isProduction 
  ? [...productionChains, ...customProductionChains]
  : [...testnetChains, ...customTestnetChains, ...productionChains, ...customProductionChains];

export const allProductionChains = [...productionChains, ...customProductionChains];
export const allTestnetChains = [...testnetChains, ...customTestnetChains];

// Helper functions
export const getChainById = (chainId: number): ChainConfig | undefined => {
  return activeChains.find(config => config.chain.id === chainId);
};

export const getChainByAtmId = (atmId: number): ChainConfig | undefined => {
  return activeChains.find(config => config.atmId === atmId);
};

export const getLucaContract = (chainId: number): string | undefined => {
  return activeChains.find(config => config.chain.id === chainId)?.lucaContract;
};

export const getChainContracts = (chainId: number): ChainContracts | undefined => {
  return activeChains.find(config => config.chain.id === chainId)?.contracts;
};

export const getExplorerUrl = (chainId: number, hash: string, type: 'tx' | 'address' = 'tx'): string => {
  const chain = getChainById(chainId);
  if (!chain) return '#';
  return `${chain.explorerUrl}/${type}/${hash}`;
};

export const supportedChains = activeChains.map(config => config.chain);

export const customRpcUrls = activeChains.reduce((acc, config) => {
  acc[`eip155:${config.chain.id}` as const] = [config.rpcUrl];
  return acc;
}, {} as Record<string, string[]>);

export const chainImages = activeChains.reduce((acc, config) => {
  acc[config.chain.id] = `/assets/chains/${config.chain.id}.png`;
  return acc;
}, {} as Record<number, string>);