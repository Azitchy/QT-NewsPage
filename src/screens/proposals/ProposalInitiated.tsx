import { useState, useEffect, useRef, useCallback } from "react";
import { useUnified } from "@/context/Context";
import {
  useMyInitiatedProposals,
  useGetUserGameProposals,
  useProposalStatusText,
} from "@/hooks/useWebAppService";
import type { Proposal } from "@/lib/webAppService";
import {
  Loader2,
  Wallet,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
  X,
} from "lucide-react";

/* ============================================================================
   CONSTANTS & TYPES
   ============================================================================ */

const ITEMS_PER_PAGE = 10;

type StatusFilter = "" | "1" | "2" | "3" | "4" | "5" | "6";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "", label: "All" },
  { value: "4", label: "In progress" },
  { value: "1", label: "Under review" },
  { value: "2", label: "Approved" },
  { value: "3", label: "Rejected" },
  { value: "5", label: "Ended" },
  { value: "6", label: "Invalid" },
];

/* ============================================================================
   MODULE-LEVEL CACHE
   ============================================================================ */

interface CachedData {
  proposals: Proposal[];
  totalCount: number;
  fetchedAt: number;
}

const initiatedCache = new Map<string, CachedData>();
const CACHE_TTL = 60_000;

function getCacheKey(address: string, status: StatusFilter, search: string, page: number) {
  return `initiated|${address}|${status}|${search || "all"}|${page}`;
}

/* ============================================================================
   HELPERS
   ============================================================================ */

function formatDate(timestamp: number): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusBadgeConfig(status: number, typeOfProposal?: string) {
  if (typeOfProposal === "3") {
    const configs: Record<number, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
      0: { bg: "bg-[#F0F0F0]", text: "text-[#959595]", icon: Ban },
      1: { bg: "bg-[#FFF8E6]", text: "text-[#F2994A]", icon: Clock },
      2: { bg: "bg-[#E8F0FE]", text: "text-[#2D9CDB]", icon: AlertCircle },
      3: { bg: "bg-[#E8F8EE]", text: "text-[#27AE60]", icon: CheckCircle2 },
      4: { bg: "bg-[#FEECEC]", text: "text-[#EB5757]", icon: XCircle },
      5: { bg: "bg-[#F0E8FE]", text: "text-[#9B51E0]", icon: Clock },
      6: { bg: "bg-[#E8F8EE]", text: "text-[#27AE60]", icon: CheckCircle2 },
      7: { bg: "bg-[#E8F0FE]", text: "text-[#2D9CDB]", icon: Clock },
    };
    return configs[status] || configs[0];
  }

  const configs: Record<number, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
    1: { bg: "bg-[#FFF8E6]", text: "text-[#F2994A]", icon: Clock },
    2: { bg: "bg-[#E8F8EE]", text: "text-[#27AE60]", icon: CheckCircle2 },
    3: { bg: "bg-[#FEECEC]", text: "text-[#EB5757]", icon: XCircle },
    4: { bg: "bg-[#E8F0FE]", text: "text-[#2D9CDB]", icon: Clock },
    5: { bg: "bg-[#F0F0F0]", text: "text-[#959595]", icon: Ban },
    6: { bg: "bg-[#FEECEC]", text: "text-[#EB5757]", icon: XCircle },
  };
  return configs[status] || configs[1];
}

/* ============================================================================
   MAIN COMPONENT
   ============================================================================ */

