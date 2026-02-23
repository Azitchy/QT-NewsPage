import { useState, useEffect, useRef, useCallback } from "react";
import { useUnified } from "@/context/Context";
import { useGetNFTLinkList } from "@/hooks/useWebAppService";
import type { NFTLinkConnection } from "@/hooks/useWebAppService";
import { Loader2, Wallet, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/atm/button";
import { SearchBar } from "@/components/SearchBar";

/* ============================================================================
   CONSTANTS & TYPES
   ============================================================================ */

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

  // Search handler
  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
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
  // const totalPages = Math.ceil(connections.length / ITEMS_PER_PAGE);
  // const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  // const endIdx = startIdx + ITEMS_PER_PAGE;
  // const pageConnections = connections.slice(startIdx, endIdx);

  if (!isConnected || !isAuthenticated) return null;

  return (
    <div className="flex flex-col space-y-[10px] h-full">
      <div className="flex items-center justify-between rounded-[15px] bg-white px-[20px] py-[15px]">
        <div className="flex gap-[30px]">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`body-text2-500 transition-colors cursor-pointer ${
                  isActive
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                <div className="flex items-center">
                  <span>{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-[12px]">
          <SearchBar
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onSearch={handleSearch}
            onClear={handleClearSearch}
            placeholder="Search user address"
            containerClassName="flex-1 max-w-[400px]"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="body-text2-400 text-[#959595] hover:text-foreground cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="bg-white rounded-[15px] flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-[80px]">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="body-text2-400 text-[#959595]">
                Loading NFT connections...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center py-[80px] gap-[16px]">
            <AlertCircle className="w-12 h-12 text-[#FF6B6B]" />
            <p className="body-text2-400 text-[#FF6B6B]">{error}</p>
            <Button variant="soft" size="sm" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        ) : connections.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-[80px] gap-[12px]">
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
            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0F0F0]">
                    <th className="px-[15px] py-[20px] text-left body-text1-400 text-foreground font-medium">
                      User address
                    </th>
                    <th className="px-[15px] py-[20px] text-left body-text1-400 text-foreground font-medium">
                      NFT name
                    </th>
                    <th className="px-[15px] py-[20px] text-left body-text1-400 text-foreground font-medium">
                      NFT address
                    </th>
                    <th className="px-[15px] py-[20px] text-left body-text1-400 text-foreground font-medium">
                      Lockup time{" "}
                      <span className="text-[#878787] body-label-400">
                        (day(s))
                      </span>
                    </th>
                    <th className="px-[15px] py-[20px] text-left body-text1-400 text-foreground font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {connections.map((conn) => {
                    const otherAddr = getOtherPartyAddress(conn);
                    return (
                      <tr
                        key={`${conn.id}-${conn.linkStatus}`}
                        className="hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                      >
                        <td className="px-[15px] py-[20px]">
                          <span className="body-text2-400 text-foreground font-mono">
                            {formatAddress(otherAddr)}
                          </span>
                        </td>
                        <td className="px-[15px] py-[20px]">
                          <span className="body-text2-400 text-foreground">
                            {conn.nftName || "—"}
                          </span>
                        </td>
                        <td className="px-[15px] py-[20px]">
                          <span className="body-text2-400 text-foreground font-mono">
                            {formatAddress(conn.nftAddress)}
                          </span>
                        </td>
                        <td className="px-[15px] py-[20px]">
                          <span className="body-text2-400 text-foreground">
                            {conn.lockedDay}
                          </span>
                        </td>
                        <td className="px-[15px] py-[20px]">
                          <span className="body-text2-400 text-foreground">
                            {getStatusLabel(conn.linkStatus)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
