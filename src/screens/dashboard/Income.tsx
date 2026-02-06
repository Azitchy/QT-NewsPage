import { useEffect } from "react";
import { useUnified } from "../../context/Context";
import { Loader2, Wallet, Info } from "lucide-react";

const Income = () => {
  const {
    address,
    isConnected,
    openModal,
    isAuthenticated,
    isAuthenticating,
    authError,
    authenticate,
    withdrawalBalance,
    isLoadingBalance,
    balanceError,
    refreshBalance,
  } = useUnified();

  // Load balance when authenticated (only if no error)
  useEffect(() => {
    if (isAuthenticated && withdrawalBalance === null && !isLoadingBalance && !balanceError) {
      refreshBalance();
    }
  }, [isAuthenticated, withdrawalBalance, isLoadingBalance, balanceError, refreshBalance]);

  // Show connect wallet screen
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 text-[#0DAEB9]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Connect Wallet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please connect your wallet to view your income dashboard
          </p>
          <button
            onClick={openModal}
            className="px-6 py-3 bg-[#0DAEB9] hover:bg-[#0c9aa3] text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
          >
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  // Show sign message screen
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 text-[#0DAEB9]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {isAuthenticating ? "Authenticating..." : "Sign to Continue"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {isAuthenticating
              ? "Please sign the message in your wallet to authenticate"
              : "Sign a message with your wallet to authenticate and access your income"}
          </p>

          {authError && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-300">
                {authError}
              </p>
            </div>
          )}

          {!isAuthenticating && (
            <button
              onClick={authenticate}
              className="px-6 py-3 bg-[#0DAEB9] hover:bg-[#0c9aa3] text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <Wallet className="w-5 h-5" />
              Sign Message
            </button>
          )}

          {isAuthenticating && (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#0DAEB9]" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Waiting for signature...
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show income dashboard
  return (
    <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="bg-primary rounded-lg p-8 text-white">
          <h3 className="text-lg font-medium mb-4">Available Income</h3>

          <p className="text-sm mb-10 leading-relaxed">
            The total available revenue can be withdrawn directly to your
            Ethereum wallet, and the corresponding gas fee will be deducted from
            the withdrawal revenue.
          </p>

          {isLoadingBalance ? (
            <div className="text-4xl font-normal mb-10">
              <Loader2 className="w-10 h-10 animate-spin inline" />
            </div>
          ) : balanceError ? (
            <div className="mb-10">
              <div className="text-red-200 text-sm mb-4">
                Error loading balance: {balanceError}
              </div>
              <button
                onClick={refreshBalance}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="text-5xl font-normal mb-10">
                {withdrawalBalance !== null
                  ? withdrawalBalance.toFixed(7)
                  : "0.0000000"}{" "}
                LUCA
              </div>

              <hr className="border-white border-dashed mb-10" />

              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-normal text-sm mb-2">
                    Withdrawal Notes
                  </h4>
                  <p className="text-sm">
                    Binance Smart Chain only. Gas fees deducted from withdrawal.
                    All proceeds will be withdrawn to your wallet address.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Connected wallet info */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Connected Wallet
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                {address}
              </p>
            </div>
            <button
              onClick={refreshBalance}
              disabled={isLoadingBalance}
              className="px-4 py-2 bg-[#0DAEB9] hover:bg-[#0c9aa3] text-white rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoadingBalance ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                "Refresh Balance"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Income;
