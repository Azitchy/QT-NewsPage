import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../../../../components/ui/pagination";

const columns = [
  "Hash",
  "Initiator",
  "Receiver",
  "Connection quantity",
  "Time",
  "Action",
];

const dataRewardPoints = [
  {
    hash: "0x3b90c30a3ae3424857d584af5e6d1d953466283072079670dd9ddcb29ed77a1",
    network: "BSC",
    status: "Connecting",
    creationTime: "18/03/2024 18:47:35",
    connectionQuality: "3817 LUCA",
    initiator: "0x04314defdfdfda4c458f2706a85b2039856be690",
    receiver: "0xd0c0bbd909ef0a8c1e0a3c7cb84c260d99301d10",
    connectionContract: "0xd0db3a0b7e7dd36068a9a4f9c4e9d20d2adcbe7f",
    lockTime: "12 days",
  },
  {
    hash: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e5035",
    network: "BSC",
    status: "Connecting",
    creationTime: "18/03/2024 18:47:35",
    connectionQuality: "3817 LUCA",
    initiator: "0x04314defdfdfda4c458f2706a85b2039856be690",
    receiver: "0x04314defdfdfda4c458f2706a85b2039856be690",
    connectionContract: "0x04314defdfdfda4c458f2706a85b2039856be690",
    lockTime: "12 days",
  },
  {
    hash: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e5035",
    network: "BSC",
    status: "Connecting",
    creationTime: "18/03/2024 18:47:35",
    connectionQuality: "3817 LUCA",
    initiator: "0x04314defdfdfda4c458f2706a85b2039856be690",
    receiver: "0x04314defdfdfda4c458f2706a85b2039856be690",
    connectionContract: "0x04314defdfdfda4c458f2706a85b2039856be690",
    lockTime: "12 days",
  },
  {
    hash: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e5035",
    network: "BSC",
    status: "Connecting",
    creationTime: "18/03/2024 18:47:35",
    connectionQuality: "3817 LUCA",
    initiator: "0x04314defdfdfda4c458f2706a85b2039856be690",
    receiver: "0x04314defdfdfda4c458f2706a85b2039856be690",
    connectionContract: "0x04314defdfdfda4c458f2706a85b2039856be690",
    lockTime: "12 days",
  },
  {
    hash: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e5035",
    network: "BSC",
    status: "Connecting",
    creationTime: "18/03/2024 18:47:35",
    connectionQuality: "3817 LUCA",
    initiator: "0x04314defdfdfda4c458f2706a85b2039856be690",
    receiver: "0x04314defdfdfda4c458f2706a85b2039856be690",
    connectionContract: "0x04314defdfdfda4c458f2706a85b2039856be690",
    lockTime: "12 days",
  },
  {
    hash: "0xef104cbbb002a42d1cc76e0e4ae4f8f3356e5035",
    network: "BSC",
    status: "Connecting",
    creationTime: "18/03/2024 18:47:35",
    connectionQuality: "3817 LUCA",
    initiator: "0x04314defdfdfda4c458f2706a85b2039856be690",
    receiver: "0x04314defdfdfda4c458f2706a85b2039856be690",
    connectionContract: "0x04314defdfdfda4c458f2706a85b2039856be690",
    lockTime: "12 days",
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
            Connection contract information
          </h2>
        </div>
        <div className="grid md:grid-cols-[180px_1fr] gap-y-1 md:gap-y-4 text-[14px] leading-[19px] text-gray-700">
          <div className="text-[#858585] md:text-[#1C1C1C]">Hash</div>
          <div className="truncate max-w-full">{selectedRow.hash}</div>

          <hr className="md:hidden my-1" />

          <div className="text-[#858585] md:text-[#1C1C1C]">Network</div>
          <div>{selectedRow.network}</div>

          <hr className="md:hidden my-1" />

          <div className="text-[#858585] md:text-[#1C1C1C]">Status</div>
          <div>{selectedRow.status}</div>

          <hr className="md:hidden my-1" />

          <div className="text-[#858585] md:text-[#1C1C1C]">Creation Time</div>
          <div>{selectedRow.creationTime}</div>

          <hr className="md:hidden my-1" />

          <div className="text-[#858585] md:text-[#1C1C1C]">
            Connection Quantity
          </div>
          <div>{selectedRow.connectionQuality}</div>
          <hr className="md:hidden my-1" />

          <div className="text-[#858585] md:text-[#1C1C1C]">Initiator</div>
          <div className="flex gap-2 items-center">
            <span className="truncate max-w-full">{selectedRow.initiator}</span>
            <img src="/copy.svg" />
          </div>
          <hr className="md:hidden my-1" />

          <div className="text-[#858585] md:text-[#1C1C1C]">Receiver</div>
          <div className="flex gap-2 items-center">
            <span className="truncate max-w-full">{selectedRow.receiver}</span>{" "}
            <img src="/copy.svg" />
          </div>
          <hr className="md:hidden my-1" />

          <div className="text-[#858585] md:text-[#1C1C1C]">
            Connection Contract
          </div>
          <div className="flex gap-2 items-center">
            <span className="truncate max-w-full">
              {selectedRow.connectionContract}{" "}
            </span>
            <img src="/copy.svg" />
          </div>
          <hr className="md:hidden my-1" />

          <div className="text-[#858585] md:text-[#1C1C1C]">Lock Time</div>
          <div>{selectedRow.lockTime}</div>
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
                  {row.hash}
                </td>
                <td className="px-4 py-2 text-sm truncate max-w-[180px]">
                  <div className="flex gap-[15px]">
                    <div className="truncate max-w-[180px]">
                      {row.initiator}
                    </div>
                    <div>
                      <img src="/table-arrow.svg" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm truncate max-w-[180px]">
                  {row.receiver}
                </td>
                <td className="px-4 py-2 text-sm">{row.connectionQuality}</td>
                <td className="px-4 py-2 text-sm">{row.creationTime}</td>
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
                {row.hash}
              </span>
              <span onClick={() => onRowSelect(row)} className="text-[#2EA8AF]">
                {row.connectionQuality}
              </span>
            </div>
            <div className="flex justify-between text-sm font-normal mt-2">
              <span className="text-[#858585]">Initiator:</span>
              <span className="truncate max-w-[250px]">{row.initiator}</span>
            </div>
            <div className="flex justify-between text-sm font-normal mt-2">
              <span className="text-[#858585]">Receiver:</span>
              <span className="truncate max-w-[250px]">{row.receiver}</span>
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

const ConsensusConnectionTable = () => {
  const [selectedRow, setSelectedRow] = useState<any>(null);

  return (
    <div>
      {!selectedRow && (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
          <div className="px-0 py-4 md:px-4 md:py-0 text-[14px] leading-[19px] font-normal text-[#1C1C1C]">
            Connection contract information
          </div>
          <div className="flex gap-2">
            {["Token", "All network", "LUCA"].map((label) => (
              <div key={label} className="relative inline-block">
                <select
                  className="h-10 px-2 py-2 pr-10 rounded-lg border border-[#eeeeee] bg-transparent hover:bg-gray-50 flex items-center gap-3 appearance-none text-sm text-[#858585] focus:outline-none focus:ring-0"
                  defaultValue={label}
                >
                  <option value={label}>{label}</option>
                  <option value="Contract">Contract</option>
                  <option value="Hash">Hash</option>
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
        data={dataRewardPoints}
        showAction={true}
        onRowSelect={setSelectedRow}
        selectedRow={selectedRow}
      />
    </div>
  );
};

export default ConsensusConnectionTable;
