import { useEffect, useState, useMemo } from "react";
import { Star, Wallet } from "lucide-react";
import { useUnified } from "@/context/Context";
import {
  useGetAllGames,
  useFetchRankList,
  useGetStars,
} from "@/hooks/useApi";
import GameCard from "./components/GameCard";
import LeaderboardCard from "./components/LeaderboardCard";
import LeaderboardPanel from "./components/LeaderboardPanel";
import { truncateAddress } from "./types";

export default function GamesDashboard() {
  const { address, isConnected, isAuthenticated, logout } = useUnified();

  // API hooks
  const { data: gamesResponse, execute: fetchGames } = useGetAllGames();
  const {
    data: atmRankData,
    loading: atmRankLoading,
    execute: fetchAtmRank,
  } = useFetchRankList();
  const {
    data: yourRankData,
    loading: yourRankLoading,
    execute: fetchYourRank,
  } = useFetchRankList();
  const { data: starsData, execute: fetchStars } = useGetStars();

  // Sliding panel state
  const [atmPanelOpen, setAtmPanelOpen] = useState(false);
  const [yourPanelOpen, setYourPanelOpen] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchGames();
    fetchAtmRank({ pageNo: 1, pageSize: 100, type: 1 });
    fetchYourRank({ pageNo: 1, pageSize: 100, type: 2 });
  }, []);

  useEffect(() => {
    if (isAuthenticated && address) {
      fetchStars({ agfUserId: parseInt(address.slice(-8), 16) || 0 });
    }
  }, [isAuthenticated, address]);

  const games = gamesResponse?.data || [];
  const atmRankings = atmRankData?.list || [];
  const yourRankings = yourRankData?.list || [];

  // User stats from stars data
  const stars = starsData?.data?.stars || starsData?.data?.totalStars || 143;
  const userLevel = starsData?.data?.level || 15;
  const currentXp = starsData?.data?.xp || 14281;
  const xpForNextLevel = starsData?.data?.xpToNext || 17000;
  const gamesPlayed = starsData?.data?.gamesPlayed || games.length || 12;
  const wins = starsData?.data?.wins || 25;
  const daysActive = starsData?.data?.daysActive || 172;

  const xpPercentage =
    xpForNextLevel > 0
      ? Math.min(Math.round((currentXp / xpForNextLevel) * 100), 100)
      : 0;

  // Recent games — take first 3
  const recentGames = useMemo(() => {
    return [...games]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 3);
  }, [games]);

  return (
    <div className="space-y-[20px]">
      {/* Main 3-column layout */}
      <div className="flex gap-[16px]">
        {/* Left Column - Profile */}
        <div className="w-[320px] flex-shrink-0 space-y-[16px]">
          {/* Your ATM Stars card */}
          <div className="rounded-[15px] bg-[#F6F6F6] p-[20px]">
            <div className="flex items-center justify-between mb-[16px]">
              <h3 className="font-h4-400 text-foreground">Your ATM Stars</h3>
              {isConnected && (
                <button
                  onClick={logout}
                  className="px-[16px] py-[6px] rounded-full border border-primary text-primary body-text2-400 hover:bg-[#E9F6F7] cursor-pointer transition-colors"
                >
                  Disconnect
                </button>
              )}
            </div>

            {/* Stars count */}
            <div className="flex items-center gap-[12px] mb-[12px]">
              <span className="text-[48px] font-bold text-foreground leading-none">
                {stars}
              </span>
              <Star className="w-[40px] h-[40px] text-[#FFB347] fill-[#FFB347]" />
            </div>

            {/* Wallet address */}
            {address && (
              <p className="body-text2-400 text-[#959595] mb-[16px] break-all">
                {address}
              </p>
            )}

            {/* Level + XP progress */}
            <div className="flex items-center gap-[12px] mb-[8px]">
              <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[#FFB347] to-[#FF8C00] flex items-center justify-center">
                <span className="text-white text-[14px] font-bold">
                  {userLevel}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-[4px]">
                  <div className="w-full bg-[#E5E5E5] rounded-full h-[8px] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#A5DC53] to-[#5DD27A] transition-all duration-500"
                      style={{ width: `${xpPercentage}%` }}
                    />
                  </div>
                </div>
                <p className="body-label-400 text-[#959595] text-right">
                  XP {currentXp.toLocaleString()} / {xpForNextLevel.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-[8px] mt-[16px]">
              <div className="rounded-[10px] bg-white p-[12px] text-center">
                <p className="body-label-400 text-[#959595]">Games</p>
                <p className="font-h4-400 text-foreground">{gamesPlayed}</p>
              </div>
              <div className="rounded-[10px] bg-white p-[12px] text-center">
                <p className="body-label-400 text-[#959595]">Wins</p>
                <p className="font-h4-400 text-foreground">{wins}</p>
              </div>
              <div className="rounded-[10px] bg-white p-[12px] text-center">
                <p className="body-label-400 text-[#959595]">Hours</p>
                <p className="font-h4-400 text-foreground">{daysActive}</p>
              </div>
            </div>
          </div>

          {/* Recent Games */}
          {recentGames.length > 0 && (
            <div>
              <h3 className="font-h4-400 text-foreground mb-[12px]">
                Recent games
              </h3>
              <div className="space-y-[12px]">
                {recentGames.map((game) => (
                  <GameCard key={`recent-${game.id}`} game={game} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Middle Column - ATM Universe Leaderboard */}
        <div className="flex-1 min-w-0">
          <LeaderboardCard
            title="ATM Universe leaderboard"
            subtitle="(All ATM users)"
            rankings={atmRankings}
            userAddress={address}
            loading={atmRankLoading}
            onSeeAll={() => setAtmPanelOpen(true)}
          />
        </div>

        {/* Right Column - Your Universe Leaderboard */}
        <div className="flex-1 min-w-0">
          <LeaderboardCard
            title="Your Universe leaderboard"
            subtitle="(ATM users you connected)"
            rankings={yourRankings}
            userAddress={address}
            loading={yourRankLoading}
            onSeeAll={() => setYourPanelOpen(true)}
          />
        </div>
      </div>

      {/* Sliding Panels */}
      <LeaderboardPanel
        isOpen={atmPanelOpen}
        onClose={() => setAtmPanelOpen(false)}
        title="ATM Universe leaderboard"
        rankings={atmRankings}
        userAddress={address}
        loading={atmRankLoading}
      />
      <LeaderboardPanel
        isOpen={yourPanelOpen}
        onClose={() => setYourPanelOpen(false)}
        title="Your Universe leaderboard"
        rankings={yourRankings}
        userAddress={address}
        loading={yourRankLoading}
      />
    </div>
  );
}
