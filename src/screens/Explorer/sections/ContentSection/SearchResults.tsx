import * as React from "react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { useTranslation } from "react-i18next";
import {
  fetchConsensusContractList,
  fetchPRNodes,
  fetchStakeTransactions,
  ConsensusConnectionItem,
  PRNodeItem,
  StakeTransactionItem,
} from "@/lib/webApi";

// -------------------- UTILS --------------------
const formatTime = (value: string | number | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const copyToClipboard = (text: string | undefined) => {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => alert("Copied!"));
};

const getStakeMethod = (ledgeType: number | undefined, t: any) => {
  return ledgeType === 1
    ? t("stake.stakeMethod.lucaStake")
    : t("stake.stakeMethod.consensusContract");
};

const getStatusText = (status: number | undefined, t: any) => {
  if (!status) return "Unknown";
  const statusMap: { [key: number]: string } = {
    1: t("consensus.status.pending"),
    2: t("consensus.status.connected"),
    3: t("consensus.status.waiting"),
    4: t("consensus.status.cancelled"),
    5: t("consensus.status.disconnected"),
  };
  return statusMap[status] || "Unknown";
};

const getPageNumbers = (currentPage: number, totalPages: number) => {
  const pages: (number | string)[] = [];
  const maxVisible = 2;
  if (totalPages <= maxVisible + 2) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (currentPage <= maxVisible) {
      for (let i = 1; i <= maxVisible; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - maxVisible + 1) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++)
        pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }
  }
  return pages;
};

const hideAddress = (address: string | undefined) => {
  return address
    ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
    : "";
};

// -------------------- HOOK --------------------
function usePaginatedSearch<T>(
  fetchFn: (
    page: number,
    pageSize: number
  ) => Promise<{ data: T[]; total: number }>,
  filterFn: (item: T) => boolean,
  searchQuery: string,
  isValidInput: boolean
) {
  const [allData, setAllData] = useState<T[]>([]);
  const [displayData, setDisplayData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isSearchComplete, setIsSearchComplete] = useState(false);

  const itemsPerPage = 10;

  const searchAllData = async () => {
    if (!isValidInput || !searchQuery) {
      setAllData([]);
      setDisplayData([]);
      setTotal(0);
      setIsSearchComplete(true);
      return;
    }

    setLoading(true);
    setError(null);
    setIsSearchComplete(false);

    try {
      let allResults: T[] = [];
      let currentPage = 1;
      const batchSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const result = await fetchFn(currentPage, batchSize);

        if (result.data && result.data.length > 0) {
          const filtered = result.data.filter(filterFn);
          allResults = [...allResults, ...filtered];

          setAllData(allResults);
          setTotal(allResults.length);

          const startIndex = 0;
          const endIndex = itemsPerPage;
          setDisplayData(allResults.slice(startIndex, endIndex));

          if (
            result.data.length < batchSize ||
            currentPage * batchSize >= result.total
          ) {
            hasMore = false;
          } else {
            currentPage++;
          }
        } else {
          hasMore = false;
        }
      }

      setIsSearchComplete(true);
    } catch (err) {
      console.error(err);
      setError("Error loading data");
      setIsSearchComplete(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    searchAllData();
  }, [searchQuery, isValidInput]);

  useEffect(() => {
    if (allData.length > 0) {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setDisplayData(allData.slice(startIndex, endIndex));
    }
  }, [page, allData]);

  return {
    data: displayData,
    loading,
    error,
    page,
    total,
    setPage,
    isSearchComplete,
  };
}

