// components/ProtectedRoute.tsx
import * as React from "react";
import { useState, useEffect } from "react";
import { useWeb3Auth } from '../contexts/Web3AuthContext';
import { WalletConnect } from './WalletConnect';
import { Loader2, Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isConnecting, session } = useWeb3Auth();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      if (session) {
        await new Promise(resolve => setTimeout(resolve, 500)); 
      }
      setIsValidating(false);
    };

    validateSession();
  }, [session]);

  // Show loading state during initial validation
  if (isValidating) {
    return (
      <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-white dark:bg-[#1a1d2e]">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="w-12 h-12 text-gray-300 dark:text-gray-600" />
              <Loader2 className="w-6 h-6 text-[#0DAEB9] animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Validating Session
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Please wait while we verify your authentication...
          </p>
        </div>
      </div>
    );
  }

  // Show authentication required screen with WalletConnect component
  if (!isAuthenticated) {
    return <WalletConnect />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};