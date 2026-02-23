import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, ExternalLink } from "lucide-react";
import { useUnified } from "@/context/Context";
import { useGetAllGames } from "@/hooks/useWebAppService";
import type { Game } from "@/hooks/useWebAppService";
import ContributionChart from "./components/ContributionChart";
import { mapGameStatus, getStatusBadgeClasses } from "./types";
import type { GameMilestone } from "./types";

export default function Contributions() {
  const { address, isConnected, isAuthenticated, openModal } = useUnified();
  const { data: gamesResponse, loading, execute: fetchGames } = useGetAllGames();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const games = gamesResponse?.data || [];

  // Filter games that have contributions (totalInvestment > 0)
  const contributedGames = useMemo(() => {
    return games.filter((g) => (g.totalInvestment || 0) > 0);
  }, [games]);

  // Auto-select first game
  useEffect(() => {
    if (contributedGames.length > 0 && !selectedGame) {
      setSelectedGame(contributedGames[0]);
    }
  }, [contributedGames, selectedGame]);

  if (!isConnected) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-[28px] h-[28px] border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (contributedGames.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 max-w-md">
          <h3 className="font-h4-600 text-foreground">No contributions yet</h3>
          <p className="body-text2-400 text-[#959595]">
            You haven't contributed to any games yet. Browse games to find ones
            you'd like to support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-[20px]">
      {/* Game list */}
      <div className={selectedGame ? "w-[55%]" : "w-full"}>
        <div className="space-y-[12px]">
          {contributedGames.map((game) => {
            const displayStatus = mapGameStatus(game.status);
            const badgeClasses = getStatusBadgeClasses(displayStatus);
            const isSelected = selectedGame?.id === game.id;
            const placeholderImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(game.title)}&background=0DAEB9&color=fff&size=100&bold=true`;

            return (
              <div
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className={`flex items-center gap-[16px] p-[16px] rounded-[15px] cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#E9F6F7] border-2 border-primary"
                    : "bg-[#F6F6F6] hover:bg-[#EFEFEF] border-2 border-transparent"
                }`}
              >
                {/* Game thumbnail */}
                <div className="w-[80px] h-[60px] rounded-[10px] overflow-hidden flex-shrink-0">
                  <img
                    src={
                      (game as any).image ||
                      (game as any).coverImage ||
                      placeholderImage
                    }
                    alt={game.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = placeholderImage;
                    }}
                  />
                </div>

                {/* Game info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-[8px] mb-[4px]">
                    <h4 className="body-text1-500 text-foreground truncate">
                      {game.title}
                    </h4>
                    <span
                      className={`px-[8px] py-[2px] rounded-full text-[11px] font-medium ${badgeClasses}`}
                    >
                      {displayStatus}
                    </span>
                  </div>
                  <p className="body-label-400 text-[#959595]">
                    {game.category}
                  </p>
                </div>

                {/* Contribution amount */}
                <div className="text-right flex-shrink-0">
                  <p className="body-text1-500 text-foreground">
                    {(game.totalInvestment || 0).toLocaleString()} USDC
                  </p>
                  <p className="body-label-400 text-[#959595]">
                    Total contributed
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      {selectedGame && (
        <div className="w-[45%] sticky top-[20px] self-start space-y-[16px]">
          {/* Contribution overview */}
          <div className="rounded-[15px] bg-[#F6F6F6] p-[20px]">
            <h4 className="font-h4-400 text-foreground mb-[4px]">
              {selectedGame.title}
            </h4>
            <p className="body-label-400 text-[#959595] mb-[16px]">
              {selectedGame.category}
            </p>

            {/* Chart */}
            <div className="flex justify-center mb-[16px]">
              <ContributionChart
                totalContributed={selectedGame.totalInvestment || 0}
                goalAmount={(selectedGame as any).funds || 2000}
                size={160}
              />
            </div>

            {/* Stats */}
            <div className="space-y-[8px]">
              <div className="flex justify-between">
                <span className="body-text2-400 text-[#959595]">
                  Total contribution
                </span>
                <span className="body-text2-400 text-foreground font-medium">
                  {(selectedGame.totalInvestment || 0).toLocaleString()} USDC
                </span>
              </div>
              <div className="flex justify-between">
                <span className="body-text2-400 text-[#959595]">
                  Your contribution
                </span>
                <span className="body-text2-400 text-foreground font-medium">
                  0 USDC
                </span>
              </div>
              <div className="flex justify-between">
                <span className="body-text2-400 text-[#959595]">Goal</span>
                <span className="body-text2-400 text-foreground font-medium">
                  {((selectedGame as any).funds || 2000).toLocaleString()} USDC
                </span>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="rounded-[15px] bg-[#F6F6F6] p-[20px]">
            <h4 className="font-h4-400 text-foreground mb-[16px]">
              Milestones
            </h4>
            <div className="space-y-[12px]">
              {(
                (selectedGame as any).milestones || [
                  { title: "Mechanics Implementation", completed: false },
                  { title: "Physics and Collisions", completed: false },
                  { title: "User Interface", completed: false },
                  { title: "Basic gameplay mechanics", completed: false },
                  { title: "Scoring system", completed: false },
                  { title: "Testing and refinement", completed: false },
                  { title: "Release", completed: false },
                ]
              ).map((milestone: any, index: number) => (
                <div key={index} className="flex items-center gap-[12px]">
                  <div
                    className={`w-[24px] h-[24px] rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-medium ${
                      milestone.completed
                        ? "bg-gradient-to-br from-[#A5DC53] to-[#5DD27A] text-white"
                        : "bg-[#E5E5E5] text-[#959595]"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`body-text2-400 ${
                        milestone.completed
                          ? "text-foreground font-medium"
                          : "text-[#959595]"
                      }`}
                    >
                      {milestone.title}
                    </p>
                  </div>
                  {milestone.completed && milestone.txHash && (
                    <a
                      href={`https://bscscan.com/tx/${milestone.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary"
                    >
                      <ExternalLink className="w-[14px] h-[14px]" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* View full game button */}
          <button
            onClick={() =>
              window.location.assign(`/games/games/${selectedGame.id}`)
            }
            className="w-full py-[12px] rounded-[30px] border-2 border-primary text-primary body-text2-400 hover:bg-[#E9F6F7] cursor-pointer transition-colors text-center"
          >
            View full game details
          </button>
        </div>
      )}
    </div>
  );
}
