import { useState, useEffect } from "react";
import { ChevronDown, User, X, Loader2, CheckCircle, AlertCircle, Info } from "lucide-react";
import LucaIcon from "@/assets/tokens/luca.svg?react";
import { Slider } from "./Slider";
import { Switch } from "@/components/ui/atm/switch";
import { Button } from "@/components/ui/atm/button";
import { LoadingAnimation } from "@/components/ui/atm/loadingAnimation";
import { Toast } from "@/components/ui/atm/toastMessage";
import { useUnified } from "@/context/Context";
import { useAppKit } from "@/context/AppKitProvider";
import {
  useGetCurrencyList,
  useGetNFTProjectList,
  useCheckNetworkMatch,
  useCheckAllowance,
  useApproveToken,
  useCheckNFTApproval,
  useApproveNFT,
  useCheckNFTOwnership,
  useCreateTokenConnection,
  useCreateNFTConnection,
  useValidateAddress,
  type CoinCurrency,
  type NFTProject,
} from "@/hooks/useWebAppService";
import {
  activeChains,
  getChainById,
  getChainContracts,
  type ChainConfig,
} from "@/config/chains";

export default function CreateConnection() {
  const { isAuthenticated } = useUnified();
  const { address, isConnected, getUserBalance, walletProvider, chainId } = useAppKit();

  // Hooks
  const currencyList = useGetCurrencyList();
  const nftProjectList = useGetNFTProjectList();
  const checkNetwork = useCheckNetworkMatch();
  const checkAllowance = useCheckAllowance();
  const approveToken = useApproveToken();
  const checkNFTApprovalHook = useCheckNFTApproval();
  const approveNFTHook = useApproveNFT();
  const checkNFTOwnershipHook = useCheckNFTOwnership();
  const createTokenConn = useCreateTokenConnection();
  const createNFTConn = useCreateNFTConnection();
  const validateAddress = useValidateAddress();

  // Connection type
  const [connectionType, setConnectionType] = useState<"token" | "nft">("token");

  // Network
  const [selectedChain, setSelectedChain] = useState<ChainConfig | null>(null);
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);

  // Token connection state
  const [connectionWith, setConnectionWith] = useState("");
  const [selectedToken, setSelectedToken] = useState("LUCA");
  const [availableTokens, setAvailableTokens] = useState<CoinCurrency[]>([]);
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [tokenBalance, setTokenBalance] = useState("0.0000");
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Amount state (mine + others → derive totalLocked + lockedPortion)
  const [mine, setMine] = useState("");
  const [others, setOthers] = useState("");

  // Period
  const [selectedPeriod, setSelectedPeriod] = useState("365");
  const [customPeriod, setCustomPeriod] = useState("");

  // Message (kept in UI but not used in on-chain call)
  const [message, setMessage] = useState("");
  const [isPrivateMessage, setIsPrivateMessage] = useState(false);

  // NFT state
  const [nftProjects, setNftProjects] = useState<NFTProject[]>([]);
  const [selectedNFTProject, setSelectedNFTProject] = useState<NFTProject | null>(null);
  const [showNFTSelect, setShowNFTSelect] = useState(false);
  const [firstTokenId, setFirstTokenId] = useState("");
  const [secondTokenId, setSecondTokenId] = useState("");
  const [isTogether, setIsTogether] = useState(true);
  const [nftApprovals, setNftApprovals] = useState<{ [key: string]: boolean }>({});
  const [showNFTDialog, setShowNFTDialog] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [approvalSuccess, setApprovalSuccess] = useState(false);
  const [approvalMessage, setApprovalMessage] = useState("");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // ─── Derived values ────────────────────────────────────────────────────────
  const mineNum = Number(mine) || 0;
  const othersNum = Number(others) || 0;
  const totalLuca = mineNum + othersNum;
  const sliderPercentage = totalLuca > 0 ? Math.round((mineNum / totalLuca) * 100) : 0;

  // lockedPortion = sliderPercentage (my %)
  const lockedPortion = String(sliderPercentage);
  const totalLocked = String(totalLuca);

  // Derived: myLocked, otherPartyLocked
  const myLocked =
    totalLuca > 0 && sliderPercentage > 0
      ? (totalLuca * (sliderPercentage / 100)).toFixed(4)
      : "";
  const otherPartyLocked =
    totalLuca > 0 && sliderPercentage < 100
      ? (totalLuca * (1 - sliderPercentage / 100)).toFixed(4)
      : "";

  // Lockup days
  const finalPeriodDays =
    selectedPeriod === "custom" ? Number(customPeriod) || 0 : Number(selectedPeriod);
  const lockupDays = String(finalPeriodDays);

  // Expected AGT
  const expectedAGT =
    myLocked && finalPeriodDays > 0
      ? ((parseFloat(myLocked) * finalPeriodDays) / 100).toFixed(2)
      : "0";

  // Available chains that have a factory contract
  const availableChains = activeChains.filter((chain) => {
    const contracts = getChainContracts(chain.chain.id);
    return contracts?.factory;
  });

  // ─── Validation ───────────────────────────────────────────────────────────
  const lockupMin = connectionType === "token" ? 30 : 2;
  const lockupMax = 1825;
  const lockupValue = finalPeriodDays;
  const isLockupValid =
    !lockupDays ||
    lockupDays === "0" ||
    (!isNaN(lockupValue) && lockupValue >= lockupMin && lockupValue <= lockupMax);

  const isCustomValid =
    selectedPeriod !== "custom" ||
    (customPeriod !== "" &&
      !isNaN(Number(customPeriod)) &&
      Number(customPeriod) >= lockupMin &&
      Number(customPeriod) <= lockupMax);

  const isFormValid =
    connectionWith.trim() !== "" &&
    isConnected &&
    selectedChain !== null &&
    finalPeriodDays >= lockupMin &&
    finalPeriodDays <= lockupMax &&
    isCustomValid &&
    !isSubmitting &&
    !isApproving &&
    (connectionType === "token"
      ? mine !== "" && others !== "" && mineNum > 0
      : selectedNFTProject !== null && firstTokenId !== "");

  // ─── Effects ──────────────────────────────────────────────────────────────

  // Auto-select chain from wallet
  useEffect(() => {
    if (chainId) {
      const chain = getChainById(chainId);
      if (chain && getChainContracts(chain.chain.id)?.factory) {
        setSelectedChain(chain);
      }
    } else if (availableChains.length > 0 && !selectedChain) {
      setSelectedChain(availableChains[0]);
    }
  }, [chainId, availableChains.length]);

  // Load currency list
  useEffect(() => {
    const loadTokens = async () => {
      if (!selectedChain) return;
      if (!currencyList.data && !currencyList.loading && !currencyList.error) {
        await currencyList.execute();
      }
      if (currencyList.data && Array.isArray(currencyList.data)) {
        const chainTokens = (currencyList.data as any[]).filter(
          (coin: any) => !coin.chainId || coin.chainId === selectedChain.atmId
        );
        setAvailableTokens(chainTokens);
        if (chainTokens.length > 0 && !chainTokens.find((t: any) => t.baseCurrency === selectedToken)) {
          setSelectedToken(chainTokens[0].baseCurrency);
        }
      }
    };
    loadTokens();
  }, [selectedChain, currencyList.data]);

  // Load NFT projects
  useEffect(() => {
    const loadNFTProjects = async () => {
      if (!selectedChain || connectionType !== "nft") return;
      if (!nftProjectList.data && !nftProjectList.loading && !nftProjectList.error) {
        await nftProjectList.execute();
      }
      if ((nftProjectList.data as any)?.success && (nftProjectList.data as any)?.data?.nftProjectList) {
        const chainProjects = (nftProjectList.data as any).data.nftProjectList.filter(
          (project: any) => !project.chainId || project.chainId === selectedChain.atmId
        );
        setNftProjects(chainProjects);
        setSelectedNFTProject(chainProjects.length > 0 ? chainProjects[0] : null);
      }
    };
    loadNFTProjects();
  }, [connectionType, selectedChain, nftProjectList.data]);

  // Load token balance
  useEffect(() => {
    if (isConnected && address && connectionType === "token" && selectedChain) {
      loadTokenBalance();
    }
  }, [selectedToken, isConnected, address, connectionType, selectedChain]);

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const loadTokenBalance = async () => {
    if (!address || !selectedChain) return;
    setIsLoadingBalance(true);
    try {
      if (selectedToken === "LUCA") {
        const balance = await getUserBalance();
        setTokenBalance(balance);
      } else {
        setTokenBalance("0.0000");
      }
    } catch {
      setTokenBalance("0.0000");
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const toWeiBigInt = (amountStr: string, decimals: number): bigint => {
    const [intPart = "0", decPart = ""] = amountStr.split(".");
    const paddedDec = decPart.padEnd(decimals, "0").slice(0, decimals);
    return BigInt(intPart + paddedDec);
  };

  const checkNFTApprovalStatus = async (tokenId: string): Promise<boolean> => {
    if (!selectedNFTProject || !walletProvider || !selectedChain) return false;
    const factoryAddress = getChainContracts(selectedChain.chain.id)?.factory;
    if (!factoryAddress) return false;
    const approved = await checkNFTApprovalHook.execute({
      tokenId,
      nftAddress: selectedNFTProject.address,
      factoryAddress,
      walletProvider,
    });
    return !!approved;
  };

  const handleApproveNFT = async (tokenId: string) => {
    if (!selectedNFTProject || !walletProvider || !selectedChain) return;
    const factoryAddress = getChainContracts(selectedChain.chain.id)?.factory;
    if (!factoryAddress) {
      setToast({ message: "Factory contract not found for this network", type: "error" });
      return;
    }
    try {
      await approveNFTHook.execute({
        tokenId,
        nftAddress: selectedNFTProject.address,
        factoryAddress,
        walletProvider,
      });
      setNftApprovals((prev) => ({ ...prev, [tokenId]: true }));
      setToast({ message: "NFT approved successfully", type: "success" });
    } catch (error: any) {
      setToast({ message: `Approval failed: ${error.message || "Unknown error"}`, type: "error" });
    }
  };

  // ─── Token Connection ──────────────────────────────────────────────────────

  const handleTokenConnection = async () => {
    if (!walletProvider || !address || !selectedChain) {
      setToast({ message: "Please connect your wallet and select a network", type: "error" });
      return;
    }

    const networkMatches = await checkNetwork.execute({
      selectedChainId: selectedChain.chain.id,
      walletProvider,
    });
    if (!networkMatches) {
      setToast({ message: `Please switch to ${selectedChain.chain.name} network in your wallet`, type: "error" });
      return;
    }

    if (!connectionWith || !validateAddress.execute(connectionWith)) {
      setToast({ message: "Please enter a valid connection address", type: "error" });
      return;
    }
    if (connectionWith.toLowerCase() === address.toLowerCase()) {
      setToast({ message: "Connection address cannot be your own address", type: "error" });
      return;
    }

    const totalVal = parseFloat(totalLocked);
    const portionVal = parseFloat(lockedPortion);
    const daysVal = parseInt(lockupDays);

    if (isNaN(totalVal) || totalVal < 1 || (portionVal === 100 && totalVal <= 31)) {
      setToast({ message: "Invalid total locked amount", type: "error" });
      return;
    }
    if (isNaN(portionVal) || portionVal < 1 || portionVal > 100) {
      setToast({ message: "Locked portion must be between 1% and 100%", type: "error" });
      return;
    }
    if (isNaN(daysVal) || daysVal < 30 || daysVal > 1825) {
      setToast({ message: "Lockup days must be between 30 and 1825", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setApprovalSuccess(false);

    try {
      const currencyData = availableTokens.find((t) => t.baseCurrency === selectedToken);
      if (!currencyData) throw new Error("Currency data not found");

      const contracts = getChainContracts(selectedChain.chain.id);
      const factoryAddress = contracts?.factory;
      const traderAddress = contracts?.trader;

      if (!factoryAddress) throw new Error("Factory contract not found for this network");
      if (!traderAddress) throw new Error("Trader contract not found for this network");

      const weiPlaces = Number((currencyData as any).weiPlaces || "18");
      const myAmountInWei = toWeiBigInt(myLocked, weiPlaces);
      const totalAmountInWei = toWeiBigInt(totalLocked, weiPlaces);

      // Step 1: Check allowance
      let hasAllowance = false;
      try {
        hasAllowance = await checkAllowance.execute({
          currency: selectedToken,
          approveAddress: traderAddress,
          amountBase: myAmountInWei,
          currencyList: availableTokens,
          walletProvider,
        });
      } catch {
        // will attempt approval below
      }

      // Step 2: Approve if needed
      if (!hasAllowance) {
        setIsApproving(true);
        setApprovalMessage(`Approving ${selectedToken}...`);
        try {
          const approvalResult = await approveToken.execute({
            currency: selectedToken,
            contractForApproval: traderAddress,
            amount: parseFloat(myLocked),
            currencyList: availableTokens,
            walletProvider,
          });
          setIsApproving(false);
          if (!(approvalResult as any)?.status) {
            throw new Error((approvalResult as any)?.msg || "Approval failed");
          }
          setApprovalSuccess(true);
          setApprovalMessage(`${selectedToken} approved successfully!`);
          await new Promise((resolve) => setTimeout(resolve, 1500));
        } catch (approvalError: any) {
          setIsApproving(false);
          throw approvalError;
        }
      }

      // Step 3: Create connection
      setApprovalMessage("Creating connection...");
      await createTokenConn.execute({
        toAddress: connectionWith,
        tokenSymbol: selectedToken,
        totalAmount: totalAmountInWei,
        percentA: parseInt(lockedPortion),
        lockupDays: parseInt(lockupDays),
        factoryAddress,
        walletProvider,
      });

      setToast({ message: "Connection created successfully!", type: "success" });
      setApprovalSuccess(false);
      setApprovalMessage("");
      resetForm();
    } catch (error: any) {
      const errorMsg = error.message || error.reason || "Unknown error";
      setToast({ message: `Failed: ${errorMsg}`, type: "error" });
      setApprovalSuccess(false);
      setApprovalMessage("");
      setIsApproving(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── NFT Connection ────────────────────────────────────────────────────────

  const handleNFTConnection = async () => {
    if (!walletProvider || !address || !selectedChain) {
      setToast({ message: "Please connect your wallet and select a network", type: "error" });
      return;
    }

    const networkMatches = await checkNetwork.execute({
      selectedChainId: selectedChain.chain.id,
      walletProvider,
    });
    if (!networkMatches) {
      setToast({ message: `Please switch to ${selectedChain.chain.name} network in your wallet`, type: "error" });
      return;
    }

    if (!connectionWith || !validateAddress.execute(connectionWith)) {
      setToast({ message: "Please enter a valid connection address", type: "error" });
      return;
    }
    if (connectionWith.toLowerCase() === address.toLowerCase()) {
      setToast({ message: "Connection address cannot be your own address", type: "error" });
      return;
    }
    if (!selectedNFTProject) {
      setToast({ message: "Please select an NFT project", type: "error" });
      return;
    }
    if (!firstTokenId) {
      setToast({ message: "Please enter the first NFT Token ID", type: "error" });
      return;
    }
    if (!lockupDays || parseInt(lockupDays) < 2 || parseInt(lockupDays) > 1825) {
      setToast({ message: "Lockup days must be between 2 and 1825", type: "error" });
      return;
    }

    const ownsFirst = await checkNFTOwnershipHook.execute({
      tokenId: firstTokenId,
      nftAddress: selectedNFTProject.address,
      walletProvider,
    });
    if (!ownsFirst) {
      setToast({ message: "You do not own the first NFT", type: "error" });
      return;
    }

    if (!isTogether) {
      if (!secondTokenId) {
        setToast({ message: "Please enter the second NFT Token ID for separate pledging", type: "error" });
        return;
      }
      if (firstTokenId === secondTokenId) {
        setToast({ message: "Token IDs must be different", type: "error" });
        return;
      }
      const ownsSecond = await checkNFTOwnershipHook.execute({
        tokenId: secondTokenId,
        nftAddress: selectedNFTProject.address,
        walletProvider,
      });
      if (!ownsSecond) {
        setToast({ message: "You do not own the second NFT", type: "error" });
        return;
      }
    }

    const tokenList = [firstTokenId];
    if (!isTogether && secondTokenId) tokenList.push(secondTokenId);

    const approvalStatuses: { [key: string]: boolean } = {};
    for (const tokenId of tokenList) {
      approvalStatuses[tokenId] = await checkNFTApprovalStatus(tokenId);
    }
    setNftApprovals(approvalStatuses);
    setShowNFTDialog(true);
  };

  const confirmNFTConnection = async () => {
    if (!walletProvider || !address || !selectedNFTProject || !selectedChain) return;

    const tokenList = [firstTokenId];
    if (!isTogether && secondTokenId) tokenList.push(secondTokenId);

    const allApproved = tokenList.every((tokenId) => nftApprovals[tokenId]);
    if (!allApproved) {
      setToast({ message: "Please approve all NFTs before creating the connection", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setShowNFTDialog(false);

    try {
      const factoryAddress = getChainContracts(selectedChain.chain.id)?.factory;
      if (!factoryAddress) throw new Error("Factory contract not found for this network");

      await createNFTConn.execute({
        nftAddress: selectedNFTProject.address,
        toAddress: connectionWith,
        tokenList,
        lockupDays: parseInt(lockupDays),
        factoryAddress,
        walletProvider,
      });

      setToast({ message: "NFT Connection created successfully!", type: "success" });
      resetForm();
    } catch (error: any) {
      const errorMsg = error.message || error.reason || "Unknown error";
      setToast({ message: `Failed: ${errorMsg}`, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Form helpers ──────────────────────────────────────────────────────────

  const resetForm = () => {
    setConnectionWith("");
    setMine("");
    setOthers("");
    setSelectedPeriod("365");
    setCustomPeriod("");
    setIsPrivateMessage(false);
    setMessage("");
    setFirstTokenId("");
    setSecondTokenId("");
    setIsTogether(true);
    setNftApprovals({});
    setApprovalSuccess(false);
    setApprovalMessage("");
  };

  const handleClear = () => setConnectionWith("");

  const handleMaxClick = () => setMine(tokenBalance);

  const handleSliderChange = (percentage: number) => {
    if (totalLuca > 0) {
      const newMine = Math.round((totalLuca * percentage) / 100);
      const newOthers = totalLuca - newMine;
      setMine(String(newMine));
      setOthers(String(newOthers));
    }
  };

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
    if (period !== "custom") setCustomPeriod("");
  };

  const handleCustomPeriodChange = (value: string) => {
    setSelectedPeriod("custom");
    setCustomPeriod(value);
  };

  const handleConfirm = async () => {
    if (!isFormValid) return;
    if (connectionType === "token") {
      await handleTokenConnection();
    } else {
      await handleNFTConnection();
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col md:flex-row gap-[16px] md:gap-[10px]">
      {/* Connection Instructions */}
      <div className="p-[12px] md:p-[20px] rounded-[15px] bg-card md:w-1/2 md:order-2">
        <h4 className="font-h4-400 mb-[30px] md:mb-[20px] text-foreground">
          Connection instructions
        </h4>

        <ol className="body-text-400 list-decimal list-outside space-y-4 ml-[20px] text-foreground">
          {connectionType === "token" ? (
            <>
              <li>The connection is successfully created only if the other party agrees.</li>
              <li>Both parties shall deduct a certain amount of liquidated damages for early redemption.</li>
              <li>In the process of establishing a connection, the Gas Price fee will be borne by the user.</li>
              <li>The funds will be returned to the original payment account if the connection creation fails.</li>
            </>
          ) : (
            <>
              <li>If you choose to require the other party to pledge NFT at the same time, you need to achieve a mutual agreement to complete the connection.</li>
              <li>NFT connection only supports NFT hedging of the same project.</li>
              <li>After being created, the connection cannot be redeemed in advance.</li>
            </>
          )}
        </ol>

        {/* Expected AGT (token only) */}
        {connectionType === "token" && (
          <div className="mt-[20px] text-center">
            <span className="block text-[#999999] body-text2-400">
              Expected {expectedAGT} AGT.
            </span>
          </div>
        )}

        {/* Approval status */}
        {(isApproving || approvalSuccess) && connectionType === "token" && (
          <div className="mt-[16px] p-[12px] rounded-[10px] bg-[#F0F9FF] border border-[#BAE6FD]">
            <div className="flex items-center gap-2">
              {isApproving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="body-text2-400 text-primary">{approvalMessage}</span>
                </>
              ) : approvalSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="body-text2-400 text-green-700">{approvalMessage}</span>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Create Connection Form */}
      <div className="p-[30px] rounded-[15px] bg-card md:w-1/2 md:order-1">
        <h4 className="font-h4-400 mb-[20px] text-foreground">Create Connection</h4>

        <div className="space-y-[24px]">
          {/* Connection Type Toggle */}
          <div className="flex gap-[8px]">
            <div
              className={`flex-1 rounded-[12px] p-[2px] transition-all ${
                connectionType === "token"
                  ? "bg-gradient-to-r from-[#A5DC53] to-[#5DD27A]"
                  : "bg-[#EBEBEB]"
              }`}
            >
              <button
                onClick={() => setConnectionType("token")}
                className="w-full py-[12px] px-[8px] rounded-[10px] body-text-400 bg-white text-foreground"
              >
                Token connection
              </button>
            </div>
            <div
              className={`flex-1 rounded-[12px] p-[2px] transition-all ${
                connectionType === "nft"
                  ? "bg-gradient-to-r from-[#A5DC53] to-[#5DD27A]"
                  : "bg-[#EBEBEB]"
              }`}
            >
              <button
                onClick={() => setConnectionType("nft")}
                className="w-full py-[12px] px-[8px] rounded-[10px] body-text-400 bg-white text-foreground"
              >
                NFT connection
              </button>
            </div>
          </div>

          {/* Network Selector */}
          <div className="space-y-[8px]">
            <span className="block text-[#8E8E93] body-text-400">Select network</span>
            <div className="relative">
              <div
                onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                className="w-full px-[16px] py-[14px] rounded-[12px] bg-[#F8F8F8] dark:bg-[#383D4C] text-foreground body-text1-400 flex justify-between items-center cursor-pointer"
              >
                <span>{selectedChain?.chain.name || "Select Network"}</span>
                <ChevronDown className="w-[16px] h-[16px] text-[#8E8E93]" />
              </div>
              {showNetworkDropdown && (
                <div className="absolute z-20 w-full mt-[4px] bg-white dark:bg-[#383D4C] border border-[#EBEBEB] rounded-[12px] shadow-xl max-h-60 overflow-auto">
                  {availableChains.length > 0 ? (
                    availableChains.map((chain) => (
                      <div
                        key={chain.chain.id}
                        onClick={() => {
                          setSelectedChain(chain);
                          setShowNetworkDropdown(false);
                        }}
                        className={`px-[16px] py-[12px] cursor-pointer body-text1-400 text-foreground hover:bg-[#F8F8F8] dark:hover:bg-[#2A2E3D] border-b border-[#F0F0F0] last:border-0 ${
                          selectedChain?.chain.id === chain.chain.id ? "text-primary" : ""
                        }`}
                      >
                        {chain.chain.name}
                        <span className="block text-xs text-[#8E8E93]">Chain ID: {chain.chain.id}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-[16px] py-[12px] text-[#8E8E93] body-text1-400">No networks available</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* With Section */}
          <div className="space-y-[10px]">
            <span className="block text-[#8E8E93] body-text-400">With</span>
            <div className="relative">
              <div
                className={`absolute left-[16px] top-1/2 -translate-y-1/2 transition-all duration-300 ${
                  connectionWith ? "opacity-0 scale-75" : "opacity-100 scale-100"
                }`}
              >
                <User className="w-[24px] h-[24px] text-primary" />
              </div>
              <input
                type="text"
                value={connectionWith}
                onChange={(e) => setConnectionWith(e.target.value)}
                placeholder="0x1234a1fdc2f34a6b1f2rae1ee12f345adbf0000"
                className={`w-full px-[10px] py-[15px] rounded-[12px] bg-[#F8F8F8] dark:bg-[#383D4C] placeholder:text-[#878787] text-foreground body-text1-400 transition-all duration-300 focus:outline-none ${
                  connectionWith ? "pl-[16px] pr-[48px]" : "pl-[48px] pr-[16px]"
                }`}
              />
              <button
                onClick={handleClear}
                className={`absolute right-[16px] top-1/2 -translate-y-1/2 transition-all duration-300 bg-[#F2F2F2] rounded-full p-1 ${
                  connectionWith ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-75 pointer-events-none"
                }`}
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>

          {/* ── TOKEN CONNECTION FIELDS ── */}
          {connectionType === "token" && (
            <>
              {/* Token Selector */}
              <div className="space-y-[8px]">
                <span className="block text-[#8E8E93] body-text-400">Connection token</span>
                <div className="relative">
                  <div
                    onClick={() => setShowTokenSelect(!showTokenSelect)}
                    className="w-full px-[16px] py-[14px] rounded-[12px] bg-[#F8F8F8] dark:bg-[#383D4C] text-foreground body-text1-400 flex justify-between items-center cursor-pointer"
                  >
                    <span className="flex items-center gap-[8px]">
                      <LucaIcon className="w-[28px] h-[28px]" />
                      <span>{selectedToken}</span>
                    </span>
                    <ChevronDown className="w-[16px] h-[16px] text-[#8E8E93]" />
                  </div>
                  {showTokenSelect && (
                    <div className="absolute z-20 w-full mt-[4px] bg-white dark:bg-[#383D4C] border border-[#EBEBEB] rounded-[12px] shadow-xl max-h-60 overflow-auto">
                      {availableTokens.length > 0 ? (
                        availableTokens.map((token) => (
                          <div
                            key={token.baseCurrency}
                            onClick={() => {
                              setSelectedToken(token.baseCurrency);
                              setShowTokenSelect(false);
                            }}
                            className="px-[16px] py-[12px] hover:bg-[#F8F8F8] dark:hover:bg-[#2A2E3D] cursor-pointer flex items-center gap-[8px] body-text1-400 text-foreground border-b border-[#F0F0F0] last:border-0"
                          >
                            <LucaIcon className="w-[24px] h-[24px]" />
                            <span>{token.baseCurrency}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-[16px] py-[12px] text-[#8E8E93] body-text1-400">No tokens available</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#868686] body-label-400 flex items-center gap-1">
                    Balance:{" "}
                    {isLoadingBalance ? (
                      <Loader2 className="inline w-3 h-3 animate-spin ml-1" />
                    ) : (
                      <span className="font-semibold text-foreground">{tokenBalance} {selectedToken}</span>
                    )}
                    {parseFloat(tokenBalance) === 0 && selectedToken === "LUCA" && !isLoadingBalance && (
                      <Info className="w-3 h-3 text-red-500 ml-1" title="Selected chain has 0 LUCA for you. Please change your network." />
                    )}
                  </span>
                </div>
              </div>

              {/* Amount Section */}
              <div className="space-y-[5px]">
                <div className="flex justify-between">
                  <span className="block text-[#8E8E93] body-text-400">Amount</span>
                  <button
                    onClick={handleMaxClick}
                    className="px-[10px] py-[5px] border border-[#EBEBEB] rounded-[20px] text-foreground body-label-400 cursor-pointer"
                  >
                    MAX
                  </button>
                </div>

                <div className="bg-[#F8F8F8] rounded-[12px] py-[12px]">
                  {/* Mine */}
                  <div className="px-[16px] mb-[5px]">
                    <div className="flex justify-between">
                      <input
                        type="number"
                        value={mine || ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "" || Number(v) >= 0) setMine(v);
                        }}
                        placeholder="0"
                        className="placeholder:text-foreground font-h1 bg-transparent focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="0"
                      />
                      <div className="flex items-center">
                        <LucaIcon className="w-[62px] h-[62px]" />
                        <ChevronDown className="w-[14px] h-[14px] text-[#434343]" />
                      </div>
                    </div>
                    <span className="text-[#8E8E93] body-label-400">Mine</span>
                  </div>

                  {/* Slider */}
                  <Slider value={sliderPercentage} onChange={handleSliderChange} />
                  <div className="pr-[12px] text-end body-label-400 text-[#878787]">
                    {totalLuca} LUCA
                  </div>

                  {/* Others */}
                  <div className="px-[16px] mt-[5px]">
                    <div className="flex justify-between">
                      <input
                        type="number"
                        value={others || ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "" || Number(v) >= 0) setOthers(v);
                        }}
                        placeholder="0"
                        className="placeholder:text-foreground font-h1 bg-transparent focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="0"
                      />
                    </div>
                    <span className="text-[#8E8E93] body-label-400">Others</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── NFT CONNECTION FIELDS ── */}
          {connectionType === "nft" && (
            <>
              {/* NFT Project */}
              <div className="space-y-[8px]">
                <span className="block text-[#8E8E93] body-text-400">NFT project</span>
                <div className="relative">
                  <div
                    onClick={() => setShowNFTSelect(!showNFTSelect)}
                    className="w-full px-[16px] py-[14px] rounded-[12px] bg-[#F8F8F8] dark:bg-[#383D4C] text-foreground body-text1-400 flex justify-between items-center cursor-pointer"
                  >
                    <span>{selectedNFTProject?.name || "Select NFT Project"}</span>
                    <ChevronDown className="w-[16px] h-[16px] text-[#8E8E93]" />
                  </div>
                  {showNFTSelect && (
                    <div className="absolute z-20 w-full mt-[4px] bg-white dark:bg-[#383D4C] border border-[#EBEBEB] rounded-[12px] shadow-xl max-h-60 overflow-auto">
                      {nftProjects.length > 0 ? (
                        nftProjects.map((project) => (
                          <div
                            key={project.address}
                            onClick={() => {
                              setSelectedNFTProject(project);
                              setShowNFTSelect(false);
                            }}
                            className="px-[16px] py-[12px] hover:bg-[#F8F8F8] dark:hover:bg-[#2A2E3D] cursor-pointer body-text1-400 text-foreground border-b border-[#F0F0F0] last:border-0"
                          >
                            {project.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-[16px] py-[12px] text-[#8E8E93] body-text1-400">No NFT projects available</div>
                      )}
                    </div>
                  )}
                  {selectedNFTProject && (
                    <p className="mt-[6px] text-xs text-[#8E8E93]">
                      Buy the project NFT:{" "}
                      <a
                        href={selectedNFTProject.webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        {selectedNFTProject.webUrl}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {/* First Token ID */}
              <div className="space-y-[8px]">
                <span className="block text-[#8E8E93] body-text-400">Lock NFT (Token ID)</span>
                <input
                  type="number"
                  value={firstTokenId}
                  onChange={(e) => setFirstTokenId(e.target.value)}
                  placeholder="Enter NFT Token ID"
                  className="w-full px-[16px] py-[15px] rounded-[12px] bg-[#F8F8F8] dark:bg-[#383D4C] placeholder:text-[#878787] text-foreground body-text1-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* Separate pledging toggle */}
              <div className="border border-[#EBEBEB] rounded-[12px] p-[16px] space-y-[10px]">
                <div className="flex items-center justify-between">
                  <span className="body-text-400 text-foreground">Separate pledging</span>
                  <Switch
                    checked={!isTogether}
                    onCheckedChange={(checked) => setIsTogether(!checked)}
                  />
                </div>
                <p className="body-text2-400 text-[#8E8E93]">
                  Does the other party need to pledge NFT at the same time?
                </p>
                {!isTogether && (
                  <div className="space-y-[8px]">
                    <p className="text-xs text-[#8E8E93]">
                      If the other party does not need to pledge NFT, you need to pledge one more NFT to complete the connection.
                    </p>
                    <span className="block text-[#8E8E93] body-text-400">Please select the other NFT to pledge</span>
                    <input
                      type="number"
                      value={secondTokenId}
                      onChange={(e) => setSecondTokenId(e.target.value)}
                      placeholder="Enter second NFT Token ID"
                      className="w-full px-[16px] py-[15px] rounded-[12px] bg-[#F8F8F8] dark:bg-[#383D4C] placeholder:text-[#878787] text-foreground body-text1-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Period (days) Section */}
          <div className="space-y-[5px]">
            <span className="block text-[#8E8E93] body-text-400">Period (days)</span>

            <div className="flex gap-[5px]">
              {["180", "365", "1825"].map((p) => (
                <div
                  key={p}
                  className={`w-[15%] rounded-[12px] p-[2px] transition-all ${
                    selectedPeriod === p ? "bg-gradient-to-r from-[#A5DC53] to-[#5DD27A]" : "bg-[#EBEBEB]"
                  }`}
                >
                  <button
                    onClick={() => handlePeriodSelect(p)}
                    className="w-full py-[15px] px-[8px] rounded-[10px] body-text-400 bg-white text-foreground"
                  >
                    {p}
                  </button>
                </div>
              ))}

              <div
                className={`w-[55%] rounded-[12px] p-[2px] transition-all ${
                  selectedPeriod === "custom" ? "bg-gradient-to-r from-[#A5DC53] to-[#5DD27A]" : "bg-[#EBEBEB]"
                }`}
              >
                <input
                  type="number"
                  value={customPeriod}
                  onChange={(e) => handleCustomPeriodChange(e.target.value)}
                  onClick={() => setSelectedPeriod("custom")}
                  placeholder={`${lockupMin} to 1825 days`}
                  min={lockupMin}
                  max={lockupMax}
                  className="w-full py-[16.5px] px-[12px] rounded-[10px] body-text1-400 focus:outline-none bg-white text-foreground placeholder:text-[#878787] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {!isLockupValid && finalPeriodDays > 0 && (
              <p className="flex items-center gap-1.5 text-sm text-red-500 mt-[4px]">
                <AlertCircle className="w-4 h-4" />
                Lockup time must be between {lockupMin} and {lockupMax} days
              </p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-[5px]">
            <span className="block text-[#8E8E93] body-text-400">Message</span>
            <textarea
              placeholder="Add a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-[80px] p-[16px] rounded-[12px] bg-[#F8F8F8] placeholder:text-[#878787] text-foreground body-text1-400 focus:outline-none resize-none"
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-0.5">
                <span className="body-text1-400 text-foreground">Private message</span>
                <span className="body-text2-400 text-[#4F5555]">(only visible for you and connected user)</span>
              </div>
              <Switch checked={isPrivateMessage} onCheckedChange={setIsPrivateMessage} />
            </div>
          </div>

          {/* Confirm Button */}
          <div className="text-center">
            <Button
              disabled={!isFormValid}
              onClick={handleConfirm}
              size="lg"
              className="w-[137px]"
              variant={!isFormValid ? "disabled" : "default"}
            >
              {isApproving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Approving...
                </span>
              ) : isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {approvalSuccess ? "Creating..." : "Processing..."}
                </span>
              ) : (
                "Confirm"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Loading Animation */}
      <LoadingAnimation isVisible={isSubmitting || isApproving} />

      {/* Toast Message */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* NFT Approval Dialog */}
      {showNFTDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-card rounded-[15px] max-w-md w-full p-[24px]">
            <h4 className="font-h4-400 mb-[8px] text-foreground">Complete the NFT connection</h4>
            <p className="body-text2-400 text-[#8E8E93] mb-[16px]">
              Please authorize the NFTs to pledge on {selectedChain?.chain.name}
            </p>
            <div className="space-y-[10px] mb-[20px]">
              {Object.keys(nftApprovals).map((tokenId) => (
                <div
                  key={tokenId}
                  className="flex items-center justify-between p-[12px] bg-[#F8F8F8] rounded-[10px]"
                >
                  <span className="body-text1-400 text-foreground">Token ID: {tokenId}</span>
                  {nftApprovals[tokenId] ? (
                    <span className="text-green-500 body-text2-400 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Authorized
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApproveNFT(tokenId)}
                      className="text-primary body-text2-400 underline"
                    >
                      Authorize
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-[10px]">
              <Button
                onClick={() => setShowNFTDialog(false)}
                variant="disabled"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmNFTConnection}
                disabled={!Object.values(nftApprovals).every((v) => v)}
                className="flex-1"
                variant={!Object.values(nftApprovals).every((v) => v) ? "disabled" : "default"}
              >
                Create Connection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
