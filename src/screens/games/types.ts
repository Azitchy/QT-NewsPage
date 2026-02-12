import type { Game } from "@/lib/gameApi";
import type { RankingItem } from "@/lib/webApi";

export type GameDisplayStatus = "Ready to play" | "Contribution" | "Development";

export function mapGameStatus(status: Game["status"]): GameDisplayStatus {
  switch (status) {
    case "active":
      return "Ready to play";
    case "development":
      return "Development";
    case "inactive":
      return "Contribution";
    default:
      return "Development";
  }
}

export function getStatusBadgeClasses(displayStatus: GameDisplayStatus): string {
  switch (displayStatus) {
    case "Ready to play":
      return "bg-[#E8F8EE] text-[#27AE60]";
    case "Contribution":
      return "bg-[#FFF8E6] text-[#F2994A]";
    case "Development":
      return "bg-[#E8F0FE] text-[#2D9CDB]";
  }
}

export interface LeaderboardEntry extends RankingItem {
  level?: number;
}

export type LeaderboardRow = LeaderboardEntry | "separator";

export function getVisibleLeaderboardEntries(
  rankings: RankingItem[],
  userAddress: string | undefined
): LeaderboardRow[] {
  if (!rankings.length) return [];
  if (!userAddress) return rankings.slice(0, 5) as LeaderboardRow[];

  const userIdx = rankings.findIndex(
    (r) => r.address.toLowerCase() === userAddress.toLowerCase()
  );

  if (rankings.length <= 5 || userIdx < 0) {
    return rankings.slice(0, 5) as LeaderboardRow[];
  }

  const userRank = userIdx + 1;
  const entries: LeaderboardRow[] = [];

  // Always show top 2
  entries.push(rankings[0], rankings[1]);

  if (userRank <= 4) {
    // User is near top — show continuous range
    for (let i = 2; i <= Math.min(userRank, rankings.length - 1); i++) {
      entries.push(rankings[i]);
    }
  } else {
    // Show separator then user-1, user, user+1
    entries.push("separator");
    entries.push(rankings[userIdx - 1]); // rank before user
    entries.push(rankings[userIdx]); // user
    if (userIdx + 1 < rankings.length) {
      entries.push(rankings[userIdx + 1]); // rank after user
    }
  }

  return entries;
}

export function truncateAddress(address: string): string {
  if (address.length <= 13) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function deriveLevelFromAmount(totalAmount: number): number {
  if (totalAmount <= 0) return 1;
  return Math.floor(Math.log2(totalAmount + 1)) + 1;
}

export interface GameMilestone {
  number: number;
  title: string;
  description?: string;
  completed: boolean;
  txHash?: string;
}
