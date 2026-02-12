import { useState, useEffect, useCallback, useRef } from "react";
import { useUnified } from "@/context/Context";
import {
  useGetUserGameProposals,
  useProposalStatusText,
} from "@/hooks/useWebAppService";
import type { AGFGameProposal } from "@/lib/webAppService";
import {
  Loader2,
  Wallet,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
  DollarSign,
  X,
  ExternalLink,
  Edit3,
} from "lucide-react";

/* ============================================================================
   CONSTANTS
   ============================================================================ */

const ITEMS_PER_PAGE = 10;

/* ============================================================================
   MODULE-LEVEL CACHE
   ============================================================================ */

interface CachedUserContribData {
  proposals: AGFGameProposal[];
  fetchedAt: number;
}

const userContribCache = new Map<string, CachedUserContribData>();
const CACHE_TTL = 60_000;

/* ============================================================================
   HELPERS
   ============================================================================ */

function formatDate(timestamp: number | undefined): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getGameStatusConfig(status: number) {
  const configs: Record<number, { bg: string; text: string; icon: typeof CheckCircle2; label: string }> = {
    0: { bg: "bg-[#F0F0F0]", text: "text-[#959595]", icon: Ban, label: "Inactive" },
    1: { bg: "bg-[#FFF8E6]", text: "text-[#F2994A]", icon: Clock, label: "Under review" },
    2: { bg: "bg-[#E8F0FE]", text: "text-[#2D9CDB]", icon: Edit3, label: "Changes required" },
    3: { bg: "bg-[#E8F8EE]", text: "text-[#27AE60]", icon: CheckCircle2, label: "Approved" },
    4: { bg: "bg-[#FEECEC]", text: "text-[#EB5757]", icon: XCircle, label: "Rejected" },
    5: { bg: "bg-[#F0E8FE]", text: "text-[#9B51E0]", icon: DollarSign, label: "Contribution stage" },
    6: { bg: "bg-[#E8F8EE]", text: "text-[#27AE60]", icon: CheckCircle2, label: "Released" },
    7: { bg: "bg-[#E8F0FE]", text: "text-[#2D9CDB]", icon: Clock, label: "Development" },
  };
  return configs[status] || configs[0];
}

/* ============================================================================
   MAIN COMPONENT
   ============================================================================ */

