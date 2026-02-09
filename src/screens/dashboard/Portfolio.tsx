import { useEffect, useState, useRef, useCallback } from "react";
import { useUnified } from "@/context/Context";
import { useDashboardCache } from "@/context/DashboardCacheContext";
import type { TokenRowData } from "@/context/DashboardCacheContext";
import {
  useUpdateNickname,
} from "@/hooks/useWebAppService";
import type { OverviewData } from "@/hooks/useWebAppService";
import { Loader2, Wallet, Pencil, Copy, Check, X, Settings, Trash2, Plus } from "lucide-react";
import { Dropdown } from "@/components/ui/atm/dropdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/atm/tooltip";

/* ============================================================================
   DONUT CHART COMPONENT
   ============================================================================ */

interface DonutSegment {
  value: number;
  color: string;
  label: string;
}

function DonutChart({
  segments,
  size = 160,
  strokeWidth = 28,
  children,
}: {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  let cumulativeOffset = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#F0F0F0"
          strokeWidth={strokeWidth}
        />
        {total > 0 &&
          segments.map((segment, i) => {
            const pct = segment.value / total;
            const dashLength = pct * circumference;
            const dashGap = circumference - dashLength;
            const offset = cumulativeOffset;
            cumulativeOffset += dashLength;

            return (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${dashGap}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${center} ${center})`}
                className="transition-all duration-700 ease-out"
              />
            );
          })}
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   MINI SPARKLINE CHART
   ============================================================================ */

function SparklineChart({
  data,
  color = "#0DAEB9",
  width = 120,
  height = 50,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} className="bg-gray-50 rounded" />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
      const y =
        height - padding - ((val - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  // Area fill path
  const firstX = padding;
  const lastX = width - padding * 2 + padding;
  const areaPath = `M${firstX},${height} L${points
    .split(" ")
    .map((p) => p)
    .join(" L")} L${lastX},${height} Z`;

  const gradientId = `sparkGrad-${color.replace("#", "")}-${Math.random().toString(36).substring(7)}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ============================================================================
   TOKEN ROW COMPONENT
   ============================================================================ */

function TokenRow({
  token,
  onRemove,
}: {
  token: TokenRowData;
  onRemove?: (symbol: string) => void;
}) {
  const isPositive = token.change24h >= 0;
  const DEFAULT_TOKENS = ["LUCA", "USDC", "USDT", "BNB"];
  const canRemove = !DEFAULT_TOKENS.includes(token.symbol) && onRemove;

  return (
    <div className="flex items-center py-[16px] border-b border-[#F0F0F0] last:border-b-0 group">
      {/* Token info */}
      <div className="flex items-center gap-[12px] w-[35%]">
        <img
          src={token.icon}
          alt={token.symbol}
          className="w-[36px] h-[36px] rounded-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${token.symbol}&background=0DAEB9&color=fff&size=36`;
          }}
        />
        <div>
          <p className="body-text1-500 text-foreground">{token.symbol}</p>
          <p className="body-label-400 text-[#959595]">{token.name}</p>
        </div>
      </div>

      {/* Balance */}
      <div className="w-[35%]">
        <p className="body-text1-500 text-foreground">
          {token.balance} {token.symbol}
        </p>
        <p className="body-label-400 text-[#959595]">${token.balanceUsd}</p>
      </div>

      {/* Price + Remove */}
      <div className="w-[30%] flex items-center justify-end gap-[8px]">
        <div className="text-right">
          <p className="body-text1-500 text-foreground">${token.price}</p>
          <p
            className={`body-label-400 ${
              isPositive ? "text-[#5DD27A]" : "text-[#FF6B6B]"
            }`}
          >
            {isPositive ? "+" : ""}
            {token.change24h.toFixed(2)}%
          </p>
        </div>
        {canRemove && (
          <button
            onClick={() => onRemove!(token.symbol)}
            className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1 hover:bg-red-50 rounded"
            title="Remove token"
          >
            <Trash2 className="w-[14px] h-[14px] text-[#959595] hover:text-red-500" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   COIN WATCHLIST CARD
   ============================================================================ */

interface WatchlistCoin {
  symbol: string;
  name: string;
  price: string;
  btcPrice: string;
  change: number;
  sparkData: number[];
  icon: string;
}

function CoinWatchlistCard({ coin }: { coin: WatchlistCoin }) {
  const isPositive = coin.change >= 0;
  return (
    <div className="bg-white rounded-[15px] p-[16px] flex-1 min-w-[250px]">
      <div className="flex items-center justify-between mb-[12px]">
        <div className="flex items-center gap-[8px]">
          <img
            src={coin.icon}
            alt={coin.symbol}
            className="w-[28px] h-[28px] rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${coin.symbol}&background=0DAEB9&color=fff&size=28`;
            }}
          />
          <div>
            <p className="body-text1-500 text-foreground">{coin.symbol}</p>
            <p className="body-label-400 text-[#959595]">{coin.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="body-text1-500 text-foreground">$ {coin.price}</p>
          <p
            className={`body-label-400 ${
              isPositive ? "text-[#5DD27A]" : "text-[#FF6B6B]"
            }`}
          >
            {isPositive ? "+" : ""}
            {coin.change.toFixed(1)}%
          </p>
        </div>
      </div>
      <div className="flex items-end gap-[4px]">
        <p className="body-label-400 text-[#959595]">₿ {coin.btcPrice}</p>
        <p
          className={`body-label-400 ${
            isPositive ? "text-[#5DD27A]" : "text-[#FF6B6B]"
          }`}
        >
          {isPositive ? "+" : ""}
          {(coin.change * 0.3).toFixed(1)}%
        </p>
      </div>
      <div className="mt-[8px]">
        <SparklineChart
          data={coin.sparkData}
          color={isPositive ? "#0DAEB9" : "#FF6B6B"}
          width={220}
          height={60}
        />
      </div>
      <div className="flex items-center justify-between mt-[8px]">
        <div className="flex items-center gap-[4px]">
          <div
            className="w-[8px] h-[8px] rounded-full"
            style={{ backgroundColor: isPositive ? "#0DAEB9" : "#FF6B6B" }}
          />
          <span className="body-label-400 text-primary">
            {coin.symbol} Price Charts
          </span>
        </div>
        <span className="body-label-400 text-[#959595]">This Week</span>
      </div>
    </div>
  );
}

/* ============================================================================
   IMPORT TOKEN MODAL
   ============================================================================ */

function ImportTokenModal({
  isOpen,
  onClose,
  onImport,
  existingSymbols,
}: {
  isOpen: boolean;
  onClose: () => void;
  onImport: (token: { symbol: string; name: string; icon: string }) => void;
  existingSymbols: string[];
}) {
  const [contractAddress, setContractAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenName, setTokenName] = useState("");

  if (!isOpen) return null;

  const handleImport = () => {
    if (!tokenSymbol.trim()) return;
    if (existingSymbols.includes(tokenSymbol.toUpperCase())) {
      alert("Token already exists in your list");
      return;
    }
    onImport({
      symbol: tokenSymbol.toUpperCase(),
      name: tokenName || tokenSymbol.toUpperCase(),
      icon: `https://ui-avatars.com/api/?name=${tokenSymbol}&background=0DAEB9&color=fff&size=36`,
    });
    setContractAddress("");
    setTokenSymbol("");
    setTokenName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-[15px] p-[24px] w-[420px] max-w-[90vw]">
        <div className="flex items-center justify-between mb-[20px]">
          <h3 className="font-h4-600 text-foreground">Import Token</h3>
          <button
            onClick={onClose}
            className="cursor-pointer p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-[#959595]" />
          </button>
        </div>

        <div className="space-y-[16px]">
          <div>
            <label className="body-label-400 text-[#959595] block mb-[6px]">
              Contract Address
            </label>
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-[12px] py-[10px] rounded-[10px] border border-[#E0E0E0] body-text2-400 text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="body-label-400 text-[#959595] block mb-[6px]">
              Token Symbol
            </label>
            <input
              type="text"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              placeholder="e.g. DOGE"
              className="w-full px-[12px] py-[10px] rounded-[10px] border border-[#E0E0E0] body-text2-400 text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="body-label-400 text-[#959595] block mb-[6px]">
              Token Name
            </label>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              placeholder="e.g. Dogecoin"
              className="w-full px-[12px] py-[10px] rounded-[10px] border border-[#E0E0E0] body-text2-400 text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex gap-[12px] mt-[24px]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-[10px] rounded-[10px] border border-[#E0E0E0] body-text2-500 text-[#959595] hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!tokenSymbol.trim()}
            className="flex-1 px-4 py-[10px] rounded-[10px] bg-primary text-white body-text2-500 hover:bg-primary/90 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   MAIN PORTFOLIO COMPONENT
   ============================================================================ */

export default function Portfolio() {
  const {
    address,
    isConnected,
    openModal,
    isAuthenticated,
    isAuthenticating,
    authError,
    authenticate,
    walletProvider,
    getUserBalance,
  } = useUnified();

  // Dashboard cache
  const {
    portfolioData,
    portfolioLoading,
    portfolioError,
    fetchPortfolioData,
    updateUserName,
    importedTokens,
    setImportedTokens,
  } = useDashboardCache();

  // API hooks (only for actions, not data fetching)
  const updateNicknameHook = useUpdateNickname();

  // Local UI state only (not data)
  const [sortOrder, setSortOrder] = useState("balance-desc");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Derive data from cache
  const overview = portfolioData?.overview ?? null;
  const userBalance = portfolioData?.userBalance ?? "0.0000";
  const prValue = portfolioData?.prValue ?? "0.00";
  const atmStars = portfolioData?.atmStars ?? 0;
  const agtBalance = portfolioData?.agtBalance ?? 0;
  const tokens = portfolioData?.tokens ?? [];
  const lockedMine = portfolioData?.lockedMine ?? 0;
  const lockedOthers = portfolioData?.lockedOthers ?? 0;
  const activeConns = portfolioData?.activeConns ?? 0;
  const pendingConns = portfolioData?.pendingConns ?? 0;
  const inactiveConns = portfolioData?.inactiveConns ?? 0;
  const totalConnections = portfolioData?.totalConnections ?? 0;
  const userName = portfolioData?.userName ?? "User";
  const isLoading = portfolioLoading && !portfolioData;

  // Truncate address
  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  // Copy address with feedback
  const copyAddress = useCallback(() => {
    if (address) {
      navigator.clipboard.writeText(address);
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 2000);
    }
  }, [address]);

  // Edit username handlers
  const startEditName = () => {
    setEditNameValue(userName);
    setIsEditingName(true);
    setTimeout(() => editInputRef.current?.focus(), 50);
  };

  const cancelEditName = () => {
    setIsEditingName(false);
    setEditNameValue("");
  };

  const saveName = async () => {
    if (!editNameValue.trim() || editNameValue.trim() === userName) {
      cancelEditName();
      return;
    }
    setIsSavingName(true);
    try {
      await updateNicknameHook.execute({
        nickName: editNameValue.trim(),
        walletProvider,
      });
      updateUserName(editNameValue.trim());
      setIsEditingName(false);
    } catch (error) {
      console.error("Failed to update nickname:", error);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") saveName();
    if (e.key === "Escape") cancelEditName();
  };

  // Remove imported token
  const removeToken = (symbol: string) => {
    setImportedTokens((prev) => prev.filter((t) => t.symbol !== symbol));
  };

  // Import token handler
  const handleImportToken = (tokenData: {
    symbol: string;
    name: string;
    icon: string;
  }) => {
    const newToken: TokenRowData = {
      icon: tokenData.icon,
      symbol: tokenData.symbol,
      name: tokenData.name,
      balance: "0.00",
      balanceUsd: "0.00",
      price: "0.00",
      change24h: 0,
      isDefault: false,
    };
    setImportedTokens((prev) => [...prev, newToken]);
  };

  // Fetch data on auth (uses cache — won't re-fetch if data is fresh)
  useEffect(() => {
    if (!isAuthenticated || !walletProvider) return;
    fetchPortfolioData(walletProvider, getUserBalance);
  }, [isAuthenticated, walletProvider, fetchPortfolioData, getUserBalance]);

  // Generate watchlist data
  const watchlistCoins: WatchlistCoin[] = [
    {
      symbol: "LUCA",
      name: "LUCA",
      price:
        overview?.price != null
          ? Number(overview.price).toFixed(5)
          : "1.51365",
      btcPrice: "0.00000541",
      change: parseFloat(String(overview?.pre || "-8.8")),
      sparkData: [1.6, 1.55, 1.52, 1.48, 1.51, 1.49, 1.53, 1.51],
      icon: "/img/currency/luca.png",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: "42746.2",
      btcPrice: "1.00000000",
      change: -6.3,
      sparkData: [44000, 43500, 43000, 42500, 42800, 42600, 42700, 42746],
      icon: "/img/currency/btc.png",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: "2545.76",
      btcPrice: "0.05960898",
      change: 0.3,
      sparkData: [2520, 2530, 2540, 2535, 2545, 2550, 2548, 2545],
      icon: "/img/currency/eth.png",
    },
  ];

  // Combine API tokens + imported tokens
  const allTokens = [...tokens, ...importedTokens];

  // Total tokens balance
  const totalTokensBalance = allTokens.reduce(
    (sum, t) => sum + parseFloat(t.balanceUsd || "0"),
    0
  );

  // Sort tokens
  const sortedTokens = [...allTokens].sort((a, b) => {
    if (sortOrder === "balance-desc")
      return parseFloat(b.balanceUsd) - parseFloat(a.balanceUsd);
    if (sortOrder === "balance-asc")
      return parseFloat(a.balanceUsd) - parseFloat(b.balanceUsd);
    if (sortOrder === "name-asc") return a.symbol.localeCompare(b.symbol);
    return 0;
  });

  // Connect wallet screen
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-h4-600 text-foreground">Connect Wallet</h3>
          <p className="body-text2-400 text-[#959595]">
            Please connect your wallet to view your portfolio dashboard
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

  // Authenticating screen
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
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
              : "Sign a message to access your portfolio"}
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

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="body-text1-400 text-[#959595]">
            Loading portfolio data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-[20px]">
        {/* ============ TOP ROW: Profile + Locked Amount + Connections ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px]">
          {/* Profile Card */}
          <div className="bg-white rounded-[15px] p-[20px]">
            <div className="flex items-center gap-[12px] mb-[16px]">
              <div className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[#A5DC53] to-[#5DD27A] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                {/* Editable Username */}
                {isEditingName ? (
                  <div className="flex items-center gap-[4px]">
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editNameValue}
                      onChange={(e) => setEditNameValue(e.target.value)}
                      onKeyDown={handleNameKeyDown}
                      className="body-text1-500 text-foreground border-b border-primary focus:outline-none bg-transparent w-full max-w-[140px]"
                      maxLength={20}
                    />
                    <button
                      onClick={saveName}
                      disabled={isSavingName}
                      className="cursor-pointer p-0.5 hover:bg-green-50 rounded"
                    >
                      {isSavingName ? (
                        <Loader2 className="w-[14px] h-[14px] animate-spin text-primary" />
                      ) : (
                        <Check className="w-[14px] h-[14px] text-[#5DD27A]" />
                      )}
                    </button>
                    <button
                      onClick={cancelEditName}
                      className="cursor-pointer p-0.5 hover:bg-red-50 rounded"
                    >
                      <X className="w-[14px] h-[14px] text-[#FF6B6B]" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-[6px]">
                    <h3 className="body-text1-500 text-foreground truncate">
                      {userName}
                    </h3>
                    <button
                      onClick={startEditName}
                      className="cursor-pointer flex-shrink-0"
                    >
                      <Pencil className="w-[14px] h-[14px] text-[#959595] hover:text-primary transition-colors" />
                    </button>
                  </div>
                )}

                {/* Wallet Address with Tooltip */}
                <div className="flex items-center gap-[6px]">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="body-label-400 text-[#959595] cursor-default">
                        {truncatedAddress}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-mono text-xs">{address}</p>
                    </TooltipContent>
                  </Tooltip>
                  <button onClick={copyAddress} className="cursor-pointer flex-shrink-0">
                    {addressCopied ? (
                      <Check className="w-[12px] h-[12px] text-[#5DD27A]" />
                    ) : (
                      <Copy className="w-[12px] h-[12px] text-[#959595] hover:text-primary transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Balance */}
            <div className="mb-[16px]">
              <p className="body-label-400 text-[#959595]">Balance</p>
              <p className="font-h3-500 text-primary">
                {userBalance} LUCA
              </p>
            </div>

            {/* Stats row */}
            <div className="flex gap-[1px] bg-[#F0F0F0] rounded-[10px] overflow-hidden">
              <div className="flex-1 bg-white p-[12px]">
                <p className="body-label-400 text-[#959595]">PR Value</p>
                <p className="body-text1-500 text-foreground">{prValue}</p>
              </div>
              <div className="flex-1 bg-white p-[12px]">
                <p className="body-label-400 text-[#959595]">ATM stars</p>
                <p className="body-text1-500 text-foreground">{atmStars}</p>
              </div>
              <div className="flex-1 bg-white p-[12px]">
                <p className="body-label-400 text-[#959595]">AGT Balance</p>
                <p className="body-text1-500 text-foreground">{agtBalance}</p>
                <button className="text-primary body-label-400 hover:underline mt-[2px] cursor-pointer">
                  See history
                </button>
              </div>
            </div>
          </div>

          {/* Locked Amount of LUCA */}
          <div className="bg-white rounded-[15px] p-[20px]">
            <h3 className="body-text1-500 text-foreground mb-[20px]">
              Locked amount of LUCA
            </h3>
            <div className="flex items-center justify-center gap-[24px]">
              <DonutChart
                segments={[
                  { value: lockedMine, color: "#A5DC53", label: "Mine" },
                  { value: lockedOthers, color: "#FFB347", label: "Others" },
                ]}
                size={140}
                strokeWidth={24}
              />
              <div className="space-y-[12px]">
                <div className="flex items-center gap-[8px]">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#A5DC53]" />
                  <div>
                    <p className="body-label-400 text-[#959595]">Mine</p>
                    <p className="body-text2-500 text-foreground">
                      {lockedMine.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-[8px]">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#FFB347]" />
                  <div>
                    <p className="body-label-400 text-[#959595]">Others</p>
                    <p className="body-text2-500 text-foreground">
                      {lockedOthers.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connections */}
          <div className="bg-white rounded-[15px] p-[20px]">
            <h3 className="body-text1-500 text-foreground mb-[20px]">
              Connections
            </h3>
            <div className="flex items-center justify-center gap-[24px]">
              <DonutChart
                segments={[
                  { value: activeConns, color: "#0DAEB9", label: "Active" },
                  { value: pendingConns, color: "#FFB347", label: "Pending" },
                  {
                    value: inactiveConns,
                    color: "#FF8A80",
                    label: "Inactive",
                  },
                ]}
                size={140}
                strokeWidth={24}
              />
              <div className="space-y-[8px]">
                <div className="flex items-center gap-[8px]">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#0DAEB9]" />
                  <div>
                    <p className="body-label-400 text-[#959595]">Active</p>
                    <p className="body-text2-500 text-foreground">
                      {activeConns}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-[8px]">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#FFB347]" />
                  <div>
                    <p className="body-label-400 text-[#959595]">Pending</p>
                    <p className="body-text2-500 text-foreground">
                      {pendingConns}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-[8px]">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#FF8A80]" />
                  <div>
                    <p className="body-label-400 text-[#959595]">Inactive</p>
                    <p className="body-text2-500 text-foreground">
                      {inactiveConns}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ TOTAL TOKENS BALANCE TABLE ============ */}
        <div className="bg-white rounded-[15px] p-[20px]">
          <div className="flex items-center justify-between mb-[4px]">
            <div>
              <h3 className="body-text1-500 text-foreground">
                Total tokens balance
              </h3>
              <p className="font-h3-500 text-foreground">
                ${totalTokensBalance.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-[12px]">
              <button
                onClick={() => setShowImportModal(true)}
                className="text-primary body-text2-400 hover:underline cursor-pointer flex items-center gap-[4px]"
              >
                Import token
              </button>
              <Dropdown
                options={[
                  { label: "Balance: High to low", value: "balance-desc" },
                  { label: "Balance: Low to high", value: "balance-asc" },
                  { label: "Name: A to Z", value: "name-asc" },
                ]}
                value={sortOrder}
                onChange={setSortOrder}
                placeholder="Sort by"
              />
            </div>
          </div>

          {/* Table header */}
          <div className="flex items-center py-[12px] border-b border-[#F0F0F0]">
            <p className="body-text2-500 text-[#959595] w-[35%]">Token</p>
            <p className="body-text2-500 text-[#959595] w-[35%]">Balance</p>
            <p className="body-text2-500 text-[#959595] w-[30%] text-right">
              Price (24hr)
            </p>
          </div>

          {/* Token rows */}
          {sortedTokens.length > 0 ? (
            sortedTokens.map((token, i) => (
              <TokenRow
                key={`${token.symbol}-${i}`}
                token={token}
                onRemove={removeToken}
              />
            ))
          ) : (
            <div className="py-[40px] text-center">
              <p className="body-text2-400 text-[#959595]">
                No tokens found in your portfolio
              </p>
            </div>
          )}
        </div>

        {/* ============ ATM GALAXY (iframe) ============ */}
        <div className="bg-white rounded-[15px] p-[20px]">
          <div className="flex items-center justify-between mb-[16px]">
            <div className="flex items-center gap-[12px]">
              <h3 className="body-text1-500 text-foreground">ATM Galaxy</h3>
              <span className="body-text2-400 text-[#959595]">
                Total connections:{" "}
                <span className="body-text2-500 text-foreground">
                  {totalConnections}
                </span>
              </span>
            </div>
            <button className="cursor-pointer">
              <Settings className="w-[18px] h-[18px] text-[#959595] hover:text-primary transition-colors" />
            </button>
          </div>
          <div className="w-full h-[300px] rounded-[10px] overflow-hidden bg-[#0D1117]">
            <iframe
              src="https://visual.atm.network/vis3d/false/ALL/conNodes"
              title="ATM Galaxy"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
              loading="lazy"
            />
          </div>
        </div>

        {/* ============ COIN WATCHLIST ============ */}
        <div className="bg-white rounded-[15px] p-[20px]">
          <div className="flex items-center justify-between mb-[16px]">
            <h3 className="body-text1-500 text-foreground">Coin watchlist</h3>
            <button className="cursor-pointer">
              <Settings className="w-[18px] h-[18px] text-[#959595] hover:text-primary transition-colors" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
            {watchlistCoins.map((coin) => (
              <CoinWatchlistCard key={coin.symbol} coin={coin} />
            ))}
          </div>
        </div>

        {/* Import Token Modal */}
        <ImportTokenModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImportToken}
          existingSymbols={allTokens.map((t) => t.symbol)}
        />
      </div>
    </TooltipProvider>
  );
}
