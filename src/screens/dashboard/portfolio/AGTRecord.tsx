import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type HistoryItem = {
  date: string;
  type: string;
  amount: string;
  status: "Completed" | "Pending";
};

const dummyData: HistoryItem[] = [
  {
    date: "09.01.2024",
    type: "Create connection reward",
    amount: "12.34 AGT",
    status: "Completed",
  },
  {
    date: "15.12.2023",
    type: "Create connection reward",
    amount: "10.18 AGT",
    status: "Completed",
  },
  {
    date: "23.11.2023",
    type: "Create connection reward",
    amount: "9.12 AGT",
    status: "Completed",
  },
  {
    date: "08.11.2023",
    type: "Create connection reward",
    amount: "11.12 AGT",
    status: "Completed",
  },
  {
    date: "24.10.2023",
    type: "Create connection reward",
    amount: "14.24 AGT",
    status: "Completed",
  },
  {
    date: "08.09.2023",
    type: "Create connection reward",
    amount: "12.12 AGT",
    status: "Completed",
  },
  {
    date: "19.08.2023",
    type: "Create connection reward",
    amount: "8.22 AGT",
    status: "Completed",
  },
  {
    date: "11.08.2023",
    type: "Create connection reward",
    amount: "9.31 AGT",
    status: "Completed",
  },
  {
    date: "26.07.2023",
    type: "Create connection reward",
    amount: "12.76 AGT",
    status: "Completed",
  },
  {
    date: "14.07.2023",
    type: "Create connection reward",
    amount: "0.12 AGT",
    status: "Completed",
  },
  {
    date: "30.06.2023",
    type: "Create connection reward",
    amount: "0.12 AGT",
    status: "Completed",
  },
  {
    date: "12.05.2023",
    type: "Create connection reward",
    amount: "0.12 AGT",
    status: "Completed",
  },
  {
    date: "08.04.2023",
    type: "Create connection reward",
    amount: "0.12 AGT",
    status: "Completed",
  },
  {
    date: "25.03.2023",
    type: "Create connection reward",
    amount: "0.12 AGT",
    status: "Completed",
  },
  {
    date: "07.03.2023",
    type: "Create connection reward",
    amount: "0.12 AGT",
    status: "Completed",
  },
  {
    date: "23.02.2023",
    type: "Create connection reward",
    amount: "0.12 AGT",
    status: "Completed",
  },
  {
    date: "12.02.2023",
    type: "Create connection reward",
    amount: "0.12 AGT",
    status: "Completed",
  },
  {
    date: "28.01.2023",
    type: "Create connection reward",
    amount: "0.12 AGT",
    status: "Completed",
  },
  {
    date: "16.01.2023",
    type: "Create connection reward",
    amount: "0.12 AGT",
    status: "Completed",
  },
  {
    date: "16.01.2023",
    type: "Create connection reward",
    amount: "0.12 AGT",
    status: "Completed",
  },
];

const ITEMS_PER_PAGE = 10;

export default function AGTRecord({ onBack }: { onBack: () => void }) {
  const [page, setPage] = useState(1);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const currentData = dummyData.slice(start, start + ITEMS_PER_PAGE);

  const totalItems = dummyData.length;
  const startItem = start + 1;
  const endItem = Math.min(start + ITEMS_PER_PAGE, totalItems);

  const hasData = totalItems > 0;

  return (
    <div className="w-full">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 body-text1-400 text-foreground mb-2.5 cursor-pointer"
      >
        <ArrowLeft
          className="w-6 h-6 text-muted-foreground"
          strokeWidth={1.6}
        />
        Go back
      </button>

      {/* Header */}
      <div className="flex gap-1 mb-2.5">
        <p className="font-h4-400 text-foreground">AGT balance:</p>
        <p className="text-[20px] font-semibold text-foreground">180</p>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl p-5">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className="text-left body-text2-500 text-foreground border-b">
              <th className="pb-3">Date</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, idx) => (
                <tr key={idx} className="body-text2-400 text-foreground">
                  <td className="py-4">{item.date}</td>
                  <td className="py-4">{item.type}</td>
                  <td className="py-4">{item.amount}</td>
                  <td className="py-4">{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                  <p className="body-text2-400 text-[#959595]">
                    No Records found
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {hasData && (
          <div className="flex flex-col items-center mt-6 gap-2">
            <div className="flex items-center gap-2 bg-card border border-[#EBEBEB] rounded-full px-2 py-1">
              {/* Previous */}
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-primary hover:bg-muted disabled:text-gray-400 disabled:hover:bg-transparent cursor-pointer"
              >
                <ArrowLeft className="w-6 h-6" strokeWidth={1.6} />
              </button>

              {/* Current page */}
              <div className="w-8 h-8 flex items-center justify-center text-primary body-text2-500">
                {page}
              </div>

              {/* Next */}
              <button
                disabled={page * ITEMS_PER_PAGE >= totalItems}
                onClick={() => setPage((p) => p + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-primary hover:bg-muted disabled:text-gray-400 disabled:hover:bg-transparent cursor-pointer"
              >
                <ArrowRight className="w-6 h-6" strokeWidth={1.6} />
              </button>
            </div>

            {/* Range text */}
            <p className="body-text2-400 text-muted-foreground">
              {startItem}–{endItem} of {totalItems}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
