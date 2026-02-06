import { Button } from "@/components/ui/atm/button";
import { ConfirmationModal } from "@/components/ui/atm/confirmationModal";
import { Dropdown } from "@/components/ui/atm/dropdown";
import { LoadingAnimation } from "@/components/ui/atm/loadingAnimation";
import { Toast } from "@/components/ui/atm/toastMessage";
import { CandyCane, Check, Cross, Plane, Plus, X } from "lucide-react";
import React, { useState } from "react";
import TokenBalance from "./TokenBalance";
import BalanceSection from "./BalanceSection";
import { PieChartCard } from "./PiechartCard";
import AGTRecord from "./AGTRecord";

const options = [
  { label: "A–Z", value: "az" },
  { label: "Z–A", value: "za" },
  { label: "Balance: High to low", value: "high" },
  { label: "Balance: Low to high", value: "low" },
];

const lucaData = [
  { name: "Mine", value: 500 },
  { name: "Others", value: 1698 },
];

const lucaColors = ["#56B299", "#C3E58E"];

const connectionData = [
  { name: "Active", value: 6 },
  { name: "Pending", value: 22 },
  { name: "Inactive", value: 36 },
];

const connectionColors = ["#81DED8", "#72AEF4", "#F8B38C"];

function Dashboard() {
  const [sort, setSort] = useState("high");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAGTHistory, setShowAGTHistory] = useState(false);

  return (
    <div className=" h-[2000px] rounded-[20px] p-6">
      {/* <Dropdown options={options} value={sort} onChange={setSort} /> */}
      {/* <ConfirmationModal
        isOpen={isModalOpen}
        title="Token removal confirmation"
        description="You can import this token again later from the filter options"
        message={`Are you sure you want to remove the token?`}
        onConfirm={() => alert("ok")}
        onCancel={() => {
          setToast({
            message: "Tokens imported successfully",
            type: "success",
          });
          setIsModalOpen(false);
          setIsLoading(true);
        }}
      /> */}
      {/* {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )} */}

      {!showAGTHistory ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row gap-5">
            <BalanceSection onSeeHistory={() => setShowAGTHistory(true)} />
            <PieChartCard
              title="Locked amount of LUCA"
              data={lucaData}
              colors={lucaColors}
              innerRadius={95}
              outerRadius={110}
              width={290}
              height={260}
            />
            <PieChartCard
              title="Connections"
              data={connectionData}
              colors={connectionColors}
              innerRadius={95}
              outerRadius={110}
              width={290}
              height={260}
            />
          </div>
          <div className="flex flex-col gap-5">
            <TokenBalance />
          </div>
        </div>
      ) : (
        <AGTRecord onBack={() => setShowAGTHistory(false)} />
      )}
    </div>
  );
}

export default Dashboard;
