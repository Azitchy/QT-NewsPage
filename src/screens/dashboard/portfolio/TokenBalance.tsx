import React, { useEffect, useState } from "react";
import { Mic, Search, Trash2, X } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/atm/confirmationModal";
import { LoadingAnimation } from "@/components/ui/atm/loadingAnimation";
import { Toast } from "@/components/ui/atm/toastMessage";
import { Dropdown } from "@/components/ui/atm/dropdown";
import DogeIcon from "@/assets/tokens/doge-icon.svg";
import BinanceIcon from "@/assets/tokens/binance.svg";
import LucaIcon from "@/assets/tokens/luca.svg";
import LinkIcon from "@/assets/tokens/link-icon.svg";
import PancakeIcon from "@/assets/tokens/pancake.svg";
import SolanaIcon from "@/assets/tokens/solana-logo.png";
import UniSwapIcon from "@/assets/tokens/uniswap-logo.png";
import UsdcIcon from "@/assets/tokens/usdc.svg";
import UsdtIcon from "@/assets/tokens/usdt-icon.svg";
import XrpIcon from "@/assets/tokens/xrp-logo.png";
import PolkadotIcon from "@/assets/tokens/polkadot-icon.png";
import BitcointIcon from "@/assets/tokens/btcb-icon.svg";
import { Button } from "@/components/ui/atm/button";

const dummyImportableTokens = [
  {
    name: "Dogecoin",
    symbol: "DOGE",
    logo: DogeIcon,
    price: 0.4028,
    priceText: "$1.30",
    balanceText: "232.23 DOGE",
    balance: 232.23,
    usd: "$0.4028",
    change: -0.72,
  },
  {
    name: "PancakeSwap",
    symbol: "CAKE",
    logo: PancakeIcon,
    balanceText: "232.23 CAKE",
    balance: 232.23,
    price: 1.95,
    priceText: "$1.30",
    usd: "$1.95",
    change: 1.94,
  },
  {
    name: "Polkadot",
    symbol: "DOT",
    logo: PolkadotIcon,
    balanceText: "232.23 DOT",
    balance: 232.23,
    price: 6.31,
    priceText: "$1.30",
    usd: "$6.31",
    change: 9.4,
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    logo: BitcointIcon,
    balanceText: "232.23 BTC",
    balance: 232.23,
    price: 99268.73,
    priceText: "$1.30",
    usd: "$99,268.73",
    change: 1.79,
  },
  {
    name: "XRP",
    symbol: "XRP",
    logo: XrpIcon,
    balanceText: "232.23 XRP",
    balance: 232.23,
    price: 255.99,
    priceText: "$1.30",
    usd: "$1.46",
    change: 30.89,
  },

  {
    name: "Chainlink",
    symbol: "LINK",
    logo: LinkIcon,
    balanceText: "232.23 LINK",
    balance: 232.23,
    price: 7.87,
    priceText: "$1.30",
    usd: "$15.53",
    change: 3.72,
  },
  {
    name: "Solana",
    symbol: "SOL",
    logo: SolanaIcon,
    balanceText: "232.23 SOL",
    balance: 232.23,
    price: 7.87,
    priceText: "$1.30",
    usd: "$255.99",
    change: 0.01,
  },
  {
    name: "Uniswap",
    symbol: "UNI",
    logo: UniSwapIcon,
    balanceText: "232.23 UNI",
    balance: 232.23,
    price: 7.87,
    priceText: "$1.30",
    usd: "$7.87",
    change: 0.9,
  },
];

const initialTokens = [
  {
    name: "LUCA",
    symbol: "LUCA",
    logo: LucaIcon,
    balance: 232.23,
    balanceText: "232.23 LUCA",
    usd: "$301.90",
    price: 1.3,
    priceText: "$1.30",
    change: -7.94,
  },
  {
    name: "USDC",
    symbol: "USDC",
    logo: UsdcIcon,
    balance: 124,
    balanceText: "124 USDC",
    usd: "$123",
    price: 1.0,
    priceText: "$1.00",
    change: 0.01,
  },
  {
    name: "USDT",
    symbol: "USDT",
    logo: UsdtIcon,
    balance: 88,
    balanceText: "88 USDT",
    usd: "$87",
    price: 1.0,
    priceText: "$1.00",
    change: 0.01,
  },
  {
    name: "Binance",
    symbol: "BNB",
    logo: BinanceIcon,
    balance: 0.82623,
    balanceText: "0.82623 BNB",
    usd: "$471.17",
    price: 570.27,
    priceText: "$570.27",
    change: -7.01,
  },
];

const options = [
  { label: "A–Z", value: "az" },
  { label: "Z–A", value: "za" },
  { label: "Balance: High to low", value: "high" },
  { label: "Balance: Low to high", value: "low" },
];

