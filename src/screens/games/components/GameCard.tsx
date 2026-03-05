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

  const placeholderImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    game.title,
  )}&background=0DAEB9&color=fff&size=400&bold=true`;

  const imageSrc =
    (game as any).image || (game as any).coverImage || placeholderImage;

  return (
    <div
      onClick={() => navigate(`/games/games/${game.id}`)}
      className={`relative h-[220px] rounded-[15px] overflow-hidden cursor-pointer group ${className}`}
    >
      {/* Background Image */}
      <img
        src={imageSrc}
        alt={game.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          (e.target as HTMLImageElement).src = placeholderImage;
        }}
      />

      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      {/* Status badge */}
      <span
        className={`absolute top-[12px] left-[12px] px-[12px] py-[8px] rounded-full text-[12px] font-normal ${badgeClasses}`}
      >
        {displayStatus}
      </span>

      {/* Investment badge */}
      {game.totalInvestment != null && game.totalInvestment > 0 && (
        <div className="absolute top-[12px] right-[12px] flex items-center gap-[4px] bg-black/60 rounded-full px-[8px] py-[2px]">
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
      )}

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-[12px]">
        <h4 className="font-h4-400 text-white truncate">{game.title}</h4>

        <div className="flex items-center gap-[12px] mt-[6px]">
          <div className="flex items-center gap-[4px]">
            <span className="text-white/80 text-[12px]">
              {game.totalRatings || 0}
            </span>
            <Heart className="w-[14px] h-[14px]" fill="#FE5572" />
          </div>

          <div className="flex items-center gap-[4px]">
            <span className="text-white/80 text-[12px]">
              {game.totalRatings || 0}
            </span>
            <Users className="w-[14px] h-[14px] text-white/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
