import CoinCard from "./CoinCard";
import FilterIcon from "@/assets/icons/filter-icon.svg";
import LucaIcon from "@/assets/tokens/luca.svg";
import BitcointIcon from "@/assets/tokens/btcb-icon.svg";
import EthereumIcon from "@/assets/tokens/ethereum-token-logo.svg";
import { useState } from "react";
import AddCoinsModal from "./AddCoinsModal";
import { Toast } from "@/components/ui/atm/toastMessage";

export default function CoinWatchlist() {
  const initialCoins = [
    {
      name: "LUCA",
      subtitle: "LUCA",
      price: "$ 1.51365",
      change: "-8.6%",
      btcValue: "฿ 0.00003541",
      btcChange: "-2.4%",
      time: "This Week",
      icon: LucaIcon,
      data: [
        40, 35, 38, 30, 45, 60, 52, 58, 46, 34, 38, 32, 40, 42, 39, 37, 36, 41,
        30,
      ],
    },
    {
      name: "BTC",
      subtitle: "Bitcoin",
      price: "$ 42746.2",
      change: "-6.3%",
      btcValue: "฿ 1.00000000",
      btcChange: "+0.0%",
      time: "This Week",
      icon: BitcointIcon,
      data: [
        45, 65, 60, 75, 68, 70, 72, 40, 28, 33, 30, 35, 32, 31, 36, 40, 38,
      ],
    },
    {
      name: "ETH",
      subtitle: "Ethereum",
      price: "$ 2545.76",
      change: "+0.3%",
      btcValue: "฿ 0.05958088",
      btcChange: "+1.0%",
      time: "Today",
      icon: EthereumIcon,
      data: [
        20, 28, 18, 32, 30, 29, 35, 40, 48, 43, 45, 38, 39, 36, 34, 35, 30,
      ],
    },
  ];

  const [coins, setCoins] = useState(initialCoins);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  return (
    <div className="bg-card shadow rounded-[12px] p-5">
      <div className="flex mb-2.5 justify-between">
        <div className="font-h4-400">Coin watchlist</div>
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <img src={FilterIcon} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {coins.map((coin) => (
          <CoinCard key={coin.name} {...coin} />
        ))}
      </div>
      <AddCoinsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCoins={coins}
        setSelectedCoins={setCoins}
        setToast={setToast}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