export default function ProposalInitiated() {
  const {
    address,
    isConnected,
    isAuthenticated,
    isAuthenticating,
    walletProvider,
    openModal,
    authenticate,
    authError,
  } = useUnified();

  const initiatedHook = useMyInitiatedProposals();
  const agfProposalsHook = useGetUserGameProposals();
  const getStatusText = useProposalStatusText();

  // State
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const requestIdRef = useRef(0);

  /* ---------- Load proposals ---------- */
  const loadProposals = useCallback(async () => {
    if (!address || !isAuthenticated || !walletProvider) return;

    const requestId = ++requestIdRef.current;
    const cacheKey = getCacheKey(address, statusFilter, searchQuery, currentPage);

    const cached = initiatedCache.get(cacheKey);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
      setProposals(cached.proposals);
      setTotalCount(cached.totalCount);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch V1 (community) and V2 (AGF) proposals in parallel
      const [v1Result, v2Result] = await Promise.all([
        initiatedHook.execute({
          status: statusFilter,
          searchKeys: searchQuery,
          pageIndex: currentPage,
          pageSize: ITEMS_PER_PAGE,
          walletProvider,
        }),
        agfProposalsHook.execute().catch(() => ({
          isSuccess: false,
          data: [],
        })),
      ]);

      console.log('[ProposalInitiated] V1 raw result:', v1Result);
      console.log('[ProposalInitiated] V2 raw result:', v2Result);

      if (requestId !== requestIdRef.current) return;

      // Extract V1 proposals — API may return data as array or nested under initiateList/list
      let v1Proposals: Proposal[] = [];
      if (v1Result?.data) {
        if (Array.isArray(v1Result.data)) {
          v1Proposals = v1Result.data;
        } else if (v1Result.data.initiateList) {
          v1Proposals = v1Result.data.initiateList;
        } else if (v1Result.data.list) {
          v1Proposals = v1Result.data.list;
        }
      }

      // Extract V2 (AGF) proposals
      const v2Proposals: Proposal[] =
        v2Result && v2Result.isSuccess && Array.isArray(v2Result.data)
          ? v2Result.data
          : [];

      // Merge both lists
      const proposalList = [...v1Proposals, ...v2Proposals];
      const total = proposalList.length;

      initiatedCache.set(cacheKey, {
        proposals: proposalList,
        totalCount: total,
        fetchedAt: Date.now(),
      });

      setProposals(proposalList);
      setTotalCount(total);
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
      console.error("Error loading initiated proposals:", err);
      setError(err?.message || "Failed to load proposals");
      setProposals([]);
      setTotalCount(0);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [address, isAuthenticated, walletProvider, statusFilter, searchQuery, currentPage, initiatedHook, agfProposalsHook]);

  useEffect(() => {
    if (isAuthenticated && walletProvider) {
      loadProposals();
    }
  }, [isAuthenticated, walletProvider, statusFilter, searchQuery, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedProposal(null);
  }, [statusFilter, searchQuery]);

  /* ---------- Handlers ---------- */
  const handleSearch = () => setSearchQuery(searchInput.trim());
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };
  const handleRetry = () => {
    setError(null);
    const cacheKey = getCacheKey(address || "", statusFilter, searchQuery, currentPage);
    initiatedCache.delete(cacheKey);
    loadProposals();
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

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
            Please connect your wallet to view your initiated proposals
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
              : "Sign a message to view your initiated proposals"}
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

  /* ── Main UI ── */
  return (
    <div className="space-y-[16px]">
      {/* Header */}
      <div className="rounded-[15px] bg-white p-[20px]">
        <h2 className="text-[20px] font-semibold text-foreground mb-[16px]">Proposal Initiated</h2>

        {/* Search & Status filter */}
        <div className="flex items-center gap-[12px]">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#959595]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search your proposals..."
              className="w-full pl-[36px] pr-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground placeholder:text-[#959595] focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-[140px]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            className="px-[16px] py-[10px] rounded-[10px] bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-[16px] items-start">
        <div className={`${selectedProposal ? "w-[55%]" : "w-full"} transition-all`}>
          <div className="rounded-[15px] bg-white p-[20px]">
            {loading ? (
              <div className="flex items-center justify-center py-[60px]">
                <div className="text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                  <p className="text-sm text-[#959595]">Loading proposals...</p>
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
            ) : proposals.length === 0 ? (
              <div className="flex items-center justify-center py-[60px]">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-[#F0F0F0] rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6 text-[#959595]" />
                  </div>
                  <p className="text-sm text-[#959595]">No initiated proposals found</p>
                  <p className="text-xs text-[#BDBDBD]">
                    {searchQuery || statusFilter
                      ? "Try adjusting your filters"
                      : "Proposals you have initiated will appear here"}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5E5]">
                        <th className="text-left py-[12px] px-[12px] text-xs font-semibold text-[#959595] uppercase tracking-wide">Title</th>
                        <th className="text-left py-[12px] px-[12px] text-xs font-semibold text-[#959595] uppercase tracking-wide">Type</th>
                        <th className="text-left py-[12px] px-[12px] text-xs font-semibold text-[#959595] uppercase tracking-wide">Status</th>
                        <th className="text-left py-[12px] px-[12px] text-xs font-semibold text-[#959595] uppercase tracking-wide">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proposals.map((proposal) => {
                        const config = getStatusBadgeConfig(proposal.status, proposal.typeOfProposal);
                        const Icon = config.icon;
                        const statusLabel = getStatusText(proposal.status, proposal.typeOfProposal);

                        return (
                          <tr
                            key={proposal.id}
                            onClick={() => setSelectedProposal(proposal)}
                            className={`border-b border-[#F0F0F0] cursor-pointer transition-colors ${
                              selectedProposal?.id === proposal.id
                                ? "bg-[#F0FAFB]"
                                : "hover:bg-[#F8F9FA]"
                            }`}
                          >
                            <td className="py-[12px] px-[12px]">
                              <p className="text-sm font-medium text-foreground truncate max-w-[250px]">
                                {proposal.title || "Untitled"}
                              </p>
                            </td>
                            <td className="py-[12px] px-[12px]">
                              <span className="text-xs font-medium px-[8px] py-[2px] rounded bg-[#F0F0F0] text-[#959595]">
                                {proposal.typeOfProposal === "3" ? "AGF" : "Community"}
                              </span>
                            </td>
                            <td className="py-[12px] px-[12px]">
                              <span className={`inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                                <Icon className="w-[12px] h-[12px]" />
                                {statusLabel}
                              </span>
                            </td>
                            <td className="py-[12px] px-[12px]">
                              <span className="text-sm text-[#959595] flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(proposal.createTime)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-[16px] pt-[16px] border-t border-[#E5E5E5]">
                    <p className="text-xs text-[#959595]">
                      Page {currentPage} of {totalPages} ({totalCount} proposals)
                    </p>
                    <div className="flex items-center gap-[8px]">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-[8px] rounded-[8px] border border-[#E5E5E5] hover:bg-[#F0F0F0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-[32px] h-[32px] rounded-[8px] text-sm font-medium transition-colors cursor-pointer ${
                              currentPage === pageNum
                                ? "bg-primary text-white"
                                : "border border-[#E5E5E5] hover:bg-[#F0F0F0] text-foreground"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-[8px] rounded-[8px] border border-[#E5E5E5] hover:bg-[#F0F0F0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selectedProposal && (
          <div className="w-[45%] sticky top-[20px]">
            <div className="rounded-[15px] bg-white p-[20px]">
              <div className="flex items-start justify-between mb-[16px]">
                <h3 className="font-h4-600 text-foreground">
                  {selectedProposal.title || "Untitled Proposal"}
                </h3>
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="p-1 rounded-full hover:bg-[#F0F0F0] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-[#959595]" />
                </button>
              </div>

              <div className="space-y-[12px]">
                <div className="flex items-center gap-2">
                  {(() => {
                    const config = getStatusBadgeConfig(selectedProposal.status, selectedProposal.typeOfProposal);
                    const Icon = config.icon;
                    return (
                      <span className={`inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                        <Icon className="w-[12px] h-[12px]" />
                        {getStatusText(selectedProposal.status, selectedProposal.typeOfProposal)}
                      </span>
                    );
                  })()}
                  <span className="text-xs font-medium px-[8px] py-[2px] rounded bg-[#F0F0F0] text-[#959595]">
                    {selectedProposal.typeOfProposal === "3" ? "AGF Game" : "Community"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-[12px]">
                  <div className="rounded-[10px] bg-[#F8F9FA] p-[12px]">
                    <p className="text-xs text-[#959595] mb-[4px]">Created</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(selectedProposal.createTime)}
                    </p>
                  </div>
                  {selectedProposal.startTime && (
                    <div className="rounded-[10px] bg-[#F8F9FA] p-[12px]">
                      <p className="text-xs text-[#959595] mb-[4px]">Start</p>
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(selectedProposal.startTime)}
                      </p>
                    </div>
                  )}
                  {selectedProposal.endTime && (
                    <div className="rounded-[10px] bg-[#F8F9FA] p-[12px]">
                      <p className="text-xs text-[#959595] mb-[4px]">End</p>
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(selectedProposal.endTime)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-[10px] bg-[#F8F9FA] p-[12px]">
                  <p className="text-xs text-[#959595] mb-[4px]">Proposal ID</p>
                  <p className="text-sm font-medium text-foreground font-mono">{selectedProposal.id}</p>
                </div>

                {selectedProposal.creatorUserDetailsModel?.walletAddress && (
                  <div className="rounded-[10px] bg-[#F8F9FA] p-[12px]">
                    <p className="text-xs text-[#959595] mb-[4px]">Creator</p>
                    <p className="text-sm font-medium text-foreground font-mono">
                      {selectedProposal.creatorUserDetailsModel.walletAddress}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
