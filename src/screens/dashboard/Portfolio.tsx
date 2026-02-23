import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useUnified } from "@/context/Context";
import { useDashboardCache } from "@/context/DashboardCacheContext";
import type { TokenRowData } from "@/context/DashboardCacheContext";
import {
  useUpdateNickname,
  useGetCurrencyList,
  useFetchCoinPriceTrend,
} from "@/hooks/useWebAppService";
import type { OverviewData } from "@/hooks/useWebAppService";
import {
  Loader2,
  Wallet,
  Check,
  X,
  Trash2,
  PenLine,
  InfoIcon,
  SlidersHorizontal,
  Search,
  Mic,
} from "lucide-react";
import { Dropdown } from "@/components/ui/atm/dropdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/atm/tooltip";
import LucaIcon from "@/assets/icons/luca-icon.png";
import { PieChart, Pie, Cell } from "recharts";
import { ConfirmationModal } from "@/components/ui/atm/confirmationModal";
import { LoadingAnimation } from "@/components/ui/atm/loadingAnimation";
import { Toast } from "@/components/ui/atm/toastMessage";
import AGTRecord from "./portfolio/AGTRecord";
import { Button } from "@/components/ui/atm/button";
import AddCoinsModal from "./portfolio/AddCoinsModal";

/* ============================================================================
   DONUT CHART COMPONENT
   ============================================================================ */

interface PieChartCardProps {
  title: string;
  data: { label: string; value: number; color: string }[];
  innerRadius?: number;
  outerRadius?: number;
  width?: number;
  height?: number;
  className?: string;
  showLegend?: boolean;
}

