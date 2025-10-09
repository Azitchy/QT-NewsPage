import * as React from "react";
import { useState, useEffect } from "react";
import { AlertCircle, Loader2, CheckCircle, Shield, Key } from 'lucide-react';
import { useWeb3Auth, WalletType } from '../contexts/Web3AuthContext';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WALLET_OPTIONS: Array<{type: WalletType; name: string; icon: string}> = [
  { type: 'metamask', name: 'MetaMask', icon: '/webapp/MetaMask-icon-fox.svg' },
  { type: 'walletconnect', name: 'WalletConnect', icon: 'https://avatars.githubusercontent.com/u/37784886' },
  { type: 'coinbase', name: 'Coinbase Wallet', icon: 'https://www.coinbase.com/img/favicon/favicon-32x32.png' },
];

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { connectWallet, isConnecting, error, isAuthenticated } = useWeb3Auth();
  const [connectionStep, setConnectionStep] = useState<'idle' | 'connecting' | 'requesting-nonce' | 'signing' | 'verifying' | 'success'>('idle');
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);

  useEffect(() => {
    if (isConnecting) {
      setConnectionStep('connecting');
      
      const stepTimer = setTimeout(() => {
        setConnectionStep('requesting-nonce');
        
        setTimeout(() => {
          setConnectionStep('signing');
        }, 1000);
      }, 500);

      return () => clearTimeout(stepTimer);
    } else if (isAuthenticated) {
      setConnectionStep('success');
      const resetTimer = setTimeout(() => {
        setConnectionStep('idle');
        onClose();
      }, 2000);
      return () => clearTimeout(resetTimer);
    } else {
      setConnectionStep('idle');
    }
  }, [isConnecting, isAuthenticated, onClose]);

  const handleConnect = async (walletType: WalletType) => {
    setSelectedWallet(walletType);
    try {
      await connectWallet(walletType);
    } catch (err) {
      setConnectionStep('idle');
      console.error('Connection failed:', err);
    }
  };

  const getStepStatus = (step: string) => {
    const steps = ['connecting', 'requesting-nonce', 'signing', 'verifying', 'success'];
    const currentIndex = steps.indexOf(connectionStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const connectionSteps = [
    { 
      id: 'connecting', 
      label: 'Connect Wallet', 
      description: 'Opening wallet connection',
      icon: Shield
    },
    { 
      id: 'requesting-nonce', 
      label: 'Request Nonce', 
      description: 'Getting authentication challenge',
      icon: Key 
    },
    { 
      id: 'signing', 
      label: 'Sign Message', 
      description: 'Sign with your private key',
      icon: Shield 
    },
    { 
      id: 'success', 
      label: 'Access Granted', 
      description: 'Successfully authenticated!',
      icon: CheckCircle 
    }
  ];

  const wallets = WALLET_OPTIONS.map(option => ({
    ...option,
    isInstalled: option.type === 'metamask' 
      ? typeof window !== 'undefined' && window.ethereum?.isMetaMask
      : true,
  }));

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-white dark:bg-[#2B2F3E] rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Content */}
        <div className="space-y-6">
          {/* Wallet Options */}
          {!isConnecting && connectionStep === 'idle' && (
            <div className="space-y-3">
              
              {wallets.map((wallet) => (
                <button
                  key={wallet.type}
                  onClick={() => handleConnect(wallet.type)}
                  disabled={!wallet.isInstalled && wallet.type === 'metamask'}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    wallet.isInstalled
                      ? 'border-gray-200 dark:border-gray-700 hover:border-[#0DAEB9] dark:hover:border-[#0DAEB9] bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
                      : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <img 
                      src={wallet.icon} 
                      alt={wallet.name} 
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/webapp/default-wallet-icon.svg';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {wallet.name}
                    </div>
                  </div>

                  {wallet.isInstalled ? (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                  ) : (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Not installed
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Connection Progress */}
          {(isConnecting || connectionStep !== 'idle') && connectionStep !== 'success' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Authentication Progress
                {selectedWallet && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({wallets.find(w => w.type === selectedWallet)?.name})
                  </span>
                )}
              </h3>
              <div className="space-y-3">
                {connectionSteps.map((step) => {
                  const status = getStepStatus(step.id);
                  const IconComponent = step.icon;
                  
                  return (
                    <div key={step.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        status === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : status === 'active'
                          ? 'bg-[#0DAEB9] text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}>
                        {status === 'completed' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : status === 'active' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <IconComponent className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${
                          status === 'active' ? 'text-[#0DAEB9] dark:text-[#0DAEB9]' : 
                          status === 'completed' ? 'text-green-700 dark:text-green-300' : 
                          'text-gray-500 dark:text-gray-400'
                        }`}>
                          {step.label}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {step.description}
                        </div>
                      </div>
                      {status === 'active' && step.id === 'signing' && (
                        <div className="text-xs text-[#0DAEB9] dark:text-[#0DAEB9] bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                          Check your wallet
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Success State */}
          {connectionStep === 'success' && (
            <div className="flex items-center justify-center p-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
              <div>
                <div className="text-sm font-medium text-green-800 dark:text-green-200">
                  Success! Redirecting...
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                  Authentication Failed
                </div>
                <div className="text-sm text-red-700 dark:text-red-300">{error}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};