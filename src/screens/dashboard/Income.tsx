import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useUnified } from "@/context/Context";
import { useDashboardCache } from "@/context/DashboardCacheContext";
import type { IncomeRecord, WithdrawalRecord } from "@/hooks/useWebAppService";
import { Copy, Info } from "lucide-react";
import Pagination from "@/components/ui/atm/pagination";
import { Button } from "@/components/ui/atm/button";
import { Toast } from "@/components/ui/atm/toastMessage";
import { LoadingAnimation } from "@/components/ui/atm/loadingAnimation";
import { ConfirmationModal } from "@/components/ui/atm/confirmationModal";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/atm/tooltip";
import WalletIcon from "@/assets/icons/wallet-icon.svg?react";

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
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE);
  const clampedPage = Math.min(currentPage, Math.max(1, totalPages));
  const startIdx = (clampedPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const pageRecords = records.slice(startIdx, endIdx);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
        <p className="body-text2-400 text-destructive">
          {t("income.failedToLoadIncomeRecords")}
        </p>
        {onRetry && (
          <Button variant="soft" size="sm" onClick={onRetry}>
            {t("common.retry")}
          </Button>
        )}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <>
        <LoadingAnimation isVisible={loading} />
        <div className="flex items-center justify-center py-[60px]">
          <p className="body-text2-400 text-[#878787]">
            {t("income.noIncomeRecordsFound")}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <LoadingAnimation isVisible={loading} />
      <div className="bg-white rounded-[15px] p-[20px]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0F0F0]">
                <th className="px-[15px] py-[20px] text-left body-text1-400 text-foreground font-medium">
                  {t("common.date")}
                </th>
                <th className="px-[15px] py-[20px] text-left body-text1-400 text-foreground font-medium">
                  {t("income.prValueIncome")} <span className="text-[#878787] body-label-400">(LUCA)</span>
                </th>
                <th className="px-[15px] py-[20px] text-left body-text1-400 text-foreground font-medium">
                  {t("income.serverOperationIncome")} <span className="text-[#878787] body-label-400">(LUCA)</span>
                </th>
                <th className="px-[15px] py-[20px] text-left body-text1-400 text-foreground font-medium">
                  {t("income.serverStakeIncome")} <span className="text-[#878787] body-label-400">(LUCA)</span>
                </th>
                <th className="px-[15px] py-[20px] text-right body-text1-400 text-foreground font-medium">
                  {t("income.total")} <span className="text-[#878787] body-label-400">(LUCA)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRecords.map((record, i) => {
                const total =
                  (record.pr || 0) +
                  (record.topNodes || 0) +
                  (record.pledge || 0) +
                  (record.liquidity || 0);
                return (
                  <tr
                    key={`${record.date}-${i}`}
                  >
                    <td className="px-[15px] py-[20px]">
                      <span className="body-text2-400 text-foreground">{formatDate(record.date)}</span>
                    </td>
                    <td className="px-[15px] py-[20px]">
                      <span className="body-text2-400 text-foreground">{formatNumber(record.pr)}</span>
                    </td>
                    <td className="px-[15px] py-[20px]">
                      <span className="body-text2-400 text-foreground">{formatNumber(record.topNodes)}</span>
                    </td>
                    <td className="px-[15px] py-[20px]">
                      <span className="body-text2-400 text-foreground">{formatNumber(record.pledge)}</span>
                    </td>
                    <td className="px-[15px] py-[20px] text-right">
                      <span className="body-text2-400 text-foreground">{formatNumber(total)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={clampedPage}
          totalItems={records.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
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
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE);
  const clampedPage = Math.min(currentPage, Math.max(1, totalPages));
  const startIdx = (clampedPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const pageRecords = records.slice(startIdx, endIdx);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
        <p className="body-text2-400 text-destructive">
          {t("income.failedToLoadWithdrawalRecords")}
        </p>
        {onRetry && (
          <Button variant="soft" size="sm" onClick={onRetry}>
            {t("common.retry")}
          </Button>
        )}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <>
        <LoadingAnimation isVisible={loading} />
        <div className="flex items-center justify-center py-[60px]">
          <p className="body-text2-400 text-[#878787]">
            {t("income.noWithdrawalRecordsFound")}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <LoadingAnimation isVisible={loading} />
      <div className="bg-white rounded-[15px] p-[20px]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0F0F0]">
                <th className="px-[15px] py-[20px] text-left body-text1-400 text-foreground font-medium">
                  {t("common.date")}
                </th>
                <th className="px-[15px] py-[20px] text-left body-text1-400 text-foreground font-medium">
                  {t("income.amountLuca")}
                </th>
                <th className="px-[15px] py-[20px] text-left body-text1-400 text-foreground font-medium">
                  {t("income.coinType")}
                </th>
                <th className="px-[15px] py-[20px] text-right body-text1-400 text-foreground font-medium">
                  {t("income.transactionHash")}
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRecords.map((record, i) => (
                <tr
                  key={`${record.transaction_hash}-${i}`}
                >
                  <td className="px-[15px] py-[20px]">
                    <span className="body-text2-400 text-foreground">{formatDate(record.get_time || record.in_time)}</span>
                  </td>
                  <td className="px-[15px] py-[20px]">
                    <span className="body-text2-400 text-foreground">{formatNumber(record.total_amount)}</span>
                  </td>
                  <td className="px-[15px] py-[20px]">
                    <span className="body-text2-400 text-foreground">{record.coin_type || "LUCA"}</span>
                  </td>
                  <td className="px-[15px] py-[20px] text-right">
                    <span className="body-text2-400 text-primary">
                      {record.transaction_hash
                        ? `${record.transaction_hash.slice(0, 10)}...${record.transaction_hash.slice(-6)}`
                        : "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={clampedPage}
          totalItems={records.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}

/* ============================================================================
   MAIN INCOME COMPONENT
   ============================================================================ */

const Income = () => {
  const { t } = useTranslation();
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
      setToast({ message: t("income.addressCopied"), type: "success" });
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
      setToast({ message: t("income.pleaseEnterValidAmount"), type: "error" });
      return;
    }
    if (withdrawalBalance !== null && amount > withdrawalBalance) {
      setToast({ message: t("income.insufficientBalance"), type: "error" });
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
        message: t("income.withdrawalSuccessful"),
        type: "success",
      });
      setWithdrawAmount("");
      // Re-fetch records after withdrawal
      invalidateIncome();
    } else {
      setToast({
        message: result.error || t("income.withdrawalFailed"),
        type: "error",
      });
    }
  };

  if (!isConnected || !isAuthenticated) return null;

  return (
    <div className="space-y-[16px] md:space-y-[20px]">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Loading overlays – only show full-screen spinner for active withdrawal */}
      <LoadingAnimation isVisible={isWithdrawing} />

      {/* Confirmation modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title={t("income.confirmWithdrawal")}
        description={t("income.withdrawConfirmDescription", { amount: withdrawAmount })}
        message={t("income.withdrawConfirmMessage")}
        confirmText={t("common.confirm")}
        cancelText={t("common.cancel")}
        confirmVariant="default"
        onConfirm={confirmWithdrawal}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* ============ TOP ROW: Available Income + Withdraw ============ */}
      <div className="flex flex-col md:flex-row rounded-[15px] overflow-hidden">
        {/* Available Income Card */}
        <div className="w-full md:w-1/2 bg-primary p-[15px] md:p-[30px] text-white">
          <div className="flex items-center justify-between mb-[30px] md:mb-[40px]">
            <p className="font-h4-400 text-white">
              {t("income.availableIncome")}
            </p>
            {/* Info icon — mobile only */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="cursor-pointer md:hidden">
                  <Info className="w-[18px] h-[18px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent showArrow={true} collisionPadding={32}>
                <p className="max-w-[330px] body-label-400">{t("income.availableIncomeDescription")}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {isLoadingBalance ? (
            <div className="h-10" />
          ) : balanceError ? (
            <div className="">
              <p className="body-text2-400 text-red-200 mb-[8px]">
                {t("income.errorLoadingBalance")}
              </p>
              <button
                onClick={refreshBalance}
                className="body-text2-400 text-white underline cursor-pointer"
              >
                {t("common.retry")}
              </button>
            </div>
          ) : (
            <h1 className="text-[28px] md:text-[40px] font-medium text-white mb-0 md:mb-[40px]">
              {withdrawalBalance !== null
                ? formatNumber(withdrawalBalance, 8)
                : "0.00000000"}{" "}
              LUCA
            </h1>
          )}

          {/* Description — desktop only */}
          <p className="hidden md:block body-text2-400 leading-[19px]">
            {t("income.availableIncomeDescription")}
          </p>
        </div>

        {/* Withdraw Card */}
        <div className="w-full md:w-1/2 bg-white p-[15px] md:p-[30px]">
          <h3 className="font-h4-400 text-foreground mb-[5px] md:mb-[10px]">
            {t("income.withdraw")}
          </h3>

          <div className="flex items-center gap-[6px] mb-[16px] md:mb-[30px]">
            <p className="body-text2-400 text-[#878787]">
              {t("income.bscOnlyWithdraw")}
            </p>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="cursor-pointer">
                  <Info className="w-[15px] h-[15px] text-[#878787]" />
                </button>
              </TooltipTrigger>
              <TooltipContent showArrow={true} side="bottom" collisionPadding={32} align="end" alignOffset={-60}>
                <p className="body-label-400">
                  {t("income.bscTooltip")}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Wallet address */}
          <div className="flex items-center gap-[5px] mb-[5px]">
            <button
              onClick={copyAddress}
              className="cursor-pointer hover:opacity-70 transition-opacity"
            >
              <WalletIcon className="w-[19px] h-[16px] text-[#878787]" />
            </button>
            <p className="body-text1-400 truncate">
              <span className="text-foreground">{displayAddress.slice(0, 6)}</span>
              <span className="text-[#878787]">{displayAddress.slice(6, -6)}</span>
              <span className="text-foreground">{displayAddress.slice(-6)}</span>
            </p>
          </div>

          {/* Amount input */}
          {(() => {
            const exceedsBalance =
              withdrawalBalance !== null &&
              withdrawAmount !== "" &&
              parseFloat(withdrawAmount) > withdrawalBalance;
            return (
              <div className="mb-[16px] md:mb-[30px]">
                <div className="flex p-[10px] rounded-[12px] bg-[#F8F8F8] mb-[5px]">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="any"
                    className={`placeholder:text-[#B5B5B5] font-h1 focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${exceedsBalance ? "text-[#FE5572]" : "text-foreground"}`}
                  />
                </div>
                {exceedsBalance && (
                  <p className="body-label-400 text-[#FE5572]">
                    Exceed balance
                  </p>
                )}
              </div>
            );
          })()}

          {/* Withdraw button */}
          <Button
            variant="success"
            size="lg"
            className="px-15px py-[15px] md:py-[15px] md:px-[20px] w-full"
            onClick={handleWithdraw}
            disabled={
              isWithdrawing ||
              isLoadingBalance ||
              !withdrawAmount ||
              parseFloat(withdrawAmount) <= 0
            }
          >
            <span className="body-text1-400"> {isWithdrawing ? t("income.withdrawing") : t("income.withdraw")} </span>
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
      <div className="rounded-[15px]">
        {/* Tabs */}
        <div className="flex items-center gap-[24px] mb-[20px]">
          <button
            onClick={() => setActiveTab("income")}
            className={`flex flex-col items-start cursor-pointer transition-colors ${
              activeTab === "income"
                ? "text-foreground"
                : "text-[#878787] hover:text-foreground"
            }`}
          >
            <span className="body-text1-400">{t("income.incomeRecords")}</span>
            <div className={`mt-[5px] h-[2px] w-full rounded-full ${activeTab === "income" ? "bg-[#CBE45F]" : "bg-transparent"}`} />
          </button>
          <button
            onClick={() => setActiveTab("withdrawal")}
            className={`flex flex-col items-start cursor-pointer transition-colors ${
              activeTab === "withdrawal"
                ? "text-foreground"
                : "text-[#878787] hover:text-foreground"
            }`}
          >
            <span className="body-text1-400">{t("income.withdrawalRecords")}</span>
            <div className={`mt-[5px] h-[2px] w-full rounded-full ${activeTab === "withdrawal" ? "bg-[#CBE45F]" : "bg-transparent"}`} />
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