export default function YourContribution() {
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

  const userProposalsHook = useGetUserGameProposals();

  // State
  const [proposals, setProposals] = useState<AGFGameProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProposal, setSelectedProposal] = useState<AGFGameProposal | null>(null);

  const requestIdRef = useRef(0);

  /* ---------- Load data ---------- */
  const loadProposals = useCallback(async () => {
    if (!isAuthenticated) return;

    const requestId = ++requestIdRef.current;
    const cacheKey = `user-contrib|${address}`;

    const cached = userContribCache.get(cacheKey);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
      setProposals(cached.proposals);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await userProposalsHook.execute();

      if (requestId !== requestIdRef.current) return;

      let proposalList: AGFGameProposal[] = [];
      if (result?.data && Array.isArray(result.data)) {
        proposalList = result.data;
      } else if (Array.isArray(result)) {
        proposalList = result;
      }

      userContribCache.set(cacheKey, {
        proposals: proposalList,
        fetchedAt: Date.now(),
      });

      setProposals(proposalList);
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
      console.error("Error loading your proposals:", err);
      setError(err?.message || "Failed to load your contributions");
      setProposals([]);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [isAuthenticated, address, userProposalsHook]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProposals();
    }
  }, [isAuthenticated]);

  const handleRetry = () => {
    setError(null);
    userContribCache.delete(`user-contrib|${address}`);
    loadProposals();
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(proposals.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageProposals = proposals.slice(startIdx, startIdx + ITEMS_PER_PAGE);

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
            Please connect your wallet to view your contributions
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
              : "Sign a message to view your contributions"}
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
        <h2 className="text-[20px] font-semibold text-foreground">Your Contribution</h2>
        <p className="text-sm text-[#959595] mt-[4px]">
          Game proposals you have created or contributed to
        </p>
      </div>

      {/* Content */}
      <div className="flex gap-[16px] items-start">
        <div className={`${selectedProposal ? "w-[55%]" : "w-full"} transition-all`}>
          <div className="rounded-[15px] bg-white p-[20px]">
            {loading ? (
              <div className="flex items-center justify-center py-[60px]">
                <div className="text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                  <p className="text-sm text-[#959595]">Loading your contributions...</p>
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
                    <Gamepad2 className="w-6 h-6 text-[#959595]" />
                  </div>
                  <p className="text-sm text-[#959595]">No contributions found</p>
                  <p className="text-xs text-[#BDBDBD]">
                    Your game proposal submissions will appear here
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Cards */}
                <div className="space-y-[8px]">
                  {pageProposals.map((proposal) => {
                    const statusConfig = getGameStatusConfig(proposal.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <div
                        key={proposal.id}
                        onClick={() => setSelectedProposal(proposal)}
                        className={`rounded-[12px] p-[16px] cursor-pointer transition-all border-2 ${
                          selectedProposal?.id === proposal.id
                            ? "border-primary bg-[#F0FAFB]"
                            : "border-transparent bg-white hover:border-[#E0E0E0]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-[8px]">
                              <span className={`inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                <StatusIcon className="w-[12px] h-[12px]" />
                                {statusConfig.label}
                              </span>
                              {proposal.status === 2 && (
                                <span className="text-xs text-[#2D9CDB] flex items-center gap-1">
                                  <Edit3 className="w-3 h-3" />
                                  Needs revision
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-[14px] text-foreground truncate mb-[4px]">
                              {proposal.title || "Untitled Game"}
                            </h4>
                            <p className="text-xs text-[#959595] line-clamp-2 mb-[8px]">
                              {proposal.overview || "No description"}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-[#959595]">
                              {proposal.createTime && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(proposal.createTime)}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {proposal.funds || 0} LUCA
                              </span>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-[8px] bg-[#E9F6F7] flex items-center justify-center flex-shrink-0">
                            <Gamepad2 className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-[16px] pt-[16px] border-t border-[#E5E5E5]">
                    <p className="text-xs text-[#959595]">
                      Page {currentPage} of {totalPages} ({proposals.length} proposals)
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
                        if (totalPages <= 5) pageNum = i + 1;
                        else if (currentPage <= 3) pageNum = i + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                        else pageNum = currentPage - 2 + i;
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
                  {selectedProposal.title || "Untitled Game"}
                </h3>
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="p-1 rounded-full hover:bg-[#F0F0F0] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-[#959595]" />
                </button>
              </div>

              <div className="space-y-[12px]">
                {/* Status */}
                {(() => {
                  const config = getGameStatusConfig(selectedProposal.status);
                  const Icon = config.icon;
                  return (
                    <span className={`inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                      <Icon className="w-[12px] h-[12px]" />
                      {config.label}
                    </span>
                  );
                })()}

                {/* Overview */}
                {selectedProposal.overview && (
                  <div className="rounded-[10px] bg-[#F8F9FA] p-[12px]">
                    <p className="text-xs text-[#959595] mb-[4px]">Overview</p>
                    <p className="text-sm text-foreground">{selectedProposal.overview}</p>
                  </div>
                )}

                {/* Gameplay */}
                {selectedProposal.gameplay && (
                  <div className="rounded-[10px] bg-[#F8F9FA] p-[12px]">
                    <p className="text-xs text-[#959595] mb-[4px]">Gameplay</p>
                    <p className="text-sm text-foreground">{selectedProposal.gameplay}</p>
                  </div>
                )}

                {/* Notes (especially for "Changes required" status) */}
                {selectedProposal.notes && (
                  <div className={`rounded-[10px] p-[12px] ${
                    selectedProposal.status === 2 ? "bg-[#FFF8E6] border border-[#F2994A]/20" : "bg-[#F8F9FA]"
                  }`}>
                    <p className="text-xs text-[#959595] mb-[4px]">
                      {selectedProposal.status === 2 ? "Reviewer Notes" : "Notes"}
                    </p>
                    <p className="text-sm text-foreground">{selectedProposal.notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-[12px]">
                  <div className="rounded-[10px] bg-[#F8F9FA] p-[12px]">
                    <p className="text-xs text-[#959595] mb-[4px]">Funds Required</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedProposal.funds || 0} LUCA
                    </p>
                  </div>
                  {selectedProposal.createTime && (
                    <div className="rounded-[10px] bg-[#F8F9FA] p-[12px]">
                      <p className="text-xs text-[#959595] mb-[4px]">Created</p>
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(selectedProposal.createTime)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Milestones */}
                {selectedProposal.milestones && selectedProposal.milestones.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#959595] uppercase tracking-wide mb-[8px]">
                      Milestones ({selectedProposal.milestones.length})
                    </p>
                    <div className="space-y-[8px]">
                      {selectedProposal.milestones.map((milestone, idx) => (
                        <div key={idx} className="rounded-[10px] bg-[#F8F9FA] p-[12px]">
                          <div className="flex items-center justify-between mb-[4px]">
                            <p className="text-sm font-medium text-foreground">{milestone.title}</p>
                            <span className="text-xs text-[#959595]">{milestone.funds} LUCA</span>
                          </div>
                          <p className="text-xs text-[#959595]">{milestone.description}</p>
                          {milestone.deadline && (
                            <p className="text-xs text-[#BDBDBD] mt-[4px]">
                              Deadline: {milestone.deadline}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Details */}
                {selectedProposal.contactDetails && selectedProposal.contactDetails.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#959595] uppercase tracking-wide mb-[8px]">
                      Contact Details
                    </p>
                    <div className="space-y-[6px]">
                      {selectedProposal.contactDetails.map((contact, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <span className="text-[#959595] capitalize">{contact.name}:</span>
                          <span className="text-foreground">{contact.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Media links */}
                {selectedProposal.gamesMediaModelList && selectedProposal.gamesMediaModelList.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#959595] uppercase tracking-wide mb-[8px]">
                      Media
                    </p>
                    <div className="flex flex-wrap gap-[8px]">
                      {selectedProposal.gamesMediaModelList.map((media, idx) => (
                        <a
                          key={idx}
                          href={media.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-[10px] py-[6px] rounded-[8px] bg-[#F8F9FA] text-xs text-primary hover:bg-[#E9F6F7] transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Link {idx + 1}
                        </a>
                      ))}
                    </div>
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
