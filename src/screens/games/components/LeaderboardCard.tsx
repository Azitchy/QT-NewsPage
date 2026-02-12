import { Crown } from "lucide-react";
import type { RankingItem } from "@/lib/webApi";
import {
  getVisibleLeaderboardEntries,
  truncateAddress,
  deriveLevelFromAmount,
} from "../types";

interface LeaderboardCardProps {
  title: string;
  subtitle?: string;
  rankings: RankingItem[];
  userAddress: string | undefined;
  loading: boolean;
  onSeeAll: () => void;
}

export default function LeaderboardCard({
  title,
  subtitle,
  rankings,
  userAddress,
  loading,
  onSeeAll,
}: LeaderboardCardProps) {
  const visibleEntries = getVisibleLeaderboardEntries(rankings, userAddress);

  const isUserRow = (entry: RankingItem) =>
    userAddress &&
    entry.address.toLowerCase() === userAddress.toLowerCase();

  return (
    <div className="rounded-[15px] bg-white p-[20px] h-full">
      <h3 className="font-h4-400 text-foreground">{title}</h3>
      {subtitle && (
        <p className="body-label-400 text-[#959595] mt-[2px]">{subtitle}</p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-[40px]">
          <div className="w-[24px] h-[24px] border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : rankings.length === 0 ? (
        <div className="py-[40px] text-center">
          <p className="body-text2-400 text-[#959595]">No rankings available</p>
        </div>
      ) : (
        <div className="mt-[16px] space-y-[2px]">
          {visibleEntries.map((entry, index) => {
            if (entry === "separator") {
              return (
                <div
                  key={`sep-${index}`}
                  className="flex items-center justify-center py-[4px]"
                >
                  <span className="text-[#959595] text-[18px] tracking-widest">
                    ...
                  </span>
                </div>
              );
            }

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
                  className={`w-[28px] text-center body-text1-500 ${
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

          {/* See all button */}
          <button
            onClick={onSeeAll}
            className="mt-[12px] text-primary body-text2-400 hover:underline cursor-pointer"
          >
            See all
          </button>
        </div>
      )}
    </div>
  );
}
