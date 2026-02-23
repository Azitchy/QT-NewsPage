import { useEffect, useMemo, useState } from "react";
import { Search, Mic, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/atm/button";
import { ConfirmationModal } from "@/components/ui/atm/confirmationModal";
import { LoadingAnimation } from "@/components/ui/atm/loadingAnimation";
import { useGetCurrencyList, useFetchCoinPriceTrend } from "@/hooks/useWebAppService";

type WatchlistCoin = {
  symbol: string;
  name: string;
  price: string;
  change: number;
  btcPrice: string;
  icon: string;
  sparkData: number[];
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedCoins?: WatchlistCoin[];
  setSelectedCoins?: React.Dispatch<React.SetStateAction<WatchlistCoin[]>>;
  setToast?: React.Dispatch<
    React.SetStateAction<{ message: string; type: "success" | "error" } | null>
  >;
  onSave: (coins: WatchlistCoin[]) => void;
};

type CoinOption = {
  name: string;
  symbol: string;
  logo: string;
};

// Fallback static list used only when the API has not yet returned data
const FALLBACK_COINS: CoinOption[] = [
  { name: "LUCA", symbol: "LUCA", logo: "/img/currency/luca.png" },
];

export default function AddCoinsModal({
  isOpen,
  onClose,
  selectedCoins = [],
  setSelectedCoins,
  setToast,
  onSave,
}: Props) {
  const [search, setSearch] = useState("");
  const [tempSelected, setTempSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmRemoveAll, setConfirmRemoveAll] = useState(false);

  // Fetch available coins from API
  const {
    data: currencyListData,
    loading: currencyLoading,
    execute: fetchCurrencyList,
  } = useGetCurrencyList();
  const { execute: fetchCoinPriceTrend } = useFetchCoinPriceTrend();

  useEffect(() => {
    if (isOpen) {
      fetchCurrencyList();
    }
  }, [isOpen, fetchCurrencyList]);

  // Derive coin options from the API currency list
  // API returns CoinCurrency objects with: baseCurrency, currencyName, currencyLogo
  const ALL_COINS: CoinOption[] = useMemo(() => {
    if (!currencyListData || !Array.isArray(currencyListData))
      return FALLBACK_COINS;
    return currencyListData
      .map((c: any) => ({
        name: c.currencyName || c.baseCurrency || "",
        symbol: c.baseCurrency || "",
        logo:
          c.currencyLogo ||
          `/img/currency/${(c.baseCurrency || "").toLowerCase()}.png`,
      }))
      .filter((c) => c.symbol !== "");
  }, [currencyListData]);

  const originalSymbols = useMemo(
    () => selectedCoins.map((c) => c.symbol),
    [selectedCoins],
  );

  useEffect(() => {
    setTempSelected(originalSymbols);
  }, [originalSymbols]);

  if (!isOpen) return null;

  const toggleCoin = (symbol: string) => {
    if (symbol === "LUCA") return;

    setTempSelected((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol],
    );
  };

  const hasChanges =
    tempSelected.length !== originalSymbols.length ||
    tempSelected.some((s) => !originalSymbols.includes(s));

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const updated: WatchlistCoin[] = [];

      for (const c of ALL_COINS.filter((coin) =>
        tempSelected.includes(coin.symbol),
      )) {
        const existing = selectedCoins.find(
          (coin) => coin.symbol === c.symbol,
        );

        if (existing) {
          updated.push(existing);
          continue;
        }

        // Fetch real price data for new coins
        let price = "0.00";
        let change = 0;
        let btcPrice = "0.00000000";
        let sparkData: number[] = [];

        try {
          // Fetch price trend using type "1" (matches explorer reference)
          const trendData = await fetchCoinPriceTrend({
            coinCurrency: c.symbol,
            type: "1",
          });
          if (trendData?.y && Array.isArray(trendData.y)) {
            sparkData = trendData.y.map(
              (val: any) => Number(val ?? 0),
            );
          }
          // Use trend info for price and change (same as explorer DashboardSection)
          if (trendData?.info?.nowPrice) {
            price = String(Number(trendData.info.nowPrice).toFixed(2));
          }
          if (trendData?.info?.pre != null) {
            const parsed = Number(trendData.info.pre);
            change = isNaN(parsed) ? 0 : parsed;
          }

          // Lookup price from currency data for btcPrice calculation
          // API returns CoinCurrency with baseCurrency, nowPrice, pricePlaces
          const coinData = currencyListData?.find(
            (cd: any) => cd.baseCurrency?.toUpperCase() === c.symbol.toUpperCase(),
          );
          if (coinData?.nowPrice) {
            const coinPrice = Number(coinData.nowPrice);
            price = coinPrice.toFixed(coinData.pricePlaces ?? 2);
          }
          const btcData = currencyListData?.find(
            (cd: any) => cd.baseCurrency?.toUpperCase() === "BTC",
          );
          const btcPriceNum = Number(btcData?.nowPrice ?? 0);
          btcPrice =
            btcPriceNum > 0
              ? (Number(price) / btcPriceNum).toFixed(8)
              : "0.00000000";
        } catch {
          // Use zeros if price fetch fails
        }

        updated.push({
          symbol: c.symbol,
          name: c.name,
          icon: c.logo,
          sparkData,
          price,
          change,
          btcPrice,
        });
      }

      setSelectedCoins?.(updated);
      setToast?.({ message: "Watchlist updated successfully", type: "success" });
      onSave(updated);
      onClose();
    } catch {
      setToast?.({ message: "Failed to update watchlist", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAllConfirm = async () => {
    setConfirmRemoveAll(false);
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 1500));

    const onlyLuca = selectedCoins.filter((c) => c.symbol === "LUCA");

    setSelectedCoins?.(onlyLuca);
    setTempSelected(["LUCA"]);

    setIsLoading(false);
    setToast?.({ message: "All tokens removed", type: "success" });
    onClose();
  };

  const filtered = ALL_COINS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const inList = filtered.filter((c) => originalSymbols.includes(c.symbol));
  const inListExceptLuca = inList.filter((c) => c.symbol !== "LUCA");
  const notInList = filtered.filter((c) => !originalSymbols.includes(c.symbol));

  const renderCoin = (coin: CoinOption, index: number) => (
    <label key={`${coin.symbol}-${index}`} className="flex justify-between py-2">
      <div className="flex gap-3 items-center">
        <input
          type="checkbox"
          checked={tempSelected.includes(coin.symbol)}
          disabled={coin.symbol === "LUCA"}
          onChange={() => toggleCoin(coin.symbol)}
        />
        <img
          src={coin.logo}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${coin.symbol}&background=0DAEB9&color=fff&size=36`;
          }}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <p>{coin.name}</p>
          <p className="text-gray-400 text-sm">{coin.symbol}</p>
        </div>
      </div>
    </label>
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
        <div className="w-105 bg-card p-6 h-full rounded-l-2xl shadow-xl relative overflow-y-auto
           [&::-webkit-scrollbar]:hidden 
           [-ms-overflow-style:none] 
           [scrollbar-width:none]">
          {/* HEADER */}
          <div className="flex justify-between mb-4">
            <h2 className="font-h4-400">Add coins to track prices</h2>
            <X onClick={onClose} className="cursor-pointer text-primary" />
          </div>

          {/* SEARCH */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-xl bg-[#F5F5F5]"
            />
            <Mic className="absolute right-3 top-3 text-gray-400" size={16} />
          </div>

          {/* Loading state while fetching currencies */}
          {currencyLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 body-text2-400 text-[#959595]">
                Loading coins...
              </span>
            </div>
          )}

          {/* SECTION: IN LIST */}
          {!currencyLoading && inList.length > 0 && (
            <>
              <p className="text-foreground body-text1-400 mb-2">
                These coins are already in your list
              </p>

              {inList.map(renderCoin)}

              <Button
                onClick={() => setConfirmRemoveAll(true)}
                disabled={inListExceptLuca.length === 0}
                className="body-text2-500 text-primary px-0"
                variant="ghost"
              >
                Remove all
              </Button>
            </>
          )}

          {/* SECTION: OTHER COINS */}
          {!currencyLoading && notInList.length > 0 && (
            <>
              <p className="text-foreground body-text1-400 mt-3 mb-2">Coins</p>
              {notInList.map(renderCoin)}
            </>
          )}

          {/* FOOTER */}
          <div className="sticky bottom-0 bg-white pt-4 flex justify-end gap-3">
            <Button variant="success" onClick={onClose}>
              Cancel
            </Button>

            <Button
              disabled={!hasChanges}
              onClick={handleSave}
              variant={!hasChanges ? "disabled" : "default"}
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* CONFIRM REMOVE ALL MODAL */}
      <ConfirmationModal
        isOpen={confirmRemoveAll}
        title="Remove all tokens"
        description="This will remove all except LUCA"
        message="Are you sure you want to continue?"
        onConfirm={handleRemoveAllConfirm}
        onCancel={() => setConfirmRemoveAll(false)}
      />

      {/* LOADING */}
      <LoadingAnimation isVisible={isLoading} />
    </>
  );
}
