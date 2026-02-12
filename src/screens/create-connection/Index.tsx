import { ChevronDown, User, X } from "lucide-react";
import { useState } from "react";
import LucaIcon from "@/assets/tokens/luca.svg?react";
import { Slider } from "./Slider";
import { Switch } from "@/components/ui/atm/switch";
import { Button } from "@/components/ui/atm/button";
import { LoadingAnimation } from "@/components/ui/atm/loadingAnimation";
import { Toast } from "@/components/ui/atm/toastMessage";

export default function CreateConnection() {
  const [connectionWith, setConnectionWith] = useState("");
  const [mine, setMine] = useState("");
  const [others, setOthers] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("365");
  const [customPeriod, setCustomPeriod] = useState("");
  const [isPrivateMessage, setIsPrivateMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const USER_BALANCE = 24242.23;

  // Calculate total and percentage
  const mineNum = Number(mine) || 0;
  const othersNum = Number(others) || 0;

  const totalLuca = mineNum + othersNum;

  const sliderPercentage =
    totalLuca > 0 ? Math.round((mineNum / totalLuca) * 100) : 0;

  const isCustomValid =
    selectedPeriod !== "custom" ||
    (customPeriod !== "" &&
      !isNaN(Number(customPeriod)) &&
      Number(customPeriod) >= 2 &&
      Number(customPeriod) <= 1825);

  const finalPeriodDays =
    selectedPeriod === "custom"
      ? Number(customPeriod) || 0
      : Number(selectedPeriod);

  const isFormValid =
    connectionWith.trim() !== "" &&
    mine !== "" &&
    others !== "" &&
    mineNum > 0 &&
    othersNum > 0 &&
    isCustomValid &&
    finalPeriodDays >= 2;

  const resetForm = () => {
    setConnectionWith("");
    setMine("");
    setOthers("");
    setSelectedPeriod("365");
    setCustomPeriod("");
    setIsPrivateMessage(false);
    setMessage("");
  };

  const handleClear = () => {
    setConnectionWith("");
  };

  const handleMaxClick = () => {
    setMine(String(USER_BALANCE));
  };

  const handleSliderChange = (percentage: number) => {
    if (totalLuca > 0) {
      const newMine = Math.round((totalLuca * percentage) / 100);
      const newOthers = totalLuca - newMine;
      setMine(String(newMine));
      setOthers(String(newOthers));
    }
  };

  const handleMineChange = (value: string) => {
    if (value === "" || Number(value) >= 0) setMine(value);
  };

  const handleOthersChange = (value: string) => {
    if (value === "" || Number(value) >= 0) setOthers(value);
  };

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
    if (period !== "custom") {
      setCustomPeriod("");
    }
  };

  const handleCustomPeriodChange = (value: string) => {
    setSelectedPeriod("custom");
    setCustomPeriod(value);
  };

  const handleConfirm = async () => {
    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setToast({
        message: "Connection request sent successfully!",
        type: "success",
      });

      resetForm();
    } catch (err) {
      setToast({
        message: "Failed to send connection request",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-[16px] md:gap-[10px]">
      {/* Connection Instructions */}
      <div className="p-[12px] md:p-[20px] rounded-[15px] bg-card md:w-1/2 md:order-2">
        <h4 className="font-h4-400 mb-[30px] md:mb-[20px] text-foreground">
          Connection instructions
        </h4>

        <ol className="body-text-400 list-decimal list-outside space-y-4 ml-[20px] text-foreground">
          <li>
            The connection is successfully created only if the other party
            agrees.
          </li>
          <li>
            Both parties shall deduct a certain amount of liquidated damages for
            early redemption.
          </li>
          <li>
            In the process of establishing a connection, the Gas Price fee will
            be borne by the user.
          </li>
          <li>
            The funds will be returned to the original payment account if the
            connection creation fails.
          </li>
        </ol>
      </div>

      {/* Create Connection */}
      <div className="p-[30px] rounded-[15px] bg-card md:w-1/2 md:order-1">
        <h4 className="font-h4-400 mb-[20px] text-foreground">
          Create Connection
        </h4>

        <div className="space-y-[30px]">
          {/* With Section */}
          <div className="space-y-[10px]">
            <span className="block text-[#8E8E93] body-text-400">With</span>

            {/* "With" Input field */}
            <div className="relative">
              <div
                className={`absolute left-[16px] top-1/2 -translate-y-1/2 transition-all duration-300 ${
                  connectionWith
                    ? "opacity-0 scale-75"
                    : "opacity-100 scale-100"
                }`}
              >
                <User className="w-[24px] h-[24px] text-primary" />
              </div>

              <input
                type="text"
                value={connectionWith}
                onChange={(e) => setConnectionWith(e.target.value)}
                placeholder="0x1234a1fdc2f34a6b1f2rae1ee12f345adbf0000"
                className={`w-full px-[10px] py-[15px] rounded-[12px] bg-[#F8F8F8] dark:bg-[#383D4C] placeholder:text-[#878787] text-foreground body-text1-400 transition-all duration-300 focus:outline-none focus:border-primary ${
                  connectionWith ? "pl-[16px] pr-[48px]" : "pl-[48px] pr-[16px]"
                }`}
              />

              <button
                onClick={handleClear}
                className={`absolute right-[16px] top-1/2 -translate-y-1/2 transition-all duration-300 bg-[#F2F2F2] rounded-full p-1 ${
                  connectionWith
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-75 pointer-events-none"
                }`}
                aria-label="Clear input"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>

          {/* Amount Section */}
          <div className="space-y-[5px]">
            {/* Amount, Balance and Max */}
            <div className="flex justify-between">
              <span className="block text-[#8E8E93] body-text-400">Amount</span>

              <div className="space-x-[5px]">
                <span className="text-[#868686] body-label-400">
                  Balance: {USER_BALANCE}
                </span>

                <button
                  onClick={handleMaxClick}
                  className="px-[10px] py-[5px] border border-[#EBEBEB] rounded-[20px] text-foreground body-label-400 cursor-pointer"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Amount Values and Slider */}
            <div className="bg-[#F8F8F8] rounded-[12px] py-[12px]">
              {/* Mine */}
              <div className="px-[16px] mb-[5px]">
                <div className="flex justify-between">
                  <input
                    type="number"
                    value={mine || ""}
                    onChange={(e) => handleMineChange(e.target.value)}
                    placeholder="0"
                    className="placeholder:text-foreground font-h1 bg-transparent focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="0"
                  />

                  {/* Currency Dropdown */}
                  <div className="flex items-center">
                    <LucaIcon className="w-[62px] h-[62px]" />
                    <ChevronDown className="w-[14px] h-[14px] text-[#434343]" />
                  </div>
                </div>
                <span className="text-[#8E8E93] body-label-400">Mine</span>
              </div>

              {/* Slider */}
              <Slider value={sliderPercentage} onChange={handleSliderChange} />
              <div className="pr-[12px] text-end body-label-400 text-[#878787]">
                {totalLuca} LUCA
              </div>

              {/* Others */}
              <div className="px-[16px] mt-[5px]">
                <div className="flex justify-between">
                  <input
                    type="number"
                    value={others || ""}
                    onChange={(e) => handleOthersChange(e.target.value)}
                    placeholder="0"
                    className="placeholder:text-foreground font-h1 bg-transparent focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="0"
                  />
                </div>
                <span className="text-[#8E8E93] body-label-400">Others</span>
              </div>
            </div>
          </div>

          {/* Period (days) Section */}
          <div className="space-y-[5px]">
            <span className="block text-[#8E8E93] body-text-400">
              Period (days)
            </span>

            <div className="flex gap-[5px]">
              {/* First 3 preset buttons with gradient border */}
              <div
                className={`w-[15%] rounded-[12px] p-[2px] transition-all ${
                  selectedPeriod === "180"
                    ? "bg-gradient-to-r from-[#A5DC53] to-[#5DD27A]"
                    : "bg-[#EBEBEB]"
                }`}
              >
                <button
                  onClick={() => handlePeriodSelect("180")}
                  className="w-full py-[15px] px-[8px] rounded-[10px] body-text-400 bg-white text-foreground"
                >
                  180
                </button>
              </div>

              <div
                className={`w-[15%] rounded-[12px] p-[2px] transition-all ${
                  selectedPeriod === "365"
                    ? "bg-gradient-to-r from-[#A5DC53] to-[#5DD27A]"
                    : "bg-[#EBEBEB]"
                }`}
              >
                <button
                  onClick={() => handlePeriodSelect("365")}
                  className="w-full py-[15px] px-[8px] rounded-[10px] body-text-400 bg-white text-foreground"
                >
                  365
                </button>
              </div>

              <div
                className={`w-[15%] rounded-[12px] p-[2px] transition-all ${
                  selectedPeriod === "1825"
                    ? "bg-gradient-to-r from-[#A5DC53] to-[#5DD27A]"
                    : "bg-[#EBEBEB]"
                }`}
              >
                <button
                  onClick={() => handlePeriodSelect("1825")}
                  className="w-full py-[15px] px-[8px] rounded-[10px] body-text-400 bg-white text-foreground"
                >
                  1825
                </button>
              </div>

              {/* Custom input field wrapper for gradient border */}
              <div
                className={`w-[55%] rounded-[12px] p-[2px] transition-all ${
                  selectedPeriod === "custom"
                    ? "bg-gradient-to-r from-[#A5DC53] to-[#5DD27A]"
                    : "bg-[#EBEBEB]"
                }`}
              >
                <input
                  type="number"
                  value={customPeriod}
                  onChange={(e) => handleCustomPeriodChange(e.target.value)}
                  onClick={() => setSelectedPeriod("custom")}
                  placeholder="Number of days from 2 to 1825"
                  min="2"
                  max="1825"
                  className="w-full py-[16.5px] px-[12px] rounded-[10px] body-text1-400 focus:outline-none bg-white text-foreground placeholder:text-[#878787] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-[5px]">
            <span className="block text-[#8E8E93] body-text-400">Message </span>
            <textarea
              placeholder="Add a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-[80px] p-[16px] rounded-[12px] bg-[#F8F8F8] placeholder:text-[#878787] text-foreground body-text1-400 focus:outline-none resize-none"
            ></textarea>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-0.5">
                <span className="body-text1-400 text-foreground">
                  Private message
                </span>
                <span className="body-text2-400 text-[#4F5555]">
                  (only visible for you and connected user)
                </span>
              </div>

              <Switch
                checked={isPrivateMessage}
                onCheckedChange={setIsPrivateMessage}
              />
            </div>
          </div>

          <div className="text-center space-y-[20px]">
            <span className="block text-[#999999] body-text2-400">
              {" "}
              Expected {0} AGT.{" "}
            </span>
            <Button
              disabled={!isFormValid || isSubmitting}
              onClick={handleConfirm}
              size="lg"
              className="w-[137px]"
              variant={!isFormValid ? "disabled" : "default"}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>

      {/* Loading Animation */}
      <LoadingAnimation isVisible={isSubmitting} />

      {/* Toast Message */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
