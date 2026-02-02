import { Button } from "@/components/ui/atm/button";
import { ConfirmationModal } from "@/components/ui/atm/confirmationModal";
import { Dropdown } from "@/components/ui/atm/dropdown";
import { LoadingAnimation } from "@/components/ui/atm/loadingAnimation";
import { Toast } from "@/components/ui/atm/toastMessage";
import { CandyCane, Check, Cross, Plane, Plus, X } from "lucide-react";
import React, { useState } from "react";
import TokenBalance from "./TokenBalance";

const options = [
  { label: "A–Z", value: "az" },
  { label: "Z–A", value: "za" },
  { label: "Balance: High to low", value: "high" },
  { label: "Balance: Low to high", value: "low" },
];

function Dashboard() {
  const [sort, setSort] = useState("high");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="bg-white h-[2000px] rounded-[20px] p-6">
      <h1 className="text-2xl font-bold">Dashboard Page</h1>

      <Button variant="success">Create Connection</Button>
      <Button variant="gradient" size="lg">
        Cancel
      </Button>

      <Dropdown options={options} value={sort} onChange={setSort} />
      <ConfirmationModal
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
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* <LoadingAnimation isVisible={isLoading} /> */}
      <Check className="bg-[#12B463] rounded-full p-1 w-6 h-6" />
      <X className="bg-[#FE5572] rounded-full p-1 w-6 h-6" />
      <TokenBalance />
    </div>
  );
}

export default Dashboard;
