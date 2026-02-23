import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useGetUserAGTRecord } from "@/hooks/useWebAppService";
import { useUnified } from "@/context/Context";

type HistoryItem = {
  date: string;
  type: string;
  amount: string;
  status: string;
};

const ITEMS_PER_PAGE = 10;

export default function AGTRecord({
  onBack,
  agtBalance,
}: {
  onBack: () => void;
  agtBalance: any;
}) {
  const { walletProvider } = useUnified();
  const { data, loading, error, execute: fetchAGTRecord } = useGetUserAGTRecord();

  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAGTRecord({ pageNo: page, pageSize: ITEMS_PER_PAGE, walletProvider });
  }, [page, walletProvider]);

  const rawList: any[] = data?.list || [];

  // Normalize API response fields to display fields
  const historyItems: HistoryItem[] = rawList.map((item: any) => {
    // Date: try createTime, time, date fields
    let date = item.createTime || item.time || item.date || "";
    if (date && typeof date === "number") {
      date = new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, ".");
    } else if (date && typeof date === "string" && date.includes("T")) {
      date = new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, ".");
    }

    // Type: try type, typeName, remark fields
    const type = item.typeName || item.type || item.remark || "AGT Record";

    // Amount
    const amount =
      item.amount != null
        ? `${Number(item.amount).toFixed(2)} AGT`
        : item.agtAmount != null
        ? `${Number(item.agtAmount).toFixed(2)} AGT`
        : "0.00 AGT";

    // Status
    const statusRaw = item.status ?? item.state ?? 1;
    let status = "Completed";
    if (statusRaw === 0 || statusRaw === "0" || statusRaw === "pending" || statusRaw === "Pending") {
      status = "Pending";
    }

    return { date, type, amount, status };
  });

  const totalItems = historyItems.length;
  const startItem = totalItems === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, totalItems);
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
        <p className="text-[20px] font-semibold text-foreground">
          {agtBalance}
        </p>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl p-5">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
            <span className="body-text2-400 text-[#959595]">Loading records...</span>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="body-text2-400 text-destructive">Failed to load AGT records</p>
          </div>
        ) : (
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
              {historyItems.length > 0 ? (
                historyItems.map((item, idx) => (
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
        )}

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