const PieChartCard: React.FC<PieChartCardProps> = ({
  title,
  data,
  innerRadius = 70,
  outerRadius = 100,
  width = 280,
  height = 250,
  className = "",
  showLegend = true,
}) => {
  return (
    <div className={`flex flex-1 xl:w-[250px] ${className}`}>
      <div className="bg-card rounded-2xl p-5 w-full max-w-xl relative">
        <h2 className="font-h4-400 text-foreground mb-4">{title}</h2>

        <div className="flex items-center">
          <PieChart width={width} height={height}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={0}
              endAngle={360}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              dataKey="value"
              cornerRadius={10}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>

          {showLegend && (
            <div className="ml-6 space-y-4">
              {data.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span
                    className="inline-block w-4 h-1.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <div className="flex flex-col">
                    <span className="text-[#878787] text-[12px]">
                      {entry.label}
                    </span>
                    <span className="text-foreground text-[14px] font-normal">
                      {entry.value.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   MINI SPARKLINE CHART
   ============================================================================ */

function SparklineChart({
  data,
  color = "#0DAEB9",
  height = 60,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  if (!data || data.length < 2) {
    return <div style={{ height }} className="w-full bg-gray-50 rounded" />;
  }

  const width = 100;
  const padding = 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

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

  const gradientId = `sparkGrad-${color.replace("#", "")}`;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="w-full"
    >
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
  onRemoveClick,
}: {
  token: TokenRowData;
  onRemoveClick?: (symbol: string) => void;
}) {
  const isPositive = token.change24h >= 0;
  const DEFAULT_TOKENS = ["LUCA", "USDC", "USDT", "BNB"];
  const canRemove = !DEFAULT_TOKENS.includes(token.symbol) && onRemoveClick;

  return (
    <div className="flex items-center py-[16px] border-b border-[#F0F0F0] last:border-b-0 group">
      {/* Token info */}
      <div className="flex items-center gap-[12px] w-[35%]">
        <img
          src={token.icon}
          alt={token.symbol}
          className="w-[40px] h-[40px] rounded-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${token.symbol}&background=0DAEB9&color=fff&size=36`;
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
      <div className="w-[30%] flex items-center gap-[8px]">
        <div className="text-right">
          <p className="body-text1-500 text-foreground">${token.price}</p>
          <p
            className={`body-label-400 text-start ${
              isPositive ? "text-[#5DD27A]" : "text-[#FF6B6B]"
            }`}
          >
            {isPositive ? "+" : ""}
            {token.change24h.toFixed(2)}%
          </p>
        </div>
        {canRemove && (
          <button
            onClick={() => onRemoveClick?.(token.symbol)}
            className="opacity-0 flex items-center group-hover:opacity-100 transition-opacity cursor-pointer p-1 rounded pl-10"
          >
            <Trash2 className=" text-[#FE5572]" />
            <span className="text-[14px] font-normal text-[#FE5572]">
              Remove token
            </span>
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
  const safeChange = isNaN(coin.change) ? 0 : coin.change;
  const isPositive = safeChange >= 0;
  return (
    <div className="bg-white rounded-[10px] border border-[#EBEBEB] h-57">
      <div className="flex items-center justify-between mb-[12px] p-4">
        <div className="flex items-center gap-[8px]">
          <img
            src={coin.icon}
            alt={coin.symbol}
            className="w-10 h-10 rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://ui-avatars.com/api/?name=${coin.symbol}&background=0DAEB9&color=fff&size=28`;
            }}
          />
          <div>
            <p className="text-foreground font-h4-400">{coin.symbol}</p>
            <p className="text-[#878787] body-text1-400">{coin.name}</p>
          </div>
        </div>
        <div>
          <div className="text-right flex items-center gap-1">
            <p className="body-text1-500 text-foreground">$ {coin.price}</p>
            <p
              className={`body-label-400 ${
                isPositive ? "text-[#5DD27A]" : "text-[#FF6B6B]"
              }`}
            >
              {isPositive ? "+" : ""}
              {safeChange.toFixed(1)}%
            </p>
          </div>
          <div className="flex items-end gap-[4px]">
            <p className="body-label-400 text-[#959595]">₿ {coin.btcPrice}</p>
            <p
              className={`body-label-400 ${
                isPositive ? "text-[#5DD27A]" : "text-[#FF6B6B]"
              }`}
            >
              {isPositive ? "+" : ""}
              {(safeChange * 0.3).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="mt-[8px]">
        <SparklineChart
          data={coin.sparkData}
          color={isPositive ? "#0DAEB9" : "#FF6B6B"}
          height={60}
        />
      </div>
      <div className="flex items-center justify-between p-4 relative top-5">
        <div className="flex items-center gap-[4px] ">
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
  const {
    data: currencyListData,
    execute: fetchCurrencyList,
  } = useGetCurrencyList();
  const {
    execute: fetchCoinPriceTrend,
  } = useFetchCoinPriceTrend();

  // Derive importable tokens from the currency list API
  // API returns CoinCurrency objects with: baseCurrency, currencyName, currencyLogo, nowPrice, pricePlaces
  const walletImportTokens = useMemo(() => {
    if (!currencyListData || !Array.isArray(currencyListData)) return [];
    return currencyListData
      .filter(
        (c: any) =>
          c.baseCurrency &&
          !["LUCA", "USDC", "USDT", "BNB"].includes(c.baseCurrency.toUpperCase()),
      )
      .map((c: any) => ({
        symbol: c.baseCurrency || "",
        name: c.currencyName || c.baseCurrency || "",
        icon:
          c.currencyLogo ||
          `https://ui-avatars.com/api/?name=${c.baseCurrency}&background=0DAEB9&color=fff&size=36`,
        balanceUsd: "0.00",
        balance: "0.00",
        change24h: 0,
        price: String(
          c.nowPrice != null
            ? Number(c.nowPrice).toFixed(c.pricePlaces ?? 4)
            : "0.00",
        ),
      }));
  }, [currencyListData]);

  // Local UI state only (not data)
  const [sortOrder, setSortOrder] = useState("balance-desc");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showAGTHistory, setShowAGTHistory] = useState(false);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImports, setSelectedImports] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);

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

  const filteredImportTokens = walletImportTokens.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleImportTokens = async () => {
    if (selectedImports.length === 0) return;

    setIsImporting(true);

    try {
      await new Promise((res) => setTimeout(res, 1200));

      // filter out duplicates
      const tokensToAdd = walletImportTokens
        .filter(
          (t) =>
            selectedImports.includes(t.symbol) &&
            !existingSymbols.includes(t.symbol.toUpperCase()),
        )
        .map((t) => ({
          icon: t.icon,
          symbol: t.symbol,
          name: t.name,
          balance: t.balance,
          balanceUsd: t.balanceUsd,
          price: t.price,
          change24h: t.change24h,
          isDefault: false,
        }));

      if (tokensToAdd.length === 0) {
        setToast({
          message: "Token already exists in your list",
          type: "error",
        });
        return;
      }

      setImportedTokens((prev) => [...prev, ...tokensToAdd]);

      setToast({
        message: "Tokens imported successfully",
        type: "success",
      });

      setSelectedImports([]);
      setSearchTerm("");
      setIsImportModalOpen(false);
    } catch {
      setToast({
        message: "Failed to import tokens",
        type: "error",
      });
    } finally {
      setIsImporting(false);
    }
  };

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

  // Watchlist coin price trends state
  const [watchlistPriceTrends, setWatchlistPriceTrends] = useState<
    Record<string, number[]>
  >({});
  const [watchlistPriceInfo, setWatchlistPriceInfo] = useState<
    Record<string, { nowPrice: number; change: number }>
  >({});

  // Build watchlist coins from currency list (nowPrice) + price trend (sparkline + change %)
  // API note: BTC is listed as "BTCB" in baseCurrency; trend endpoint uses "BTCB" too
  const watchlistCoins: WatchlistCoin[] = useMemo(() => {
    const safeNum = (v: any, fallback = 0) => {
      const n = Number(v ?? fallback);
      return isNaN(n) ? fallback : n;
    };
    const safeChange = (v: any) => {
      const n = parseFloat(String(v ?? "0"));
      return isNaN(n) ? 0 : n;
    };

    const defaultCoins: WatchlistCoin[] = [];

    if (!currencyListData || !Array.isArray(currencyListData)) return defaultCoins;

    // LUCA — baseCurrency: "LUCA"
    const lucaData = currencyListData.find(
      (c: any) => c.baseCurrency?.toUpperCase() === "LUCA",
    );
    if (lucaData) {
      // Price: currency list nowPrice is primary; trend nowPrice as fallback
      const lucaPrice = safeNum(lucaData.nowPrice) || safeNum(watchlistPriceInfo["LUCA"]?.nowPrice) || safeNum(overview?.price);
      const lucaChange = safeChange(watchlistPriceInfo["LUCA"]?.change ?? overview?.pre);
      defaultCoins.push({
        symbol: "LUCA",
        name: lucaData.currencyName || "LUCA",
        price: lucaPrice > 0 ? lucaPrice.toFixed(lucaData.pricePlaces ?? 4) : "0.00",
        btcPrice: "0.00000000",
        change: lucaChange,
        sparkData: watchlistPriceTrends["LUCA"] || [],
        icon: lucaData.currencyLogo || "/img/currency/luca.png",
      });
    }

    // BTC — baseCurrency: "BTCB" in the API; show as "BTC" in UI
    const btcData = currencyListData.find(
      (c: any) => c.baseCurrency?.toUpperCase() === "BTCB" || c.baseCurrency?.toUpperCase() === "BTC",
    );
    if (btcData) {
      const btcPrice = safeNum(btcData.nowPrice);
      // Trend is keyed by the actual baseCurrency from the API (e.g. "BTCB")
      const trendKey = btcData.baseCurrency as string;
      const btcChange = safeChange(watchlistPriceInfo[trendKey]?.change);
      defaultCoins.push({
        symbol: "BTC",
        name: "Bitcoin",
        price: btcPrice > 0 ? btcPrice.toFixed(btcData.pricePlaces ?? 2) : "0.00",
        btcPrice: "1.00000000",
        change: btcChange,
        sparkData: watchlistPriceTrends[trendKey] || [],
        icon: btcData.currencyLogo || "/img/currency/btc.png",
      });
    }

    // ETH — baseCurrency: "ETH"
    const ethData = currencyListData.find(
      (c: any) => c.baseCurrency?.toUpperCase() === "ETH",
    );
    if (ethData) {
      const ethPrice = safeNum(ethData.nowPrice);
      const btcRef = safeNum(btcData?.nowPrice, 1) || 1;
      const ethChange = safeChange(watchlistPriceInfo["ETH"]?.change);
      defaultCoins.push({
        symbol: "ETH",
        name: ethData.currencyName || "Ethereum",
        price: ethPrice > 0 ? ethPrice.toFixed(ethData.pricePlaces ?? 4) : "0.00",
        btcPrice: (ethPrice / btcRef).toFixed(8),
        change: ethChange,
        sparkData: watchlistPriceTrends["ETH"] || [],
        icon: ethData.currencyLogo || "/img/currency/eth.png",
      });
    }

    return defaultCoins;
  }, [overview, currencyListData, watchlistPriceTrends, watchlistPriceInfo]);

  const [coins, setCoins] = useState<WatchlistCoin[]>([]);

  // Fetch data on auth (uses cache — won't re-fetch if data is fresh)
  useEffect(() => {
    if (!isAuthenticated || !walletProvider) return;
    fetchPortfolioData(walletProvider, getUserBalance);
    fetchCurrencyList();
  }, [isAuthenticated, walletProvider, fetchPortfolioData, getUserBalance, fetchCurrencyList]);

  // Fetch price trends for watchlist coins — run once per currency list load
  // Uses actual baseCurrency from API (e.g. "BTCB" not "BTC") as the trend key
  const priceTrendFetchedRef = useRef(false);
  useEffect(() => {
    if (!isAuthenticated) priceTrendFetchedRef.current = false;
  }, [isAuthenticated]);
  useEffect(() => {
    if (!isAuthenticated || !currencyListData || priceTrendFetchedRef.current) return;
    priceTrendFetchedRef.current = true;

    // Resolve actual API symbols from the currency list so the trend key matches
    const resolveSymbol = (uiSymbol: string) => {
      if (!Array.isArray(currencyListData)) return uiSymbol;
      // For BTC, the API uses "BTCB"
      const match = currencyListData.find(
        (c: any) => c.baseCurrency?.toUpperCase() === uiSymbol.toUpperCase()
          || (uiSymbol === "BTC" && c.baseCurrency?.toUpperCase() === "BTCB"),
      );
      return (match?.baseCurrency as string) ?? uiSymbol;
    };

    const uiSymbols = ["LUCA", "BTC", "ETH"];
    uiSymbols.forEach(async (uiSymbol) => {
      const apiSymbol = resolveSymbol(uiSymbol);
      try {
        const trendData = await fetchCoinPriceTrend({
          coinCurrency: apiSymbol,
          type: "1",
        });
        if (trendData?.y && Array.isArray(trendData.y)) {
          setWatchlistPriceTrends((prev) => ({
            ...prev,
            // Key by API symbol so useMemo can look it up with the same key
            [apiSymbol]: trendData.y.map((val: any) => {
              const n = Number(val ?? 0);
              return isNaN(n) ? 0 : n;
            }),
          }));
        }
        if (trendData?.info) {
          const parsedPrice = Number(trendData.info.nowPrice ?? 0);
          const parsedChange = parseFloat(String(trendData.info.pre ?? "0"));
          setWatchlistPriceInfo((prev) => ({
            ...prev,
            [apiSymbol]: {
              nowPrice: isNaN(parsedPrice) ? 0 : parsedPrice,
              change: isNaN(parsedChange) ? 0 : parsedChange,
            },
          }));
        }
      } catch {
        // Silently handle — sparkline will just be empty
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currencyListData]);

  // Sync watchlist coins into coins state whenever data updates (price trends, currency list, overview)
  useEffect(() => {
    if (watchlistCoins.length > 0) {
      setCoins(watchlistCoins);
    }
  }, [watchlistCoins]);
  const [isCoinModalOpen, setIsCoinModalOpen] = useState(false);
  const [coinToast, setCoinToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSaveCoins = (updatedCoins: WatchlistCoin[]) => {
    setCoins(updatedCoins);
    setIsCoinModalOpen(false);
  };
  // Combine API tokens + imported tokens
  const allTokens = [...tokens, ...importedTokens];

  const existingSymbols = allTokens.map((t) => t.symbol.toUpperCase());

  // Total tokens balance
  const totalTokensBalance = allTokens.reduce(
    (sum, t) => sum + parseFloat(t.balanceUsd || "0"),
    0,
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

  const handleRemoveConfirm = async () => {
    if (!selectedToken) return;

    setIsRemoving(true);

    try {
      await new Promise((res) => setTimeout(res, 1200));
      removeToken(selectedToken);

      setToast({
        message: `Token has been removed`,
        type: "success",
      });
    } catch (err) {
      setToast({
        message: "Failed to remove token",
        type: "error",
      });
    } finally {
      setIsRemoving(false);
      setIsModalOpen(false);
      setSelectedToken(null);
    }
  };

  if (!isConnected || !isAuthenticated) return null;

  return (
    <TooltipProvider>
      <LoadingAnimation isVisible={isLoading} />
      {!showAGTHistory ? (
        <div className="space-y-[20px]">
          {/* ============ TOP ROW: Profile + Locked Amount + Connections ============ */}
          <div className="flex flex-col xl:flex-row gap-5">
            {/* Profile Card */}
            <div>
              <div className="bg-card rounded-[15px] p-5 lg:max-w-[570px] w-full mb-[10px]">
                <div className="flex items-center gap-[12px] mb-[16px]">
                  <div className="w-17.5 h-17.5 rounded-full bg-gradient-to-br from-[#A5DC53] to-[#5DD27A] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
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
                          className="body-text1-500 text-foreground focus:outline-none bg-transparent w-full max-w-[140px]"
                          maxLength={20}
                        />
                        <button
                          onClick={saveName}
                          disabled={isSavingName}
                          className="cursor-pointer p-0.5  rounded"
                        >
                          {isSavingName ? (
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                          ) : (
                            <Check className="w-5 h-5 text-primary" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-[6px]">
                        <h3 className="body-text-600 text-foreground truncate">
                          {userName}
                        </h3>
                        <button
                          onClick={startEditName}
                          className="cursor-pointer flex-shrink-0"
                        >
                          <PenLine className="text-primary w-5 h-5 cursor-pointer transition-colors" />
                        </button>
                      </div>
                    )}

                    {/* Wallet Address with Tooltip */}
                    <div className="flex items-center gap-[6px]">
                      <Tooltip>
                        <p className="body-text1-400 text-foreground cursor-default">
                          {truncatedAddress}
                        </p>
                        <TooltipContent>
                          <p className="font-mono text-xs">{address}</p>
                        </TooltipContent>
                        <TooltipTrigger asChild>
                          <button className="cursor-pointer flex-shrink-0">
                            <InfoIcon className="w-5 h-5 cursor-pointer text-[#B5B5B5]" />
                          </button>
                        </TooltipTrigger>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                {/* Balance */}
                <div className="flex items-center justify-between mt-5">
                  <div>
                    <p className="text-foreground font-h4-400">LUCA Balance</p>
                    <p className="text-[#119B56] font-h2">{userBalance} LUCA</p>
                  </div>
                  <div>
                    <img src={LucaIcon} alt="luca" className="w-14 h-14" />
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-[10px] mt-4 w-full max-w-xl h-[105px] md:h-35">
                <div className="bg-card  rounded-2xl p-3 md:p-5">
                  <p className="text-[#878787] text-[12px] md:text-[15px]  font-normal">
                    PR Value
                  </p>
                  <p className="font-h4-600 mt-1">{prValue}</p>
                </div>

                <div className="bg-card rounded-2xl p-3 md:p-5">
                  <p className="text-[#878787] text-[12px] md:text-[15px]  font-normal">
                    ATM stars
                  </p>
                  <p className="font-h4-600 mt-1">{atmStars}</p>
                </div>

                <div className="bg-card rounded-2xl p-3 md:p-5 relative">
                  <p className="text-[#878787] text-[12px] md:text-[15px] font-normal">
                    AGT Balance
                  </p>
                  <p className="font-h4-600 mt-1">{agtBalance}</p>
                  <button
                    onClick={() => setShowAGTHistory(true)}
                    className="body-text2-500 text-primary mt-2 cursor-pointer"
                  >
                    See history
                  </button>
                </div>
              </div>
            </div>

            {/* Locked Amount of LUCA */}
            <PieChartCard
              title="Locked amount of LUCA"
              data={[
                { value: lockedMine, color: "#A5DC53", label: "Mine" },
                { value: lockedOthers, color: "#FFB347", label: "Others" },
              ]}
              innerRadius={95}
              outerRadius={110}
              width={290}
              height={260}
            />

            {/* Connections */}
            <PieChartCard
              title="Connections"
              data={[
                { value: activeConns, color: "#0DAEB9", label: "Active" },
                { value: pendingConns, color: "#FFB347", label: "Pending" },
                {
                  value: inactiveConns,
                  color: "#FF8A80",
                  label: "Inactive",
                },
              ]}
              innerRadius={95}
              outerRadius={110}
              width={290}
              height={260}
            />
          </div>

          {/* ============ TOTAL TOKENS BALANCE TABLE ============ */}
          <div className="bg-white rounded-[15px] p-[20px]">
            <div className="flex items-center justify-between mb-[4px]">
              <div>
                <h3 className="font-h4-400 text-foreground">
                  Total tokens balance
                </h3>
                <p className="font-h2 text-[#119B56]">
                  ${totalTokensBalance.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-[12px]">
                <button
                  onClick={() => setIsImportModalOpen(true)}
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
              <p className="body-text-600 text-foreground w-[35%]">Token</p>
              <p className="body-text-600 text-foreground w-[35%]">Balance</p>
              <p className="body-text-600 text-foreground  ">Price (24hr)</p>
            </div>

            {/* Token rows */}
            {sortedTokens.length > 0 ? (
              sortedTokens.map((token, i) => (
                <TokenRow
                  key={`${token.symbol}-${i}`}
                  token={token}
                  onRemoveClick={(symbol) => {
                    setSelectedToken(symbol);
                    setIsModalOpen(true);
                  }}
                />
              ))
            ) : (
              <div className="py-[40px] text-center">
                <p className="body-text2-400 text-[#959595]">
                  No tokens found in your portfolio
                </p>
              </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
              isOpen={isModalOpen}
              title="Token removal confirmation"
              description="You can import this token again later from the filter options"
              message={`Are you sure you want to remove the ${selectedToken} token?`}
              onConfirm={handleRemoveConfirm}
              onCancel={() => {
                setIsModalOpen(false);
                setSelectedToken(null);
              }}
              confirmText={isRemoving ? "Removing..." : "Remove"}
            />

            {/* Loading Animation */}
            <LoadingAnimation isVisible={isRemoving} />

            {/* Toast Message */}
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
              />
            )}
          </div>

          {/* Import Token Modal */}
          {isImportModalOpen && (
            <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
              <div className="w-105 bg-card p-6 h-full rounded-l-2xl shadow-xl relative flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-h4-400 text-foreground">Import tokens</h2>
                  <X
                    className="text-primary cursor-pointer"
                    onClick={() => setIsImportModalOpen(false)}
                  />
                </div>

                {/* Search */}
                <div className="relative w-full mb-4">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <Search size={16} />
                  </span>

                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 rounded-[10px] bg-[#F8F8F8] dark:bg-[#383D4C]"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Mic size={16} />
                  </span>
                </div>

                <div className="body-text1-400 mb-5">
                  We find these tokens in your wallet. Choose which one you want
                  to add
                </div>

                {/* Token List */}
                 <div className="flex-1 overflow-y-auto space-y-3 pr-2 
                   [&::-webkit-scrollbar]:hidden 
                   [-ms-overflow-style:none] 
                   [scrollbar-width:none]"
                 >
                  {filteredImportTokens.map((token) => (
                    <label
                      key={token.symbol}
                      className="flex items-center justify-between p-2 rounded-md cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedImports.includes(token.symbol)}
                          onChange={() =>
                            setSelectedImports((prev) =>
                              prev.includes(token.symbol)
                                ? prev.filter((s) => s !== token.symbol)
                                : [...prev, token.symbol],
                            )
                          }
                        />

                        <img
                          src={token.icon}
                          className="w-10 h-10 rounded-full"
                        />

                        <div>
                          <p>{token.name}</p>
                          <p className="text-[#878787]">{token.symbol}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p>{token.balanceUsd}</p>
                        <span
                          className={
                            token.change24h >= 0
                              ? "text-[#119B56]"
                              : "text-destructive"
                          }
                        >
                          {token.change24h >= 0
                            ? `+${token.change24h}%`
                            : `${token.change24h}%`}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Buttons */}
              {/* <div className="sticky bottom-0 bg-white pt-4  flex justify-end gap-3"> */}
                <div className="pt-4 flex justify-end gap-3 ">
                  <Button
                    variant="success"
                    onClick={() => setIsImportModalOpen(false)}
                  >
                    Cancel
                  </Button>

                  <Button onClick={handleImportTokens}>Import tokens</Button>
                </div>
              </div>
              <LoadingAnimation isVisible={isImporting} />
            </div>
          )}

          {/* ============ ATM GALAXY (iframe) ============ */}
          <div className="bg-card rounded-[15px] p-[20px]">
            <div className="flex items-center justify-between mb-[16px]">
              <div className="flex items-center gap-[12px]">
                <h3 className="font-h4-400 text-foreground">ATM Galaxy</h3>
                <span className="body-text-400 text-foreground">
                  Total connections:{" "}
                  <span className="body-text-600 text-foreground">
                    {totalConnections}
                  </span>
                </span>
              </div>
              <button className="cursor-pointer">
                <SlidersHorizontal className="w-[18px] h-[18px] text-[#959595] hover:text-primary transition-colors" />
              </button>
            </div>
            <div className="w-full h-105 rounded-[10px] overflow-hidden bg-[#0D1117]">
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
          <div className="bg-card rounded-[15px] p-[20px]">
            <div className="flex items-center justify-between mb-[16px]">
              <h3 className="font-h4-400 text-foreground">Coin watchlist</h3>
              <button className="cursor-pointer">
                <SlidersHorizontal
                  className="w-[18px] h-[18px] text-[#959595] hover:text-primary transition-colors"
                  onClick={() => setIsCoinModalOpen(true)}
                />
              </button>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-[16px]">
              {coins.map((coin) => (
                <CoinWatchlistCard key={coin.symbol} coin={coin} />
              ))}
            </div>
          </div>

          <AddCoinsModal
            isOpen={isCoinModalOpen}
            onClose={() => setIsCoinModalOpen(false)}
            onSave={handleSaveCoins}
            selectedCoins={coins}
            setSelectedCoins={setCoins}
            setToast={setCoinToast}
          />

          {coinToast && (
            <Toast
              message={coinToast.message}
              type={coinToast.type}
              onClose={() => setCoinToast(null)}
            />
          )}
        </div>
      ) : (
        <AGTRecord
          agtBalance={agtBalance}
          onBack={() => setShowAGTHistory(false)}
        />
      )}
    </TooltipProvider>
  );
}
