import * as React from "react";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { Web3 } from 'web3';
import { useWeb3Auth } from './Web3AuthContext';

import UserManagerABI from '../contracts/userManager.json';
import GameManagerABI from '../contracts/gameManager.json';
import FactoryABI from '../contracts/factory.json';
import GamePropsLinkABI from '../contracts/gamePropsLink.json';
import ERC20ABI from '../contracts/erc20.json';
import AtmStarTokenABI from '../contracts/atmStarToken.json';
import ERC721ABI from '../contracts/nft.json';
import AGFManagerABI from '../contracts/AGFManagerABI.json';
import LucaVoidABI from '../contracts/LucaVoid.json';
import CrosschainABI from '../contracts/crosschain.json';
import PledgeABI from '../contracts/pledge.json';

interface ContractAddresses {
  [chainId: string]: {
    [contractName: string]: string;
  };
}

interface BlockchainContextType {
  web3: Web3 | null;
  isInitialized: boolean;
  currentChainId: string | null;
  contractAddresses: ContractAddresses;
  
  getContract: (contractName: string) => any;
  getTokenContract: (tokenName: string) => any;
  getTokenContractByAddress: (address: string) => any;
  getContractAddress: (contractName: string) => string | null;
  
  switchToSupportedChain: () => Promise<boolean>;
  getPersonalSign: (message: string) => Promise<{ data: string | null; isError: boolean; message: string }>;
  
  executeContractMethod: (contract: any, method: string, params: any[], value?: string) => Promise<any>;
  getTokenBalance: (tokenAddress: string, userAddress: string) => Promise<string>;
  approveToken: (tokenAddress: string, spenderAddress: string, amount: string) => Promise<any>;
  
