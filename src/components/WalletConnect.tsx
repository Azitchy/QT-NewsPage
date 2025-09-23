import React, { useState, useEffect } from 'react';
import { Wallet, AlertCircle, Loader2, CheckCircle, ArrowRight, Shield, Key } from 'lucide-react';
import { useWeb3Auth } from '../contexts/Web3AuthContext';

export const WalletConnect: React.FC = () => {
  const { connectWallet, isConnecting, error, isAuthenticated } = useWeb3Auth();
  const [connectionStep, setConnectionStep] = useState<'idle' | 'connecting' | 'requesting-nonce' | 'signing' | 'verifying' | 'success'>('idle');

  // Update step based on connection state
  useEffect(() => {
    if (isConnecting) {
      // Simulate the steps during connection
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
      // Reset after showing success
      const resetTimer = setTimeout(() => {
        setConnectionStep('idle');
      }, 2000);
      return () => clearTimeout(resetTimer);
    } else {
      setConnectionStep('idle');
    }
  }, [isConnecting, isAuthenticated]);

  const handleConnect = async () => {
    try {
      await connectWallet();
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
      icon: Wallet 
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

  return (
    <div className="space-y-6">
      {/* SIWE Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Sign-In with Ethereum (SIWE)
            </h3>
            <p className="text-sm text-blue-700">
              This app uses SIWE for secure authentication. You'll sign a message 
              to prove wallet ownership without sharing your private keys.
            </p>
          </div>
        </div>
      </div>

      {/* Connection Progress */}
      {(isConnecting || connectionStep !== 'idle') && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Authentication Progress
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
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
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
                      status === 'active' ? 'text-blue-700' : 
                      status === 'completed' ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </div>
                    <div className="text-xs text-gray-600">
                      {step.description}
                    </div>
                  </div>
                  {status === 'active' && step.id === 'signing' && (
                    <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      Check your wallet
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-medium text-red-800 mb-1">
              Authentication Failed
            </div>
            <div className="text-sm text-red-700 mb-2">{error}</div>
            {error.includes('MetaMask') && (
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 underline"
              >
                Download MetaMask
              </a>
            )}
          </div>
        </div>
      )}

      {/* Main connect button */}
      <button
        onClick={handleConnect}
        disabled={isConnecting || connectionStep === 'success'}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-400 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
      >
        {connectionStep === 'success' ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Success! Redirecting...
          </>
        ) : isConnecting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Shield className="w-5 h-5" />
            Sign-In with Ethereum
            <ArrowRight className="w-4 h-4 ml-1" />
          </>
        )}
      </button>

      {/* Supported wallets info */}
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600">
          Supported wallets:
        </p>
        <div className="flex justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl">
            <img 
              src="\webapp\MetaMask-icon-fox.svg" 
              alt="MetaMask" 
              className="w-6 h-6"
            />
            <div>
              <div className="text-sm font-medium text-gray-800">MetaMask</div>
              <div className="text-xs text-gray-500">Recommended</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};