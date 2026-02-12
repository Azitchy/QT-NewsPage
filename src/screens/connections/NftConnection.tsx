import { useState, useEffect, useRef, useCallback } from "react";
import { useUnified } from "@/context/Context";
import { useGetNFTLinkList } from "@/hooks/useWebAppService";
import type { NFTLinkConnection } from "@/hooks/useWebAppService";
import {
  Loader2,
  Wallet,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/atm/button";

/* ============================================================================
   CONSTANTS & TYPES
   ============================================================================ */

const ITEMS_PER_PAGE = 20;

type TabKey = "active" | "pending" | "inactive";

interface TabConfig {
  key: TabKey;
  label: string;
  statuses: number[];
}

const TABS: TabConfig[] = [
  { key: "active", label: "Active", statuses: [1, 6] },
  { key: "pending", label: "Pending", statuses: [2, 3] },
  { key: "inactive", label: "Inactive", statuses: [4, 5] },
];

/* ============================================================================
   MODULE-LEVEL CACHE
   Persists across component mounts (tab navigation) but clears on page refresh
   ============================================================================ */

interface CachedTabData {
  connections: NFTLinkConnection[];
  fetchedAt: number;
}

const nftConnectionCache = new Map<string, CachedTabData>();
const nftTabCountsCache = new Map<
  string,
  { active: number; pending: number; inactive: number }
>();
const CACHE_TTL = 60_000; // 60 seconds

function getCacheKey(address: string, tab: TabKey, search: string) {
  return `nft|${address}|${tab}|${search || "all"}`;
}

function getCountsCacheKey(address: string) {
  return `nft-counts|${address}`;
}

/* ============================================================================
   HELPERS
   ============================================================================ */

function formatAddress(addr: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function getStatusLabel(status: number): string {
  const statusMap: Record<number, string> = {
    1: "Connected",
    2: "Pending",
    3: "Waiting",
    4: "Canceled",
    5: "Disconnected",
    6: "Redeemable",
  };
  return statusMap[status] || "Unknown";
}

function getStatusBadgeConfig(status: number) {
  const configs: Record<
    number,
    { bg: string; text: string; Icon: typeof CheckCircle }
  > = {
    1: { bg: "bg-[#E8F8EE]", text: "text-[#27AE60]", Icon: CheckCircle },
    2: { bg: "bg-[#FFF8E6]", text: "text-[#F2994A]", Icon: Clock },
    3: { bg: "bg-[#E8F0FE]", text: "text-[#2D9CDB]", Icon: Clock },
    4: { bg: "bg-[#FEECEC]", text: "text-[#EB5757]", Icon: XCircle },
    5: { bg: "bg-[#F0F0F0]", text: "text-[#959595]", Icon: XCircle },
    6: { bg: "bg-[#F0E8FE]", text: "text-[#9B51E0]", Icon: CheckCircle },
  };
  return configs[status] || configs[1];
}

/* ============================================================================
   STATUS BADGE COMPONENT
   ============================================================================ */

function StatusBadge({ status }: { status: number }) {
  const config = getStatusBadgeConfig(status);
  const Icon = config.Icon;
  const label = getStatusLabel(status);

  return (
    <span
      className={`inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <Icon className="w-[12px] h-[12px]" />
      {label}
    </span>
  );
}

/* ============================================================================
   MAIN NFT CONNECTION COMPONENT
   ============================================================================ */

export default function NftConnection() {
  const {
    address,
    isConnected,
    isAuthenticated,
    isAuthenticating,
    openModal,
    authenticate,
    authError,
  } = useUnified();

  const nftLinkListHook = useGetNFTLinkList();

  // State
  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const [connections, setConnections] = useState<NFTLinkConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tabCounts, setTabCounts] = useState({
    active: 0,
    pending: 0,
    inactive: 0,
  });
  const [countsLoaded, setCountsLoaded] = useState(false);

  const requestIdRef = useRef(0);

  // Get other party address
  const getOtherPartyAddress = useCallback(
    (conn: NFTLinkConnection): string => {
      if (!address) return conn.linkAddress || "";
      return address.toLowerCase() === conn.createAddress?.toLowerCase()
        ? conn.targetAddress
        : conn.createAddress;
    },
    [address]
  );

  // Load tab counts
  const loadTabCounts = useCallback(async () => {
    if (!address || !isAuthenticated) return;

    const cacheKey = getCountsCacheKey(address);
    const cached = nftTabCountsCache.get(cacheKey);
    if (cached) {
      setTabCounts(cached);
      setCountsLoaded(true);
      return;
    }

    try {
      const counts = { active: 0, pending: 0, inactive: 0 };

      for (const tab of TABS) {
        for (const status of tab.statuses) {
          try {
            const res = await nftLinkListHook.execute({
              linkStatus: status,
            });
            counts[tab.key] += res?.data?.linkList?.length || 0;
          } catch {
            // Individual status fetch can fail
          }
        }
      }

      nftTabCountsCache.set(cacheKey, counts);
      setTabCounts(counts);
      setCountsLoaded(true);
    } catch {
      setCountsLoaded(true);
    }
  }, [address, isAuthenticated, nftLinkListHook]);

  // Load connections for the current tab
  const loadConnections = useCallback(async () => {
    if (!address || !isAuthenticated) {
      setConnections([]);
      setLoading(false);
      return;
    }

    const currentTab = TABS.find((t) => t.key === activeTab);
    if (!currentTab) return;

    const cacheKey = getCacheKey(address, activeTab, searchQuery);
    const cached = nftConnectionCache.get(cacheKey);

    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
      setConnections(cached.connections);
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const aggregated: NFTLinkConnection[] = [];
      const addressToSearch = searchQuery || undefined;

      for (const status of currentTab.statuses) {
        const response = await nftLinkListHook.execute({
          linkStatus: status,
          userWalletAddress: addressToSearch,
        });

        if (requestId !== requestIdRef.current) return;

        const list = response?.data?.linkList || [];
        aggregated.push(
          ...list.map((link: NFTLinkConnection) => ({
            ...link,
            linkStatus: status,
          }))
        );
      }

      if (requestId !== requestIdRef.current) return;

      nftConnectionCache.set(cacheKey, {
        connections: aggregated,
        fetchedAt: Date.now(),
      });

      setConnections(aggregated);
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
      console.error("Error loading NFT connections:", err);
      setError(err?.message || "Failed to load NFT connections");
      setConnections([]);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [address, isAuthenticated, activeTab, searchQuery, nftLinkListHook]);

  // Fetch on auth / tab / search change
  useEffect(() => {
    if (isAuthenticated) {
      loadConnections();
    }
  }, [isAuthenticated, activeTab, searchQuery]);

  // Load tab counts once
  useEffect(() => {
    if (isAuthenticated && !countsLoaded) {
      loadTabCounts();
    }
  }, [isAuthenticated, countsLoaded]);

  // Reset page on tab or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Search handler
  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  // Retry
  const handleRetry = () => {
    setError(null);
    const cacheKey = getCacheKey(address || "", activeTab, searchQuery);
    nftConnectionCache.delete(cacheKey);
    loadConnections();
  };

  // Pagination
  const totalPages = Math.ceil(connections.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const pageConnections = connections.slice(startIdx, endIdx);

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
            Please connect your wallet to view your NFT connections
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
              : "Sign a message to view your NFT connections"}
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
    <div className="space-y-[20px]">
      {/* ── Search Bar ── */}
      <div className="flex items-center gap-[12px]">
        <div className="relative flex-1 max-w-[400px]">
          <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#959595]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search by wallet address"
            className="w-full pl-[36px] pr-[12px] py-[10px] rounded-[10px] border border-[#E0E0E0] body-text2-400 text-foreground focus:outline-none focus:border-primary bg-white"
          />
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={handleSearch}
          className="cursor-pointer"
        >
          Search
        </Button>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchInput("");
              setSearchQuery("");
            }}
            className="body-text2-400 text-[#959595] hover:text-foreground cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-[#F0F0F0]">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = tabCounts[tab.key];
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-[20px] py-[12px] body-text2-500 transition-colors cursor-pointer ${
                isActive
                  ? "text-primary"
                  : "text-[#959595] hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-[6px]">
                <span>{tab.label}</span>
                {countsLoaded && (
                  <span
                    className={`text-xs px-[6px] py-[1px] rounded-full ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-[#F0F0F0] text-[#959595]"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </div>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div className="bg-white rounded-[15px]">
        {loading ? (
          <div className="flex items-center justify-center py-[80px]">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="body-text2-400 text-[#959595]">
                Loading NFT connections...
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
        ) : connections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[80px] gap-[12px]">
            <AlertCircle className="w-12 h-12 text-[#959595]" />
            <p className="body-text2-400 text-[#959595]">
              {searchQuery
                ? `No NFT connections found for "${searchQuery}"`
                : "No NFT connections found"}
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0F0F0]">
                    <th className="px-[16px] py-[12px] text-left body-text2-500 text-[#959595] font-medium">
                      User address
                    </th>
                    <th className="px-[16px] py-[12px] text-left body-text2-500 text-[#959595] font-medium">
                      NFT name
                    </th>
                    <th className="px-[16px] py-[12px] text-left body-text2-500 text-[#959595] font-medium">
                      NFT address
                    </th>
                    <th className="px-[16px] py-[12px] text-left body-text2-500 text-[#959595] font-medium">
                      Lockup time
                    </th>
                    <th className="px-[16px] py-[12px] text-left body-text2-500 text-[#959595] font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageConnections.map((conn) => {
                    const otherAddr = getOtherPartyAddress(conn);
                    return (
                      <tr
                        key={`${conn.id}-${conn.linkStatus}`}
                        className="border-b border-[#F0F0F0] last:border-b-0 hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                      >
                        <td className="px-[16px] py-[14px]">
                          <span className="body-text2-400 text-foreground font-mono">
                            {formatAddress(otherAddr)}
                          </span>
                        </td>
                        <td className="px-[16px] py-[14px]">
                          <span className="body-text2-400 text-foreground">
                            {conn.nftName || "—"}
                          </span>
                        </td>
                        <td className="px-[16px] py-[14px]">
                          <span className="body-text2-400 text-foreground font-mono">
                            {formatAddress(conn.nftAddress)}
                          </span>
                        </td>
                        <td className="px-[16px] py-[14px]">
                          <span className="body-text2-400 text-foreground">
                            {conn.lockedDay} day
                            {conn.lockedDay !== 1 ? "s" : ""}
                          </span>
                        </td>
                        <td className="px-[16px] py-[14px]">
                          <StatusBadge status={conn.linkStatus} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-[16px] py-[12px] border-t border-[#F0F0F0]">
                <p className="body-label-400 text-[#959595]">
                  {startIdx + 1}-{Math.min(endIdx, connections.length)} of{" "}
                  {connections.length}
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

            {/* Total count */}
            {totalPages <= 1 && connections.length > 0 && (
              <div className="px-[16px] py-[12px] border-t border-[#F0F0F0]">
                <p className="body-label-400 text-[#959595]">
                  Total {connections.length}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
