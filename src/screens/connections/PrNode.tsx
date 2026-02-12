import { useState, useEffect, useRef, useCallback } from "react";
import { useUnified } from "@/context/Context";
import {
  useFetchPRNodesPaginated,
  useFetchUserTreatyList,
} from "@/hooks/useWebAppService";
import type { PRNodeItem } from "@/hooks/useWebAppService";
import {
  Loader2,
  Wallet,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Check,
  Zap,
  Server,
} from "lucide-react";
import { Button } from "@/components/ui/atm/button";

/* ============================================================================
   CONSTANTS & TYPES
   ============================================================================ */

const ITEMS_PER_PAGE = 20;
const STAKE_RECORDS_PER_PAGE = 10;

interface StakeRecord {
  ledgeAmount: string;
  ledgeTime: number;
  ledgeNum?: number;
  chainId: number;
  ledgeAddress?: string;
  linkAddress?: string;
  newNodeAddress?: string;
}

/* ============================================================================
   MODULE-LEVEL CACHE
   ============================================================================ */

interface CachedNodeData {
  nodes: PRNodeItem[];
  total: number;
  fetchedAt: number;
}

const prNodeCache = new Map<string, CachedNodeData>();
const CACHE_TTL = 60_000;

function getNodeCacheKey(page: number) {
  return `pr-nodes|page-${page}`;
}

/* ============================================================================
   HELPERS
   ============================================================================ */

