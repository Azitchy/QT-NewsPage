import { useEffect, useMemo, useState } from "react";
import { Search, Mic, X } from "lucide-react";
import { Button } from "@/components/ui/atm/button";
import { ConfirmationModal } from "@/components/ui/atm/confirmationModal";
import { LoadingAnimation } from "@/components/ui/atm/loadingAnimation";

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

const ALL_COINS: CoinOption[] = [
  { name: "LUCA", symbol: "LUCA", logo: "/img/currency/luca.png" },
  { name: "Bitcoin", symbol: "BTC", logo: "/img/currency/btc.png" },
  { name: "Ethereum", symbol: "ETH", logo: "/img/currency/eth.png" },
  { name: "Dogecoin", symbol: "DOGE", logo: "/img/currency/doge.png" },
  { name: "PancakeSwap", symbol: "CAKE", logo: "/img/currency/cake.png" },
  { name: "XRP", symbol: "XRP", logo: "/img/currency/xrp.png" },
  { name: "Solana", symbol: "SOL", logo: "/img/currency/sol.png" },
  { name: "Chainlink", symbol: "LINK", logo: "/img/currency/link.png" },
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

  const generateMockPrice = () => {
    const priceNum = Math.random() * 50000 + 1;
    const changeNum = Math.random() * 10 - 5;

    return {
      price: priceNum.toFixed(2),
      change: Number(changeNum.toFixed(2)),
      btcPrice: (priceNum / 50000).toFixed(6),
    };
  };

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));

    const updated: WatchlistCoin[] = ALL_COINS.filter((c) =>
      tempSelected.includes(c.symbol),
    ).map((c) => {
      const existing = selectedCoins.find((coin) => coin.symbol === c.symbol);

      if (existing) return existing;

      return {
        symbol: c.symbol,
        name: c.name,
        icon: c.logo,
        sparkData: [20, 30, 25, 40, 35, 50, 45],
        ...generateMockPrice(),
      };
    });

    setSelectedCoins?.(updated);
    setToast?.({ message: "Watchlist updated successfully", type: "success" });
    onSave(updated);
    setIsLoading(false);
    onClose();
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

  const renderCoin = (coin: CoinOption) => (
    <label key={coin.symbol} className="flex justify-between py-2">
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
        <div className="w-105 bg-card p-6 h-full rounded-l-2xl shadow-xl relative overflow-y-auto">
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

          {/* SECTION: IN LIST */}
          {inList.length > 0 && (
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
          {notInList.length > 0 && (
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
