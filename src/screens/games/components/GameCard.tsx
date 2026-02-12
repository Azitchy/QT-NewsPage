import { useNavigate } from "react-router-dom";
import { Heart, Users } from "lucide-react";
import type { Game } from "@/lib/gameApi";
import { mapGameStatus, getStatusBadgeClasses } from "../types";

interface GameCardProps {
  game: Game;
  className?: string;
}

export default function GameCard({ game, className = "" }: GameCardProps) {
  const navigate = useNavigate();
  const displayStatus = mapGameStatus(game.status);
  const badgeClasses = getStatusBadgeClasses(displayStatus);

  const placeholderImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(game.title)}&background=0DAEB9&color=fff&size=400&bold=true`;

  return (
    <div
      onClick={() => navigate(`/games/games/${game.id}`)}
      className={`rounded-[15px] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-white ${className}`}
    >
      {/* Image container */}
      <div className="relative h-[180px] overflow-hidden">
        <img
          src={(game as any).image || (game as any).coverImage || placeholderImage}
          alt={game.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = placeholderImage;
          }}
        />
        {/* Status badge */}
        <span
          className={`absolute top-[12px] left-[12px] px-[12px] py-[4px] rounded-full text-[12px] font-medium ${badgeClasses}`}
        >
          {displayStatus}
        </span>

        {/* Overlay stats on image (for games with rating/investment data) */}
        {game.totalInvestment != null && game.totalInvestment > 0 && (
          <div className="absolute top-[12px] right-[12px] flex items-center gap-[8px]">
            <div className="flex items-center gap-[4px] bg-black/50 rounded-full px-[8px] py-[2px]">
              <img
                src="/img/currency/luca.png"
                alt="LUCA"
                className="w-[14px] h-[14px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-white text-[11px]">
                {game.totalInvestment.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-[12px]">
        <h4 className="font-h4-400 text-foreground truncate">{game.title}</h4>
        <div className="flex items-center gap-[12px] mt-[8px]">
          <div className="flex items-center gap-[4px]">
            <Heart className="w-[14px] h-[14px] text-[#FF6B6B]" />
            <span className="body-label-400 text-[#959595]">
              {game.totalRatings || 0}
            </span>
          </div>
          <div className="flex items-center gap-[4px]">
            <Users className="w-[14px] h-[14px] text-[#959595]" />
            <span className="body-label-400 text-[#959595]">
              {game.totalRatings || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
