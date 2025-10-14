import * as React from "react";
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../../../../components/ui/pagination";
import { fetchUserInformation } from "../../../../lib/webApi";
import { useTranslation } from "react-i18next";

interface UserInfo {
  userAddress: string;
  prValue: string;
  consensusConnection: number;
  connectionQuality: string;
}

const TableComponent = ({
  columns,
  data,
}: {
  columns: string[];
  data: UserInfo[];
}) => {
  const { t } = useTranslation("explorer");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const hideAddress = (address: string) => {
    return address
      ? `${address.substring(0, 6)}...${address.substring(address.length - 6)}`
      : "";
  };

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
                <td className="px-4 py-2 text-sm truncate max-w-[400px]">
                  <span title={row.userAddress}>
                    {hideAddress(row.userAddress)}
                  </span>
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
      <div className="md:hidden space-y-3 dark:bg-card">
        {currentData.map((row, idx) => (
          <div key={idx} className="border-b dark:border-[#454545] p-3">
            <div className="flex justify-between text-sm font-normal">
              <span className="truncate max-w-[220px] text-card-foreground">
                {t("user.columns.userAddress")}:
              </span>
              <span className="truncate max-w-[200px]" title={row.userAddress}>
                {hideAddress(row.userAddress)}
              </span>
            </div>
            <div className="flex gap-16 text-sm font-normal mt-2">
              <span className="text-card-foreground">
                {" "}
                {t("user.columns.prValue")}:{" "}
              </span>
              <span>{row.prValue}</span>
            </div>
            <div className="flex gap-2 text-sm font-normal mt-2">
              <span className="text-card-foreground">
                {" "}
                {t("user.columns.connectionQuality")}{" "}
              </span>
              <span>{row.connectionQuality}</span>
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
              loading="lazy"
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
              loading="lazy"
            />
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

const UserInformationTable = () => {
  const { t } = useTranslation("explorer");

  const columns = [
    t("user.columns.userAddress"),
    t("user.columns.prValue"),
    t("user.columns.consensusConnection"),
    t("user.columns.connectionQuantity"),
  ];
  const [data, setData] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = async (pageNo = 1) => {
    try {
      setLoading(true);
      const response = await fetchUserInformation(pageNo, 10);

      if (response.data && Array.isArray(response.data)) {
        setData(response.data);
        setTotal(response.total || response.data.length);
      } else {
        setData([]);
        setTotal(0);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching user information:", err);
      setError("Failed to load user information");
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
      <div>
        <div className="dark:bg-card flex flex-col md:flex-row md:items-center rounded-t-[10px] justify-between p-4 pb-5">
          <div className="px-0 py-4 md:px-4 md:py-0 text-[14px] leading-[19px] font-normal text-foreground">
            {t("user.title")}
          </div>
        </div>
        <div className="h-96 flex items-center justify-center dark:bg-card">
          <div className="text-card-foreground">
            Loading user information...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="dark:bg-card flex flex-col md:flex-row md:items-center rounded-t-[10px] justify-between p-4 pb-5">
          <div className="px-0 py-4 md:px-4 md:py-0 text-[14px] leading-[19px] font-normal text-foreground">
            {t("user.title")}
          </div>
        </div>
        <div className="h-96 flex items-center justify-center dark:bg-card">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div>
        <div className="dark:bg-card flex flex-col md:flex-row md:items-center rounded-t-[10px] justify-between p-4 pb-5">
          <div className="px-0 py-4 md:px-4 md:py-0 text-[14px] leading-[19px] font-normal text-foreground">
            {t("user.title")}
          </div>
        </div>
        <div className="h-96 flex items-center justify-center dark:bg-card">
          <div className="text-card-foreground"> {t("user.noData")} </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="dark:bg-card flex flex-col md:flex-row md:items-center rounded-t-[10px] justify-between p-4 pb-5">
        <div className="px-0 py-4 md:px-4 md:py-0 text-[14px] leading-[19px] font-normal text-foreground">
          {t("user.title")}
        </div>
      </div>

      <TableComponent columns={columns} data={data} />

      {/* API Pagination */}
      {total > 10 && (
        <div className="flex justify-center bg-card md:bg-background py-10">
          <Pagination>
            <PaginationContent className="inline-flex items-center gap-[10px] md:gap-[35px] px-[9px] py-[10px] rounded-[40px] border border-solid border-border dark:border-primary-foreground">
              <img
                src="/arrow-left-icon.svg"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className="w-5 h-5 cursor-pointer"
                loading="lazy"
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
                loading="lazy"
              />
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default UserInformationTable;
