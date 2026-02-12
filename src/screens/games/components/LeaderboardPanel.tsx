import { useEffect } from "react";
import { X, Crown } from "lucide-react";
import type { RankingItem } from "@/lib/webApi";
import { truncateAddress, deriveLevelFromAmount } from "../types";

interface LeaderboardPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  rankings: RankingItem[];
  userAddress: string | undefined;
  loading: boolean;
}

export default function LeaderboardPanel({
  isOpen,
  onClose,
  title,
  rankings,
  userAddress,
  loading,
}: LeaderboardPanelProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isUserRow = (entry: RankingItem) =>
    userAddress &&
    entry.address.toLowerCase() === userAddress.toLowerCase();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[420px] max-w-[90vw] bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-[20px] border-b border-[#F0F0F0]">
          <h3 className="font-h4-400 text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-[4px] rounded-full hover:bg-[#F6F6F6] cursor-pointer transition-colors"
          >
            <X className="w-[20px] h-[20px] text-[#959595]" />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-65px)] overflow-y-auto p-[20px]">
          {loading ? (
            <div className="flex items-center justify-center py-[40px]">
              <div className="w-[24px] h-[24px] border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : rankings.length === 0 ? (
            <div className="py-[40px] text-center">
              <p className="body-text2-400 text-[#959595]">
                No rankings available
              </p>
            </div>
          ) : (
            <div className="space-y-[2px]">
              {rankings.map((entry) => {
                const level = deriveLevelFromAmount(entry.totalAmount);
                const highlighted = isUserRow(entry);

                return (
                  <div
                    key={`${entry.rank}-${entry.address}`}
                    className={`flex items-center gap-[12px] px-[12px] py-[10px] rounded-[10px] transition-colors ${
                      highlighted
                        ? "bg-[#E9F6F7]"
                        : "hover:bg-[#FAFAFA]"
                    }`}
                  >
                    {/* Rank */}
                    <span
                      className={`w-[32px] text-center body-text1-500 ${
                        highlighted ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {entry.rank}
                    </span>

                    {/* Address */}
                    <span
                      className={`flex-1 body-text2-400 ${
                        highlighted
                          ? "text-primary font-medium"
                          : "text-foreground"
                      }`}
                    >
                      {truncateAddress(entry.address)}
                    </span>

                    {/* Level */}
                    <span
                      className={`body-text2-400 ${
                        highlighted ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {level} LVL
                    </span>

                    {/* Crown for rank 1 */}
                    {entry.rank === 1 && (
                      <Crown className="w-[18px] h-[18px] text-[#FFD700]" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
