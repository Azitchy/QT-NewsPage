import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ChatRoom, DirectMessage, ChatSection } from "../types";
import UserAvatar from "./UserAvatar";

interface ChatSidebarProps {
  currentUser: { name: string; avatar?: string };
  rooms: ChatRoom[];
  directMessages: DirectMessage[];
  activeRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onSelectDM: (dmId: string) => void;
  onCreateRoom: () => void;
}

export default function ChatSidebar({
  currentUser,
  rooms,
  directMessages,
  activeRoomId,
  onSelectRoom,
  onSelectDM,
  onCreateRoom,
}: ChatSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<ChatSection, boolean>
  >({
    chat: false,
    rooms: true,
    "direct-messages": false,
    pinned: false,
  });

  const toggleSection = (section: ChatSection) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-[222px] shrink-0 bg-white rounded-[15px] border border-[#EBEBEB] flex flex-col h-full overflow-hidden">
      {/* ── User Profile ─────────────────────────────────────── */}
      <div className="px-[20px] pt-[30px] flex items-center gap-[10px]">
        <UserAvatar name={currentUser.name} avatar={currentUser.avatar} size="lg" />
        <span className="text-[16px] font-normal text-[#1C1C1C] leading-[21px]">
          {currentUser.name}
        </span>
      </div>

      {/* ── Main Nav ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-[20px] pt-[30px] flex flex-col gap-[30px]">
        {/* Chat + compose icon */}
        <div className="flex items-center justify-between">
          <span className="text-[18px] font-medium text-[#1C1C1C] leading-[20px]">
            Chat
          </span>
          <button
            onClick={onCreateRoom}
            className="text-primary hover:opacity-80 cursor-pointer"
          >
            {/* Compose / new‑chat icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" fill="none" />
              <path
                d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* ── Rooms section ─────────────────────────────────── */}
        <div className="flex flex-col gap-[20px]">
          {/* Rooms header */}
          <button
            onClick={() => toggleSection("rooms")}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="text-[20px] font-semibold text-primary">
              Rooms
            </span>
            {expandedSections.rooms ? (
              <ChevronUp size={24} className="text-primary" />
            ) : (
              <ChevronDown size={24} className="text-primary" />
            )}
          </button>

          {/* Room list */}
          {expandedSections.rooms && (
            <div className="pl-[10px] flex flex-col gap-[20px]">
              {rooms.map((room) => {
                const isActive = activeRoomId === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => onSelectRoom(room.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span
                      className={`text-[16px] leading-[21px] ${
                        isActive
                          ? "text-primary font-bold"
                          : "text-[#1C1C1C] font-normal"
                      }`}
                    >
                      {room.name}
                    </span>
                    <div
                      className={`w-[35px] py-[3px] rounded-[15px] flex items-center justify-center ${
                        isActive ? "bg-[#E9F6F7]" : "bg-[#E9F6F7]"
                      }`}
                    >
                      <span
                        className={`text-[14px] ${
                          isActive
                            ? "text-primary font-bold"
                            : "text-[#1C1C1C] font-normal leading-[19px]"
                        }`}
                      >
                        {room.memberCount}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Direct messages ───────────────────────────────── */}
        <button
          onClick={() => toggleSection("direct-messages")}
          className="flex items-center justify-between cursor-pointer"
        >
          <span className="text-[16px] font-normal text-[#1C1C1C] leading-[21px]">
            Direct messages
          </span>
          {expandedSections["direct-messages"] ? (
            <ChevronUp size={24} className="text-[#1C1C1C]" />
          ) : (
            <ChevronDown size={24} className="text-[#1C1C1C]" />
          )}
        </button>

        {expandedSections["direct-messages"] && directMessages.length > 0 && (
          <div className="pl-[10px] flex flex-col gap-[15px]">
            {directMessages.map((dm) => (
              <button
                key={dm.id}
                onClick={() => onSelectDM(dm.id)}
                className="text-left text-[16px] text-[#1C1C1C] font-normal leading-[21px] cursor-pointer hover:text-primary transition-colors"
              >
                {dm.participant.name}
              </button>
            ))}
          </div>
        )}

        {/* ── Pinned ────────────────────────────────────────── */}
        <button
          onClick={() => toggleSection("pinned")}
          className="flex items-center justify-between cursor-pointer"
        >
          <span className="text-[16px] font-normal text-[#1C1C1C] leading-[21px]">
            Pinned
          </span>
          {expandedSections.pinned ? (
            <ChevronUp size={24} className="text-[#1C1C1C]" />
          ) : (
            <ChevronDown size={24} className="text-[#1C1C1C]" />
          )}
        </button>
      </div>

      {/* ── Bottom links ─────────────────────────────────────── */}
      <div className="px-[30px] pb-[20px] flex flex-col gap-[20px]">
        <button className="text-left text-[16px] text-[#1C1C1C] font-normal leading-[21px] hover:text-primary transition-colors cursor-pointer">
          Settings
        </button>
        <button className="text-left text-[16px] text-[#1C1C1C] font-normal leading-[21px] hover:text-primary transition-colors cursor-pointer">
          Help centre
        </button>
        <button className="flex items-center gap-[5px] text-[16px] text-[#1C1C1C] font-normal hover:text-primary transition-colors cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.6667 11.3333L14 8L10.6667 4.66667"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 8H6"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Log out
        </button>
      </div>

      {/* ── Social icons ─────────────────────────────────────── */}
      <div className="px-[24px] pb-[24px] flex items-center gap-[24px] border-t border-[#EEEEEE] pt-[10px]">
        <SocialIcon type="telegram" />
        <SocialIcon type="twitter" />
        <SocialIcon type="discord" />
        <SocialIcon type="reddit" />
      </div>
    </div>
  );
}

function SocialIcon({ type }: { type: "telegram" | "twitter" | "discord" | "reddit" }) {
  const icons: Record<string, JSX.Element> = {
    telegram: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#039BE5">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    twitter: (
      <svg width="30" height="24" viewBox="0 0 30 24" fill="#03A9F4">
        <path d="M28.75 2.84a11.76 11.76 0 0 1-3.39.93A5.92 5.92 0 0 0 27.96.44a11.83 11.83 0 0 1-3.75 1.43A5.9 5.9 0 0 0 14.3 5.26a5.74 5.74 0 0 0 .15 1.35A16.76 16.76 0 0 1 2.28 1.11a5.9 5.9 0 0 0 1.83 7.89 5.87 5.87 0 0 1-2.67-.74v.07a5.9 5.9 0 0 0 4.73 5.79 5.88 5.88 0 0 1-2.66.1 5.91 5.91 0 0 0 5.51 4.1A11.85 11.85 0 0 1 1.4 21.13a16.7 16.7 0 0 0 9.05 2.65c10.85 0 16.78-8.99 16.78-16.78 0-.26-.01-.51-.02-.76A12 12 0 0 0 30 3.16a11.76 11.76 0 0 1-3.25.89z" />
      </svg>
    ),
    discord: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#7289DA">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
      </svg>
    ),
    reddit: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#FE5572">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
  };

  return (
    <span className="cursor-pointer hover:opacity-80 transition-opacity">
      {icons[type]}
    </span>
  );
}
