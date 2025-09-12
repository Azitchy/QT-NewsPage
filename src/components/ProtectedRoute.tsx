// components/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { useWeb3Auth } from '../contexts/Web3AuthContext';
import { WalletConnect } from './WalletConnect';
import { Loader2, Shield, CheckCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isConnecting, session, error } = useWeb3Auth();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // Simulate session validation process
    const validateSession = async () => {
      if (session) {
        // Add any additional validation logic here
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate validation delay
      }
      setIsValidating(false);
    };

    validateSession();
  }, [session]);

  // Show loading state during initial validation
  if (isValidating) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Shield className="w-12 h-12 text-gray-300" />
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Validating Session
            </h2>
            <p className="text-gray-500">
              Please wait while we verify your authentication...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show authentication required screen
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-1 items-center justify-center p-4">
          <div className="max-w-md w-full mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Web3 Authentication
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  Secure access to the WebApp using your cryptocurrency wallet. 
                  Your private keys remain safe and are never stored.
                </p>
              </div>

              <WalletConnect />

            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};