// Trading tools.tsx
import React from "react";
import { useWeb3Auth } from "@/contexts/Web3AuthContext";
import { Shield, Zap } from "lucide-react";

export const TradingTools = (): JSX.Element => {
  const { session, checkLUCASupport } = useWeb3Auth();

  const isNetworkSupported = checkLUCASupport();

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Trading tools
            </h3>
            <p className="text-gray-500 mb-4">
              This section is under development and will be available soon.
            </p>
            {session && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <Shield className="w-4 h-4" />
                <span>Authenticated and ready for access</span>
              </div>
            )}
            {isNetworkSupported && (
              <div className="flex items-center justify-center gap-2 text-sm text-blue-600 mt-2">
                <Zap className="w-4 h-4" />
                <span>LUCA token support enabled</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};