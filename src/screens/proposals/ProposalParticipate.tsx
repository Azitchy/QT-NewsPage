import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUnified } from "@/context/Context";
import {
  useMyParticipatedProposals,
  useProposalStatusText,
  useWithdrawAGT,
} from "@/hooks/useWebAppService";
import type { Proposal } from "@/hooks/useWebAppService";
import {
  Loader2,
  Wallet,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Vote,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/atm/button";

/* ============================================================================
   CONSTANTS & TYPES
   ============================================================================ */

const ITEMS_PER_PAGE = 10;

type FilterTab = "all" | "community" | "agf";
type StatusFilter = "" | "1" | "2" | "3" | "4" | "5" | "6";

interface FilterTabConfig {
  key: FilterTab;
  label: string;
  typeOfProposal: string;
}

const FILTER_TABS: FilterTabConfig[] = [
  { key: "all", label: "All", typeOfProposal: "" },
  { key: "community", label: "Community", typeOfProposal: "1" },
  { key: "agf", label: "AGF", typeOfProposal: "3" },
];

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

interface CachedProposalData {
  proposals: Proposal[];
  totalCount: number;
  fetchedAt: number;
}

const proposalCache = new Map<string, CachedProposalData>();
const CACHE_TTL = 60_000;

function getCacheKey(address: string, tab: FilterTab, status: StatusFilter, search: string, page: number) {
  return `participate|${address}|${tab}|${status}|${search || "all"}|${page}`;
}

/* ============================================================================
   HELPERS
   ============================================================================ */

function formatAddress(addr: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatDate(timestamp: number): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getDaysLeft(endTime?: number): number | null {
  if (!endTime) return null;
  const now = Date.now();
  const diff = endTime - now;
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getStatusBadgeConfig(status: number, typeOfProposal?: string) {
  if (typeOfProposal === "3") {
    const configs: Record<number, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
      0: { bg: "bg-[#F0F0F0]", text: "text-[#959595]", icon: Ban },
      1: { bg: "bg-[#FFF8E6]", text: "text-[#F2994A]", icon: Clock },
      2: { bg: "bg-[#E8F0FE]", text: "text-[#2D9CDB]", icon: AlertCircle },
      3: { bg: "bg-[#E8F8EE]", text: "text-[#27AE60]", icon: CheckCircle2 },
      4: { bg: "bg-[#FEECEC]", text: "text-[#EB5757]", icon: XCircle },
      5: { bg: "bg-[#F0E8FE]", text: "text-[#9B51E0]", icon: Users },
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
   STATUS BADGE
   ============================================================================ */

function ProposalStatusBadge({ status, typeOfProposal, getStatusText }: {
  status: number;
  typeOfProposal?: string;
  getStatusText: (status: number, typeOfProposal?: string) => string;
}) {
  const config = getStatusBadgeConfig(status, typeOfProposal);
  const Icon = config.icon;
  const label = getStatusText(status, typeOfProposal);

  return (
    <span className={`inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-[12px] h-[12px]" />
      {label}
    </span>
  );
}

/* ============================================================================
   PROPOSAL CARD COMPONENT
   ============================================================================ */

function ProposalCard({
  proposal,
  isSelected,
  getStatusText,
  onClick,
}: {
  proposal: Proposal;
  isSelected: boolean;
  getStatusText: (status: number, typeOfProposal?: string) => string;
  onClick: () => void;
}) {
  const daysLeft = getDaysLeft(proposal.endTime);

  return (
    <div
      onClick={onClick}
      className={`rounded-[12px] p-[16px] cursor-pointer transition-all border-2 ${
        isSelected
          ? "border-primary bg-[#F0FAFB]"
          : "border-transparent bg-white hover:border-[#E0E0E0]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-[8px]">
            <ProposalStatusBadge
              status={proposal.status}
              typeOfProposal={proposal.typeOfProposal}
              getStatusText={getStatusText}
            />
            {daysLeft !== null && daysLeft > 0 && (
              <span className="text-xs text-[#959595] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {daysLeft}d left
              </span>
            )}
          </div>
          <h4 className="font-semibold text-[14px] text-foreground truncate mb-[4px]">
            {proposal.title || "Untitled Proposal"}
          </h4>
          <div className="flex items-center gap-3 text-xs text-[#959595]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(proposal.createTime)}
            </span>
            {proposal.creatorUserDetailsModel?.walletAddress && (
              <span className="flex items-center gap-1">
                <Wallet className="w-3 h-3" />
                {formatAddress(proposal.creatorUserDetailsModel.walletAddress)}
              </span>
            )}
          </div>
        </div>
        <span className="text-xs font-medium px-[8px] py-[2px] rounded bg-[#F0F0F0] text-[#959595] whitespace-nowrap">
          {proposal.typeOfProposal === "3" ? "AGF" : "Community"}
        </span>
      </div>
    </div>
  );
}

/* ============================================================================
   PROPOSAL DETAIL PANEL
   ============================================================================ */

function ProposalDetailPanel({
  proposal,
  getStatusText,
  onWithdraw,
  isWithdrawing,
  onClose,
}: {
  proposal: Proposal;
  getStatusText: (status: number, typeOfProposal?: string) => string;
  onWithdraw: (proposalId: string) => void;
  isWithdrawing: boolean;
  onClose: () => void;
}) {
  const daysLeft = getDaysLeft(proposal.endTime);
  const canRedeem = proposal.redeemFlag === 1 && (proposal.status === 5 || proposal.status === 3);

  return (
    <div className="rounded-[15px] bg-white p-[20px] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-[16px]">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-[8px]">
            <ProposalStatusBadge
              status={proposal.status}
              typeOfProposal={proposal.typeOfProposal}
              getStatusText={getStatusText}
            />
            {daysLeft !== null && daysLeft > 0 && (
              <span className="inline-flex items-center gap-1 px-[8px] py-[2px] rounded-full bg-[#E8F0FE] text-[#2D9CDB] text-xs font-medium">
                <Clock className="w-3 h-3" />
                {daysLeft} days left
              </span>
            )}
            {daysLeft === 0 && (
              <span className="inline-flex items-center gap-1 px-[8px] py-[2px] rounded-full bg-[#FEECEC] text-[#EB5757] text-xs font-medium">
                Ended
              </span>
            )}
          </div>
          <h3 className="font-h4-600 text-foreground mb-[4px]">
            {proposal.title || "Untitled Proposal"}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-[#F0F0F0] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-[#959595]" />
        </button>
      </div>

      {/* Info */}
      <div className="space-y-[12px] flex-1">
        <div className="grid grid-cols-2 gap-[12px]">
          <div className="rounded-[10px] bg-[#F8F9FA] p-[12px]">
            <p className="text-xs text-[#959595] mb-[4px]">Type</p>
            <p className="text-sm font-medium text-foreground">
              {proposal.typeOfProposal === "3" ? "AGF Game" : "Community"}
            </p>
          </div>
          <div className="rounded-[10px] bg-[#F8F9FA] p-[12px]">
            <p className="text-xs text-[#959595] mb-[4px]">Created</p>
            <p className="text-sm font-medium text-foreground">
              {formatDate(proposal.createTime)}
            </p>
          </div>
          {proposal.startTime && (
            <div className="rounded-[10px] bg-[#F8F9FA] p-[12px]">
              <p className="text-xs text-[#959595] mb-[4px]">Start</p>
              <p className="text-sm font-medium text-foreground">
                {formatDate(proposal.startTime)}
              </p>
            </div>
          )}
          {proposal.endTime && (
            <div className="rounded-[10px] bg-[#F8F9FA] p-[12px]">
              <p className="text-xs text-[#959595] mb-[4px]">End</p>
              <p className="text-sm font-medium text-foreground">
                {formatDate(proposal.endTime)}
              </p>
            </div>
          )}
        </div>

        {proposal.creatorUserDetailsModel?.walletAddress && (
          <div className="rounded-[10px] bg-[#F8F9FA] p-[12px]">
            <p className="text-xs text-[#959595] mb-[4px]">Creator</p>
            <p className="text-sm font-medium text-foreground font-mono">
              {proposal.creatorUserDetailsModel.walletAddress}
            </p>
          </div>
        )}

        {/* Proposal ID */}
        <div className="rounded-[10px] bg-[#F8F9FA] p-[12px]">
          <p className="text-xs text-[#959595] mb-[4px]">Proposal ID</p>
          <p className="text-sm font-medium text-foreground font-mono">{proposal.id}</p>
        </div>
      </div>

      {/* Actions */}
      {canRedeem && (
        <div className="mt-[16px] pt-[16px] border-t border-[#E5E5E5]">
          <Button
            variant="default"
            className="w-full"
            onClick={() => onWithdraw(proposal.id)}
            disabled={isWithdrawing}
          >
            {isWithdrawing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Withdrawing...
              </>
            ) : (
              "Withdraw AGT"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   NEW PROPOSAL MODAL
   ============================================================================ */

function NewProposalModal({ onClose }: { onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div ref={modalRef} className="rounded-[15px] bg-white p-[24px] w-[420px] max-w-[90vw] shadow-lg">
        <div className="flex items-center justify-between mb-[20px]">
          <h3 className="font-h4-600 text-foreground">What proposal do you want to initiate?</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#F0F0F0] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-[#959595]" />
          </button>
        </div>
        <div className="space-y-[12px]">
          <button
            onClick={() => {
              onClose();
              navigate("/proposals/propose-community");
            }}
            className="w-full rounded-[12px] border-2 border-[#E5E5E5] hover:border-primary p-[16px] text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E8F8EE] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#27AE60]" />
              </div>
              <div>
                <h4 className="font-semibold text-[14px] text-foreground group-hover:text-primary transition-colors">Community proposal</h4>
                <p className="text-xs text-[#959595]">Create a community governance proposal</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => {
              onClose();
              navigate("/proposals/propose-game");
            }}
            className="w-full rounded-[12px] border-2 border-[#E5E5E5] hover:border-primary p-[16px] text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F0E8FE] flex items-center justify-center">
                <Vote className="w-5 h-5 text-[#9B51E0]" />
              </div>
              <div>
                <h4 className="font-semibold text-[14px] text-foreground group-hover:text-primary transition-colors">Game proposal</h4>
                <p className="text-xs text-[#959595]">Create an AGF game proposal</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   TOAST COMPONENT
   ============================================================================ */

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-5 py-3 rounded-[12px] shadow-lg transition-all ${
      type === "success" ? "bg-[#E8F8EE] text-[#27AE60]" : "bg-[#FEECEC] text-[#EB5757]"
    }`}>
      {type === "success" ? (
        <CheckCircle2 className="w-5 h-5" />
      ) : (
        <XCircle className="w-5 h-5" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 cursor-pointer">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ============================================================================
   MAIN COMPONENT
   ============================================================================ */

export default function ProposalParticipate() {
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

  const participatedHook = useMyParticipatedProposals();
  const getStatusText = useProposalStatusText();
  const withdrawHook = useWithdrawAGT();

  // State
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showNewProposalModal, setShowNewProposalModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const requestIdRef = useRef(0);

  /* ---------- Load proposals ---------- */
  const loadProposals = useCallback(async () => {
    if (!address || !isAuthenticated || !walletProvider) return;

    const requestId = ++requestIdRef.current;
    const cacheKey = getCacheKey(address, activeTab, statusFilter, searchQuery, currentPage);

    // Check cache
    const cached = proposalCache.get(cacheKey);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
      setProposals(cached.proposals);
      setTotalCount(cached.totalCount);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tabConfig = FILTER_TABS.find((t) => t.key === activeTab);
      // Build search keys — combine search query with type filter
      let searchKeys = searchQuery;
      if (tabConfig && tabConfig.typeOfProposal) {
        // When a specific type tab is active, pass the type as part of search
        searchKeys = searchQuery;
      }

      const result = await participatedHook.execute({
        status: statusFilter,
        searchKeys: searchKeys,
        pageIndex: currentPage,
        pageSize: ITEMS_PER_PAGE,
        walletProvider,
      });

      console.log('[ProposalParticipate] Raw API result:', result);

      if (requestId !== requestIdRef.current) return;

      let proposalList: Proposal[] = [];
      let total = 0;

      // API may return data as an array directly, or nested under initiateList/partList
      if (result?.data) {
        if (Array.isArray(result.data)) {
          proposalList = result.data;
        } else if (result.data.initiateList) {
          proposalList = result.data.initiateList;
        } else if (result.data.partList) {
          proposalList = result.data.partList;
        } else if (result.data.list) {
          proposalList = result.data.list;
        }
        total = result.data.totalCount || result.data.total || result.total || proposalList.length;
      }

      // Client-side type filter if API doesn't support it
      if (tabConfig && tabConfig.typeOfProposal) {
        proposalList = proposalList.filter(
          (p) => p.typeOfProposal === tabConfig.typeOfProposal
        );
        total = proposalList.length;
      }

      proposalCache.set(cacheKey, {
        proposals: proposalList,
        totalCount: total,
        fetchedAt: Date.now(),
      });

      setProposals(proposalList);
      setTotalCount(total);
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
      console.error("Error loading proposals:", err);
      setError(err?.message || "Failed to load proposals");
      setProposals([]);
      setTotalCount(0);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [address, isAuthenticated, walletProvider, activeTab, statusFilter, searchQuery, currentPage, participatedHook]);

  // Fetch on state change
  useEffect(() => {
    if (isAuthenticated && walletProvider) {
      loadProposals();
    }
  }, [isAuthenticated, walletProvider, activeTab, statusFilter, searchQuery, currentPage]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedProposal(null);
  }, [activeTab, statusFilter, searchQuery]);

  /* ---------- Handlers ---------- */
  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleRetry = () => {
    setError(null);
    const cacheKey = getCacheKey(address || "", activeTab, statusFilter, searchQuery, currentPage);
    proposalCache.delete(cacheKey);
    loadProposals();
  };

  const handleWithdraw = async (proposalId: string) => {
    try {
      const result = await withdrawHook.execute({
        keyIds: [proposalId],
        walletProvider,
      });
      if (result?.success) {
        setToast({ message: "AGT withdrawn successfully", type: "success" });
        // Invalidate cache and reload
        proposalCache.clear();
        loadProposals();
      } else {
        setToast({ message: result?.message || "Failed to withdraw AGT", type: "error" });
      }
    } catch (err: any) {
      setToast({ message: err?.message || "Failed to withdraw AGT", type: "error" });
    }
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  /* ── Connect wallet screen ── */
  if (!isConnected || !isAuthenticated) return null;

  /* ── Main UI ── */
  return (
    <div className="space-y-[16px]">
      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* New Proposal Modal */}
      {showNewProposalModal && (
        <NewProposalModal onClose={() => setShowNewProposalModal(false)} />
      )}

      {/* Header */}
      <div className="rounded-[15px] bg-white p-[20px]">
        <div className="flex items-center justify-between mb-[16px]">
          <h2 className="text-[20px] font-semibold text-foreground">Proposal Participate</h2>
          <Button
            variant="default"
            size="default"
            onClick={() => setShowNewProposalModal(true)}
          >
            <Plus className="w-4 h-4" />
            Proposal
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-[8px] mb-[16px]">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-[16px] py-[8px] rounded-full text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? "bg-primary text-white"
                  : "bg-[#F0F0F0] text-[#959595] hover:bg-[#E5E5E5]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Status filter row */}
        <div className="flex items-center gap-[12px]">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#959595]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search proposals..."
              className="w-full pl-[36px] pr-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground placeholder:text-[#959595] focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-[12px] py-[10px] rounded-[10px] bg-[#F8F9FA] border border-[#E5E5E5] text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-[140px]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
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

      {/* Content area: list + detail panel */}
      <div className="flex gap-[16px] items-start">
        {/* Proposal list */}
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
                    <Vote className="w-6 h-6 text-[#959595]" />
                  </div>
                  <p className="text-sm text-[#959595]">No proposals found</p>
                  <p className="text-xs text-[#BDBDBD]">
                    {searchQuery || statusFilter
                      ? "Try adjusting your filters"
                      : "Proposals you participate in will appear here"}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Proposal cards */}
                <div className="space-y-[8px]">
                  {proposals.map((proposal) => (
                    <ProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      isSelected={selectedProposal?.id === proposal.id}
                      getStatusText={getStatusText}
                      onClick={() => setSelectedProposal(proposal)}
                    />
                  ))}
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
            <ProposalDetailPanel
              proposal={selectedProposal}
              getStatusText={getStatusText}
              onWithdraw={handleWithdraw}
              isWithdrawing={withdrawHook.loading}
              onClose={() => setSelectedProposal(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
