import { useState, useEffect, useRef, useCallback } from "react";
import { useUnified } from "@/context/Context";
import {
  useGetRecoveryPotBalance,
  useGetRecoveryTransactions,
  useFetchBurnTotal,
} from "@/hooks/useWebAppService";
import type { RecoveryTransaction } from "@/lib/webAppService";
import { getExplorerUrl } from "@/config/chains";
import {
  Loader2,
  Wallet,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Copy,
  FileText,
} from "lucide-react";

/* ============================================================================
   CONSTANTS & TYPES
   ============================================================================ */

const ITEMS_PER_PAGE = 10;
const DEFAULT_CHAIN_ID = 56; // BSC
const RECOVERY_TARGET = 900000;
const POT_WALLET = import.meta.env.VITE_POT_WALLET || "0x42323bcbgg33123kcvcmbdl";
const COUNTDOWN_END = new Date("2024-03-15T00:00:00Z"); // adjust as needed

type RecoveryTab = "buying" | "investing";

interface BuyingTransaction {
  createTime: string;
  burnAmount: string;
  useAmount: string;
  hash: string;
}

/* ============================================================================
   MODULE-LEVEL CACHE
   ============================================================================ */

interface CachedRecoveryData {
  balance: { usdc: string; luca: string };
  transactions: RecoveryTransaction[];
  buyingTransactions: BuyingTransaction[];
  totalRaised: string;
  fetchedAt: number;
}

const recoveryCache = new Map<string, CachedRecoveryData>();
const CACHE_TTL = 120_000;

/* ============================================================================
   HELPERS
   ============================================================================ */

function formatHash(hash: string): string {
  if (!hash) return "";
  return `${hash.slice(0, 20)}...${hash.slice(-20)}`;
}

