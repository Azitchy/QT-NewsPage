import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import type { AvatarProfile, AvatarConversation } from "../types";
import { ConfirmationModal } from "@/components/ui/atm/confirmationModal";

interface AvatarSidebarProps {
  profile: AvatarProfile | null;
  conversations: AvatarConversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNewChat: () => void;
}

export default function AvatarSidebar({
  profile,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
}: AvatarSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const avatarId = profile?.id ?? "lucy";
  const basePath = `/avatar/${avatarId}`;
  const activeTab = location.pathname.includes("/chat") ? "chat" : "dashboard";

  return (
    <>
      <div className="w-[222px] shrink-0 bg-white rounded-[15px] border border-[#EBEBEB] flex flex-col h-full overflow-hidden">
        {/* ── Back arrow ─────────────────────────────────── */}
        <div className="px-[20px] pt-[20px]">
          <button
            onClick={() => navigate("/avatar")}
            className="cursor-pointer hover:opacity-70"
          >
            <ArrowLeft size={20} className="text-[#1C1C1C]" />
          </button>
        </div>

        {/* ── Avatar image + name ────────────────────────── */}
        <div className="flex flex-col items-center gap-[10px] pt-[16px] px-[20px]">
          <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-b from-[#8E1BF4] to-[#100CD8] flex items-center justify-center">
            {profile?.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="w-[74px] h-[74px] rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-[28px] font-semibold">
                {profile?.name?.charAt(0) ?? "L"}
              </span>
            )}
          </div>
          <span className="text-[16px] font-semibold text-[#1C1C1C]">
            {profile?.name ?? "Lucy"}
          </span>
        </div>

        {/* ── Nav items (Dashboard / Chat) ───────────────── */}
        <div className="flex flex-col gap-[4px] px-[12px] pt-[20px]">
          <button
            onClick={() => navigate(`${basePath}/dashboard`)}
            className={`flex items-center gap-[10px] px-[12px] py-[10px] rounded-[10px] cursor-pointer transition-colors ${
              activeTab === "dashboard"
                ? "bg-[#F3E8FF] border-l-[3px] border-[#8E1BF4]"
                : "hover:bg-[#F6F6F6]"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect
                x="1"
                y="1"
                width="6"
                height="6"
                rx="1.5"
                stroke={activeTab === "dashboard" ? "#8E1BF4" : "#1C1C1C"}
                strokeWidth="1.5"
              />
              <rect
                x="11"
                y="1"
                width="6"
                height="6"
                rx="1.5"
                stroke={activeTab === "dashboard" ? "#8E1BF4" : "#1C1C1C"}
                strokeWidth="1.5"
              />
              <rect
                x="1"
                y="11"
                width="6"
                height="6"
                rx="1.5"
                stroke={activeTab === "dashboard" ? "#8E1BF4" : "#1C1C1C"}
                strokeWidth="1.5"
              />
              <rect
                x="11"
                y="11"
                width="6"
                height="6"
                rx="1.5"
                stroke={activeTab === "dashboard" ? "#8E1BF4" : "#1C1C1C"}
                strokeWidth="1.5"
              />
            </svg>
            <span
              className={`text-[14px] ${
                activeTab === "dashboard"
                  ? "text-[#8E1BF4] font-semibold"
                  : "text-[#1C1C1C] font-normal"
              }`}
            >
              Dashboard
            </span>
          </button>

          <button
            onClick={() => {
              navigate(`${basePath}/chat`);
              onNewChat();
            }}
            className={`flex items-center gap-[10px] px-[12px] py-[10px] rounded-[10px] cursor-pointer transition-colors ${
              activeTab === "chat"
                ? "bg-[#F3E8FF] border-l-[3px] border-[#8E1BF4]"
                : "hover:bg-[#F6F6F6]"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M16 11.5C16 12.0304 15.7893 12.5391 15.4142 12.9142C15.0391 13.2893 14.5304 13.5 14 13.5H5L2 16.5V3.5C2 2.96957 2.21071 2.46086 2.58579 2.08579C2.96086 1.71071 3.46957 1.5 4 1.5H14C14.5304 1.5 15.0391 1.71071 15.4142 2.08579C15.7893 2.46086 16 2.96957 16 3.5V11.5Z"
                stroke={activeTab === "chat" ? "#8E1BF4" : "#1C1C1C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className={`text-[14px] ${
                activeTab === "chat"
                  ? "text-[#8E1BF4] font-semibold"
                  : "text-[#1C1C1C] font-normal"
              }`}
            >
              Chat
            </span>
          </button>
        </div>

        {/* ── Conversation list (only in chat tab) ───────── */}
        {activeTab === "chat" && conversations.length > 0 && (
          <>
            <div className="mx-[20px] mt-[16px] border-t border-[#EBEBEB]" />
            <div className="flex-1 overflow-y-auto px-[12px] pt-[12px] flex flex-col gap-[2px]">
              {conversations.map((conv) => {
                const isActive = conv.id === activeConversationId;
                return (
                  <div
                    key={conv.id}
                    className={`group flex items-center justify-between px-[12px] py-[8px] rounded-[8px] cursor-pointer transition-colors ${
                      isActive ? "bg-[#F3E8FF]" : "hover:bg-[#F6F6F6]"
                    }`}
                    onClick={() => onSelectConversation(conv.id)}
                  >
                    <span
                      className={`text-[13px] truncate flex-1 ${
                        isActive
                          ? "text-[#8E1BF4] font-medium"
                          : "text-[#1C1C1C] font-normal"
                      }`}
                    >
                      {conv.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === conv.id ? null : conv.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 cursor-pointer ml-[4px] shrink-0"
                    >
                      <MoreHorizontal size={16} className="text-[#999]" />
                    </button>

                    {/* Dropdown menu */}
                    {menuOpenId === conv.id && (
                      <div className="absolute right-[10px] mt-[40px] bg-white border border-[#EBEBEB] rounded-[8px] shadow-md z-10 py-[4px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(conv.id);
                            setMenuOpenId(null);
                          }}
                          className="px-[16px] py-[8px] text-[13px] text-red-500 hover:bg-[#FEF2F2] w-full text-left cursor-pointer"
                        >
                          Delete chat
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Delete confirmation modal ───────────────────── */}
      <ConfirmationModal
        isOpen={deleteTarget !== null}
        title="Delete chat?"
        description="Are you sure you want to delete this conversation? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
        onConfirm={() => {
          if (deleteTarget) {
            onDeleteConversation(deleteTarget);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
