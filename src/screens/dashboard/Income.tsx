import { useEffect, useState, useRef } from "react";
import { useUnified } from "@/context/Context";
import { useDashboardCache } from "@/context/DashboardCacheContext";
import type { IncomeRecord, WithdrawalRecord } from "@/hooks/useWebAppService";
import { Loader2, Copy, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/atm/button";
import { Toast } from "@/components/ui/atm/toastMessage";
import { LoadingAnimation } from "@/components/ui/atm/loadingAnimation";
import { ConfirmationModal } from "@/components/ui/atm/confirmationModal";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/atm/tooltip";

/* ============================================================================
   CONSTANTS
   ============================================================================ */

const ITEMS_PER_PAGE = 20;

/* ============================================================================
   HELPERS
   ============================================================================ */

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  } catch {
    return dateStr;
  }
}

function formatNumber(num: number | undefined | null, decimals = 8): string {
  if (num === undefined || num === null || isNaN(num)) return "0";
  return num.toFixed(decimals);
}

/* ============================================================================
   INCOME TABLE
   ============================================================================ */

function IncomeTable({
  records,
  loading,
  error,
  onRetry,
}: {
  records: IncomeRecord[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const pageRecords = records.slice(startIdx, endIdx);

  useEffect(() => {
    setCurrentPage(1);
  }, [records.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[60px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
        <p className="body-text2-400 text-destructive">
          Failed to load income records
        </p>
        {onRetry && (
          <Button variant="soft" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex items-center justify-center py-[60px]">
        <p className="body-text2-400 text-[#959595]">
          No income records found
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="grid grid-cols-5 py-[14px] border-b border-[#F0F0F0]">
        <p className="body-text2-500 text-[#959595]">Date</p>
        <p className="body-text2-500 text-[#959595]">
          PR value income
          <br />
          <span className="body-label-400">(LUCA)</span>
        </p>
        <p className="body-text2-500 text-[#959595]">
          Server operation income
          <br />
          <span className="body-label-400">(LUCA)</span>
        </p>
        <p className="body-text2-500 text-[#959595]">
          Server stake income
          <br />
          <span className="body-label-400">(LUCA)</span>
        </p>
        <p className="body-text2-500 text-[#959595] text-right">
          Total <span className="body-label-400">(LUCA)</span>
        </p>
      </div>

      {/* Rows */}
      {pageRecords.map((record, i) => {
        const total =
          (record.pr || 0) +
          (record.topNodes || 0) +
          (record.pledge || 0) +
          (record.liquidity || 0);
        return (
          <div
            key={`${record.date}-${i}`}
            className="grid grid-cols-5 py-[14px] border-b border-[#F0F0F0] last:border-b-0"
          >
            <p className="body-text2-400 text-foreground">
              {formatDate(record.date)}
            </p>
            <p className="body-text2-400 text-foreground">
              {formatNumber(record.pr)}
            </p>
            <p className="body-text2-400 text-foreground">
              {formatNumber(record.topNodes)}
            </p>
            <p className="body-text2-400 text-foreground">
              {formatNumber(record.pledge)}
            </p>
            <p className="body-text2-400 text-foreground text-right">
              {formatNumber(total)}
            </p>
          </div>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-[4px] pt-[20px] pb-[8px]">
          <div className="flex items-center gap-[8px]">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-[6px] rounded-full hover:bg-[#F0F0F0] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-[18px] h-[18px] text-[#959595]" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-[28px] h-[28px] rounded-full body-text2-500 cursor-pointer transition-colors ${
                    page === currentPage
                      ? "bg-primary text-white"
                      : "text-[#959595] hover:bg-[#F0F0F0]"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="p-[6px] rounded-full hover:bg-[#F0F0F0] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-[18px] h-[18px] text-[#959595]" />
            </button>
          </div>

          <p className="body-label-400 text-[#959595]">
            {startIdx + 1}-{Math.min(endIdx, records.length)} of{" "}
            {records.length}
          </p>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   WITHDRAWAL TABLE
   ============================================================================ */

function WithdrawalTable({
  records,
  loading,
  error,
  onRetry,
}: {
  records: WithdrawalRecord[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const pageRecords = records.slice(startIdx, endIdx);

  useEffect(() => {
    setCurrentPage(1);
  }, [records.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[60px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
        <p className="body-text2-400 text-destructive">
          Failed to load withdrawal records
        </p>
        {onRetry && (
          <Button variant="soft" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex items-center justify-center py-[60px]">
        <p className="body-text2-400 text-[#959595]">
          No withdrawal records found
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="grid grid-cols-4 py-[14px] border-b border-[#F0F0F0]">
        <p className="body-text2-500 text-[#959595]">Date</p>
        <p className="body-text2-500 text-[#959595]">Amount (LUCA)</p>
        <p className="body-text2-500 text-[#959595]">Coin Type</p>
        <p className="body-text2-500 text-[#959595] text-right">
          Transaction Hash
        </p>
      </div>

      {/* Rows */}
      {pageRecords.map((record, i) => (
        <div
          key={`${record.transaction_hash}-${i}`}
          className="grid grid-cols-4 py-[14px] border-b border-[#F0F0F0] last:border-b-0"
        >
          <p className="body-text2-400 text-foreground">
            {formatDate(record.get_time || record.in_time)}
          </p>
          <p className="body-text2-400 text-foreground">
            {formatNumber(record.total_amount)}
          </p>
          <p className="body-text2-400 text-foreground">
            {record.coin_type || "LUCA"}
          </p>
          <p className="body-text2-400 text-primary text-right truncate">
            {record.transaction_hash
              ? `${record.transaction_hash.slice(0, 10)}...${record.transaction_hash.slice(-6)}`
              : "-"}
          </p>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-[4px] pt-[20px] pb-[8px]">
          <div className="flex items-center gap-[8px]">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-[6px] rounded-full hover:bg-[#F0F0F0] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-[18px] h-[18px] text-[#959595]" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-[28px] h-[28px] rounded-full body-text2-500 cursor-pointer transition-colors ${
                    page === currentPage
                      ? "bg-primary text-white"
                      : "text-[#959595] hover:bg-[#F0F0F0]"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="p-[6px] rounded-full hover:bg-[#F0F0F0] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-[18px] h-[18px] text-[#959595]" />
            </button>
          </div>

          <p className="body-label-400 text-[#959595]">
            {startIdx + 1}-{Math.min(endIdx, records.length)} of{" "}
            {records.length}
          </p>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   MAIN INCOME COMPONENT
   ============================================================================ */

const Income = () => {
  const {
    address,
    isConnected,
    isAuthenticated,
    withdrawalBalance,
    isLoadingBalance,
    balanceError,
    refreshBalance,
    withdrawLUCA,
    isWithdrawing,
    withdrawError,
    lastTransactionHash,
  } = useUnified();

  // Dashboard cache
  const {
    incomeData,
    incomeLoading,
    incomeError: cacheIncomeError,
    fetchIncomeData,
    invalidateIncome,
  } = useDashboardCache();

  // State
  const [activeTab, setActiveTab] = useState<"income" | "withdrawal">(
    "income"
  );
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Derive data from cache
  const incomeRecords = incomeData?.incomeRecords ?? [];
  const withdrawalRecords = incomeData?.withdrawalRecords ?? [];
  const isLoadingIncome = incomeLoading && !incomeData;
  const isLoadingWithdrawal = incomeLoading && !incomeData;
  const incomeError = cacheIncomeError;
  const withdrawalError = cacheIncomeError;

  // Display address
  const displayAddress = address || "";

  // Copy address
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setToast({ message: "Address copied to clipboard", type: "success" });
    }
  };

  // Load balance when authenticated
  useEffect(() => {
    if (
      isAuthenticated &&
      withdrawalBalance === null &&
      !isLoadingBalance &&
      !balanceError
    ) {
      refreshBalance();
    }
  }, [
    isAuthenticated,
    withdrawalBalance,
    isLoadingBalance,
    balanceError,
    refreshBalance,
  ]);

  // Fetch records function (reusable for retry — invalidates cache then re-fetches)
  const fetchRecords = async () => {
    invalidateIncome();
    await fetchIncomeData();
  };

  // Fetch records on auth (uses cache — won't re-fetch if data is fresh)
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchIncomeData();
  }, [isAuthenticated, fetchIncomeData]);

  // Handle withdraw click
  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setToast({ message: "Please enter a valid amount", type: "error" });
      return;
    }
    if (withdrawalBalance !== null && amount > withdrawalBalance) {
      setToast({ message: "Insufficient balance", type: "error" });
      return;
    }
    setShowConfirmModal(true);
  };

  // Confirm withdrawal
  const confirmWithdrawal = async () => {
    setShowConfirmModal(false);
    const amount = parseFloat(withdrawAmount);
    const result = await withdrawLUCA(amount);

    if (result.success) {
      setToast({
        message: `Withdrawal successful! TX: ${result.transactionHash?.slice(0, 10)}...`,
        type: "success",
      });
      setWithdrawAmount("");
      // Re-fetch records after withdrawal
      invalidateIncome();
    } else {
      setToast({
        message: result.error || "Withdrawal failed",
        type: "error",
      });
    }
  };

  // Show spinner while auto-auth is in progress
  if (!isConnected || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="body-text1-400 text-[#959595]">
            Connecting wallet...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-[20px]">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Loading overlay */}
      <LoadingAnimation isVisible={isWithdrawing} />

      {/* Confirmation modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Confirm Withdrawal"
        description={`You are about to withdraw ${withdrawAmount} LUCA to your wallet.`}
        message="Gas fees will be deducted from the withdrawal amount. This action cannot be undone."
        confirmText="Confirm"
        cancelText="Cancel"
        confirmVariant="default"
        onConfirm={confirmWithdrawal}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* ============ TOP ROW: Available Income + Withdraw ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-[20px]">
        {/* Available Income Card */}
        <div className="lg:col-span-3 bg-primary rounded-[15px] p-[24px] text-white">
          <p className="body-text2-400 text-white/80 mb-[8px]">
            Available income
          </p>

          {isLoadingBalance ? (
            <div className="mb-[16px]">
              <Loader2 className="w-10 h-10 animate-spin inline text-white" />
            </div>
          ) : balanceError ? (
            <div className="mb-[16px]">
              <p className="body-text2-400 text-red-200 mb-[8px]">
                Error loading balance
              </p>
              <button
                onClick={refreshBalance}
                className="body-text2-400 text-white underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : (
            <h1 className="font-h2 text-white mb-[16px]">
              {withdrawalBalance !== null
                ? formatNumber(withdrawalBalance, 8)
                : "0.00000000"}{" "}
              LUCA
            </h1>
          )}

          <p className="body-label-400 text-white/80 leading-relaxed">
            The total available revenue can be withdrawn directly to your
            Ethereum wallet, and the corresponding gas fee will be deducted from
            the withdrawal revenue. Every time you withdraw, all proceeds will
            be withdrawn to the wallet address, and you must wait for the
            withdrawn funds to arrive in your account before a new withdrawal
            operation can be performed.
          </p>
        </div>

        {/* Withdraw Card */}
        <div className="lg:col-span-2 bg-white rounded-[15px] p-[24px]">
          <h3 className="body-text1-500 text-foreground mb-[12px]">
            Withdraw
          </h3>

          <div className="flex items-center gap-[6px] mb-[12px]">
            <p className="body-text2-400 text-[#959595]">
              Binance Smart Chain is the only way to withdraw income.
            </p>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="cursor-pointer">
                  <Info className="w-[14px] h-[14px] text-[#959595]" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Withdrawals are processed on BSC. Gas fees are deducted
                  automatically.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Wallet address */}
          <div className="flex items-center gap-[8px] mb-[16px]">
            <button
              onClick={copyAddress}
              className="cursor-pointer hover:opacity-70 transition-opacity"
            >
              <Copy className="w-[14px] h-[14px] text-[#959595]" />
            </button>
            <p className="body-text2-400 text-foreground truncate">
              {displayAddress}
            </p>
          </div>

          {/* Amount input */}
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="0"
            min="0"
            step="any"
            className="w-full px-[16px] py-[14px] mb-[16px] rounded-[10px] border border-[#E0E0E0] bg-white text-foreground body-text1-400 outline-none focus:border-primary transition-colors placeholder:text-[#C0C0C0]"
          />

          {/* Withdraw button */}
          <Button
            variant="success"
            size="lg"
            className="w-full"
            onClick={handleWithdraw}
            disabled={
              isWithdrawing ||
              isLoadingBalance ||
              !withdrawAmount ||
              parseFloat(withdrawAmount) <= 0
            }
          >
            {isWithdrawing ? (
              <span className="flex items-center gap-[8px]">
                <Loader2 className="w-4 h-4 animate-spin" />
                Withdrawing...
              </span>
            ) : (
              "Withdraw"
            )}
          </Button>

          {/* Error / Success */}
          {withdrawError && (
            <p className="body-label-400 text-red-500 mt-[8px]">
              {withdrawError}
            </p>
          )}
          {lastTransactionHash && (
            <p className="body-label-400 text-[#5DD27A] mt-[8px]">
              TX: {lastTransactionHash.slice(0, 16)}...
            </p>
          )}
        </div>
      </div>

      {/* ============ TAB SECTION ============ */}
      <div className="bg-white rounded-[15px] p-[24px]">
        {/* Tabs */}
        <div className="flex items-center gap-[24px] mb-[20px] border-b border-[#F0F0F0]">
          <button
            onClick={() => setActiveTab("income")}
            className={`pb-[12px] body-text1-500 cursor-pointer transition-colors relative ${
              activeTab === "income"
                ? "text-foreground"
                : "text-[#959595] hover:text-foreground"
            }`}
          >
            Income records
            {activeTab === "income" && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("withdrawal")}
            className={`pb-[12px] body-text1-500 cursor-pointer transition-colors relative ${
              activeTab === "withdrawal"
                ? "text-foreground"
                : "text-[#959595] hover:text-foreground"
            }`}
          >
            Withdrawal records
            {activeTab === "withdrawal" && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === "income" ? (
          <IncomeTable
            records={incomeRecords}
            loading={isLoadingIncome}
            error={incomeError}
            onRetry={fetchRecords}
          />
        ) : (
          <WithdrawalTable
            records={withdrawalRecords}
            loading={isLoadingWithdrawal}
            error={withdrawalError}
            onRetry={fetchRecords}
          />
        )}
      </div>
    </div>
  );
};

export default Income;
