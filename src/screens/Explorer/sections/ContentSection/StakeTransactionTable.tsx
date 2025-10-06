import * as React from "react";
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../../../../components/ui/pagination";
import {
  fetchStakeTransactions,
  StakeTransactionItem,
} from "../../../../lib/webApi";
import { useTranslation } from "react-i18next";


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
  const { t } = useTranslation("explorer");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied!");
    });
  };

  const hideAddress = (address: string) => {
    return address
      ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
      : "";
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

  const getStakeMethod = (ledgeType: number) => {
    return ledgeType === 1 ? t("stake.stakeMethod.lucaStake") : t("stake.stakeMethod.consensusContract");
  };

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
            {t("stake.details.title")}
          </h2>
        </div>
        <div className="grid md:grid-cols-[180px_1fr] gap-y-1 md:gap-y-4 text-[14px] leading-[19px] text-foreground">
          <div className="text-card-foreground md:text-foreground"> {t("stake.details.hash")} </div>
          <div className="truncate max-w-[300px] md:max-w-full">
            {selectedRow.hash}
          </div>

          <hr className="md:hidden my-1" />

          <div className="text-card-foreground md:text-foreground"> {t("stake.details.network")} </div>
          <div>{selectedRow.chainNetWork}</div>

          <hr className="md:hidden my-1" />

          <div className="text-card-foreground md:text-foreground">
            {t("stake.details.stakeMethod")}
          </div>
          <div>{getStakeMethod(selectedRow.ledgeType)}</div>

          <hr className="md:hidden my-1" />

          <div className="text-card-foreground md:text-foreground">
            {t("stake.details.creationTime")}
          </div>
          <div>{formatTime(selectedRow.createTime)}</div>

          <hr className="md:hidden my-1" />

          <div className="text-card-foreground md:text-foreground">
            {t("stake.details.stakeAmount")}
          </div>
          <div>{selectedRow.ledgeAmount} LUCA</div>
          <hr className="md:hidden my-1" />

          <div className="text-card-foreground md:text-foreground">
            {t("stake.details.initiator")}
          </div>
          <div className="flex gap-2 items-center">
            <span className="truncate  max-w-[300px] md:max-w-full">
              {selectedRow.userAddress}
            </span>
            <img
              src="/copy.svg"
              onClick={() => copyToClipboard(selectedRow.userAddress)}
              className="cursor-pointer"
            />
          </div>
          <hr className="md:hidden my-1" />

          <div className="text-card-foreground md:text-foreground">
            {t("stake.details.stakeNode")}
          </div>
          <div className="flex gap-2 items-center">
            <span className="truncate  max-w-[300px] md:max-w-full">
              {selectedRow.serverAddress}
            </span>{" "}
            <img
              src="/copy.svg"
              onClick={() => copyToClipboard(selectedRow.serverAddress)}
              className="cursor-pointer"
            />
          </div>
          <hr className="md:hidden my-1" />

          <div className="text-card-foreground md:text-foreground">
            {t("stake.details.nodeRanking")}
          </div>
          <span>{selectedRow.rank || "N/A"} </span>
        </div>
      </div>
    );
  }

  return (
    <>
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
                        onClick={() => onRowSelect(row)}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm truncate max-w-[180px]">
                  {hideAddress(row.serverAddress)}
                </td>
                <td className="px-4 py-3 text-sm">{row.ledgeAmount} LUCA</td>
                <td className="px-4 py-3 text-sm">
                  {formatTime(row.createTime)}
                </td>
                {showAction && (
                  <td className="px-4 py-3 text-sm">
                    <button
                      className="text-primary hover:underline"
                      onClick={() => onRowSelect(row)}
                    >
                      {t("stake.more")}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3  dark:bg-card">
        {data.map((row, idx) => (
          <div key={idx} className="border-b dark:border-[#454545] p-3">
            <div className="flex justify-between text-sm font-normal">
              <span className="truncate max-w-[220px] text-card-foreground">
                {hideAddress(row.hash)}
              </span>
              <span
                onClick={() => onRowSelect(row)}
                className="text-primary cursor-pointer"
              >
                {row.ledgeAmount} LUCA
              </span>
            </div>
            <div className="flex justify-between text-sm font-normal mt-2">
              <span className="text-card-foreground"> {t("stake.initiator")}: </span>
              <span className="truncate max-w-[250px]">
                {hideAddress(row.userAddress)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-normal mt-2">
              <span className="text-card-foreground"> {t("stake.receiver")}:</span>
              <span className="truncate max-w-[250px]">
                {hideAddress(row.serverAddress)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const StakeTransactionTable = () => {
  const { t } = useTranslation("explorer");
  const columns = [
  t("stake.columns.hash"),
  t("stake.columns.initiator"),
  t("stake.columns.receiver"),
  t("stake.columns.connectionQuantity"),
  t("stake.columns.time"),
  t("stake.columns.action"),
];
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [data, setData] = useState<StakeTransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    chainId: null as string | null,
  });

  const fetchData = async (pageNo = 1) => {
    try {
      setLoading(true);
      const response = await fetchStakeTransactions(
        pageNo,
        10,
        filters.chainId
      );

      if (response.data && Array.isArray(response.data)) {
        setData(response.data);
        setTotal(response.total || response.data.length);
      } else {
        setData([]);
        setTotal(0);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching stake transactions:", err);
      setError("Failed to load stake transactions");
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
      [filterType]: value === t("stake.allNetwork") ? null : value,
    }));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div>
        <div className="flex flex-col md:flex-row md:items-center rounded-t-[10px] px-2 pt-2 dark:bg-card justify-between pb-5">
          <div className="px-0 py-4 md:px-4 md:py-0 text-[14px] leading-[19px] font-normal text-foreground">
            {t("stake.title")}
          </div>
        </div>
        <div className="h-96 flex items-center justify-center dark:bg-card">
          <div className="text-card-foreground">
            {t("stake.loading")}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex flex-col md:flex-row md:items-center rounded-t-[10px] px-2 pt-2 dark:bg-card justify-between pb-5">
          <div className="px-0 py-4 md:px-4 md:py-0 text-[14px] leading-[19px] font-normal text-foreground">
            {t("stake.title")}
          </div>
        </div>
        <div className="h-96 flex items-center justify-center dark:bg-card">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!selectedRow && (
        <div className="flex flex-col md:flex-row md:items-center rounded-t-[10px] px-2 pt-2 dark:bg-card justify-between pb-5">
          <div className="px-0 py-4 md:px-4 md:py-0 text-[14px] leading-[19px] font-normal text-foreground">
            {t("stake.title")}
          </div>
          <div className="flex gap-2">
            <div className="relative inline-block">
              <select
                className="h-10 px-2 py-2 pr-10 rounded-[10px] border  border-border dark:border-[#454545] bg-transparent hover:bg-gray-50 flex items-center gap-3 appearance-none text-sm text-card-foreground focus:outline-none focus:ring-0"
                value={filters.chainId || "All Network"}
                onChange={(e) => handleFilterChange("chainId", e.target.value)}
              >
                <option value="All Network">{t("stake.allNetwork")}</option>
                <option value="BSC">BSC</option>
                <option value="ETH">Ethereum</option>
              </select>
              <img
                className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2"
                alt="Dropdown Icon"
                src="/icon.svg"
              />
            </div>
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

export default StakeTransactionTable;