function formatAddress(addr: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 20)}...${addr.slice(-10)}`;
}

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      });
    };

    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

/* ============================================================================
   MAIN COMPONENT
   ============================================================================ */

export default function RecoveryPlan() {
  const {
    address,
    isConnected,
    isAuthenticated,
    isAuthenticating,
    chainId,
    walletProvider,
    openModal,
    authenticate,
    authError,
  } = useUnified();

  const balanceHook = useGetRecoveryPotBalance();
  const transactionsHook = useGetRecoveryTransactions();
  const burnTotalHook = useFetchBurnTotal();

  // State
  const [balance, setBalance] = useState({ usdc: "2.00", luca: "857995.98" });
  const [totalRaised, setTotalRaised] = useState("9000000");
  const [investingTransactions, setInvestingTransactions] = useState<RecoveryTransaction[]>([]);
  const [buyingTransactions, setBuyingTransactions] = useState<BuyingTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<RecoveryTab>("buying");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const requestIdRef = useRef(0);
  const activeChainId = chainId || DEFAULT_CHAIN_ID;
  const countdown = useCountdown(COUNTDOWN_END);

  /* ---------- Load data ---------- */
  const loadData = useCallback(async () => {
    if (!address || !isAuthenticated) return;

    const requestId = ++requestIdRef.current;
    const cacheKey = `recovery|${address}|${activeChainId}|${activeTab}`;

    const cached = recoveryCache.get(cacheKey);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
      setBalance(cached.balance);
      setTotalRaised(cached.totalRaised);
      setInvestingTransactions(cached.transactions);
      setBuyingTransactions(cached.buyingTransactions);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch balance
      const totalAmount = await balanceHook.execute(activeChainId);

      if (requestId !== requestIdRef.current) return;

      const balanceVal = {
        usdc: "2.00",
        luca: totalAmount && totalAmount !== "0" ? totalAmount : "0",
      };
      const raisedVal = totalAmount && totalAmount !== "0" ? totalAmount : "0";

      setBalance(balanceVal);
      setTotalRaised(raisedVal);

      let buyTxs: BuyingTransaction[] = [];
      let investTxs: RecoveryTransaction[] = [];

      if (activeTab === "buying") {
        try {
          const firstResponse = await burnTotalHook.execute({
            pageNo: 1,
            pageIndex: 1,
            pageSize: 5,
          });

          const totalRecord = firstResponse?.data?.totalRecord || 0;
          const totalPages = Math.ceil(totalRecord / 5);

          const allPromises = [];
          for (let page = 1; page <= totalPages; page++) {
            allPromises.push(
              burnTotalHook.execute({
                pageNo: page,
                pageIndex: page,
                pageSize: 5,
              })
            );
          }

          const allResponses = await Promise.all(allPromises);
          const allBuyBackData: any[] = [];

          allResponses.forEach((response) => {
            const pageData = response?.data?.list;
            if (pageData && Array.isArray(pageData)) {
              allBuyBackData.push(...pageData);
            }
          });

          if (allBuyBackData.length > 0) {
            allBuyBackData.forEach((item: any) => {
              const date = new Date(item.createTime);
              const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

              buyTxs.push({
                createTime: formattedDate,
                burnAmount: String(Number(item.burnAmount || 0)),
                useAmount: "-",
                hash: item.hash || "",
              });

              buyTxs.push({
                createTime: formattedDate,
                burnAmount: String(Number(item.burnAmount || 0)),
                useAmount: String(Number(item.useAmount || 0)),
                hash: item.hash || "",
              });
            });
          }
        } catch (apiError) {
          console.error("Error fetching buyback data:", apiError);
        }

        setBuyingTransactions(buyTxs);
      } else if (activeTab === "investing" && address) {
        const listData = await transactionsHook.execute({
          userAddress: address,
          chainId: activeChainId,
        });

        investTxs = (listData || []).map((tx: any) => ({
          createTime: tx.createTime || "",
          lockAmount: tx.lockAmount || "0",
          lockCurrency: tx.lockCurrency || "USDC",
          hash: tx.hash || "",
        }));

        setInvestingTransactions(investTxs);
      }

      recoveryCache.set(cacheKey, {
        balance: balanceVal,
        totalRaised: raisedVal,
        transactions: investTxs,
        buyingTransactions: buyTxs,
        fetchedAt: Date.now(),
      });
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
      console.error("Error loading recovery data:", err);
      setError(err?.message || "Failed to load recovery plan data");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [address, isAuthenticated, activeChainId, activeTab, balanceHook, transactionsHook, burnTotalHook]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, activeChainId, activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleRetry = () => {
    setError(null);
    recoveryCache.delete(`recovery|${address}|${activeChainId}|${activeTab}`);
    loadData();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Pagination
  const currentItems = activeTab === "buying" ? buyingTransactions : investingTransactions;
  const totalPages = Math.max(1, Math.ceil(currentItems.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = currentItems.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const totalRecords = currentItems.length;

  const renderLucaDirection = (useAmount?: string) => {
    if (!useAmount || useAmount === "-") {
      return <ArrowRight className="w-4 h-4 text-red-500" />;
    }
    return <ArrowLeft className="w-4 h-4 text-green-500" />;
  };

  /* ── Connect wallet screen ── */
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-h4-600 text-foreground">Connect Wallet</h3>
          <p className="body-text2-400 text-[#959595]">
            Please connect your wallet to view the recovery plan
          </p>
          <button
            onClick={openModal}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg button-text-500 transition-colors flex items-center gap-2 mx-auto cursor-pointer"
          >
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  /* ── Auth screen ── */
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-h4-600 text-foreground">
            {isAuthenticating ? "Authenticating..." : "Sign to Continue"}
          </h3>
          <p className="body-text2-400 text-[#959595]">
            {isAuthenticating
              ? "Please sign the message in your wallet"
              : "Sign a message to view the recovery plan"}
          </p>
          {authError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{authError}</p>
            </div>
          )}
          {!isAuthenticating && (
            <button
              onClick={authenticate}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg button-text-500 transition-colors flex items-center gap-2 mx-auto cursor-pointer"
            >
              <Wallet className="w-5 h-5" />
              Sign Message
            </button>
          )}
          {isAuthenticating && (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="body-text2-400 text-[#959595]">Waiting for signature...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Pagination helper ── */
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return (
      <div className="px-4 py-3 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-[32px] h-[32px] rounded-[8px] border border-[#E5E5E5] flex items-center justify-center hover:bg-[#F0F0F0] disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-[#959595]" />
          </button>

          {pages.map((page, idx) =>
            page === "..." ? (
              <span key={`dots-${idx}`} className="px-2 text-[#959595] text-sm">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page as number)}
                className={`min-w-[32px] h-[32px] px-2 rounded-[8px] text-sm font-medium transition-colors cursor-pointer ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "border border-[#E5E5E5] text-foreground hover:bg-[#F0F0F0]"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-[32px] h-[32px] rounded-[8px] border border-[#E5E5E5] flex items-center justify-center hover:bg-[#F0F0F0] disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-[#959595]" />
          </button>
        </div>
        <p className="text-xs text-[#959595]">
          {startIdx + 1}-{Math.min(startIdx + ITEMS_PER_PAGE, totalRecords)} of {totalRecords}
        </p>
      </div>
    );
  };

  /* ── Main UI ── */
  return (
    <div className="space-y-[16px]">
      {/* Recovery Summary Card */}
      <div className="rounded-[20px] overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* LEFT SECTION - Dark gradient */}
          <div
            className="lg:w-[55%] relative p-8 text-white overflow-hidden"
            style={{
              background: "linear-gradient(125deg, #3e688c 20.63%, #002d53 86.81%)",
            }}
          >
            {/* Background decorative lines */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 500 400" fill="none">
                <path d="M200 0 Q350 200 500 100" stroke="white" strokeWidth="1" fill="none" />
                <path d="M150 50 Q300 250 500 150" stroke="white" strokeWidth="1" fill="none" />
                <path d="M100 100 Q250 300 500 200" stroke="white" strokeWidth="1" fill="none" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold mb-4 relative z-10">The recovery plan</h2>
            <p className="text-white/90 mb-4 text-[14px] leading-relaxed relative z-10">
              The community will release an additional 8 million LUCA into the rewards wallet so
              users can retrieve their rewards.
            </p>
            <p className="text-white/90 mb-6 text-[14px] leading-relaxed relative z-10">
              All LUCA investors are encourage to join this round of recovery investment and
              contribute to the community. As a return of the support, starting one year from now,
              the investor will have the chance to purchase LUCA tokens at a 30% discount through
              three-month options, spread over eight years, with an annual limit of 1 million tokens.
            </p>

            <div className="flex flex-col xl:flex-row xl:items-center justify-between relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:gap-5 mb-2 xl:mb-0">
                <div className="text-sm text-white/70 mb-1 md:mb-0">Recovery address</div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[12px] py-1 rounded">
                    {formatAddress(POT_WALLET)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(POT_WALLET)}
                    className="p-1 hover:bg-white/10 rounded cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-[24px] font-medium text-cyan-300">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin inline" />
                ) : (
                  `${parseFloat(totalRaised || "0").toLocaleString("en-US")} USDC`
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="bg-white/20 relative rounded-full h-2 mb-2 mt-2 z-10">
              <div className="bg-white h-2 rounded-full w-full" />
            </div>
            <div className="flex justify-between text-xs text-white/70 mb-10 relative z-10">
              <span>{RECOVERY_TARGET.toLocaleString("en-US")} USDC stretch target</span>
              <span>30.11.2023</span>
            </div>

            <div className="text-[32px] font-medium text-cyan-300 relative z-10">
              Successfully completed
            </div>
          </div>

          {/* RIGHT SECTION - White */}
          <div className="lg:w-[45%] bg-white flex flex-col items-center justify-center p-10">
            <h3 className="text-3xl font-medium text-foreground mb-10">Balance</h3>
            <div className="flex gap-16 mb-10">
              <div className="text-center">
                <div className="text-3xl font-medium text-foreground">
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin inline" />
                  ) : (
                    parseFloat(balance.usdc).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  )}
                </div>
                <div className="text-[18px] leading-[29px] font-medium text-[#959595] mt-1">
                  USDC
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-medium text-foreground">
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin inline" />
                  ) : (
                    Number(balance.luca).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  )}
                </div>
                <div className="text-[18px] leading-[29px] font-medium text-[#959595] mt-1">
                  LUCA
                </div>
              </div>
            </div>

            <p className="text-center text-[16px] text-[#959595] max-w-lg mb-8">
              The funds in the wallet will be used for daily LUCA purchases over 60 days.
            </p>

            {/* Countdown timer */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-[72px] h-[72px] rounded-[12px] border border-[#E5E5E5] flex items-center justify-center">
                  <span className="text-[24px] font-medium text-foreground">{countdown.days}</span>
                </div>
                <span className="text-[11px] text-[#959595] mt-2 uppercase tracking-wider">
                  Days
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-[72px] h-[72px] rounded-[12px] border border-[#E5E5E5] flex items-center justify-center">
                  <span className="text-[24px] font-medium text-foreground">{countdown.hours}</span>
                </div>
                <span className="text-[11px] text-[#959595] mt-2 uppercase tracking-wider">
                  Hours
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-[72px] h-[72px] rounded-[12px] border border-[#E5E5E5] flex items-center justify-center">
                  <span className="text-[24px] font-medium text-foreground">
                    {countdown.minutes}
                  </span>
                </div>
                <span className="text-[11px] text-[#959595] mt-2 uppercase tracking-wider">
                  Minutes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="rounded-[15px] bg-white overflow-hidden">
        {/* Transaction tab switcher */}
        <div className="flex border-b border-[#E5E5E5] overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab("buying");
              setCurrentPage(1);
            }}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "buying"
                ? "border-primary text-primary"
                : "border-transparent text-[#959595] hover:text-foreground"
            }`}
          >
            Transaction of buying and burning LUCA
          </button>
          <button
            onClick={() => {
              setActiveTab("investing");
              setCurrentPage(1);
            }}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "investing"
                ? "border-primary text-primary"
                : "border-transparent text-[#959595] hover:text-foreground"
            }`}
          >
            Transaction records of investing
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-[60px]">
            <div className="text-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="text-sm text-[#959595]">Loading transactions...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-[60px]">
            <div className="text-center space-y-4 max-w-sm">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6 text-[#EB5757]" />
              </div>
              <p className="text-sm text-[#EB5757]">{error}</p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Retry
              </button>
            </div>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="flex items-center justify-center py-[60px]">
            <div className="text-center space-y-3">
              <FileText className="w-12 h-12 text-[#959595] mx-auto" />
              <h3 className="text-lg font-medium text-foreground">No Transactions Found</h3>
              <p className="text-sm text-[#959595]">
                {address
                  ? "No transactions for your address"
                  : "Please connect wallet to view transactions"}
              </p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === "buying" ? (
              /* Buying & Burning table */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E5E5]">
                      <th className="w-36 px-4 py-3 text-left text-xs font-medium text-[#959595] tracking-wider">
                        Date
                      </th>
                      <th className="w-40 px-4 py-3 text-left text-xs font-medium text-[#959595] tracking-wider">
                        LUCA amount
                      </th>
                      <th className="w-8"></th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#959595] tracking-wider">
                        USDC amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#959595] tracking-wider">
                        Transaction hash
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F0F0]">
                    {(pageItems as BuyingTransaction[]).map((tx, idx) => (
                      <tr key={`${tx.hash}-${idx}`} className="hover:bg-[#F8F9FA] transition-colors">
                        <td className="px-4 py-3 text-sm text-foreground">{tx.createTime}</td>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">
                          {Number(tx.burnAmount).toLocaleString("en-US")}
                        </td>
                        <td className="px-2 py-3 text-center">
                          {renderLucaDirection(tx.useAmount)}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {tx.useAmount === "-"
                            ? "-"
                            : Number(tx.useAmount).toLocaleString("en-US")}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {tx.hash ? (
                            <a
                              href={getExplorerUrl(activeChainId, tx.hash, "tx")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-mono inline-flex items-center gap-1"
                            >
                              {formatHash(tx.hash)}
                              <ExternalLink className="w-3 h-3 text-[#959595]" />
                            </a>
                          ) : (
                            <span className="text-[#959595]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Investing table */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E5E5]">
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#959595] tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#959595] tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#959595] tracking-wider">
                        Currency
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#959595] tracking-wider">
                        Transaction hash
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F0F0]">
                    {(pageItems as RecoveryTransaction[]).map((tx, idx) => (
                      <tr key={idx} className="hover:bg-[#F8F9FA] transition-colors">
                        <td className="px-4 py-3 text-sm text-foreground">{tx.createTime}</td>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">
                          {Number(tx.lockAmount || 0).toLocaleString("en-US")}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {tx.lockCurrency || "USDC"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {tx.hash ? (
                            <a
                              href={getExplorerUrl(activeChainId, tx.hash, "tx")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-mono inline-flex items-center gap-1"
                            >
                              {formatHash(tx.hash)}
                              <ExternalLink className="w-3 h-3 text-[#959595]" />
                            </a>
                          ) : (
                            <span className="text-[#959595]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}
