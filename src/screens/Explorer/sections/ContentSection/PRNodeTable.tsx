import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../../../../components/ui/pagination";

const columns = [
  "PR node",
  "Server domain name",
  "Server IP",
  "Server nickname",
  "Stake amount",
  "Action",
];

const dataRewardPoints = [
  {
    prNode: "0x41afb7032199151d5cDE524037cD85ddACCe708E",
    serverDomainName:
      "http://ec2-18-141-169-230.ap-southeast-1.compute.amazonaws.com:5000",
    serverIP: "18.141.169.230",
    serverNickname: "pr09",
    nodeRanking: "1",
    stakeAmount: "94438955.5526 LUCA",
  },
  {
    prNode: "0x41afb7032199151d5cDE524037cD85ddACCe708E",
    serverDomainName:
      "http://ec2-18-141-169-230.ap-southeast-1.compute.amazonaws.com:5000",
    serverIP: "18.141.169.230",
    serverNickname: "pr09",
    nodeRanking: "1",
    stakeAmount: "9748911.614100000000000001 LUCA",
  },
  {
    prNode: "0x41afb7032199151d5cDE524037cD85ddACCe708E",
    serverDomainName:
      "http://ec2-18-141-169-230.ap-southeast-1.compute.amazonaws.com:5000",
    serverIP: "18.141.169.230",
    serverNickname: "pr09",
    nodeRanking: "1",
    stakeAmount: "9748911.614100000000000001 LUCA",
  },
  {
    prNode: "0x41afb7032199151d5cDE524037cD85ddACCe708E",
    serverDomainName:
      "http://ec2-18-141-169-230.ap-southeast-1.compute.amazonaws.com:5000",
    serverIP: "18.141.169.230",
    serverNickname: "pr09",
    nodeRanking: "1",
    stakeAmount: "9748911.614100000000000001 LUCA",
  },
  {
    prNode: "0x41afb7032199151d5cDE524037cD85ddACCe708E",
    serverDomainName:
      "http://ec2-18-141-169-230.ap-southeast-1.compute.amazonaws.com:5000",
    serverIP: "18.141.169.230",
    serverNickname: "pr09",
    nodeRanking: "1",
    stakeAmount: "9748911.614100000000000001 LUCA",
  },
  {
    prNode: "0x41afb7032199151d5cDE524037cD85ddACCe708E",
    serverDomainName:
      "http://ec2-18-141-169-230.ap-southeast-1.compute.amazonaws.com:5000",
    serverIP: "18.141.169.230",
    serverNickname: "pr09",
    nodeRanking: "1",
    stakeAmount: "9748911.614100000000000001 LUCA",
  },
];

const TableComponent = ({
  columns,
  data,
  showAction,
  onRowSelect,
  selectedRow,
}: {
  columns: string[];
  data: any[];
  showAction: boolean;
  onRowSelect: (row: any) => void;
  selectedRow: any;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  // Detail View
  if (selectedRow) {
    return (
      <div className="bg-white p-1 md:p-5 w-full">
        <div className="flex items-center gap-2 text-sm mb-10">
          <img
            src="/arrow-left-icon.svg"
            className="h-[20px] w-[20px] cursor-pointer"
            onClick={() => onRowSelect(null)}
          />
          <h2 className="text-[14px] leading-[19px] font-normal">
            PR node details
          </h2>
        </div>
        <div className="grid md:grid-cols-[180px_1fr] gap-y-1 md:gap-y-4 text-[14px] leading-[19px] text-gray-700">
          <div className="text-[#858585] md:text-[#1C1C1C]">PR node</div>
          <div className="truncate max-w-full">{selectedRow.prNode}</div>

          <hr className="md:hidden my-1" />

          <div className="text-[#858585] md:text-[#1C1C1C]">
            Server domain name
          </div>
          <div>{selectedRow.serverDomainName}</div>

          <hr className="md:hidden my-1" />

          <div className="text-[#858585] md:text-[#1C1C1C]">Server IP</div>
          <div>{selectedRow.serverIP}</div>

          <hr className="md:hidden my-1" />

          <div className="text-[#858585] md:text-[#1C1C1C]">
            Server nickname
          </div>
          <div>{selectedRow.serverNickname}</div>

          <hr className="md:hidden my-1" />

          <div className="text-[#858585] md:text-[#1C1C1C]">Node ranking</div>
          <div>{selectedRow.nodeRanking}</div>
          <hr className="md:hidden my-1" />

          <div className="text-[#858585] md:text-[#1C1C1C]">Stake amount</div>
          <div>{selectedRow.stakeAmount}</div>
        </div>
      </div>
    );
  }

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
                <td className="px-4 py-2 text-sm truncate max-w-[180px]">
                  {row.prNode}
                </td>
                <td className="px-4 py-2 text-sm truncate max-w-[180px]">
                  {row.serverDomainName}
                </td>
                <td className="px-4 py-2 text-sm truncate max-w-[180px]">
                  {row.serverIP}
                </td>
                <td className="px-4 py-2 text-sm">{row.serverNickname}</td>
                <td className="px-4 py-2 text-sm">{row.stakeAmount}</td>
                {showAction && (
                  <td className="px-4 py-2 text-sm">
                    <button
                      className="text-[#2EA8AF] hover:underline"
                      onClick={() => onRowSelect(row)}
                    >
                      More
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
          <div key={idx} className="border-b p-3">
            <div className="flex justify-between text-sm font-normal">
              <span className="truncate max-w-[220px] text-[#858585]">
                {row.serverNickname}
              </span>
              <span>IP {row.serverIP}</span>
            </div>
            <div className="flex justify-between gap-10 text-sm font-normal mt-2">
              <span className="truncate max-w-[100px]">{row.prNode}</span>
              <span
                onClick={() => onRowSelect(row)}
                className="truncate max-w-full text-[#2EA8AF]"
              >
                {row.stakeAmount}
              </span>
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

const PRNodeTable = () => {
  const [selectedRow, setSelectedRow] = useState<any>(null);

  return (
    <div>
      {!selectedRow && (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
          <div className="px-0 py-4 md:px-4 md:py-0 text-[14px] leading-[19px] font-normal text-[#1C1C1C]">
            PR node information
          </div>
        </div>
      )}

      <TableComponent
        columns={columns}
        data={dataRewardPoints}
        showAction={true}
        onRowSelect={setSelectedRow}
        selectedRow={selectedRow}
      />
    </div>
  );
};

export default PRNodeTable;