// -------------------- COMPONENTS --------------------
interface PaginationWrapperProps {
  currentPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

const PaginationWrapper: React.FC<PaginationWrapperProps> = ({
  currentPage,
  total,
  onPageChange,
}) => {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(total / itemsPerPage);
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center bg-card md:bg-background py-10">
      <Pagination>
        <PaginationContent className="inline-flex items-center gap-[10px] md:gap-[35px] px-[9px] py-[10px] rounded-[40px] border border-solid border-border dark:border-primary-foreground">
          <img
            src="/arrow-left-icon.svg"
            onClick={() => handlePageChange(currentPage - 1)}
            className="w-5 h-5 cursor-pointer"
          />
          {pages.map((page, idx) =>
            page === "..." ? (
              <PaginationItem key={idx}>
                <div className="flex w-[30px] md:w-[35px] items-center justify-center text-[12px] md:text-[14px] text-gray-400">
                  ...
                </div>
              </PaginationItem>
            ) : (
              <PaginationItem key={idx}>
                <div
                  onClick={() => handlePageChange(Number(page))}
                  className={`flex w-[30px] md:w-[35px] items-center justify-center text-[12px] md:text-[14px] cursor-pointer ${
                    page === currentPage ? "text-primary" : "text-foreground"
                  }`}
                >
                  {page}
                </div>
              </PaginationItem>
            )
          )}
          <img
            src="/arrow-right-icon-3.svg"
            onClick={() => handlePageChange(currentPage + 1)}
            className="w-7 h-7 bg-[#e9f6f7] rounded-full cursor-pointer p-1"
          />
        </PaginationContent>
      </Pagination>
    </div>
  );
};

