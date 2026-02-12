import { useState, useEffect, useCallback } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import LucaIcon from "@/assets/tokens/luca.svg?react";
import PolygonIcon from "@/assets/tokens/polygon.svg?react";
import BscIcon from "@/assets/tokens/bsc1.svg?react";
import { Button } from "@/components/ui/atm/button";
import { Toast } from "@/components/ui/atm/toastMessage";
import { useUnified } from "@/context/Context";
import { useExecuteCrosschainTransfer } from "@/hooks/useWebAppService";
import { activeChains } from "@/config/chains";

const SUPPORTED_CHAINS = activeChains
  .filter((c) => c.contracts.crosschain && c.lucaContract)
  .map((c) => ({
    id: c.chain.id,
    name: c.chain.name || "Unknown",
    key: c.chain.id === 56 ? "bsc" : c.chain.id === 137 ? "polygon" : (c.chain.name?.toLowerCase() || ""),
    crosschainAddress: c.contracts.crosschain!,
    tokenAddress: c.lucaContract!,
  }));

const CHAIN_ICONS: Record<number, React.FC<{ className?: string }>> = {
  56: BscIcon,
  137: PolygonIcon,
};

export default function AtmCrossChainTransfer() {
  const [amount, setAmount] = useState<number>(0);
  const [receivingAddress, setReceivingAddress] = useState("");
  const [selectedChainIdx, setSelectedChainIdx] = useState(0);
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const { address, isConnected, isAuthenticated, chainId, getUserBalance, walletProvider } = useUnified();
  const { execute: executeCrosschain, loading: transferLoading } = useExecuteCrosschainTransfer();

  const [balance, setBalance] = useState("0.0000");
  const [balanceLoading, setBalanceLoading] = useState(false);

  // Determine destination chains (exclude current chain)
  const destinationChains = SUPPORTED_CHAINS.filter((c) => c.id !== chainId);
  const selectedChain = destinationChains[selectedChainIdx] || destinationChains[0];

  // Get the current chain's crosschain contract + LUCA token
  const currentChainConfig = SUPPORTED_CHAINS.find((c) => c.id === chainId);

  // Fetch balance on mount and when auth changes
  const fetchBalance = useCallback(async () => {
    if (!isConnected || !isAuthenticated) return;
    setBalanceLoading(true);
    try {
      const bal = await getUserBalance();
      setBalance(bal);
    } catch {
      setBalance("0.0000");
    } finally {
      setBalanceLoading(false);
    }
  }, [isConnected, isAuthenticated, getUserBalance]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const numericBalance = parseFloat(balance) || 0;

  const handleAmountChange = (value: string) => {
    const numValue = value === "" ? 0 : Number(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setAmount(numValue);
    }
  };

  const handleMaxClick = () => {
    setAmount(numericBalance);
  };

  const handleTransfer = async () => {
    if (!address || !walletProvider || !selectedChain || !currentChainConfig) return;

    if (amount <= 0) {
      setToast({ message: "Please enter an amount", type: "error" });
      return;
    }
    if (amount > numericBalance) {
      setToast({ message: "Insufficient balance", type: "error" });
      return;
    }
    if (!receivingAddress || !/^0x[a-fA-F0-9]{40}$/.test(receivingAddress)) {
      setToast({ message: "Please enter a valid address", type: "error" });
      return;
    }

    try {
      const result = await executeCrosschain({
        amount: amount.toString(),
        destinationChain: selectedChain.key,
        receivingAddress,
        selectedToken: "LUCA",
        crosschainAddress: currentChainConfig.crosschainAddress,
        tokenAddress: currentChainConfig.tokenAddress,
        userAddress: address,
        walletProvider,
      });

      if (result.success) {
        setToast({ message: "Transfer submitted successfully!", type: "success" });
        setAmount(0);
        setReceivingAddress("");
        setTimeout(() => fetchBalance(), 3000);
      } else {
        setToast({ message: result.error || "Transfer failed", type: "error" });
      }
    } catch (err: any) {
      setToast({ message: err?.message || "Transfer failed", type: "error" });
    }
  };

  const isFormValid = amount > 0 && receivingAddress !== "" && !transferLoading && !!currentChainConfig;
  const SelectedChainIcon = selectedChain ? (CHAIN_ICONS[selectedChain.id] || PolygonIcon) : PolygonIcon;

  return (
    <div className="py-[30px] px-[20px] bg-white rounded-[15px] h-full">

      <text className="block body-text1-400 text-foreground mb-[30px]">
        You can transfer assets to any address on different chains through the ATM cross-chain transfer tool
      </text>

      {/* Transfer Form */}
      <div className="max-w-[500px] p-[30px] rounded-[15px] bg-white border border-[#EBEBEB]">

        {/* Amount */}
        <div className="space-y-[5px] mb-[30px]">

          <div className='flex justify-between'>
            <span className="block text-[#8E8E93] body-text1-400">Amount</span>

            <div className='space-x-[5px]'>
              <span className="text-[#868686] body-label-400">
                Balance: {balanceLoading ? "..." : balance}
              </span>

              <button
                onClick={handleMaxClick}
                className="px-[10px] py-[5px] border border-[#EBEBEB] rounded-[20px] text-foreground body-label-400">
                MAX
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className='flex justify-between py-[12px] px-[15px] rounded-[12px] bg-[#F8F8F8]'>
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0"
              className='placeholder:text-[#B5B5B5] font-h1 focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              min="0"
            />

            {/* Currency Dropdown */}
            <div className='flex items-center'>
              <LucaIcon className='w-[62px] h-[62px]' />
              <ChevronDown className='w-[14px] h-[14px] text-[#434343]' />
            </div>

          </div>
        </div>

        {/* Receiving Address */}
        <div className="space-y-[5px]">

          <div className='flex justify-between items-center'>
            <span className="block text-[#8E8E93] body-text1-400">Receiving address</span>

            <div className='relative'>
              <button
                onClick={() => setShowChainDropdown(!showChainDropdown)}
                className='flex items-center space-x-[5px]'
              >
                <SelectedChainIcon className='w-[30px] h-[30px]' />
                <span className="text-foreground body-label-400">
                  {selectedChain?.name || "Select chain"}
                </span>
                <ChevronDown className='w-[14px] h-[14px] text-[#434343]' />
              </button>

              {showChainDropdown && destinationChains.length > 0 && (
                <div className="absolute right-0 top-full mt-[4px] bg-white border border-[#EBEBEB] rounded-[12px] shadow-lg z-10 min-w-[160px]">
                  {destinationChains.map((chain, idx) => {
                    const Icon = CHAIN_ICONS[chain.id] || PolygonIcon;
                    return (
                      <button
                        key={chain.id}
                        onClick={() => { setSelectedChainIdx(idx); setShowChainDropdown(false); }}
                        className="flex items-center space-x-[8px] px-[12px] py-[10px] w-full hover:bg-[#F8F8F8] first:rounded-t-[12px] last:rounded-b-[12px]"
                      >
                        <Icon className="w-[24px] h-[24px]" />
                        <span className="text-foreground body-label-400">{chain.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Receiving Address Input */}
          <input
            type="text"
            value={receivingAddress}
            onChange={(e) => setReceivingAddress(e.target.value)}
            placeholder="0x1234a1fdc2f345a6b1f2rae1ee12f345adbf0000"
            className="w-full px-[16px] py-[15px] rounded-[12px] bg-[#F8F8F8] placeholder:text-[#B5B5B5] text-foreground body-text1-400 focus:outline-none"
          />
        </div>

        <div className="p-[15px] bg-[#F8F8F8] rounded-[15px] my-[40px] space-y-[20px]">
          <div className="flex justify-between">
            <span className="text-[#4F5555] body-text2-400">Estimated amount to be received</span>
            <span className="text-foreground body-text2-400">{amount > 0 ? amount : 0} LUCA</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#4F5555] body-text2-400">Cross-chain transfer fee</span>
            <span className="text-foreground body-text2-400">{0} LUCA</span>
          </div>
        </div>

        {/* Transfer Button */}
        <Button
          className="w-full"
          disabled={!isFormValid}
          variant={!isFormValid ? 'disabled' : 'default'}
          onClick={handleTransfer}
        >
          {transferLoading ? (
            <span className="flex items-center justify-center gap-[8px]">
              <Loader2 className="w-[16px] h-[16px] animate-spin" />
              Processing...
            </span>
          ) : (
            "Confirm Transfer"
          )}
        </Button>

        {!currentChainConfig && isConnected && (
          <p className="text-[#8E8E93] body-label-400 text-center mt-[10px]">
            Cross-chain transfer is not available on this network. Please switch to BSC or Polygon.
          </p>
        )}

      </div>

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
