import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../../../../components/ui/pagination";
import { fetchRankList, fetchSystemTime, RankingItem } from "../../../../lib/webApi";

const overallColumns = ["Ranking", "User Address", "PR Value"];
const rewardColumns = ["Ranking", "User Address", "Total Income", "Action"];

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

const TableComponent = ({
  columns,
  data,
  showAction = false,
  loading = false,
  error = null,
  total = 0,
  currentPage = 1,
  onPageChange,
}: {
  columns: string[];
  data: any[];
  showAction?: boolean;
  loading?: boolean;
  error?: string | null;
  total?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  const openModal = (row: any) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const hideAddress = (address: string) => {
    return address ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}` : '';
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-card-foreground">Loading ranking data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-card-foreground">No ranking data available</div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full dark:bg-card rounded-lg overflow-hidden">
          <thead className="bg-[#F6F6F6] dark:bg-[#434352]">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-[20px] py-[20px] text-left text-[14px] leading-[19px] font-normal"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td className="px-4 py-3 text-sm max-w-[180px]">{row.rank}</td>
                <td className="px-4 py-3 text-sm truncate max-w-[180px]">
                  {hideAddress(row.address)}
                </td>
                <td className="px-4 py-3 text-sm truncate max-w-[180px]">
                  {row.totalAmount || row.pr}
                </td>
                {showAction && (
                  <td className="px-4 py-3 text-sm">
                    <button
                      className="text-[#2EA8AF] hover:underline"
                      onClick={() => openModal(row)}
                    >
                      Detail
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {data.map((row, idx) => (
          <div key={idx} className="border-b dark:border-[#454545]  p-3 ">
            <div className="flex justify-between text-sm font-normal">
              <span>Rank {row.rank}</span>
              <span>
                {showAction ? "Total income:" : "PR value:"} {row.totalAmount || row.pr}
              </span>
            </div>
            <div className="flex gap-2 items-center justify-between">
              <div className="mt-2 text-sm text-card-foreground truncate text-right max-w-full overflow-hidden whitespace-nowrap">
                {hideAddress(row.address)}
              </div>
              {showAction && (
                <div className="mt-2 text-right">
                  <button
                    className="text-primary hover:underline text-sm"
                    onClick={() => openModal(row)}
                  >
                    Detail
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {total > itemsPerPage && (
        <div className="flex justify-center bg-card md:bg-background py-10">
          <Pagination>
            <PaginationContent className="inline-flex items-center gap-[10px] md:gap-[35px] px-[9px] py-[10px] rounded-[40px] border border-solid border-border dark:border-primary-foreground">
              <img
                src="/arrow-left-icon.svg"
                onClick={() => handlePageChange(currentPage - 1)}
                className="w-5 h-5 cursor-pointer"
              />

              {getPageNumbers(currentPage, totalPages).map((page, idx) =>
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
      )}

      {/* Modal */}
      {isModalOpen && selectedRow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-[10px] shadow-lg mx-2 md:mx-0 w-[580px] max-w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-[18px] leading-[24px] font-normal text-foreground mb-[30px]">
              Income details
            </h2>

            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <div className="flex gap-[33px]">
                <span className="text-[#858585] text-[14px] leading-[19px] md:text-[16px] md:leading-[24px] font-normal">
                  Income ranking
                </span>
                <span className="font-normal text-foreground text-[14px] leading-[19px] md:text-[16px] md:leading-[24px]">
                  {selectedRow.rank}
                </span>
              </div>
              <div className="flex gap-[33px]">
                <span className="text-[#858585] text-[14px] leading-[19px] md:text-[16px] md:leading-[24px] font-normal">
                  Wallet address
                </span>
                <span className="font-normal text-foreground text-[14px] leading-[19px] md:text-[16px] md:leading-[24px] truncate text-right max-w-[180px] md:max-w-full overflow-hidden whitespace-nowrap">
                  {selectedRow.address}
                </span>
              </div>
              <div className="flex gap-[33px]">
                <span className="text-[#858585]  text-[14px] leading-[19px] md:text-[16px] md:leading-[24px] font-normal ">
                  Total income
                </span>
                <span className="font-normal text-foreground text-[14px] leading-[19px] md:text-[16px] md:leading-[24px]">
                  {selectedRow.totalAmount || selectedRow.pr}
                </span>
              </div>
            </div>

            <hr className="my-3" />

            <p className="font-normal text-foreground text-[14px] leading-[19px] md:text-[16px] md:leading-[24px] mb-3">
              The total income consists of the following four parts
            </p>

            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
              <div className="flex flex-col justify-between">
                <span className="text-card-foreground text-[14px] leading-[19px] md:text-[16px] md:leading-[24px] font-normal">
                  Income ranking
                </span>
                <span className="font-normal text-foreground text-[14px] leading-[19px] md:text-[16px] md:leading-[24px]">
                  {selectedRow.totalAmount || selectedRow.pr}
                </span>
              </div>
              <div className="flex flex-col justify-between">
                <span className="text-card-foreground text-[14px] leading-[19px] md:text-[16px] md:leading-[24px] font-normal">
                  Server operation income
                </span>
                <span className="font-normal text-foreground text-[14px] leading-[19px] md:text-[16px] md:leading-[24px]">
                  {selectedRow.operationIncome || 0}
                </span>
              </div>
              <div className="flex flex-col justify-between">
                <span className="text-card-foreground text-[14px] leading-[19px] md:text-[16px] md:leading-[24px] font-normal">
                  Server stake income
                </span>
                <span className="font-normal text-foreground text-[14px] leading-[19px] md:text-[16px] md:leading-[24px]">
                  {selectedRow.stakeIncome || 0}
                </span>
              </div>
              <div className="flex flex-col justify-between">
                <span
                  className="text-card-foreground
                 text-[14px] leading-[19px] md:text-[16px] md:leading-[24px] font-normal"
                >
                  Liquidity income
                </span>
                <span className="font-normal text-foreground text-[14px] leading-[19px] md:text-[16px] md:leading-[24px]">
                  {selectedRow.liquidityIncome || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const OverallRankingTable = () => {
  const [overallData, setOverallData] = useState<RankingItem[]>([]);
  const [rewardData, setRewardData] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overallPage, setOverallPage] = useState(1);
  const [rewardPage, setRewardPage] = useState(1);
  const [overallTotal, setOverallTotal] = useState(0);
  const [rewardTotal, setRewardTotal] = useState(0);
  const [systemTime, setSystemTime] = useState<number | null>(null);

  const fetchOverallRanking = async (page = 1) => {
    try {
      const { list, total } = await fetchRankList(page, 10, 1);
      setOverallData(list);
      setOverallTotal(total);
    } catch (err) {
      console.error("Error fetching overall ranking:", err);
      setError("Failed to load overall ranking");
    }
  };

  const fetchRewardRanking = async (page = 1) => {
    try {
      const { list, total } = await fetchRankList(page, 10, 2);
      setRewardData(list);
      setRewardTotal(total);
    } catch (err) {
      console.error("Error fetching reward ranking:", err);
      setError("Failed to load reward ranking");
    }
  };

  const fetchSystemTimeData = async () => {
    try {
      const time = await fetchSystemTime();
      setSystemTime(time);
    } catch (err) {
      console.warn("Failed to fetch system time:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchOverallRanking(overallPage),
          fetchRewardRanking(rewardPage),
          fetchSystemTimeData(),
        ]);
        setError(null);
      } catch (err) {
        console.error("Error fetching ranking data:", err);
        setError("Failed to load ranking data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchOverallRanking(overallPage);
    }
  }, [overallPage]);

  useEffect(() => {
    if (!loading) {
      fetchRewardRanking(rewardPage);
    }
  }, [rewardPage]);

  const formatTime = (timestamp: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    date.setDate(date.getDate() - 1); // Subtract one day as per Vue code
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <Tabs
      defaultValue="overall"
      className="w-full dark:bg-card rounded-[20px] mt-12 md:mt-6 "
    >
      <TabsList className="flex items-start flex-col-reverse gap-2 md:gap-0 md:flex-row justify-between mb-4 bg-transparent">
        <div>
          <TabsTrigger
            value="overall"
            className="px-0 md:px-4 py-2 text-[14px] leading-[19px] font-normal text-card-foreground bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Overall PR Ranking
          </TabsTrigger>
          <TabsTrigger
            value="reward"
            className="md:px-4 py-2 text-[14px] leading-[19px] font-normal text-card-foreground bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Total Reward
          </TabsTrigger>
        </div>
        <div className="text-[12px] leading-[17px] md:text-[14px] md:leading-[19px] text-card-foreground dark:px-2 dark:pt-2 font-normal">
          Ranking data is updated daily. The latest update:{" "}
          <span className="text-primary">
            {systemTime ? formatTime(systemTime) : "17/03/2024"} 23:00
          </span>
        </div>
      </TabsList>

      <TabsContent value="overall">
        <TableComponent 
          columns={overallColumns} 
          data={overallData} 
          loading={loading}
          error={error}
          total={overallTotal}
          currentPage={overallPage}
          onPageChange={setOverallPage}
        />
      </TabsContent>
      <TabsContent value="reward">
        <TableComponent
          columns={rewardColumns}
          data={rewardData}
          showAction
          loading={loading}
          error={error}
          total={rewardTotal}
          currentPage={rewardPage}
          onPageChange={setRewardPage}
        />
      </TabsContent>
    </Tabs>
  );
};

export default OverallRankingTable;