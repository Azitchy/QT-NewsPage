import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import chatImage from "@/assets/images/chat_explore.png";
import avatarImage from "@/assets/images/avatar_explore.png";
import gamesImage from "@/assets/images/games_explore.png";
import travelImage from "@/assets/images/travel_explore.png";

type ExploreCardConfig = {
  title: string;
  description: string;
  to: string;
  image: string;
};

const CARDS: ExploreCardConfig[] = [
  {
    title: "Chat",
    description: "Connect and engage with the ATM community",
    to: "/chat",
    image: chatImage,
  },
  {
    title: "Avatar",
    description: "Create and share your digital self",
    to: "/avatar",
    image: avatarImage,
  },
  {
    title: "Games",
    description: "Dont just play the game, be part of it",
    to: "/games",
    image: gamesImage,
  },
  {
    title: "Travel",
    description: "Explore the world with LUCA",
    to: "/travel",
    image: travelImage,
  },
];

export default function Explore() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-md space-y-4">
      {CARDS.map((card) => (
        <button
          key={card.title}
          type="button"
          onClick={() => navigate(card.to)}
          className="flex h-[130px] w-full items-center justify-between rounded-[12px] bg-white px-[15px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] cursor-pointer"
        >
          {/* Left text section */}
          <div className="flex flex-col items-start text-left">
            <span className="font-h3-500 text-[#111827]">{card.title}</span>
            <span className="mt-1 body-text2-400 text-[#6B7280] max-w-[200px]">
              {card.description}
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            
            {/* Image */}
            <div className="flex h-[90px] w-[90px] items-center justify-center rounded-[12px] opacity-80">
              <img
                src={card.image}
                alt={`${card.title} image`}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Chevron */}
            <ChevronRight size={20} color="#878787" />

          </div>
        </button>
      ))}
    </div>
  );
}