const TokenBalance = () => {
  const [tokens, setTokens] = useState(initialTokens);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [sortType, setSortType] = useState("high");

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImports, setSelectedImports] = useState<string[]>([]);

  const sortedTokens = [...tokens].sort((a, b) => {
    switch (sortType) {
      case "az":
        return a.name.localeCompare(b.name);
      case "za":
        return b.name.localeCompare(a.name);
      case "low":
        return a.balance - b.balance;
      case "high":
        return b.balance - a.balance;
      default:
        return 0;
    }
  });

  useEffect(() => {
    if (isImportModalOpen || isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isImportModalOpen, isModalOpen]);

  const handleRemoveClick = (name: string) => {
    setSelectedToken(name);
    setIsModalOpen(true);
  };

  const handleRemoveConfirm = async () => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 2000));
      setTokens(tokens.filter((t) => t.name !== selectedToken));
      setToast({ message: "Token has been removed", type: "success" });
    } catch {
      setToast({
        message: "Failed to remove token. Please try again",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleImportTokens = async () => {
    const selected = dummyImportableTokens.filter((t) =>
      selectedImports.includes(t.symbol),
    );
    const newTokens = selected.map((t) => ({
      name: t.name,
      symbol: t.symbol,
      logo: t.logo,
      balance: t.balance,
      balanceText: t.balanceText,
      usd: t.usd,
      price: t.price,
      priceText: `$${t.price.toFixed(2)}`,
      change: t.change,
    }));

    setIsImportModalOpen(false);
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 2000));
    setTokens((prev) => [...prev, ...newTokens]);
    setToast({ message: "Tokens imported successfully", type: "success" });
    setSelectedImports([]);
    setIsLoading(false);
  };

  const filteredImportTokens = dummyImportableTokens.filter((token) =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-card shadow rounded-[12px] p-5 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-foreground text-[16px] md:text-xl font-normal">
            Total tokens balance
          </h2>
          <p className="text-[#119B56] text-[28px] font-medium mt-1">
            $
            {tokens
              .reduce((acc, token) => acc + token.price * token.balance, 0)
              .toFixed(2)}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            className="text-primary body-text1-400 cursor-pointer"
            onClick={() => setIsImportModalOpen(true)}
          >
            Import token
          </button>

          <div className="relative inline-block">
            <Dropdown
              options={options}
              value={sortType}
              onChange={(value) => setSortType(value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-3 text-foreground body-text-600">Token</th>
            <th className="py-3 text-foreground body-text-600">Balance</th>
            <th className="py-3 text-foreground body-text-600">Price (24hr)</th>
          </tr>
        </thead>
        <tbody>
          {sortedTokens.map((token, idx) => (
            <tr
              key={idx}
              className="border-b last:border-b-0 hover:bg-[#F9F9F9] dark:hover:bg-[#1E1E36] transition-all duration-150 relative"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <td className="py-4 flex items-center space-x-3 relative">
                <img
                  src={token.logo}
                  alt={token.name}
                  className="h-10 w-10 md:w-12 md:h-12 rounded-full"
                />
                <div>
                  <p className="text-foreground font-h4-400">{token.name}</p>
                  <p className="text-[#878787] body-text1-400">
                    {token.symbol}
                  </p>
                </div>
              </td>
              <td className="py-4">
                <p className="text-foreground body-text-400">
                  {token.balanceText}
                </p>
                <p className="text-[#878787] body-text1-400">{token.usd}</p>
              </td>
              <td className="py-4">
                <p className="text-foreground body-text-400">
                  {token.priceText}
                </p>
                <span
                  className={`body-text1-400 ${
                    token.change >= 0 ? "text-[#119B56]" : "text-destructive"
                  }`}
                >
                  {token.change >= 0 ? `+${token.change}%` : `${token.change}%`}
                </span>
                {hoveredIndex === idx && (
                  <div
                    className="hidden absolute right-3 bottom-7 md:flex items-center gap-1 cursor-pointer text-destructive hover:opacity-80"
                    onClick={() => handleRemoveClick(token.name)}
                  >
                    <Trash2 />
                    <span className="text-[14px] font-normal">
                      Remove token
                    </span>
                  </div>
                )}
              </td>
              <td>
                <div
                  className="md:hidden relative flex items-center cursor-pointer"
                  onClick={() => handleRemoveClick(token.name)}
                >
                  <Trash2 className="h-4 w-4 text-[#878787]" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="w-100 bg-white dark:bg-[#2B2F3E] p-6 h-full rounded-[12px] overflow-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-h4-400 text-foreground">Import tokens</h2>
              <X
                className="text-primary cursor-pointer"
                onClick={() => setIsImportModalOpen(false)}
              />
            </div>
            <div className="relative w-full mb-4">
              {/* Search Icon */}
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Search size={16} />
              </span>

              {/* Input */}
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-[10px] bg-[#F8F8F8] dark:bg-[#383D4C] text-sm text-black dark:text-[#8E8E93] placeholder-gray-500"
              />

              {/* Talk Icon */}
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
                <Mic size={16} />
              </span>
            </div>

            <div className="body-text1-400 text-foreground mb-5">
              We find these tokens in your wallet. Choose which one you want to
              add
            </div>

            <div className="space-y-3 mb-4 max-h-100 md:max-h-130 overflow-y-auto hide-scrollbar">
              {filteredImportTokens.map((token) => (
                <label
                  key={token.symbol}
                  className="flex items-center justify-between p-2 rounded-md"
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
                      src={token.logo}
                      alt={token.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-foreground body-text-400">
                        {token.name}
                      </p>
                      <p className="text-[#878787] body-text1-400">
                        {token.symbol}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-foreground body-text1-400">
                      {token.usd}
                    </p>
                    <span
                      className={`body-text1-400 flex justify-end ${
                        token.change >= 0
                          ? "text-[#119B56]"
                          : "text-destructive"
                      }`}
                    >
                      {token.change >= 0
                        ? `+${token.change}%`
                        : `${token.change}%`}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {/* Buttons */}
            <div className="absolute bottom-4 right-4 flex justify-end space-x-3 mt-1">
              <Button
                variant="success"
                onClick={() => setIsImportModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleImportTokens}>Import tokens</Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Token removal confirmation"
        description="You can import this token again later from the filter options"
        message={`Are you sure you want to remove the ${selectedToken} token?`}
        onConfirm={handleRemoveConfirm}
        onCancel={() => setIsModalOpen(false)}
      />

      {/* Loading Animation */}
      <LoadingAnimation isVisible={isLoading} />

      {/* Toast Message */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style>
        {`
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
  `}
      </style>
    </div>
  );
};

export default TokenBalance;
