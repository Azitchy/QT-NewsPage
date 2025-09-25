import React, { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../../../../components/ui/pagination";
import { fetchPRNodes, PRNodeItem } from "../../../../lib/webApi";

const columns = [
  "PR node",
  "Server domain name",
  "Server IP",
  "Server nickname",
  "Stake amount",
  "Action",
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

  const hideAddress = (address: string) => {
    return address ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}` : '';
  };

  // Detail View
  if (selectedRow) {
    return (
      <div className="dark:bg-card p-4 md:p-5 w-full">
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
        <div className="grid md:grid-cols-[180px_1fr] gap-y-1 md:gap-y-4 text-[14px] leading-[19px] text-foreground">
          <div className="text-card-foreground md:text-foreground">PR node</div>
          <div className="truncate max-w-full">{selectedRow.serverAddress}</div>

          <hr className="md:hidden my-2 dark:border-[#454545]" />

          <div className="text-card-foreground md:text-foreground">
            Server domain name
          </div>
          <div className="truncate max-w-full">{selectedRow.serverUrl}</div>

          <hr className="md:hidden my-2 dark:border-[#454545]" />

          <div className="text-card-foreground md:text-foreground">
            Server IP
          </div>
          <div>{selectedRow.serverIp}</div>

          <hr className="md:hidden my-2 dark:border-[#454545]" />

          <div className="text-card-foreground md:text-foreground">
            Server nickname
          </div>
          <div>{selectedRow.serverNickname}</div>

          <hr className="md:hidden my-2 dark:border-[#454545]" />

          <div className="text-card-foreground md:text-foreground">
            Node ranking
          </div>
          <div>{selectedRow.rank || "N/A"}</div>
          <hr className="md:hidden my-2 dark:border-[#454545]" />

          <div className="text-card-foreground md:text-foreground">
            Stake amount
          </div>
          <div>{selectedRow.ledgeAmount} LUCA</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
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
            {currentData.map((row, idx) => (
              <tr key={idx}>
                <td className="px-4 py-3 text-sm truncate max-w-[180px]">
                  {hideAddress(row.serverAddress)}
                </td>
                <td className="px-4 py-3 text-sm truncate max-w-[180px]">
                  {row.serverUrl}
                </td>
                <td className="px-4 py-3 text-sm truncate max-w-[180px]">
                  {row.serverIp}
                </td>
                <td className="px-4 py-3 text-sm">{row.serverNickname}</td>
                <td className="px-4 py-3 text-sm">{row.ledgeAmount} LUCA</td>
                {showAction && (
                  <td className="px-4 py-3 text-sm">
                    <button
                      className="text-primary hover:underline"
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
          <div key={idx} className="border-b dark:border-[#454545] p-3">
            <div className="flex justify-between text-sm font-normal">
              <span className="truncate max-w-[220px] text-card-foreground">
                {row.serverNickname}
              </span>
              <span>IP {row.serverIp}</span>
            </div>
            <div className="flex justify-between gap-10 text-sm font-normal mt-2">
              <span className="truncate max-w-[100px]">{hideAddress(row.serverAddress)}</span>
              <span
                onClick={() => onRowSelect(row)}
                className="truncate max-w-full text-primary cursor-pointer"
              >
                {row.ledgeAmount} LUCA
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center bg-card md:bg-background py-10">
        <Pagination>
          <PaginationContent className="inline-flex items-center gap-[10px] md:gap-[35px] px-[9px] py-[10px] rounded-[40px] border border-solid border-border dark:border-primary-foreground">
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
                    page === currentPage ? "text-primary" : "text-foreground"
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
  const [data, setData] = useState<PRNodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = async (pageNo = 1) => {
    try {
      setLoading(true);
      const response = await fetchPRNodes(pageNo, 10);
      
      if (response.data && Array.isArray(response.data)) {
        setData(response.data);
        setTotal(response.total || response.data.length);
      } else {
        setData([]);
        setTotal(0);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching PR nodes:", err);
      setError("Failed to load PR nodes");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="dark:bg-card rounded-t-[10px] pt-4">
        <div className="h-96 flex items-center justify-center">
          <div className="text-card-foreground">Loading PR nodes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dark:bg-card rounded-t-[10px] pt-4">
        <div className="h-96 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-card rounded-t-[10px] pt-4">
      {!selectedRow && (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
          <div className="px-2 py-4 md:px-4 md:py-0 text-[14px] leading-[19px] font-normal text-foreground">
            PR node information
          </div>
        </div>
      )}

      <TableComponent
        columns={columns}
        data={data}
        showAction={true}
        onRowSelect={setSelectedRow}
        selectedRow={selectedRow}
      />

      {/* API Pagination */}
      {!selectedRow && total > 10 && (
        <div className="flex justify-center bg-card md:bg-background py-10">
          <Pagination>
            <PaginationContent className="inline-flex items-center gap-[10px] md:gap-[35px] px-[9px] py-[10px] rounded-[40px] border border-solid border-border dark:border-primary-foreground">
              <img
                src="/arrow-left-icon.svg"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className="w-5 h-5 cursor-pointer"
              />
              {Array.from({ length: Math.min(5, Math.ceil(total / 10)) }, (_, i) => {
                const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                return page <= Math.ceil(total / 10) ? (
                  <PaginationItem key={page}>
                    <div
                      onClick={() => handlePageChange(page)}
                      className={`flex w-[30px] items-center justify-center cursor-pointer ${
                        page === currentPage ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {page}
                    </div>
                  </PaginationItem>
                ) : null;
              })}
              <img
                src="/arrow-right-icon-3.svg"
                onClick={() => handlePageChange(Math.min(Math.ceil(total / 10), currentPage + 1))}
                className="w-7 h-7 bg-[#e9f6f7] rounded-full cursor-pointer p-1"
              />
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default PRNodeTable;