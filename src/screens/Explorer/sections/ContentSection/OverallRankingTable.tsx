import React, { useState } from "react";
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

const overallColumns = ["Ranking", "User Address", "PR Value"];
const rewardColumns = ["Ranking", "User Address", "Total Income", "Action"];

const dataOverallPR = [
  { rank: 1, address: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e5035", pr: 95 },
  { rank: 2, address: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e5783", pr: 88 },
  { rank: 3, address: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e9353", pr: 75 },
  { rank: 4, address: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e9353", pr: 78 },
  { rank: 5, address: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e9353", pr: 73 },
  { rank: 6, address: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e9353", pr: 72 },
  { rank: 7, address: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e9353", pr: 98 },
  { rank: 8, address: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e9353", pr: 45 },
  { rank: 9, address: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e9353", pr: 34 },
  { rank: 10, address: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e9353", pr: 55 },
  { rank: 11, address: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e9353", pr: 32 },
];

const dataRewardPoints = [
  {
    rank: 1,
    address: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e5035",
    pr: 95343,
    operationIncome: 0,
    stakeIncome: 35353,
    liquidityIncome: 0,
  },
  {
    rank: 2,
    address: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e2422",
    pr: 65835,
    operationIncome: 0,
    stakeIncome: 94353,
    liquidityIncome: 0,
  },
  {
    rank: 3,
    address: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e53534",
    pr: 12424,
    operationIncome: 0,
    stakeIncome: 34344,
    liquidityIncome: 0,
  },
  {
    rank: 4,
    address: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e5353",
    pr: 95343,
    operationIncome: 0,
    stakeIncome: 35353,
    liquidityIncome: 0,
  },
  {
    rank: 5,
    address: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e5035",
    pr: 95343,
    operationIncome: 0,
    stakeIncome: 35353,
    liquidityIncome: 0,
  },
  {
    rank: 6,
    address: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e50454",
    pr: 95343,
    operationIncome: 0,
    stakeIncome: 354534,
    liquidityIncome: 0,
  },
];

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
}: {
  columns: string[];
  data: any[];
  showAction?: boolean;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const openModal = (row: any) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-[#F6F6F6]">
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
            {currentData.map((row, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 text-sm max-w-[180px]">{row.rank}</td>
                <td className="px-4 py-2 text-sm truncate max-w-[180px]">
                  {row.address}
                </td>
                <td className="px-4 py-2 text-sm truncate max-w-[180px]">
                  {row.pr}
                </td>
                {showAction && (
                  <td className="px-4 py-2 text-sm">
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
        {currentData.map((row, idx) => (
          <div key={idx} className="border-b p-3 ">
            <div className="flex justify-between text-sm font-normal">
              <span>Rank {row.rank}</span>
              <span>
                {showAction ? "Total income:" : "PR value:"} {row.pr}
              </span>
            </div>
            <div className="flex gap-2 items-center justify-between">
              <div className="mt-2 text-sm text-[#858585] truncate text-right max-w-full overflow-hidden whitespace-nowrap">
                {row.address}
              </div>
              {showAction && (
                <div className="mt-2 text-right">
                  <button
                    className="text-[#2EA8AF] hover:underline text-sm"
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
      <div className="flex justify-center mt-10">
        <Pagination>
          <PaginationContent className="inline-flex items-center gap-[10px] md:gap-[35px] px-[9px] py-[10px] rounded-[40px] border border-solid border-[#eeeeee]">
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
                      page === currentPage ? "text-[#2ea8af]" : "text-[#1c1c1c]"
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

      {/* Modal */}
      {isModalOpen && selectedRow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg mx-2 md:mx-0 w-[580px] max-w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-[18px] leading-[24px] font-normal text-[#1C1C1C] mb-[30px]">
              Income details
            </h2>

            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <div className="flex gap-[33px]">
                <span className="text-[#858585] text-[14px] leading-[19px] md:text-[16px] md:leading-[24px] font-normal">
                  Income ranking
                </span>
                <span className="font-normal text-[#1C1C1C] text-[14px] leading-[19px] md:text-[16px] md:leading-[24px]">
                  {selectedRow.rank}
                </span>
              </div>
              <div className="flex gap-[33px]">
                <span className="text-[#858585] text-[14px] leading-[19px] md:text-[16px] md:leading-[24px] font-normal">
                  Wallet address
                </span>
                <span className="font-normal text-[#1C1C1C] text-[14px] leading-[19px] md:text-[16px] md:leading-[24px] truncate text-right max-w-[180px] md:max-w-full overflow-hidden whitespace-nowrap">
                  {selectedRow.address}
                </span>
              </div>
              <div className="flex gap-[33px]">
                <span className="text-[#858585]  text-[14px] leading-[19px] md:text-[16px] md:leading-[24px] font-normal ">
                  Total income
                </span>
                <span className="font-normal text-[#1C1C1C] text-[14px] leading-[19px] md:text-[16px] md:leading-[24px]">
                  {selectedRow.pr}
                </span>
              </div>
            </div>

            <hr className="my-3" />

            <p className="font-normal text-[#1C1C1C] text-[14px] leading-[19px] md:text-[16px] md:leading-[24px] mb-3">
              The total income consists of the following four parts
            </p>

            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
              <div className="flex flex-col justify-between">
                <span className="text-[#858585] text-[14px] leading-[19px] md:text-[16px] md:leading-[24px] font-normal">
                  Income ranking
                </span>
                <span className="font-normal text-[#1C1C1C] text-[14px] leading-[19px] md:text-[16px] md:leading-[24px]">
                  {selectedRow.pr}
                </span>
              </div>
              <div className="flex flex-col justify-between">
                <span className="text-[#858585] text-[14px] leading-[19px] md:text-[16px] md:leading-[24px] font-normal">
                  Server operation income
                </span>
                <span className="font-normal text-[#1C1C1C] text-[14px] leading-[19px] md:text-[16px] md:leading-[24px]">
                  {selectedRow.operationIncome}
                </span>
              </div>
              <div className="flex flex-col justify-between">
                <span className="text-[#858585] text-[14px] leading-[19px] md:text-[16px] md:leading-[24px] font-normal">
                  Server stake income
                </span>
                <span className="font-normal text-[#1C1C1C] text-[14px] leading-[19px] md:text-[16px] md:leading-[24px]">
                  {selectedRow.stakeIncome}
                </span>
              </div>
              <div className="flex flex-col justify-between">
                <span className="text-[#858585] text-[14px] leading-[19px] md:text-[16px] md:leading-[24px] font-normal">
                  Liquidity income
                </span>
                <span className="font-normal text-[#1C1C1C] text-[14px] leading-[19px] md:text-[16px] md:leading-[24px]">
                  {selectedRow.liquidityIncome}
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
  return (
    <Tabs defaultValue="overall" className="w-full mt-12 md:mt-6">
      <TabsList className="flex items-start flex-col-reverse gap-2 md:gap-0 md:flex-row justify-between mb-4 bg-transparent">
        <div>
          <TabsTrigger
            value="overall"
            className="px-0 md:px-4 py-2 text-[14px] leading-[19px] font-normal text-[#858585] bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Overall PR Ranking
          </TabsTrigger>
          <TabsTrigger
            value="reward"
            className="md:px-4 py-2 text-[14px] leading-[19px] font-normal text-[#858585] bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Total Reward
          </TabsTrigger>
        </div>
        <div className="text-[12px] leading-[17px] md:text-[14px] md:leading-[19px] text-[#858585] font-normal">
          Ranking data is updated daily. The latest update:{" "}
          <span className="text-[#2EA8AF]">17/03/2024 23:00</span>
        </div>
      </TabsList>

      <TabsContent value="overall">
        <TableComponent columns={overallColumns} data={dataOverallPR} />
      </TabsContent>
      <TabsContent value="reward">
        <TableComponent
          columns={rewardColumns}
          data={dataRewardPoints}
          showAction
        />
      </TabsContent>
    </Tabs>
  );
};

export default OverallRankingTable;
