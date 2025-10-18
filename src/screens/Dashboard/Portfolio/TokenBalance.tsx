import React, { useState } from "react";
import { Mic, Search, Trash2 } from "lucide-react";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { Toast } from "@/components/ToastMessage";

const dummyImportableTokens = [
  {
    name: "Dogecoin",
    symbol: "DOGE",
    logo: "/doge-icon.svg",
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
    logo: "/pancake.svg",
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
    logo: "/polkadot-icon.png",
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
    logo: "/btcb-icon.svg",
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
    logo: "/xrp-logo.png",
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
    logo: "/chain-link.svg",
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
    logo: "/solana-logo.png",
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
    logo: "/uniswap-logo.png",
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
    logo: "/luca.svg",
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
    logo: "/sidebar/usdc-icon.svg",
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
    logo: "/sidebar/usdt-icon.svg",
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
    logo: "/binance-1.svg",
    balance: 0.82623,
    balanceText: "0.82623 BNB",
    usd: "$471.17",
    price: 570.27,
    priceText: "$570.27",
    change: -7.01,
  },
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
  const [sortType, setSortType] = useState("Balance: High to low");

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImports, setSelectedImports] = useState<string[]>([]);

  const sortedTokens = [...tokens].sort((a, b) => {
    switch (sortType) {
      case "A-Z":
        return a.name.localeCompare(b.name);
      case "Z-A":
        return b.name.localeCompare(a.name);
      case "Balance: Low to high":
        return a.balance - b.balance;
      case "Balance: High to low":
        return b.balance - a.balance;
      default:
        return 0;
    }
  });

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
      selectedImports.includes(t.symbol)
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
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background dark:bg-[#15152B] shadow rounded-[12px] p-5 transition-all duration-300">
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
            className="text-primary text-[16px] font-normal leading-[21px]"
            onClick={() => setIsImportModalOpen(true)}
          >
            Import token
          </button>

          <div className="relative inline-block">
            <select
              className="appearance-none bg-[#F8F8F8] dark:bg-[#383D4C] h-10 px-3 pr-8 rounded-[10px] text-sm font-normal focus:outline-none"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
              <option value="Balance: High to low">Balance: High to low</option>
              <option value="Balance: Low to high">Balance: Low to high</option>
            </select>
            <img
              className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              alt="Dropdown Icon"
              src="/icon.svg"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-3 text-foreground font-semibold text-[14px] md:text-[18px]">
              Token
            </th>
            <th className="py-3 text-foreground font-semibold text-[14px] md:text-[18px]">
              Balance
            </th>
            <th className="py-3 text-foreground font-semibold text-[14px] md:text-[18px]">
              Price (24hr)
            </th>
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
                  className="h-[25px] w-[25px] md:w-12 md:h-12 rounded-full"
                />
                <div>
                  <p className="text-foreground text-[14px] md:text-[20px] font-normal">
                    {token.name}
                  </p>
                  <p className="text-[#878787] text-[12px] md:text-[16px] md:leading-[21px]">
                    {token.symbol}
                  </p>
                </div>
              </td>
              <td className="py-4">
                <p className="text-foreground font-normal text-[14px] md:text-[18px]">
                  {token.balanceText}
                </p>
                <p className="text-[#878787] text-[12px] md:text-[16px]">
                  {token.usd}
                </p>
              </td>
              <td className="py-4">
                <p className="text-foreground font-normal text-[14px] md:text-[18px]">
                  {token.priceText}
                </p>
                <span
                  className={`text-[12px] md:text-[16px]] ${
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
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-30">
          <div className="w-[400px] bg-white dark:bg-[#2B2F3E] p-6 h-full rounded-[12px] overflow-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-normal text-foreground">
                Import tokens
              </h2>
              <button
                className="text-primary"
                onClick={() => setIsImportModalOpen(false)}
              >
                ✕
              </button>
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

            <div className="text-[16px] leading-[21px] font-normal text-foreground mb-5">
              We find these tokens in your wallet. Choose which one you want to
              add
            </div>

            <div className="space-y-3 mb-4">
              {filteredImportTokens.map((token) => (
                <label
                  key={token.symbol}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedImports.includes(token.symbol)}
                      onChange={() =>
                        setSelectedImports((prev) =>
                          prev.includes(token.symbol)
                            ? prev.filter((s) => s !== token.symbol)
                            : [...prev, token.symbol]
                        )
                      }
                    />

                    <img
                      src={token.logo}
                      alt={token.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-foreground text-[18px] leading-[23px] font-normal">
                        {token.name}
                      </p>
                      <p className="text-[#878787] text-[16px] leading-[21px]">
                        {token.symbol}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-foreground font-normal text-[16px] leading-[21px]">
                      {token.usd}
                    </p>
                    <span
                      className={`text-[16px] leading-[21px] flex justify-end ${
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
            <div className="flex justify-end space-x-3">
              <button
                className="px-6 py-3 border-2  border-primary text-primary rounded-full text-sm hover:bg-[#46A59B]/10 transition"
                onClick={() => setIsImportModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 bg-primary text-white rounded-full text-sm transition"
                onClick={handleImportTokens}
              >
                Import tokens
              </button>
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
    </div>
  );
};

export default TokenBalance;
