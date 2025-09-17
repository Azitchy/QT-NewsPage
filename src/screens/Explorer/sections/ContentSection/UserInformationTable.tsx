import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../../../../components/ui/pagination";

const columns = [
  "User address",
  "PR value",
  "Consensus connection",
  "Connection quantity",
];

const dataRewardPoints = [
  {
    userAddress:
      "0x3b90c30a3ae3424857d584af5e6d1d953466283072079670dd9ddcb29ed77a1",
    prValue: "2.6831",
    consensusConnection: "1",
    connectionQuality: "10032.00000000 LUCA",
  },
  {
    userAddress:
      "0x3b90c30a3ae3424857d584af5e6d1d953466283072079670dd9ddcb29ed77a1",
    prValue: "2.6831",
    consensusConnection: "1",
    connectionQuality: "10032.00000000 LUCA",
  },
  {
    userAddress:
      "0x3b90c30a3ae3424857d584af5e6d1d953466283072079670dd9ddcb29ed77a1",
    prValue: "2.6831",
    consensusConnection: "1",
    connectionQuality: "10032.00000000 LUCA",
  },
  {
    userAddress:
      "0x3b90c30a3ae3424857d584af5e6d1d953466283072079670dd9ddcb29ed77a1",
    prValue: "2.6831",
    consensusConnection: "1",
    connectionQuality: "10032.00000000 LUCA",
  },
  {
    userAddress:
      "0x3b90c30a3ae3424857d584af5e6d1d953466283072079670dd9ddcb29ed77a1",
    prValue: "2.6831",
    consensusConnection: "1",
    connectionQuality: "10032.00000000 LUCA",
  },
  {
    userAddress:
      "0x3b90c30a3ae3424857d584af5e6d1d953466283072079670dd9ddcb29ed77a1",
    prValue: "2.6831",
    consensusConnection: "1",
    connectionQuality: "10032.00000000 LUCA",
  },
];

const TableComponent = ({
  columns,
  data,
}: {
  columns: string[];
  data: any[];
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      {/* Desktop Table */}
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
                <td className="px-4 py-2 text-sm truncate max-w-[400px]">
                  {row.userAddress}
                </td>
                <td className="px-4 py-2 text-sm truncate max-w-[180px]">
                  {row.prValue}
                </td>
                <td className="px-4 py-2 text-sm truncate max-w-[180px]">
                  {row.consensusConnection}
                </td>
                <td className="px-4 py-2 text-sm">{row.connectionQuality}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {currentData.map((row, idx) => (
          <div key={idx} className="border-b p-3">
            <div className="flex justify-between text-sm font-normal">
              <span className="truncate max-w-[220px] text-[#858585]">
                User address:
              </span>
              <span className="truncate max-w-[200px]">{row.userAddress}</span>
            </div>
            <div className="flex gap-16 text-sm font-normal mt-2">
              <span className="text-[#858585]">PR Value :</span>
              <span>{row.prValue}</span>
            </div>
            <div className="flex gap-2 text-sm font-normal mt-2">
              <span className="text-[#858585]">Connection Quality:</span>
              <span className="">{row.connectionQuality}</span>
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <div
                  onClick={() => handlePageChange(page)}
                  className={`flex w-[30px] items-center justify-center cursor-pointer ${
                    page === currentPage ? "text-[#2ea8af]" : "text-[#1c1c1c]"
                  }`}
                >
                  {page}
                </div>
              </PaginationItem>
            ))}
            <img
              src="/arrow-right-icon-3.svg"
              onClick={() => handlePageChange(currentPage + 1)}
              className="w-7 h-7 bg-[#e9f6f7] rounded-full cursor-pointer p-1"
            />
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

const UserInformationTable = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
        <div className="px-0 py-4 md:px-4 md:py-0 text-[14px] leading-[19px] font-normal text-[#1C1C1C]">
          User information
        </div>
      </div>

      <TableComponent columns={columns} data={dataRewardPoints} />
    </div>
  );
};

export default UserInformationTable;
