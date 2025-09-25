import React, { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../../../../components/ui/pagination";
import {
  fetchConsensusContractList,
  ConsensusConnectionItem,
} from "../../../../lib/webApi";

const columns = [
  "Hash",
  "Initiator",
  "Receiver",
  "Connection quantity",
  "Time",
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied!");
    });
  };

  const formatTime = (value: string | number) => {
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

  const hideAddress = (address: string) => {
    return address
      ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
      : "";
  };

  const getStatusText = (status: number) => {
    const statusList = [
      "Pending",
      "Connected",
      "Waiting",
      "Cancelled",
      "Disconnected",
    ];
    return statusList[status - 1] || "Unknown";
  };

  // Detail View
  if (selectedRow) {
    return (
      <div className="dark:bg-card rounded-[10px] p-4 md:p-5 w-full">
        <div className="flex items-center gap-2 text-sm mb-10">
          <img
            src="/arrow-left-icon.svg"
            className="h-[20px] w-[20px] cursor-pointer"
            onClick={() => onRowSelect(null)}
          />
          <h2 className="text-[14px] leading-[19px] font-normal">
            Connection contract information
          </h2>
        </div>
        <div className="grid md:grid-cols-[180px_1fr] gap-y-1 md:gap-y-4 text-[14px] leading-[19px] text-foreground">
          <div className="text-card-foreground md:text-foreground">Hash</div>
          <div className="truncate max-w-[300px] md:max-w-full">
            {selectedRow.createHash}
          </div>

          <hr className="md:hidden my-2 dark:border-[#454545]" />

          <div className="text-card-foreground md:text-foreground">Network</div>
          <div>{selectedRow.chainNetWork}</div>

          <hr className="md:hidden my-2 dark:border-[#454545]" />

          <div className="text-card-foreground md:text-foreground">Status</div>
          <div>{getStatusText(selectedRow.linkStatus)}</div>

          <hr className="md:hidden my-2 dark:border-[#454545]" />

          <div className="text-card-foreground] md:text-foreground">
            Creation Time
          </div>
          <div>{formatTime(selectedRow.createTime)}</div>

          <hr className="md:hidden my-2 dark:border-[#454545]" />

          <div className="text-card-foreground md:text-foreground">
            Connection Quantity
          </div>
          <div>
            {selectedRow.amount} {selectedRow.linkCurrency}
          </div>
          <hr className="md:hidden my-2 dark:border-[#454545]" />

          <div className="text-card-foreground md:text-foreground">
            Initiator
          </div>
          <div className="flex gap-2 items-center">
            <span className="truncate  max-w-[300px] md:max-w-full">
              {selectedRow.createAddress}
            </span>
            <img
              src="/copy.svg"
              onClick={() => copyToClipboard(selectedRow.createAddress)}
              className="cursor-pointer"
            />
          </div>
          <hr className="md:hidden my-2 dark:border-[#454545]" />

          <div className="text-card-foreground md:text-foreground">
            Receiver
          </div>
          <div className="flex gap-2 items-center">
            <span className="truncate  max-w-[300px] md:max-w-full">
              {selectedRow.targetAddress}
            </span>{" "}
            <img
              src="/copy.svg"
              onClick={() => copyToClipboard(selectedRow.targetAddress)}
              className="cursor-pointer"
            />
          </div>
          <hr className="md:hidden my-2 dark:border-[#454545]" />

          <div className="text-card-foreground md:text-foreground">
            Connection Contract
          </div>
          <div className="flex gap-2 items-center">
            <span className="truncate  max-w-[300px] md:max-w-full">
              {selectedRow.linkAddress}{" "}
            </span>
            <img
              src="/copy.svg"
              onClick={() => copyToClipboard(selectedRow.linkAddress)}
              className="cursor-pointer"
            />
          </div>
          <hr className="md:hidden my-2 dark:border-[#454545]" />

          <div className="text-card-foreground md:text-foreground">
            Lock Time
          </div>
          <div>{selectedRow.lockedDay} days</div>
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
                        onClick={() => onRowSelect(row)}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm truncate max-w-[180px]">
                  {hideAddress(row.targetAddress)}
                </td>
                <td className="px-4 py-3 text-sm">
                  {row.amount} {row.linkCurrency}
                </td>
                <td className="px-4 py-3 text-sm">
                  {formatTime(row.createTime)}
                </td>
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
      <div className="md:hidden space-y-3 dark:bg-card ">
        {currentData.map((row, idx) => (
          <div key={idx} className="border-b dark:border-[#454545] p-3">
            <div className="flex justify-between text-sm font-normal">
              <span className="truncate max-w-[220px] text-card-foreground">
                {hideAddress(row.createHash)}
              </span>
              <span onClick={() => onRowSelect(row)} className="text-primary">
                {row.amount} {row.linkCurrency}
              </span>
            </div>
            <div className="flex justify-between text-sm font-normal mt-2">
              <span className="text-card-foreground">Initiator:</span>
              <span className="truncate max-w-[250px]">
                {hideAddress(row.createAddress)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-normal mt-2">
              <span className="text-card-foreground">Receiver:</span>
              <span className="truncate max-w-[250px]">
                {hideAddress(row.targetAddress)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center bg-card md:bg-background  py-10">
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

const ConsensusConnectionTable = () => {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [data, setData] = useState<ConsensusConnectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    token: "LUCA",
    network: "All network",
    currency: "LUCA",
  });

  const fetchData = async (pageNo = 1) => {
    try {
      setLoading(true);
      const response = await fetchConsensusContractList({
        pageNo,
        pageSize: 10,
        linkCurrency: filters.currency,
        chainId: filters.network === "All network" ? null : filters.network,
        consensusType: "1",
      });

      if (response.data && Array.isArray(response.data)) {
        setData(response.data);
        setTotal(response.total || response.data.length);
      } else {
        setData([]);
        setTotal(0);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching consensus connections:", err);
      setError("Failed to load consensus connections");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="dark:bg-card rounded-[10px] p-4 md:p-5 w-full">
        <div className="h-96 flex items-center justify-center">
          <div className="text-card-foreground">
            Loading consensus connections...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dark:bg-card rounded-[10px] p-4 md:p-5 w-full">
        <div className="h-96 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!selectedRow && (
        <div className="flex flex-col md:flex-row md:items-center dark:bg-card rounded-t-[10px] justify-between pb-5 p-2">
          <div className="px-0 py-4 md:px-4 md:py-0 text-[14px] leading-[19px] font-normal text-foreground">
            Connection contract information
          </div>
          <div className="flex gap-2">
            {Object.entries({
              Token: filters.token,
              "All network": filters.network,
              [filters.currency]: filters.currency,
            }).map(([label, value]) => (
              <div key={label} className="relative inline-block">
                <select
                  className="h-10 px-2 py-2 pr-7 md:pr-10 rounded-[10px] border border-border dark:border-[#454545] bg-transparent hover:bg-gray-50 flex items-center gap-3 appearance-none text-sm text-card-foreground focus:outline-none focus:ring-0"
                  value={value}
                  onChange={(e) =>
                    handleFilterChange(
                      label.toLowerCase().replace(" ", ""),
                      e.target.value
                    )
                  }
                >
                  <option value={value}>{value}</option>
                  {label === "Token" && (
                    <>
                      <option value="LUCA">LUCA</option>
                      <option value="BTCB">BTCB</option>
                      <option value="ETH">ETH</option>
                    </>
                  )}
                  {label === "All network" && (
                    <>
                      <option value="BSC">BSC</option>
                      <option value="ETH">Ethereum</option>
                    </>
                  )}
                </select>
                <img
                  className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2"
                  alt="Dropdown Icon"
                  src="/icon.svg"
                />
              </div>
            ))}
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
              {Array.from(
                { length: Math.min(5, Math.ceil(total / 10)) },
                (_, i) => {
                  const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  return page <= Math.ceil(total / 10) ? (
                    <PaginationItem key={page}>
                      <div
                        onClick={() => handlePageChange(page)}
                        className={`flex w-[30px] items-center justify-center cursor-pointer ${
                          page === currentPage
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {page}
                      </div>
                    </PaginationItem>
                  ) : null;
                }
              )}
              <img
                src="/arrow-right-icon-3.svg"
                onClick={() =>
                  handlePageChange(
                    Math.min(Math.ceil(total / 10), currentPage + 1)
                  )
                }
                className="w-7 h-7 bg-[#e9f6f7] rounded-full cursor-pointer p-1"
              />
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ConsensusConnectionTable;
