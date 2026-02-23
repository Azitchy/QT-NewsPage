import { useState, useEffect } from "react";
import { useUnified } from "@/context/Context";
import { useAppKit } from "@/context/AppKitProvider";
import { fetchPRNodes, fetchStakeTransactions, fetchUserTreatyList } from "@/lib/webApi";
import {
  AlertCircle,
  RefreshCw,
  Server,
  Award,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Copy,
  X,
  Zap,
} from "lucide-react";
import { getChainContracts } from "@/config/chains";

/* ============================================================================
   TYPES
   ============================================================================ */

interface PRNode {
  id?: string;
  serverAddress: string;
  serverUrl: string;
  serverIp: string;
  serverNickname: string;
  ledgeAmount: string;
  rank: number;
  status?: string;
  totalStakers?: number;
  lastUpdate?: string;
  walletAddress?: string;
}

interface StakeRecord {
  ledgeAmount: string;
  ledgeTime: number;
  ledgeNum?: number;
  chainId: number;
  ledgeAddress?: string;
  linkAddress?: string;
  newNodeAddress?: string;
}

interface RecoveryStake {
  contractAddress: string;
  name: string;
  totalStaked: string;
  userStaked: string;
  limit: string;
}

type PageView =
  | "list"
  | "stake"
  | "detail"
  | "batch"
  | "recoveryStake"
  | "recoveryDetail";

/* ============================================================================
   HELPERS
   ============================================================================ */

function formatAddress(addr: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatTime(timestamp: string | number): string {
  if (!timestamp) return "";
  const ts =
    typeof timestamp === "string" ? parseInt(timestamp) * 1000 : timestamp * 1000;
  return new Date(ts).toLocaleString();
}

function getChainName(chainId: number): string {
  const chains: Record<number, string> = {
    1: "BSC",
    2: "Polygon",
    56: "BSC",
    97: "BSC Testnet",
    137: "Polygon",
  };
  return chains[chainId] || "Unknown";
}

/** Pad a hex string (without 0x) to 32 bytes (64 hex chars) */
function pad32(hex: string): string {
  return hex.replace(/^0x/, "").toLowerCase().padStart(64, "0");
}

/** Convert a decimal amount string to BigInt with given decimals */
function toWeiBigInt(amountStr: string, decimals: number = 18): bigint {
  const [intPart = "0", decPart = ""] = amountStr.split(".");
  const paddedDec = decPart.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(intPart + paddedDec);
}

/** Poll for tx receipt. Throws on timeout or on-chain revert. */
async function waitForReceipt(
  walletProvider: any,
  txHash: string,
  label = "Transaction"
): Promise<void> {
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const receipt = await walletProvider.request({
      method: "eth_getTransactionReceipt",
      params: [txHash],
    });
    if (receipt) {
      if (receipt.status === "0x0") throw new Error(`${label} failed on-chain`);
      return;
    }
  }
  throw new Error(`${label} timeout — check blockchain explorer`);
}

/**
 * allowance(owner, spender) → uint256
 * selector: 0xdd62ed3e
 */
async function checkAllowance(
  walletProvider: any,
  lucaAddress: string,
  ownerAddress: string,
  spenderAddress: string
): Promise<bigint> {
  const data = "0xdd62ed3e" + pad32(ownerAddress) + pad32(spenderAddress);
  const result = await walletProvider.request({
    method: "eth_call",
    params: [{ to: lucaAddress, data }, "latest"],
  });
  return BigInt(result || "0x0");
}

/**
 * approve(spender, MaxUint256)
 * selector: 0x095ea7b3
 */
async function approveLuca(
  walletProvider: any,
  fromAddress: string,
  lucaAddress: string,
  spenderAddress: string
): Promise<void> {
  const MAX =
    "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
  const data = "0x095ea7b3" + pad32(spenderAddress) + MAX;
  const txHash = await walletProvider.request({
    method: "eth_sendTransaction",
    params: [{ from: fromAddress, to: lucaAddress, data, gas: "0x15f90" }],
  });
  await waitForReceipt(walletProvider, txHash, "LUCA Approval");
}

/**
 * stakeLuca(address,uint256)
 * selector: 0xdbbb7c97
 */
async function sendStakeLuca(
  walletProvider: any,
  fromAddress: string,
  pledgeAddress: string,
  nodeAddress: string,
  amountWei: bigint
): Promise<string> {
  const data =
    "0xdbbb7c97" + pad32(nodeAddress) + pad32(amountWei.toString(16));

  let gasEstimate: string;
  try {
    gasEstimate = await walletProvider.request({
      method: "eth_estimateGas",
      params: [{ from: fromAddress, to: pledgeAddress, data, value: "0x0" }],
    });
  } catch (e: any) {
    throw new Error(
      `Gas estimation failed: ${e?.data?.message || e?.message || "Contract would revert"}`
    );
  }

  const txHash = await walletProvider.request({
    method: "eth_sendTransaction",
    params: [
      { from: fromAddress, to: pledgeAddress, data, value: "0x0", gas: gasEstimate },
    ],
  });
  await waitForReceipt(walletProvider, txHash, "Stake");
  return txHash;
}

/**
 * cancleStakeLuca(uint256[])
 * selector: 0x8cc15c0e
 */