function formatAddress(addr: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatTime(timestamp: number): string {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

function getChainName(chainId: number): string {
  const chains: Record<number, string> = {
    1: "BSC",
    2: "Polygon",
    56: "BSC",
    97: "BSC Testnet",
    137: "Polygon",
  };
  return chains[chainId] || "Unknown";
}

function formatStakeAmount(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
}

/* ============================================================================
   SLIDE-IN PANEL COMPONENT
   ============================================================================ */

function StakeDetailsPanel({
  node,
  onClose,
  isAuthenticated,
}: {
  node: PRNodeItem;
  onClose: () => void;
  isAuthenticated: boolean;
}) {
  const userTreatyHook = useFetchUserTreatyList();

  const [stakeTab, setStakeTab] = useState<1 | 2>(1);
  const [stakeRecords, setStakeRecords] = useState<StakeRecord[]>([]);
  const [stakeRecordsLoading, setStakeRecordsLoading] = useState(false);
  const [stakeRecordsTotalCount, setStakeRecordsTotalCount] = useState(0);
  const [stakeRecordsPage, setStakeRecordsPage] = useState(1);
  const [stakeError, setStakeError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);

  // Load stake records
  const loadStakeRecords = useCallback(async () => {
    if (!node) return;

    setStakeRecordsLoading(true);
    setStakeError(null);

    try {
      const response = await userTreatyHook.execute({
        ledgeAddress: node.serverAddress,
        pageIndex: stakeRecordsPage,
        pageSize: STAKE_RECORDS_PER_PAGE,
        type: stakeTab,
      });

      setStakeRecords(response?.data?.treatyList || []);
      setStakeRecordsTotalCount(response?.data?.totalCount || 0);
    } catch (err: any) {
      console.error("Error loading stake records:", err);
      setStakeError(err?.message || "Failed to load stake records");
      setStakeRecords([]);
    } finally {
      setStakeRecordsLoading(false);
    }
  }, [node, stakeTab, stakeRecordsPage, userTreatyHook]);

  useEffect(() => {
    if (isAuthenticated) {
      loadStakeRecords();
    }
  }, [stakeTab, stakeRecordsPage, isAuthenticated]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Copy helper
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const stakeRecordsTotalPages = Math.ceil(
    stakeRecordsTotalCount / STAKE_RECORDS_PER_PAGE
  );

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full w-full max-w-[560px] bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#F0F0F0]">
          <h3 className="text-[18px] font-semibold text-foreground">
            PR Node Stake Details
          </h3>
          <button
            onClick={onClose}
            className="p-[6px] rounded-[6px] hover:bg-[#F0F0F0] transition-colors cursor-pointer"
          >
            <X className="w-[20px] h-[20px] text-[#959595]" />
          </button>
        </div>

        {/* Node Info */}
        <div className="px-[24px] py-[20px] space-y-[16px] border-b border-[#F0F0F0]">
          {/* Stake node */}
          <div className="flex items-center gap-[16px]">
            <span className="body-text2-400 text-[#959595] min-w-[120px]">
              Stake node
            </span>
            <div className="flex items-center gap-[8px] flex-1">
              <span className="body-text2-400 text-foreground font-mono break-all">
                {node.serverAddress}
              </span>
              <button
                onClick={() => handleCopy(node.serverAddress, "address")}
                className="p-[4px] text-[#959595] hover:text-foreground cursor-pointer flex-shrink-0"
              >
                {copiedField === "address" ? (
                  <Check className="w-[14px] h-[14px] text-primary" />
                ) : (
                  <Copy className="w-[14px] h-[14px]" />
                )}
              </button>
            </div>
          </div>

          {/* Rankings */}
          <div className="flex items-center gap-[16px]">
            <span className="body-text2-400 text-[#959595] min-w-[120px]">
              Rankings
            </span>
            <span className="body-text2-400 text-foreground">
              #{node.rank ?? "—"}
            </span>
          </div>

          {/* Stake amount */}
          <div className="flex items-center gap-[16px]">
            <span className="body-text2-400 text-[#959595] min-w-[120px]">
              Stake amount
            </span>
            <span className="body-text2-400 text-foreground">
              {formatStakeAmount(node.ledgeAmount)} LUCA
            </span>
          </div>
        </div>

        {/* Tabs + Action buttons */}
        <div className="px-[24px] pt-[16px] flex items-center justify-between border-b border-[#F0F0F0]">
          <div className="flex gap-[24px]">
            <button
              onClick={() => {
                setStakeTab(1);
                setStakeRecordsPage(1);
              }}
              className={`pb-[12px] body-text2-500 border-b-2 transition-colors cursor-pointer ${
                stakeTab === 1
                  ? "text-primary border-primary"
                  : "text-[#959595] border-transparent hover:text-foreground"
              }`}
            >
              LUCA
            </button>
            <button
              onClick={() => {
                setStakeTab(2);
                setStakeRecordsPage(1);
              }}
              className={`pb-[12px] body-text2-500 border-b-2 transition-colors cursor-pointer ${
                stakeTab === 2
                  ? "text-primary border-primary"
                  : "text-[#959595] border-transparent hover:text-foreground"
              }`}
            >
              Consensus contract
            </button>
          </div>
          <div className="flex gap-[8px] pb-[12px]">
            <button
              disabled={!isAuthenticated}
              className="flex items-center gap-[6px] px-[16px] py-[8px] bg-primary text-white rounded-full text-[13px] font-medium hover:bg-primary/90 disabled:opacity-50 cursor-pointer transition-colors"
            >
              <Zap className="w-[14px] h-[14px]" />
              Stake mining
            </button>
            <button
              disabled={!isAuthenticated}
              className="flex items-center gap-[6px] px-[16px] py-[8px] border border-primary text-primary rounded-full text-[13px] font-medium hover:bg-primary/5 disabled:opacity-50 cursor-pointer transition-colors"
            >
              Batch redemption
            </button>
          </div>
        </div>

        {/* Stake Records Table */}
        <div className="flex-1 overflow-y-auto">
          {stakeRecordsLoading ? (
            <div className="flex items-center justify-center py-[60px]">
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                <p className="body-text2-400 text-[#959595]">
                  Loading stake records...
                </p>
              </div>
            </div>
          ) : stakeError ? (
            <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
              <AlertCircle className="w-10 h-10 text-[#FF6B6B]" />
              <p className="body-text2-400 text-[#FF6B6B]">{stakeError}</p>
              <Button
                variant="soft"
                size="sm"
                onClick={loadStakeRecords}
              >
                Retry
              </Button>
            </div>
          ) : stakeRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
              <Server className="w-10 h-10 text-[#959595]" />
              <p className="body-text2-400 text-[#959595]">No data</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0F0F0] bg-[#FCFCFC]">
                    <th className="px-[16px] py-[12px] text-left body-text2-500 text-[#959595] font-medium">
                      Stake amount (LUCA)
                    </th>
                    <th className="px-[16px] py-[12px] text-left body-text2-500 text-[#959595] font-medium">
                      Stake time
                    </th>
                    {stakeTab === 2 && (
                      <th className="px-[16px] py-[12px] text-left body-text2-500 text-[#959595] font-medium">
                        Consensus Link
                      </th>
                    )}
                    <th className="px-[16px] py-[12px] text-left body-text2-500 text-[#959595] font-medium">
                      Network
                    </th>
                    <th className="px-[16px] py-[12px] text-left body-text2-500 text-[#959595] font-medium">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stakeRecords.map((record, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#F0F0F0] last:border-b-0 hover:bg-[#FAFAFA] transition-colors"
                    >
                      <td className="px-[16px] py-[14px]">
                        <span className="body-text2-400 text-foreground">
                          {formatStakeAmount(record.ledgeAmount)}
                        </span>
                      </td>
                      <td className="px-[16px] py-[14px]">
                        <span className="body-text2-400 text-foreground">
                          {formatTime(record.ledgeTime)}
                        </span>
                      </td>
                      {stakeTab === 2 && (
                        <td className="px-[16px] py-[14px]">
                          <button
                            onClick={() =>
                              handleCopy(
                                record.linkAddress || "",
                                `link-${index}`
                              )
                            }
                            className="body-text2-400 text-primary hover:underline cursor-pointer font-mono"
                          >
                            {formatAddress(record.linkAddress || "")}
                          </button>
                        </td>
                      )}
                      <td className="px-[16px] py-[14px]">
                        <span className="body-text2-400 text-foreground">
                          {getChainName(record.chainId)}
                        </span>
                      </td>
                      <td className="px-[16px] py-[14px]">
                        <button className="body-text2-400 text-primary border-b border-primary hover:text-primary/80 cursor-pointer transition-colors">
                          Redeem
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Stake Records Pagination */}
              {stakeRecordsTotalPages > 1 && (
                <div className="flex items-center justify-between px-[16px] py-[12px] border-t border-[#F0F0F0]">
                  <p className="body-label-400 text-[#959595]">
                    {(stakeRecordsPage - 1) * STAKE_RECORDS_PER_PAGE + 1}-
                    {Math.min(
                      stakeRecordsPage * STAKE_RECORDS_PER_PAGE,
                      stakeRecordsTotalCount
                    )}{" "}
                    of {stakeRecordsTotalCount}
                  </p>
                  <div className="flex items-center gap-[8px]">
                    <button
                      onClick={() =>
                        setStakeRecordsPage((p) => Math.max(1, p - 1))
                      }
                      disabled={stakeRecordsPage === 1}
                      className="p-[6px] rounded-[6px] hover:bg-[#F0F0F0] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      <ChevronLeft className="w-[16px] h-[16px] text-[#959595]" />
                    </button>
                    <span className="body-label-400 text-foreground px-[8px]">
                      {stakeRecordsPage}
                    </span>
                    <button
                      onClick={() =>
                        setStakeRecordsPage((p) =>
                          Math.min(stakeRecordsTotalPages, p + 1)
                        )
                      }
                      disabled={stakeRecordsPage === stakeRecordsTotalPages}
                      className="p-[6px] rounded-[6px] hover:bg-[#F0F0F0] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      <ChevronRight className="w-[16px] h-[16px] text-[#959595]" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ============================================================================
   MAIN PR NODE COMPONENT
   ============================================================================ */

export default function PrNode() {
  const {
    address,
    isConnected,
    isAuthenticated,
    isAuthenticating,
    openModal,
    authenticate,
    authError,
  } = useUnified();

  const prNodesHook = useFetchPRNodesPaginated();

  // State
  const [nodes, setNodes] = useState<PRNodeItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNode, setSelectedNode] = useState<PRNodeItem | null>(null);

  const requestIdRef = useRef(0);

  // Load PR nodes
  const loadNodes = useCallback(async () => {
    const cacheKey = getNodeCacheKey(currentPage);
    const cached = prNodeCache.get(cacheKey);

    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
      setNodes(cached.nodes);
      setTotalCount(cached.total);
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await prNodesHook.execute({
        pageNo: currentPage,
        pageSize: ITEMS_PER_PAGE,
      });

      if (requestId !== requestIdRef.current) return;

      const nodeList = response?.data || [];
      const total = response?.total || 0;

      prNodeCache.set(cacheKey, {
        nodes: nodeList,
        total,
        fetchedAt: Date.now(),
      });

      setNodes(nodeList);
      setTotalCount(total);
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
      console.error("Error loading PR nodes:", err);
      setError(err?.message || "Failed to load PR nodes");
      setNodes([]);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [currentPage, prNodesHook]);

  useEffect(() => {
    loadNodes();
  }, [currentPage]);

  // Retry
  const handleRetry = () => {
    setError(null);
    const cacheKey = getNodeCacheKey(currentPage);
    prNodeCache.delete(cacheKey);
    loadNodes();
  };

  // Pagination
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // ── Connect wallet screen ──
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-h4-600 text-foreground">Connect Wallet</h3>
          <p className="body-text2-400 text-[#959595]">
            Please connect your wallet to view PR nodes
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

  // ── Authenticating screen ──
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
              : "Sign a message to view PR nodes"}
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
              <span className="body-text2-400 text-[#959595]">
                Waiting for signature...
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-[20px]">
        {/* ── Header ── */}
        <div>
          <p className="body-text2-400 text-[#959595]">
            Staking PR nodes can get staking rewards.
          </p>
        </div>

        {/* ── Content ── */}
        <div className="bg-white rounded-[15px]">
          {loading ? (
            <div className="flex items-center justify-center py-[80px]">
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                <p className="body-text2-400 text-[#959595]">
                  Loading PR nodes...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-[80px] gap-[16px]">
              <AlertCircle className="w-12 h-12 text-[#FF6B6B]" />
              <p className="body-text2-400 text-[#FF6B6B]">{error}</p>
              <Button variant="soft" size="sm" onClick={handleRetry}>
                Retry
              </Button>
            </div>
          ) : nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[80px] gap-[12px]">
              <Server className="w-12 h-12 text-[#959595]" />
              <p className="body-text2-400 text-[#959595]">
                No PR nodes found
              </p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#F0F0F0] bg-[#FCFCFC]">
                      <th className="px-[16px] py-[12px] text-left body-text2-500 text-[#959595] font-medium">
                        PR Node
                      </th>
                      <th className="px-[16px] py-[12px] text-left body-text2-500 text-[#959595] font-medium">
                        Server
                      </th>
                      <th className="px-[16px] py-[12px] text-left body-text2-500 text-[#959595] font-medium">
                        Total amount Staked (LUCA)
                      </th>
                      <th className="px-[16px] py-[12px] text-left body-text2-500 text-[#959595] font-medium">
                        Stake amount (LUCA)
                      </th>
                      <th className="px-[16px] py-[12px] text-left body-text2-500 text-[#959595] font-medium">
                        Ranking
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map((node, index) => (
                      <tr
                        key={node.serverAddress || index}
                        onClick={() => setSelectedNode(node)}
                        className="border-b border-[#F0F0F0] last:border-b-0 hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                      >
                        <td className="px-[16px] py-[14px]">
                          <span className="body-text2-400 text-foreground font-mono">
                            {formatAddress(node.serverAddress)}
                          </span>
                        </td>
                        <td className="px-[16px] py-[14px]">
                          <span className="body-text2-400 text-foreground">
                            {node.serverNickname || "—"}
                          </span>
                        </td>
                        <td className="px-[16px] py-[14px]">
                          <span className="body-text2-400 text-foreground">
                            {formatStakeAmount(node.ledgeAmount)}
                          </span>
                        </td>
                        <td className="px-[16px] py-[14px]">
                          <span className="body-text2-400 text-foreground">
                            —
                          </span>
                        </td>
                        <td className="px-[16px] py-[14px]">
                          <span className="body-text2-400 text-foreground font-medium">
                            #{node.rank ?? "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-[16px] py-[12px] border-t border-[#F0F0F0]">
                  <p className="body-label-400 text-[#959595]">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of{" "}
                    {totalCount}
                  </p>

                  <div className="flex items-center gap-[8px]">
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-[6px] rounded-[6px] hover:bg-[#F0F0F0] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      <ChevronLeft className="w-[16px] h-[16px] text-[#959595]" />
                    </button>

                    {Array.from(
                      { length: Math.min(totalPages, 5) },
                      (_, i) => {
                        let page: number;
                        if (totalPages <= 5) {
                          page = i + 1;
                        } else if (currentPage <= 3) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i;
                        } else {
                          page = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-[28px] h-[28px] rounded-[6px] body-label-400 transition-colors cursor-pointer ${
                              currentPage === page
                                ? "bg-primary text-white"
                                : "text-[#959595] hover:bg-[#F0F0F0]"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                    )}

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-[6px] rounded-[6px] hover:bg-[#F0F0F0] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      <ChevronRight className="w-[16px] h-[16px] text-[#959595]" />
                    </button>
                  </div>
                </div>
              )}

              {/* Total count (single page) */}
              {totalPages <= 1 && nodes.length > 0 && (
                <div className="px-[16px] py-[12px] border-t border-[#F0F0F0]">
                  <p className="body-label-400 text-[#959595]">
                    Total {totalCount || nodes.length}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Slide-in Panel */}
      {selectedNode && (
        <StakeDetailsPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          isAuthenticated={isAuthenticated}
        />
      )}
    </>
  );
}