  getNFTOwner: (tokenId: string | number) => Promise<string | null>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

const BSC_MAINNET = '0x38';
const BSC_TESTNET = '0x61';
const CURRENT_CHAIN = BSC_MAINNET;

const CONTRACT_ADDRESSES: ContractAddresses = {
  [BSC_MAINNET]: {
    GameProps: '0x0393490721e52155b84915b8e2a2a286e8d053c5',
    GameManager: '0xB51015C85d7D46EC2d844B22B58D41a799C7b112',
    CreateConnectionFactory: '0x50249e6dB2d98b314e2A843D5b642F162DA2099F',
    UserManager: '0x2251ac7072611aD6d08A6ED201a1045b1E69e31F',
    AtmStar: '0xa1Bf6208846E38EF40B185A849b3000ac5dc71cE',
    AGFManager: '0x172b5D9Afd4f411d201621718269A9BeFE9370e2',
    LUCA: '0x51E6Ac1533032E72e92094867fD5921e3ea1bfa0',
    USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    USDT: '0x55d398326f99059fF775485246999027B3197955',
    LucaVoid: '0xbA664Eb753bD75cE86EF1F0B651ABF4Ad0D9C30A',
    AGFNFT: '0xD2Be63dA93DC6df8045aBcEcab76380c21E317e8',
    TokenWhitelist: '0xEa03c9ca58Cb19F5aFE3A854B2ae0CC439e56658',
    Crosschain: '0x0393490721e52155b84915b8e2a2a286e8d053c5',
    Pledge: '0xEC56a45abFf41DF1746fDf4dedc45E909601aa02'
  },
  [BSC_TESTNET]: {
    GameProps: '0x0393490721e52155b84915b8e2a2a286e8d053c5',
    GameManager: '0xB51015C85d7D46EC2d844B22B58D41a799C7b112',
    CreateConnectionFactory: '0x50249e6dB2d98b314e2A843D5b642F162DA2099F',
    UserManager: '0x2251ac7072611aD6d08A6ED201a1045b1E69e31F',
    AtmStar: '0xa1Bf6208846E38EF40B185A849b3000ac5dc71cE',
    AGFManager: '0xC8b3Ef97d5ee7416cA9A1dc19D2dFe935D0f4A4f',
    LUCA: '0xD7a1cA21D73ff98Cc64A81153eD8eF89C2a1EfEF',
    USDC: '0xD7a1cA21D73ff98Cc64A81153eD8eF89C2a1EfEF',
    USDT: '0x18083a14d319E6AAee7c1355f00B94c65C845ADf',
    AGT: '0x18083a14d319E6AAee7c1355f00B94c65C845ADf',
    LucaVoid: '0xbA664Eb753bD75cE86EF1F0B651ABF4Ad0D9C30A',
    AGFNFT: '0xD2Be63dA93DC6df8045aBcEcab76380c21E317e8',
    TokenWhitelist: '0xEa03c9ca58Cb19F5aFE3A854B2ae0CC439e56658',
    Crosschain: '0x0393490721e52155b84915b8e2a2a286e8d053c5',
    Pledge: '0xEC56a45abFf41DF1746fDf4dedc45E909601aa02'
  }
};

const RPC_URLS = {
  [BSC_MAINNET]: 'https://bsc-dataseed.binance.org/',
  [BSC_TESTNET]: 'https://data-seed-prebsc-1-s1.binance.org:8545'
};

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { wallet, isAuthenticated } = useWeb3Auth();
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentChainId, setCurrentChainId] = useState<string | null>(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        if (wallet && wallet.provider) {
          const web3Instance = new Web3(wallet.provider);
          setWeb3(web3Instance);
          
          const chainId = await web3Instance.eth.getChainId();
          const chainIdHex = '0x' + chainId.toString(16);
          setCurrentChainId(chainIdHex);
          
          console.log('Web3 initialized with wallet, chain ID:', chainIdHex);
        } else {
          const web3Instance = new Web3(RPC_URLS[CURRENT_CHAIN]);
          setWeb3(web3Instance);
          setCurrentChainId(CURRENT_CHAIN);
          
          console.log('Web3 initialized with RPC, chain ID:', CURRENT_CHAIN);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Web3:', error);
        setIsInitialized(false);
      }
    };

    initializeWeb3();
  }, [wallet?.provider, isAuthenticated]);

  const switchToSupportedChain = async (): Promise<boolean> => {
    if (!wallet?.provider) {
      console.error('No wallet provider available');
      return false;
    }

    try {
      const targetChainId = CURRENT_CHAIN;
      
      await wallet.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      });

      setCurrentChainId(targetChainId);
      console.log(`Switched to chain ${targetChainId}`);
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          const chainConfig = {
            chainId: CURRENT_CHAIN,
            chainName: CURRENT_CHAIN.toLowerCase() === BSC_MAINNET.toLowerCase() ? 'Binance Smart Chain' : 'BSC Testnet',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'BNB',
              decimals: 18,
            },
            rpcUrls: [RPC_URLS[CURRENT_CHAIN]],
            blockExplorerUrls: [
              CURRENT_CHAIN.toLowerCase() === BSC_MAINNET.toLowerCase() ? 'https://bscscan.com/' : 'https://testnet.bscscan.com/'
            ],
          };

          await wallet.provider.request({
            method: 'wallet_addEthereumChain',
            params: [chainConfig],
          });

          setCurrentChainId(CURRENT_CHAIN);
          console.log(`Added and switched to chain ${CURRENT_CHAIN}`);
          return true;
        } catch (addError) {
          console.error('Failed to add chain:', addError);
          return false;
        }
      } else {
        console.error('Failed to switch chain:', switchError);
        return false;
      }
    }
  };

  const getContractAddress = useCallback((contractName: string): string | null => {
    const chainId = currentChainId || CURRENT_CHAIN;
    const address = CONTRACT_ADDRESSES[chainId]?.[contractName] || null;
    
    console.log(`Getting contract address for ${contractName} on chain ${chainId}:`, address);
    
    return address;
  }, [currentChainId]);

  const getContract = useCallback((contractName: string): any => {
    if (!web3) {
      console.error('Web3 not initialized');
      return null;
    }

    const address = getContractAddress(contractName);
    if (!address) {
      console.error(`Contract address not found for ${contractName} on chain ${currentChainId}`);
      return null;
    }

    let abi;
    switch (contractName) {
      case 'GameProps':
        abi = GamePropsLinkABI;
        break;
      case 'GameManager':
        abi = GameManagerABI;
        break;
      case 'CreateConnectionFactory':
        abi = FactoryABI;
        break;
      case 'UserManager':
        abi = UserManagerABI;
        break;
      case 'AGFManager':
        abi = AGFManagerABI;
        break;
      case 'LucaVoid':
        abi = LucaVoidABI;
        break;
      case 'AGFNFT':
        abi = ERC721ABI;
        break;
      case 'AtmStar':
        abi = AtmStarTokenABI;
        break;
      case 'Crosschain':
        abi = CrosschainABI;
        break;
      case 'Pledge':
        abi = PledgeABI;
        break;
      default:
        console.error(`Unknown contract: ${contractName}`);
        return null;
    }

    try {
      return new web3.eth.Contract(abi as any, address);
    } catch (error) {
      console.error(`Failed to create contract instance for ${contractName}:`, error);
      return null;
    }
  }, [web3, currentChainId, getContractAddress]);

  const getTokenContract = useCallback((tokenName: string): any => {
    if (!web3) {
      console.error('Web3 not initialized');
      return null;
    }

    const address = getContractAddress(tokenName);
    if (!address) {
      console.error(`Token address not found for ${tokenName} on chain ${currentChainId}`);
      return null;
    }

    let abi;
    switch (tokenName) {
      case 'AtmStar':
        abi = AtmStarTokenABI;
        break;
      case 'LUCA':
      case 'USDC':
      case 'USDT':
      case 'AGT':
      default:
        abi = ERC20ABI;
        break;
    }

    try {
      return new web3.eth.Contract(abi as any, address);
    } catch (error) {
      console.error(`Failed to create token contract instance for ${tokenName}:`, error);
      return null;
    }
  }, [web3, currentChainId, getContractAddress]);

  const getTokenContractByAddress = useCallback((address: string): any => {
    if (!web3) {
      console.error('Web3 not initialized');
      return null;
    }

    try {
      return new web3.eth.Contract(ERC20ABI as any, address);
    } catch (error) {
      console.error(`Failed to create token contract instance for address ${address}:`, error);
      return null;
    }
  }, [web3]);

  const getPersonalSign = useCallback(async (message: string): Promise<{ data: string | null; isError: boolean; message: string }> => {
    if (!wallet?.address || !web3) {
      return {
        data: null,
        isError: true,
        message: 'Wallet not connected or Web3 not initialized'
      };
    }

    try {
      const signature = await web3.eth.personal.sign(message, wallet.address, '');
      return {
        data: signature,
        isError: false,
        message: 'Signature successful'
      };
    } catch (error: any) {
      console.error('Error signing message:', error);
      return {
        data: null,
        isError: true,
        message: error.message || 'Failed to sign message'
      };
    }
  }, [wallet?.address, web3]);

  const executeContractMethod = useCallback(async (
    contract: any,
    method: string,
    params: any[] = [],
    value: string = '0'
  ): Promise<any> => {
    if (!contract || !wallet?.address) {
      throw new Error('Contract or wallet not available');
    }

    try {
      const gasPrice = await web3!.eth.getGasPrice();
      const gasEstimate = await contract.methods[method](...params).estimateGas({
        from: wallet.address,
        value: web3!.utils.toWei(value, 'ether')
      });

      const result = await contract.methods[method](...params).send({
        from: wallet.address,
        gas: gasEstimate,
        gasPrice: gasPrice,
        value: web3!.utils.toWei(value, 'ether')
      });

      return result;
    } catch (error: any) {
      console.error(`Failed to execute ${method}:`, error);
      throw error;
    }
  }, [wallet?.address, web3]);

  const getTokenBalance = useCallback(async (tokenAddress: string, userAddress: string): Promise<string> => {
    const contract = getTokenContractByAddress(tokenAddress);
    if (!contract) {
      throw new Error('Failed to get token contract');
    }

    try {
      const balance = await contract.methods.balanceOf(userAddress).call();
      const decimals = await contract.methods.decimals().call();
      return (Number(balance) / Math.pow(10, Number(decimals))).toFixed(4);
    } catch (error) {
      console.error('Failed to get token balance:', error);
      throw error;
    }
  }, [getTokenContractByAddress]);

  const approveToken = useCallback(async (tokenAddress: string, spenderAddress: string, amount: string): Promise<any> => {
    const contract = getTokenContractByAddress(tokenAddress);
    if (!contract || !wallet?.address) {
      throw new Error('Contract or wallet not available');
    }

    try {
      const decimals = await contract.methods.decimals().call();
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, Number(decimals))));

      return await executeContractMethod(contract, 'approve', [spenderAddress, amountInWei.toString()]);
    } catch (error) {
      console.error('Failed to approve token:', error);
      throw error;
    }
  }, [getTokenContractByAddress, wallet?.address, executeContractMethod]);

  const getNFTOwner = useCallback(async (tokenId: string | number): Promise<string | null> => {
    console.log('=== getNFTOwner called ===');
    console.log('Token ID:', tokenId);
    console.log('Web3 initialized:', !!web3);
    console.log('Current chain:', currentChainId);
    
    if (!web3) {
      console.error('Web3 not initialized');
      return null;
    }

    try {
      const contractAddress = getContractAddress('AGFNFT');
      console.log('AGFNFT contract address:', contractAddress);
      
      if (!contractAddress) {
        console.error(`AGFNFT contract address not found on chain ${currentChainId}`);
        return null;
      }

      const nftContract = new web3.eth.Contract(ERC721ABI as any, contractAddress);
      console.log('NFT Contract created:', !!nftContract);
      console.log('NFT Contract address:', nftContract.options.address);
      
      if (!nftContract.methods.ownerOf) {
        console.error('ownerOf method not found in contract ABI');
        return null;
      }
      
      console.log('Calling ownerOf for token ID:', tokenId);
      const owner = await nftContract.methods.ownerOf(tokenId).call() as unknown;
      console.log('✅ Owner address retrieved:', owner);
      
      if (typeof owner === 'string') {
        return owner;
      }
      
      console.error('Owner address is not a string:', typeof owner, owner);
      return null;
    } catch (error: any) {
      console.error('❌ Error in getNFTOwner:', error);
      console.error('Error message:', error?.message);
      console.error('Error data:', error?.data);
      return null;
    }
  }, [web3, currentChainId, getContractAddress]);

  const contextValue: BlockchainContextType = {
    web3,
    isInitialized,
    currentChainId,
    contractAddresses: CONTRACT_ADDRESSES,
    getContract,
    getTokenContract,
    getTokenContractByAddress,
    getContractAddress,
    switchToSupportedChain,
    getPersonalSign,
    executeContractMethod,
    getTokenBalance,
    approveToken,
    getNFTOwner
  };

  return (
    <BlockchainContext.Provider value={contextValue}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = (): BlockchainContextType => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};