async function sendCancleStakeLuca(
  walletProvider: any,
  fromAddress: string,
  pledgeAddress: string,
  ledgeNums: number[]
): Promise<string> {
  const arrayOffset = pad32("20");
  const arrayLen = pad32(ledgeNums.length.toString(16));
  const elements = ledgeNums.map((n) => pad32(BigInt(n).toString(16))).join("");
  const data = "0x8cc15c0e" + arrayOffset + arrayLen + elements;

  const txHash = await walletProvider.request({
    method: "eth_sendTransaction",
    params: [
      { from: fromAddress, to: pledgeAddress, data, value: "0x0", gas: "0x7a120" },
    ],
  });
  await waitForReceipt(walletProvider, txHash, "Redeem");
  return txHash;
}

/* ============================================================================
   MAIN PR NODE COMPONENT
   ============================================================================ */

export default function PrNode() {
  const { isAuthenticated } = useUnified();
  const {
    isConnected,
    address,
    walletProvider,
    chainId,
    getUserBalance,
    checkLUCASupport,
    switchToSupportedChain,
  } = useAppKit();

  // ── List / tab state ────────────────────────────────────────────────────────
  const [searchKey, setSearchKey] = useState("");
  const [searchType, setSearchType] = useState<
    "serverAddress" | "serverNickname" | "serverIp" | "hash" | "userAddress"
  >("serverNickname");
  const [chainFilter, setChainFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [nodes, setNodes] = useState<PRNode[]>([]);
  const [nodesLoading, setNodesLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // ── Navigation ──────────────────────────────────────────────────────────────
  const [selectedNode, setSelectedNode] = useState<PRNode | null>(null);
  const [pageView, setPageView] = useState<PageView>("list");
  const [selectedRecovery, setSelectedRecovery] = useState<RecoveryStake | null>(null);

  // ── Stake form ──────────────────────────────────────────────────────────────
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [userBalance, setUserBalance] = useState("0");
  const [error, setError] = useState<string | null>(null);

  // ── Detail view ─────────────────────────────────────────────────────────────
  const [stakeTab, setStakeTab] = useState<1 | 2>(1);
  const [stakeRecords, setStakeRecords] = useState<StakeRecord[]>([]);
  const [stakeRecordsLoading, setStakeRecordsLoading] = useState(false);
  const [stakeRecordsPage, setStakeRecordsPage] = useState(1);
  const [stakeRecordsTotalCount, setStakeRecordsTotalCount] = useState(0);
  const [selectedStakeRecord, setSelectedStakeRecord] =
    useState<StakeRecord | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const itemsPerPage = 25;
  const stakeRecordsPerPage = 10;

  /* ── Effects ─────────────────────────────────────────────────────────────── */

  useEffect(() => {
    loadNodes();
  }, [currentPage, searchKey, chainFilter]);

  useEffect(() => {
    if (isConnected && isAuthenticated) {
      loadUserBalance();
    }
  }, [isConnected, isAuthenticated]);

  useEffect(() => {
    if (pageView === "detail" && selectedNode) {
      loadStakeRecords();
    }
  }, [pageView, selectedNode, stakeTab, stakeRecordsPage, chainFilter]);

  /* ── Data loaders ────────────────────────────────────────────────────────── */

  const loadNodes = async () => {
    setNodesLoading(true);
    try {
      const response = await fetchPRNodes(
        currentPage,
        itemsPerPage,
        searchKey || undefined,
        searchKey ? searchType : undefined
      );
      if (response.success) {
        setNodes(response.data || []);
        setTotalCount(response.total || 0);
      }
    } catch (err: any) {
      console.error("Error loading PR nodes:", err);
    } finally {
      setNodesLoading(false);
    }
  };

  const loadUserBalance = async () => {
    try {
      const balance = await getUserBalance();
      setUserBalance(balance);
    } catch (error: any) {
      console.error("Failed to load user balance:", error);
    }
  };

  const loadStakeRecords = async () => {
    if (!selectedNode) return;
    setStakeRecordsLoading(true);
    try {
      const response = await fetchUserTreatyList({
        ledgeAddress: selectedNode.walletAddress || selectedNode.serverAddress,
        chainId: chainFilter || undefined,
        pageIndex: stakeRecordsPage,
        pageSize: stakeRecordsPerPage,
        type: stakeTab,
      });
      if (response.success) {
        setStakeRecords(response.data?.treatyList || []);
        setStakeRecordsTotalCount(response.data?.totalCount || 0);
      }
    } catch (error: any) {
      console.error("Error loading stake records:", error);
    } finally {
      setStakeRecordsLoading(false);
    }
  };

  /* ── Actions ─────────────────────────────────────────────────────────────── */

  const handleStake = async () => {
    if (!isAuthenticated || !selectedNode || !walletProvider || !address) {
      setError("Please connect your wallet first");
      return;
    }

    if (!checkLUCASupport()) {
      await switchToSupportedChain();
      setError("Please switch to Binance Smart Chain to stake LUCA tokens");
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) < 0.0001) {
      setError("Please enter a valid stake amount (minimum 0.0001 LUCA)");
      return;
    }

    if (parseFloat(stakeAmount) > parseFloat(userBalance)) {
      setError("Insufficient LUCA balance");
      return;
    }

    const contracts = getChainContracts(chainId ?? 0);
    const pledgeAddress = contracts?.prNodeStake || contracts?.pledger;
    const lucaAddress = contracts?.luca;

    if (!pledgeAddress || !lucaAddress) {
      setError("Contract not found for this network. Please switch to BSC.");
      return;
    }

    setError(null);
    setIsStaking(true);

    try {
      const amountWei = toWeiBigInt(
        parseFloat(stakeAmount).toFixed(18),
        18
      );

      // Check allowance
      let currentAllowance = BigInt(0);
      try {
        currentAllowance = await checkAllowance(
          walletProvider,
          lucaAddress,
          address,
          pledgeAddress
        );
      } catch {
        console.warn("Allowance check failed, will approve anyway");
      }

      // Approve if needed
      if (currentAllowance < amountWei) {
        setIsApproving(true);
        await approveLuca(walletProvider, address, lucaAddress, pledgeAddress);
        setIsApproving(false);
        await new Promise((r) => setTimeout(r, 3000));
      }

      // Stake
      await sendStakeLuca(
        walletProvider,
        address,
        pledgeAddress,
        selectedNode.serverAddress,
        amountWei
      );

      setStakeAmount("");
      setError(null);
      setPageView("detail");
      await loadUserBalance();
      await loadStakeRecords();
    } catch (err: any) {
      console.error("Staking failed:", err);
      const msg = err.message || "";
      if (msg.includes("rejected") || err.code === 4001) {
        setError("Transaction cancelled by user.");
      } else if (msg.includes("insufficient funds") || err.code === -32603) {
        setError("Insufficient funds for gas fees.");
      } else if (msg.includes("balance")) {
        setError("Insufficient LUCA balance.");
      } else {
        setError(`Staking failed: ${msg || "Please try again."}`);
      }
    } finally {
      setIsStaking(false);
      setIsApproving(false);
    }
  };

  const handleRedeem = async () => {
    if (!selectedStakeRecord || !walletProvider || !address || !chainId) return;

    const contracts = getChainContracts(chainId);
    const pledgeAddress = contracts?.prNodeStake || contracts?.pledger;
    if (!pledgeAddress) {
      setError("Pledge contract not found for this network");
      return;
    }

    setIsRedeeming(true);
    setError(null);

    try {
      if (stakeTab === 1) {
        // LUCA redemption: cancleStakeLuca([ledgeNum])
        if (selectedStakeRecord.ledgeNum === undefined) {
          throw new Error("Missing ledge index for redemption");
        }
        await sendCancleStakeLuca(walletProvider, address, pledgeAddress, [
          selectedStakeRecord.ledgeNum,
        ]);
      } else {
        // Consensus contract redemption: cancleStakeLuca([])
        await sendCancleStakeLuca(walletProvider, address, pledgeAddress, []);
      }

      setShowRedeemModal(false);
      setSelectedStakeRecord(null);
      await loadStakeRecords();
    } catch (err: any) {
      console.error("Redemption failed:", err);
      const msg = err.message || "";
      if (msg.includes("rejected") || err.code === 4001) {
        setError("Transaction cancelled by user.");
      } else if (err.code === -32603) {
        setError("Insufficient funds for gas fees.");
      } else {
        setError(`Redemption failed: ${msg || "Please try again."}`);
      }
    } finally {
      setIsRedeeming(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const isNetworkSupported = checkLUCASupport();
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const stakeRecordsTotalPages = Math.ceil(stakeRecordsTotalCount / stakeRecordsPerPage);

  /* ── Auth guard ──────────────────────────────────────────────────────────── */

  if (!isAuthenticated) {
    return (
      <div className="flex-1 p-[24px]">
        <div className="text-center py-[48px]">
          <AlertCircle className="w-[48px] h-[48px] text-[#959595] mx-auto mb-[16px]" />
          <h2 className="body-text1-400 text-foreground mb-[8px]">
            Authentication Required
          </h2>
          <p className="body-text2-400 text-[#959595]">
            Please connect your wallet to access PR Nodes.
          </p>
        </div>
      </div>
    );
  }

  /* ── Back button (inline, same as reference) ─────────────────────────────── */

  const BackButton = () => (
    <div className="items-center flex mb-[24px]">
      <button
        onClick={() => {
          setPageView("list");
          setSelectedNode(null);
          setStakeRecords([]);
          setStakeTab(1);
          setError(null);
        }}
        className="flex items-center gap-[8px] text-foreground body-text-400 hover:text-primary transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-[18px] h-[18px] text-foreground" />
        Back
      </button>
    </div>
  );

  /* ── Detail View ─────────────────────────────────────────────────────────── */

  if (pageView === "detail" && selectedNode) {
    return (
      <div className="space-y-[20px]">
        <BackButton />

        <div className="bg-white rounded-[15px] p-[24px] space-y-[20px]">
          <h3 className="body-text1-500 text-foreground">
            PR node stake Details
          </h3>

          {/* Node info */}
          <div className="space-y-[16px]">
            <div className="flex gap-[36px] items-center">
              <label className="body-text2-400 text-[#959595] min-w-[120px]">
                Stake node
              </label>
              <div className="flex items-center gap-[8px] flex-1">
                <span className="body-text2-400 text-foreground break-all">
                  {selectedNode.serverAddress}
                </span>
                <button
                  onClick={() => copyToClipboard(selectedNode.serverAddress)}
                  className="text-[#959595] hover:text-foreground cursor-pointer flex-shrink-0"
                >
                  <Copy className="w-[14px] h-[14px]" />
                </button>
              </div>
            </div>

            <div className="flex gap-[36px] items-center">
              <label className="body-text2-400 text-[#959595] min-w-[120px]">
                Network
              </label>
              <select
                value={chainFilter || ""}
                onChange={(e) => {
                  setChainFilter(e.target.value || null);
                  setStakeRecordsPage(1);
                }}
                className="px-[12px] py-[8px] rounded-[8px] border border-[#EBEBEB] bg-white body-text2-400 text-foreground focus:outline-none focus:border-primary"
              >
                <option value="">All Network</option>
                <option value="1">BSC</option>
                <option value="2">Polygon</option>
              </select>
            </div>

            <div className="flex gap-[36px] items-center">
              <label className="body-text2-400 text-[#959595] min-w-[120px]">
                Rankings
              </label>
              <div className="flex items-center gap-[6px]">
                <Award className="w-[14px] h-[14px] text-primary" />
                <span className="body-text2-400 text-foreground">
                  #{selectedNode.rank ?? "—"}
                </span>
              </div>
            </div>

            <div className="flex gap-[36px] items-center">
              <label className="body-text2-400 text-[#959595] min-w-[120px]">
                Stake amount
              </label>
              <span className="body-text2-400 text-foreground">
                {parseFloat(selectedNode.ledgeAmount || "0").toFixed(4)} LUCA
              </span>
            </div>
          </div>

          {/* Tabs + Actions */}
          <div className="flex gap-[12px] items-center justify-between border-b border-[#F0F0F0] pb-[12px]">
            <div className="flex gap-[48px]">
              {([1, 2] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setStakeTab(tab);
                    setStakeRecordsPage(1);
                  }}
                  className={`body-text1-500 pb-[4px] border-b-2 transition-colors cursor-pointer ${
                    stakeTab === tab
                      ? "text-primary border-primary"
                      : "text-[#959595] border-transparent hover:text-foreground"
                  }`}
                >
                  {tab === 1 ? "LUCA" : "Consensus contract"}
                </button>
              ))}
            </div>
            <div className="flex gap-[8px]">
              <button
                onClick={() => {
                  setError(null);
                  setStakeAmount("");
                  setPageView("stake");
                }}
                disabled={!isAuthenticated || !isNetworkSupported}
                className="flex items-center justify-center gap-[6px] px-[16px] py-[10px] bg-primary text-white rounded-full body-text2-400 transition-colors disabled:opacity-50 hover:bg-primary/90 cursor-pointer"
              >
                <Zap className="w-[14px] h-[14px]" />
                Stake mining
              </button>
              <button
                onClick={() => {
                  setError(null);
                  setPageView("batch");
                }}
                disabled={!isAuthenticated || !isNetworkSupported}
                className="flex items-center justify-center gap-[6px] px-[16px] py-[10px] text-primary border border-primary rounded-full body-text2-400 transition-colors disabled:opacity-50 hover:bg-primary/5 cursor-pointer"
              >
                Batch redemption
              </button>
            </div>
          </div>

          {/* Stake Records */}
          {stakeRecordsLoading ? (
            <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              <p className="body-text2-400 text-[#959595]">
                Loading stake records...
              </p>
            </div>
          ) : stakeRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
              <Server className="w-10 h-10 text-[#959595]" />
              <p className="body-text2-400 text-[#959595]">No data</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#fcfcfc]">
                    <tr>
                      <th className="px-[16px] py-[12px] text-left body-text2-400 text-[#959595] font-normal">
                        Stake amount
                      </th>
                      <th className="px-[16px] py-[12px] text-left body-text2-400 text-[#959595] font-normal">
                        Stake time
                      </th>
                      {stakeTab === 2 && (
                        <th className="px-[16px] py-[12px] text-left body-text2-400 text-[#959595] font-normal">
                          Consensus Link
                        </th>
                      )}
                      <th className="px-[16px] py-[12px] text-left body-text2-400 text-[#959595] font-normal">
                        Network
                      </th>
                      <th className="px-[16px] py-[12px] text-left body-text2-400 text-[#959595] font-normal">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F0F0]">
                    {stakeRecords.map((record, index) => (
                      <tr
                        key={index}
                        className="hover:bg-[#FAFAFA] transition-colors"
                      >
                        <td className="px-[16px] py-[14px] body-text2-400 text-foreground">
                          {parseFloat(record.ledgeAmount).toFixed(4)} LUCA
                        </td>
                        <td className="px-[16px] py-[14px] body-text2-400 text-foreground">
                          {formatTime(record.ledgeTime)}
                        </td>
                        {stakeTab === 2 && (
                          <td className="px-[16px] py-[14px]">
                            <button
                              onClick={() =>
                                copyToClipboard(record.linkAddress || "")
                              }
                              className="body-text2-400 text-primary hover:underline cursor-pointer"
                            >
                              {formatAddress(record.linkAddress || "")}
                            </button>
                          </td>
                        )}
                        <td className="px-[16px] py-[14px] body-text2-400 text-foreground">
                          {getChainName(record.chainId)}
                        </td>
                        <td className="px-[16px] py-[14px]">
                          <button
                            onClick={() => {
                              setSelectedStakeRecord(record);
                              setError(null);
                              setShowRedeemModal(true);
                            }}
                            className="body-text2-400 text-primary border-b border-primary hover:text-primary/80 cursor-pointer transition-colors"
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {stakeRecordsTotalPages > 1 && (
                <div className="px-[16px] py-[12px] flex items-center justify-between mt-[16px]">
                  <p className="body-text2-400 text-[#959595]">
                    Showing{" "}
                    {(stakeRecordsPage - 1) * stakeRecordsPerPage + 1} to{" "}
                    {Math.min(
                      stakeRecordsPage * stakeRecordsPerPage,
                      stakeRecordsTotalCount
                    )}{" "}
                    of {stakeRecordsTotalCount} records
                  </p>
                  <div className="flex gap-[8px]">
                    <button
                      onClick={() =>
                        setStakeRecordsPage((p) => Math.max(p - 1, 1))
                      }
                      disabled={stakeRecordsPage === 1}
                      className="px-[12px] py-[4px] border border-[#EBEBEB] rounded body-text2-400 text-foreground disabled:opacity-40 hover:bg-[#F0F0F0] transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-[12px] py-[4px] bg-primary/10 text-primary rounded body-text2-400 font-medium">
                      {stakeRecordsPage}
                    </span>
                    <button
                      onClick={() =>
                        setStakeRecordsPage((p) =>
                          Math.min(stakeRecordsTotalPages, p + 1)
                        )
                      }
                      disabled={
                        stakeRecordsPage * stakeRecordsPerPage >=
                        stakeRecordsTotalCount
                      }
                      className="px-[12px] py-[4px] border border-[#EBEBEB] rounded body-text2-400 text-foreground disabled:opacity-40 hover:bg-[#F0F0F0] transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Redeem Confirmation Modal */}
        {showRedeemModal && selectedStakeRecord && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[10px] max-w-md w-full">
              <div className="p-[24px] border-b border-[#F0F0F0] flex items-center justify-between">
                <h3 className="body-text1-500 text-foreground">
                  Confirm Redemption
                </h3>
                <button
                  onClick={() => {
                    if (!isRedeeming) {
                      setShowRedeemModal(false);
                      setError(null);
                    }
                  }}
                  disabled={isRedeeming}
                  className="text-[#959595] hover:text-foreground disabled:opacity-50 cursor-pointer"
                >
                  <X className="w-[18px] h-[18px]" />
                </button>
              </div>

              <div className="p-[24px] space-y-[16px]">
                {error && (
                  <div className="flex items-start gap-[8px] p-[12px] bg-red-50 border border-red-200 rounded-[8px]">
                    <AlertTriangle className="w-[16px] h-[16px] text-red-600 flex-shrink-0 mt-[2px]" />
                    <p className="body-text2-400 text-red-700">{error}</p>
                  </div>
                )}

                {isRedeeming && (
                  <div className="flex items-center gap-[8px] p-[12px] bg-primary/5 border border-primary/20 rounded-[8px]">
                    <RefreshCw className="w-[16px] h-[16px] text-primary animate-spin" />
                    <p className="body-text2-400 text-primary">
                      Processing redemption...
                    </p>
                  </div>
                )}

                <p className="body-text2-400 text-foreground">
                  Are you sure you want to redeem{" "}
                  <span className="font-medium">
                    {parseFloat(selectedStakeRecord.ledgeAmount).toFixed(4)} LUCA
                  </span>{" "}
                  from this stake? The corresponding stake income cannot be
                  obtained after redemption.
                </p>

                <div className="flex gap-[12px] pt-[8px]">
                  <button
                    onClick={() => {
                      if (!isRedeeming) {
                        setShowRedeemModal(false);
                        setError(null);
                      }
                    }}
                    disabled={isRedeeming}
                    className="flex-1 px-[16px] py-[10px] bg-[#F0F0F0] text-foreground rounded-[8px] body-text-400 hover:bg-[#E0E0E0] disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRedeem}
                    disabled={isRedeeming}
                    className="flex-1 px-[16px] py-[10px] bg-red-600 text-white rounded-[8px] body-text-400 hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-[6px]"
                  >
                    {isRedeeming ? (
                      <>
                        <RefreshCw className="w-[14px] h-[14px] animate-spin" />
                        Redeeming...
                      </>
                    ) : (
                      "Confirm Redeem"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── Stake View ──────────────────────────────────────────────────────────── */

  if (pageView === "stake" && selectedNode) {
    return (
      <div className="space-y-[20px]">
        <BackButton />

        <div className="bg-white rounded-[15px] p-[24px] space-y-[24px]">
          <h3 className="body-text1-500 text-foreground">PR node Stake</h3>

          <div className="space-y-[8px]">
            <div className="flex items-center gap-[80px] pb-[24px]">
              <label className="body-text2-400 text-[#959595] min-w-[120px]">
                Stake node
              </label>
              <div className="flex items-center gap-[8px]">
                <span className="body-text2-400 text-foreground font-mono">
                  {formatAddress(selectedNode.serverAddress)}
                </span>
                <button
                  onClick={() => copyToClipboard(selectedNode.serverAddress)}
                  className="text-[#959595] hover:text-foreground cursor-pointer"
                >
                  <Copy className="w-[14px] h-[14px]" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-[48px] pb-[24px]">
              <label className="body-text2-400 text-[#959595] min-w-[120px]">
                Server nickname
              </label>
              <span className="body-text2-400 text-foreground">
                {selectedNode.serverNickname || "—"}
              </span>
            </div>

            <div className="flex items-center gap-[96px] pb-[24px]">
              <label className="body-text2-400 text-[#959595] min-w-[120px]">
                Rankings
              </label>
              <div className="flex items-center gap-[6px]">
                <Award className="w-[14px] h-[14px] text-primary" />
                <span className="body-text2-400 text-foreground">
                  #{selectedNode.rank ?? "—"}
                </span>
              </div>
            </div>

            <div className="flex gap-[64px]">
              <label className="body-text2-400 text-[#959595] min-w-[120px]">
                Stake amount
              </label>
              <div className="flex-1">
                <div className="relative w-full max-w-[500px]">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => {
                      setStakeAmount(e.target.value);
                      setError(null);
                    }}
                    disabled={isStaking || isApproving}
                    placeholder={`Balance: ${parseFloat(userBalance).toFixed(4)} LUCA`}
                    min="0.0001"
                    step="0.0001"
                    max={userBalance}
                    className="w-full px-[12px] py-[10px] pr-[56px] border border-[#EBEBEB] rounded-[8px] bg-[#F8F8F8] body-text1-400 text-foreground placeholder:text-[#878787] focus:outline-none focus:border-primary disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-[12px] top-1/2 -translate-y-1/2 body-text2-400 text-[#959595]">
                    LUCA
                  </span>
                </div>
                <p className="mt-[20px] body-text2-400 text-orange-400">
                  Tips: The stake deposit amount needs to be greater than 0.0001
                  LUCA to get rewards
                </p>
              </div>
            </div>

            {error && (
              <div className="p-[12px] bg-red-50 border border-red-200 rounded-[8px]">
                <div className="flex items-center gap-[8px] text-red-700">
                  <AlertTriangle className="w-[14px] h-[14px]" />
                  <span className="body-text2-400">{error}</span>
                </div>
              </div>
            )}

            {(isApproving || isStaking) && (
              <div className="p-[12px] bg-primary/5 border border-primary/20 rounded-[8px]">
                <div className="flex items-center gap-[8px] text-primary">
                  <RefreshCw className="w-[14px] h-[14px] animate-spin" />
                  <span className="body-text2-400">
                    {isApproving
                      ? "Approving LUCA... Please confirm in your wallet"
                      : "Staking in progress... Please confirm the transaction"}
                  </span>
                </div>
              </div>
            )}

            {!isNetworkSupported && (
              <div className="p-[12px] bg-orange-50 border border-orange-200 rounded-[8px]">
                <div className="flex items-center gap-[8px] text-orange-700">
                  <AlertTriangle className="w-[14px] h-[14px]" />
                  <span className="body-text2-400">
                    Please switch to Binance Smart Chain
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-[12px]">
            <button
              onClick={handleStake}
              disabled={
                !isAuthenticated ||
                !isNetworkSupported ||
                !stakeAmount ||
                parseFloat(stakeAmount || "0") <= 0 ||
                isStaking ||
                isApproving
              }
              className="flex items-center gap-[8px] px-[20px] py-[12px] border-2 border-primary rounded-full text-primary body-text-400 disabled:opacity-50 transition-colors hover:bg-primary/5 cursor-pointer"
            >
              {isApproving ? (
                <>
                  <RefreshCw className="w-[14px] h-[14px] animate-spin" />
                  Approving...
                </>
              ) : isStaking ? (
                <>
                  <RefreshCw className="w-[14px] h-[14px] animate-spin" />
                  Staking...
                </>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Batch Redemption View ───────────────────────────────────────────────── */

  if (pageView === "batch" && selectedNode) {
    return (
      <div className="space-y-[20px]">
        <BackButton />

        <div className="bg-white rounded-[15px] p-[24px] space-y-[24px]">
          <h3 className="body-text1-500 text-foreground">
            Batch PR node redemption
          </h3>

          <div className="space-y-[8px]">
            <div className="flex items-center gap-[40px] pb-[24px]">
              <label className="body-text2-400 text-[#959595] min-w-[120px]">
                Stake node
              </label>
              <div className="flex items-center gap-[8px]">
                <span className="body-text2-400 text-foreground font-mono">
                  {formatAddress(selectedNode.serverAddress)}
                </span>
                <button
                  onClick={() => copyToClipboard(selectedNode.serverAddress)}
                  className="text-[#959595] hover:text-foreground cursor-pointer"
                >
                  <Copy className="w-[14px] h-[14px]" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-[48px] pb-[24px]">
              <label className="body-text2-400 text-[#959595] min-w-[120px]">
                Stake method
              </label>
              <span className="body-text2-400 text-foreground">LUCA</span>
            </div>

            <div className="flex items-center gap-[20px] pb-[24px]">
              <label className="body-text2-400 text-[#959595] min-w-[120px]">
                Redemption amount
              </label>
              <span className="body-text2-400 text-foreground">
                0 LUCA
              </span>
            </div>

            <p className="body-text2-400 text-destructive">
              Batch redemption only supports one-time redemption of all Tokens
              directly staked through LUCA, and the corresponding stake income
              cannot be obtained after redemption.
            </p>

            {error && (
              <div className="p-[12px] bg-red-50 border border-red-200 rounded-[8px]">
                <div className="flex items-center gap-[8px] text-red-700">
                  <AlertTriangle className="w-[14px] h-[14px]" />
                  <span className="body-text2-400">{error}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-[12px]">
            <button
              onClick={async () => {
                if (!walletProvider || !address || !chainId) {
                  setError("Please connect your wallet first");
                  return;
                }
                const contracts = getChainContracts(chainId);
                const pledgeAddress =
                  contracts?.prNodeStake || contracts?.pledger;
                if (!pledgeAddress) {
                  setError(
                    "Pledge contract not found for this network"
                  );
                  return;
                }
                setError(null);
                setIsStaking(true);
                try {
                  await sendCancleStakeLuca(
                    walletProvider,
                    address,
                    pledgeAddress,
                    []
                  );
                  setPageView("detail");
                } catch (err: any) {
                  const msg = err.message || "";
                  setError(
                    msg.includes("rejected") || err.code === 4001
                      ? "Transaction cancelled by user."
                      : `Batch redemption failed: ${msg}`
                  );
                } finally {
                  setIsStaking(false);
                }
              }}
              disabled={isStaking}
              className="flex items-center gap-[8px] px-[20px] py-[12px] border-2 border-primary rounded-full text-primary body-text-400 disabled:opacity-50 transition-colors hover:bg-primary/5 cursor-pointer"
            >
              {isStaking ? (
                <>
                  <RefreshCw className="w-[14px] h-[14px] animate-spin" />
                  Redeeming...
                </>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Recovery views (placeholder structure) ──────────────────────────────── */

  if (pageView === "recoveryStake" && selectedRecovery) {
    return (
      <div className="space-y-[20px]">
        <BackButton />
        <div className="bg-white rounded-[15px] p-[24px]">
          <h3 className="body-text1-500 text-foreground mb-[40px]">
            Recovery staking
          </h3>
        </div>
      </div>
    );
  }

  if (pageView === "recoveryDetail" && selectedRecovery) {
    return (
      <div className="space-y-[20px]">
        <BackButton />
        <div className="bg-white rounded-[15px] p-[24px]">
          <h3 className="body-text1-500 text-foreground mb-[32px]">
            Recovery staking details
          </h3>
        </div>
      </div>
    );
  }

  /* ── Main List View ──────────────────────────────────────────────────────── */

  return (
    <div className="space-y-[20px]">
      {/* Recovery Staking Section */}
      <div className="bg-white rounded-[15px] overflow-hidden pb-[40px]">
        <div className="px-[24px] py-[20px]">
          <h2 className="body-text1-400 text-foreground">Recovery staking</h2>
          <div className="mt-[4px] body-text2-400 text-foreground">
            Investors can buy LUCA tokens, stake them in the recovery plan, and
            receive additional rewards.{" "}
            <span className="relative group inline-block">
              <a
                href="#"
                className="text-primary body-text2-400 border-b border-primary"
              >
                Learn more
              </a>
              <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-[320px] -translate-x-1/2 rounded-[5px] bg-background px-[16px] py-[12px] body-text2-400 text-foreground opacity-0 shadow-lg border border-foreground transition-opacity duration-200 group-hover:opacity-100">
                Starting today, as a token of appreciation for their support,
                they can also purchase LUCA tokens at a 30% discount through
                90-day options, with this benefit spread over the next eight
                years and an annual limit of 1 million tokens. Recovery Staking
                is only supported on the BSC chain.
              </div>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fcfcfc]">
              <tr>
                {[
                  "Staking contract",
                  "Server",
                  "Total amount staked (LUCA)",
                  "Stake amount (LUCA)",
                  "Staking limit (LUCA)",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-[16px] py-[12px] text-left body-text2-400 text-[#959595] font-normal"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-[#FAFAFA] transition-colors">
                <td className="px-[16px] py-[14px] body-text2-400 text-foreground">
                  0xcBa0D4bd0A6aDadA793592823524C1Ccb670EcD1
                </td>
                <td className="px-[16px] py-[14px] body-text2-400 text-foreground">
                  Recovery
                </td>
                <td className="px-[16px] py-[14px] body-text2-400 text-foreground">
                  2
                </td>
                <td className="px-[16px] py-[14px] body-text2-400 text-foreground">
                  0
                </td>
                <td className="px-[16px] py-[14px] body-text2-400 text-foreground">
                  0/0
                </td>
                <td className="px-[16px] py-[14px]">
                  <div className="flex gap-[8px]">
                    <button
                      onClick={() => {
                        setSelectedRecovery({
                          contractAddress:
                            "0xcBa0D4bd0A6aDadA793592823524C1Ccb670EcD1",
                          name: "Recovery",
                          totalStaked: "2",
                          userStaked: "0",
                          limit: "0/0",
                        });
                        setPageView("recoveryStake");
                      }}
                      className="body-text2-400 text-primary border-b border-primary hover:text-primary/80 cursor-pointer transition-colors"
                    >
                      Stake
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRecovery({
                          contractAddress:
                            "0xcBa0D4bd0A6aDadA793592823524C1Ccb670EcD1",
                          name: "Recovery",
                          totalStaked: "2",
                          userStaked: "0",
                          limit: "0/0",
                        });
                        setPageView("recoveryDetail");
                      }}
                      className="body-text2-400 text-primary border-b border-primary hover:text-primary/80 cursor-pointer transition-colors"
                    >
                      View details
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* PR Node Staking Section */}
      <div className="bg-white rounded-[15px] overflow-hidden">
        <div className="px-[24px] py-[20px]">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="body-text1-400 text-foreground">
                PR node staking
              </h2>
              <div className="mt-[4px] body-text2-400 text-foreground">
                Staking PR nodes can get staking rewards.{" "}
                <span className="relative group inline-block">
                  <a
                    href="#"
                    className="text-primary body-text2-400 border-b border-primary"
                  >
                    Learn more
                  </a>
                  <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-[325px] -translate-x-1/2 rounded-[5px] bg-background px-[16px] py-[12px] body-text2-400 text-foreground opacity-0 shadow-lg border border-foreground transition-opacity duration-200 group-hover:opacity-100">
                    The top 11 servers with the largest stake amount are
                    selected to jointly execute PageRank algorithm and calculate
                    the PR value of all users in the ATM network. Users and
                    server operators who participate in the PageRank computing
                    server stake will receive corresponding stake rewards.
                  </div>
                </span>
              </div>
            </div>
            <div>
              <select
                value={chainFilter || ""}
                onChange={(e) => {
                  setChainFilter(e.target.value || null);
                  setCurrentPage(1);
                }}
                className="px-[12px] py-[10px] rounded-[5px] border border-[#EBEBEB] bg-white body-text2-400 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">All Network</option>
                <option value="1">BSC</option>
                <option value="2">Polygon</option>
              </select>
            </div>
          </div>
        </div>

        {nodesLoading ? (
          <div className="flex flex-col items-center justify-center py-[80px] gap-[12px]">
            <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            <p className="body-text2-400 text-[#959595]">Loading PR nodes...</p>
          </div>
        ) : nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[80px] gap-[12px]">
            <Server className="w-12 h-12 text-[#959595]" />
            <h3 className="body-text1-400 text-foreground">No PR Nodes Found</h3>
            <p className="body-text2-400 text-[#959595]">
              {searchKey
                ? "Try adjusting your search criteria"
                : "No PR nodes available at the moment"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#fcfcfc]">
                  <tr>
                    {[
                      "Rank",
                      "PR node",
                      "Server",
                      "Server IP",
                      "Stake Amount",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-[16px] py-[12px] text-left body-text2-400 text-[#959595] font-normal"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {nodes.map((node, index) => (
                    <tr
                      key={node.serverAddress || index}
                      className="hover:bg-[#FAFAFA] transition-colors"
                    >
                      <td className="px-[16px] py-[14px]">
                        <div className="flex items-center gap-[6px]">
                          <Award className="w-[14px] h-[14px] text-primary" />
                          <span className="body-text2-400 text-foreground font-medium">
                            #{node.rank ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-[16px] py-[14px] body-text2-400 text-foreground">
                        {formatAddress(node.serverAddress)}
                      </td>
                      <td className="px-[16px] py-[14px] body-text2-400 text-foreground">
                        {node.serverNickname || "—"}
                      </td>
                      <td className="px-[16px] py-[14px] body-text2-400 text-foreground">
                        {node.serverIp || "—"}
                      </td>
                      <td className="px-[16px] py-[14px] body-text2-400 text-foreground">
                        {node.ledgeAmount} LUCA
                      </td>
                      <td className="px-[16px] py-[14px]">
                        <div className="flex gap-[8px]">
                          <button
                            onClick={() => {
                              setSelectedNode(node);
                              setError(null);
                              setStakeAmount("");
                              setPageView("stake");
                            }}
                            className="body-text2-400 text-primary border-b border-primary hover:text-primary/80 cursor-pointer transition-colors"
                          >
                            Stake
                          </button>
                          <button
                            onClick={() => {
                              setSelectedNode(node);
                              setStakeTab(1);
                              setStakeRecordsPage(1);
                              setPageView("detail");
                            }}
                            className="body-text2-400 text-primary border-b border-primary hover:text-primary/80 cursor-pointer transition-colors"
                          >
                            View details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-[16px] py-[12px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px]">
            <p className="body-text2-400 text-[#959595] text-center sm:text-left">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
              {totalCount} results
            </p>
            <div className="flex justify-center gap-[8px]">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-[12px] py-[4px] border border-[#EBEBEB] rounded body-text2-400 text-foreground disabled:opacity-40 hover:bg-[#F0F0F0] transition-colors"
              >
                Previous
              </button>
              <span className="px-[12px] py-[4px] bg-primary/10 text-primary rounded body-text2-400 font-medium">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage * itemsPerPage >= totalCount}
                className="px-[12px] py-[4px] border border-[#EBEBEB] rounded body-text2-400 text-foreground disabled:opacity-40 hover:bg-[#F0F0F0] transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