// -------------------- MAIN COMPONENT --------------------
interface SearchResultsProps {
  searchQuery: string;
  searchType: string;
  isValidInput: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchQuery,
  isValidInput,
}) => {
  const { t } = useTranslation("explorer");

  const consensus = usePaginatedSearch<ConsensusConnectionItem>(
    async (page, pageSize) => {
      const result = await fetchConsensusContractList({
        pageNo: page,
        pageSize: pageSize,
        linkCurrency: undefined,
        chainId: null,
        consensusType: "1",
      });
      return { data: result.data || [], total: result.total || 0 };
    },
    (item) =>
      (item.createHash?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (item.createAddress?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (item.targetAddress?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (item.linkAddress?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ),
    searchQuery,
    isValidInput
  );

  const prNode = usePaginatedSearch<PRNodeItem>(
    async (page, pageSize) => {
      const result = await fetchPRNodes(page, pageSize);
      return { data: result.data || [], total: result.total || 0 };
    },
    (item) =>
      (item.serverAddress?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ),
    searchQuery,
    isValidInput
  );

  const stake = usePaginatedSearch<StakeTransactionItem>(
    async (page, pageSize) => {
      const result = await fetchStakeTransactions(page, pageSize, null);
      return { data: result.data || [], total: result.total || 0 };
    },
    (item) =>
      (item.hash?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.userAddress?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (item.serverAddress?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ),
    searchQuery,
    isValidInput
  );

  const [selectedConsensus, setSelectedConsensus] =
    useState<ConsensusConnectionItem | null>(null);
  const [selectedPR, setSelectedPR] = useState<PRNodeItem | null>(null);
  const [selectedStake, setSelectedStake] =
    useState<StakeTransactionItem | null>(null);

  const renderNoData = () => (
    <div className="h-96 flex items-center justify-center text-card-foreground">
      {isValidInput ? t("search.noResults") : t("search.invalidInput")}
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="dark:bg-card rounded-2xl px-[20px] py-[15px]">
        <Tabs defaultValue="consensus" className="w-full">
          <TabsList className="flex gap-0 bg-transparent h-auto p-0 whitespace-nowrap flex-nowrap w-max mb-6">
            <TabsTrigger
              value="consensus"
              className="px-3 py-2 h-auto bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-lg transition-colors whitespace-nowrap text-sm font-normal text-card-foreground data-[state=active]:text-primary data-[state=active]:bg-primary/10"
            >
              {t("search.tabs.consensusConnection")}
            </TabsTrigger>
            <TabsTrigger
              value="pr-node"
              className="px-3 py-2 h-auto bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-lg transition-colors whitespace-nowrap text-sm font-normal text-card-foreground data-[state=active]:text-primary data-[state=active]:bg-primary/10"
            >
              {t("search.tabs.prNode")}
            </TabsTrigger>
            <TabsTrigger
              value="stake"
              className="px-3 py-2 h-auto bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-lg transition-colors whitespace-nowrap text-sm font-normal text-card-foreground data-[state=active]:text-primary data-[state=active]:bg-primary/10"
            >
              {t("search.tabs.stakeTransaction")}
            </TabsTrigger>
          </TabsList>

          {/* Consensus Connection */}
          <TabsContent value="consensus">
            {consensus.loading && consensus.data.length === 0 ? (
              <div className="h-96 flex items-center justify-center">
                {t("consensus.loading")}
              </div>
            ) : consensus.error ? (
              <div className="h-96 flex items-center justify-center text-red-500">
                {consensus.error}
              </div>
            ) : consensus.data.length === 0 && consensus.isSearchComplete ? (
              renderNoData()
            ) : selectedConsensus ? (
              <div className="dark:bg-card rounded-[10px] p-4 md:p-5 w-full">
                <div className="flex items-center gap-2 text-sm mb-10">
                  <img
                    src="/arrow-left-icon.svg"
                    className="h-[20px] w-[20px] cursor-pointer"
                    onClick={() => setSelectedConsensus(null)}
                    loading="lazy"
                  />
                  <h2 className="text-[14px] leading-[19px] font-normal">
                    {t("consensus.title")}
                  </h2>
                </div>
                <div className="grid md:grid-cols-[180px_1fr] gap-y-1 md:gap-y-4 text-[14px] leading-[19px] text-foreground">
                  <div className="text-card-foreground md:text-foreground">
                    {t("consensus.details.hash")}
                  </div>
                  <div className="truncate max-w-[300px] md:max-w-full">
                    {selectedConsensus.createHash || ""}
                  </div>

                  <hr className="md:hidden my-2 dark:border-[#454545]" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("consensus.details.network")}
                  </div>
                  <div>{selectedConsensus.chainNetWork || ""}</div>

                  <hr className="md:hidden my-2 dark:border-[#454545]" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("consensus.details.status")}
                  </div>
                  <div>{getStatusText(selectedConsensus.linkStatus, t)}</div>

                  <hr className="md:hidden my-2 dark:border-[#454545]" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("consensus.details.creationTime")}
                  </div>
                  <div>{formatTime(selectedConsensus.createTime)}</div>

                  <hr className="md:hidden my-2 dark:border-[#454545]" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("consensus.details.connectionQuantity")}
                  </div>
                  <div>
                    {selectedConsensus.amount || ""}{" "}
                    {selectedConsensus.linkCurrency || ""}
                  </div>

                  <hr className="md:hidden my-2 dark:border-[#454545]" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("consensus.details.initiator")}
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="truncate max-w-[300px] md:max-w-full">
                      {selectedConsensus.createAddress || ""}
                    </span>
                    <img
                      src="/copy.svg"
                      onClick={() =>
                        copyToClipboard(selectedConsensus.createAddress)
                      }
                      className="cursor-pointer"
                      loading="lazy"
                    />
                  </div>

                  <hr className="md:hidden my-2 dark:border-[#454545]" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("consensus.details.receiver")}
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="truncate max-w-[300px] md:max-w-full">
                      {selectedConsensus.targetAddress || ""}
                    </span>
                    <img
                      src="/copy.svg"
                      onClick={() =>
                        copyToClipboard(selectedConsensus.targetAddress)
                      }
                      className="cursor-pointer"
                      loading="lazy"
                    />
                  </div>

                  <hr className="md:hidden my-2 dark:border-[#454545]" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("consensus.details.connectionContract")}
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="truncate max-w-[300px] md:max-w-full">
                      {selectedConsensus.linkAddress || ""}
                    </span>
                    <img
                      src="/copy.svg"
                      onClick={() =>
                        copyToClipboard(selectedConsensus.linkAddress)
                      }
                      className="cursor-pointer"
                      loading="lazy"
                    />
                  </div>

                  <hr className="md:hidden my-2 dark:border-[#454545]" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("consensus.details.lockTime")}
                  </div>
                  <div>
                    {selectedConsensus.lockedDay || ""}{" "}
                    {t("consensus.details.days")}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full dark:bg-card rounded-lg overflow-hidden">
                    <thead className="bg-[#F6F6F6] dark:bg-[#434352]">
                      <tr>
                        <th className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal">
                          {t("consensus.columns.hash")}
                        </th>
                        <th className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal">
                          {t("consensus.columns.initiator")}
                        </th>
                        <th className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal">
                          {t("consensus.columns.receiver")}
                        </th>
                        <th className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal">
                          {t("consensus.columns.connectionQuantity")}
                        </th>
                        <th className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal">
                          {t("consensus.columns.time")}
                        </th>
                        <th className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal">
                          {t("consensus.columns.action")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {consensus.data.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-sm truncate max-w-[180px]">
                            {hideAddress(row.createHash)}
                          </td>
                          <td className="px-4 py-3 text-sm truncate max-w-[180px]">
                            <div className="flex gap-[15px]">
                              <div className="truncate max-w-[180px]">
                                {hideAddress(row.createAddress)}
                              </div>
                              <div>
                                <img
                                  src="/table-arrow.svg"
                                  onClick={() => setSelectedConsensus(row)}
                                  className="cursor-pointer"
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm truncate max-w-[180px]">
                            {hideAddress(row.targetAddress)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {row.amount || ""} {row.linkCurrency || ""}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {formatTime(row.createTime)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              className="text-primary hover:underline"
                              onClick={() => setSelectedConsensus(row)}
                            >
                              {t("consensus.more")}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-3">
                  {consensus.data.map((row, idx) => (
                    <div
                      key={idx}
                      className="border-b dark:border-[#454545] p-3"
                    >
                      <div className="flex justify-between text-sm font-normal">
                        <span className="truncate max-w-[220px] text-card-foreground">
                          {hideAddress(row.createHash)}
                        </span>
                        <span
                          onClick={() => setSelectedConsensus(row)}
                          className="text-primary cursor-pointer"
                        >
                          {row.amount || ""} {row.linkCurrency || ""}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-normal mt-2">
                        <span className="text-card-foreground">
                          {t("consensus.columns.initiator")}:
                        </span>
                        <span className="truncate max-w-[250px]">
                          {hideAddress(row.createAddress)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-normal mt-2">
                        <span className="text-card-foreground">
                          {t("consensus.columns.receiver")}:
                        </span>
                        <span className="truncate max-w-[250px]">
                          {hideAddress(row.targetAddress)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {consensus.loading && !consensus.isSearchComplete && (
                  <div className="text-center py-4 text-sm text-card-foreground">
                    Loading more results... ({consensus.total}+ found so far)
                  </div>
                )}

                <PaginationWrapper
                  currentPage={consensus.page}
                  total={consensus.total}
                  onPageChange={consensus.setPage}
                />
              </>
            )}
          </TabsContent>

          {/* PR Nodes */}
          <TabsContent value="pr-node">
            {prNode.loading && prNode.data.length === 0 ? (
              <div className="h-96 flex items-center justify-center">
                {t("ranking.loading")}
              </div>
            ) : prNode.error ? (
              <div className="h-96 flex items-center justify-center text-red-500">
                {prNode.error}
              </div>
            ) : prNode.data.length === 0 && prNode.isSearchComplete ? (
              renderNoData()
            ) : selectedPR ? (
              <div className="dark:bg-card p-4 md:p-5 w-full">
                <div className="flex items-center gap-2 text-sm mb-10">
                  <img
                    src="/arrow-left-icon.svg"
                    className="h-[20px] w-[20px] cursor-pointer"
                    loading="lazy"
                    onClick={() => setSelectedPR(null)}
                  />
                  <h2 className="text-[14px] leading-[19px] font-normal">
                    {t("prNode.details.title")}
                  </h2>
                </div>
                <div className="grid md:grid-cols-[180px_1fr] gap-y-1 md:gap-y-4 text-[14px] leading-[19px] text-foreground">
                  <div className="text-card-foreground md:text-foreground">
                    {t("prNode.details.prNode")}
                  </div>
                  <div className="truncate max-w-full">
                    {selectedPR.serverAddress || ""}
                  </div>

                  <hr className="md:hidden my-2 dark:border-[#454545]" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("prNode.details.serverDomain")}
                  </div>
                  <div className="truncate max-w-full">
                    {selectedPR.serverUrl || ""}
                  </div>

                  <hr className="md:hidden my-2 dark:border-[#454545]" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("prNode.details.serverIP")}
                  </div>
                  <div>{selectedPR.serverIp || ""}</div>

                  <hr className="md:hidden my-2 dark:border-[#454545]" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("prNode.details.serverNickname")}
                  </div>
                  <div>{selectedPR.serverNickname || ""}</div>

                  <hr className="md:hidden my-2 dark:border-[#454545]" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("prNode.details.nodeRanking")}
                  </div>
                  <div>{selectedPR.rank || "N/A"}</div>

                  <hr className="md:hidden my-2 dark:border-[#454545]" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("prNode.details.stakeAmount")}
                  </div>
                  <div>{selectedPR.ledgeAmount || ""} LUCA</div>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full dark:bg-card rounded-lg overflow-hidden">
                    <thead className="bg-[#F6F6F6] dark:bg-[#434352]">
                      <tr>
                        <th className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal">
                          {t("prNode.columns.prNode")}
                        </th>
                        <th className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal">
                          {t("prNode.columns.serverDomain")}
                        </th>
                        <th className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal">
                          {t("prNode.columns.serverIP")}
                        </th>
                        <th className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal">
                          {t("prNode.columns.serverNickname")}
                        </th>
                        <th className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal">
                          {t("prNode.columns.stakeAmount")}
                        </th>
                        <th className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal">
                          {t("prNode.columns.action")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {prNode.data.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-sm truncate max-w-[180px]">
                            {hideAddress(row.serverAddress)}
                          </td>
                          <td className="px-4 py-3 text-sm truncate max-w-[180px]">
                            {row.serverUrl || ""}
                          </td>
                          <td className="px-4 py-3 text-sm truncate max-w-[180px]">
                            {row.serverIp || ""}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {row.serverNickname || ""}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {row.ledgeAmount || ""} LUCA
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              className="text-primary hover:underline"
                              onClick={() => setSelectedPR(row)}
                            >
                              {t("prNode.more")}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-3">
                  {prNode.data.map((row, idx) => (
                    <div
                      key={idx}
                      className="border-b dark:border-[#454545] p-3"
                    >
                      <div className="flex justify-between text-sm font-normal">
                        <span className="truncate max-w-[220px] text-card-foreground">
                          {row.serverNickname || ""}
                        </span>
                        <span>IP {row.serverIp || ""}</span>
                      </div>
                      <div className="flex justify-between gap-10 text-sm font-normal mt-2">
                        <span className="truncate max-w-[100px]">
                          {hideAddress(row.serverAddress)}
                        </span>
                        <span
                          onClick={() => setSelectedPR(row)}
                          className="truncate max-w-full text-primary cursor-pointer"
                        >
                          {row.ledgeAmount || ""} LUCA
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {prNode.loading && !prNode.isSearchComplete && (
                  <div className="text-center py-4 text-sm text-card-foreground">
                    Loading more results... ({prNode.total}+ found so far)
                  </div>
                )}

                <PaginationWrapper
                  currentPage={prNode.page}
                  total={prNode.total}
                  onPageChange={prNode.setPage}
                />
              </>
            )}
          </TabsContent>

          {/* Stake Transactions */}
          <TabsContent value="stake">
            {stake.loading && stake.data.length === 0 ? (
              <div className="h-96 flex items-center justify-center">
                {t("ranking.loading")}
              </div>
            ) : stake.error ? (
              <div className="h-96 flex items-center justify-center text-red-500">
                {stake.error}
              </div>
            ) : stake.data.length === 0 && stake.isSearchComplete ? (
              renderNoData()
            ) : selectedStake ? (
              <div className="dark:bg-card rounded-[10px] p-4 md:p-5 w-full">
                <div className="flex items-center gap-2 text-sm mb-10">
                  <img
                    src="/arrow-left-icon.svg"
                    className="h-[20px] w-[20px] cursor-pointer"
                    loading="lazy"
                    onClick={() => setSelectedStake(null)}
                  />
                  <h2 className="text-[14px] leading-[19px] font-normal">
                    {t("stake.details.title")}
                  </h2>
                </div>
                <div className="grid md:grid-cols-[180px_1fr] gap-y-1 md:gap-y-4 text-[14px] leading-[19px] text-foreground">
                  <div className="text-card-foreground md:text-foreground">
                    {t("stake.details.hash")}
                  </div>
                  <div className="truncate max-w-[300px] md:max-w-full">
                    {selectedStake.hash || ""}
                  </div>

                  <hr className="md:hidden my-1" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("stake.details.network")}
                  </div>
                  <div>{selectedStake.chainNetWork || ""}</div>

                  <hr className="md:hidden my-1" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("stake.details.stakeMethod")}
                  </div>
                  <div>{getStakeMethod(selectedStake.ledgeType, t)}</div>

                  <hr className="md:hidden my-1" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("stake.details.creationTime")}
                  </div>
                  <div>{formatTime(selectedStake.createTime)}</div>

                  <hr className="md:hidden my-1" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("stake.details.stakeAmount")}
                  </div>
                  <div>{selectedStake.ledgeAmount || ""} LUCA</div>

                  <hr className="md:hidden my-1" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("stake.details.initiator")}
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="truncate max-w-[300px] md:max-w-full">
                      {selectedStake.userAddress || ""}
                    </span>
                    <img
                      src="/copy.svg"
                      onClick={() => copyToClipboard(selectedStake.userAddress)}
                      className="cursor-pointer"
                      loading="lazy"
                    />
                  </div>

                  <hr className="md:hidden my-1" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("stake.details.stakeNode")}
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="truncate max-w-[300px] md:max-w-full">
                      {selectedStake.serverAddress || ""}
                    </span>
                    <img
                      src="/copy.svg"
                      onClick={() =>
                        copyToClipboard(selectedStake.serverAddress)
                      }
                      className="cursor-pointer"
                      loading="lazy"
                    />
                  </div>

                  <hr className="md:hidden my-1" />

                  <div className="text-card-foreground md:text-foreground">
                    {t("stake.details.nodeRanking")}
                  </div>
                  <span>{selectedStake.rank || "N/A"}</span>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full dark:bg-card rounded-lg overflow-hidden">
                    <thead className="bg-[#F6F6F6] dark:bg-[#434352]">
                      <tr>
                        <th className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal">
                          {t("stake.columns.hash")}
                        </th>
                        <th className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal">
                          {t("stake.columns.initiator")}
                        </th>
                        <th className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal">
                          {t("stake.columns.receiver")}
                        </th>
                        <th className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal">
                          {t("stake.columns.connectionQuantity")}
                        </th>
                        <th className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal">
                          {t("stake.columns.time")}
                        </th>
                        <th className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal">
                          {t("stake.columns.action")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stake.data.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-sm truncate max-w-[180px]">
                            {hideAddress(row.hash)}
                          </td>
                          <td className="px-4 py-3 text-sm truncate max-w-[180px]">
                            <div className="flex gap-[15px]">
                              <div className="truncate max-w-[180px]">
                                {hideAddress(row.userAddress)}
                              </div>
                              <div>
                                <img
                                  src="/table-arrow.svg"
                                  onClick={() => setSelectedStake(row)}
                                  className="cursor-pointer"
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm truncate max-w-[180px]">
                            {hideAddress(row.serverAddress)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {row.ledgeAmount || ""} LUCA
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {formatTime(row.createTime)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              className="text-primary hover:underline"
                              onClick={() => setSelectedStake(row)}
                            >
                              {t("stake.more")}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-3 dark:bg-card">
                  {stake.data.map((row, idx) => (
                    <div
                      key={idx}
                      className="border-b dark:border-[#454545] p-3"
                    >
                      <div className="flex justify-between text-sm font-normal">
                        <span className="truncate max-w-[220px] text-card-foreground">
                          {hideAddress(row.hash)}
                        </span>
                        <span
                          onClick={() => setSelectedStake(row)}
                          className="text-primary cursor-pointer"
                        >
                          {row.ledgeAmount || ""} LUCA
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-normal mt-2">
                        <span className="text-card-foreground">
                          {t("stake.initiator")}:
                        </span>
                        <span className="truncate max-w-[250px]">
                          {hideAddress(row.userAddress)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-normal mt-2">
                        <span className="text-card-foreground">
                          {t("stake.receiver")}:
                        </span>
                        <span className="truncate max-w-[250px]">
                          {hideAddress(row.serverAddress)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {stake.loading && !stake.isSearchComplete && (
                  <div className="text-center py-4 text-sm text-card-foreground">
                    Loading more results... ({stake.total}+ found so far)
                  </div>
                )}

                <PaginationWrapper
                  currentPage={stake.page}
                  total={stake.total}
                  onPageChange={stake.setPage}
                />
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SearchResults;
