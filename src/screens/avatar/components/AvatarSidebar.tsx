import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  MoreVertical,
  PencilLine,
  Trash2,
  X,
} from "lucide-react";
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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const avatarId = profile?.id ?? "lucy";
  const basePath = `/avatar/${avatarId}`;
  const activeTab = location.pathname.includes("/chat") ? "chat" : "dashboard";

  useEffect(() => {
    const close = () => setMenuOpenId(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <>
      <div className="lg:w-[222px] mb-5 lg:mb-0 shrink-0 lg:bg-card rounded-[15px] lg:border border-[#EBEBEB] flex flex-col lg:h-full overflow-hidden">
        <span className="text-[20px] hidden lg:flex font-normal text-foreground pt-[16px] px-[20px]">
          {profile?.name ?? "Lucy"}
        </span>

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
        </div>

        {/* ── Nav items (Dashboard / Chat) ───────────────── */}
        <div className="flex flex-col gap-[4px] px-[12px] pt-[20px] ">
          <div
            className={`rounded-[40px] ${activeTab === "dashboard" ? "p-[1px] bg-gradient-to-b from-[#8E1BF4] to-[#100CD8]" : ""}`}
          >
            <button
              onClick={() => navigate(`${basePath}/dashboard`)}
              className={`flex items-center gap-[10px] px-[12px] py-[10px] rounded-[40px] w-full cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-white font-semibold"
                  : "hover:bg-[#F6F6F6]"
              }`}
            >
              Dashboard
            </button>
          </div>

          <div
            className={`rounded-[40px] ${activeTab === "chat" ? "p-[1px] bg-gradient-to-b from-[#8E1BF4] to-[#100CD8]" : ""}`}
          >
            <button
              onClick={() => {
                navigate(`${basePath}/chat`);
                onNewChat();
              }}
              className={`flex items-center gap-[10px] px-[12px] py-[10px] rounded-[40px] w-full cursor-pointer ${
                activeTab === "chat"
                  ? "bg-white font-semibold"
                  : "hover:bg-[#F6F6F6]"
              }`}
            >
              Chat
            </button>
          </div>
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
                    className={`rounded-[40px] ${isActive ? "p-[1px] bg-gradient-to-b from-[#8E1BF4] to-[#100CD8]" : ""}`}
                  >
                    <div
                      className={`group relative flex items-center justify-between px-[12px] py-[8px] rounded-[40px] cursor-pointer ${
                        isActive ? "bg-white" : "hover:bg-[#F6F6F6]"
                      }`}
                      onClick={() => onSelectConversation(conv.id)}
                    >
                      {/* NORMAL TEXT */}
                      {editingId !== conv.id && (
                        <span
                          className={`body-text1-400 truncate flex-1 ${isActive ? "font-medium" : ""}`}
                        >
                          {conv.title}
                        </span>
                      )}

                      {/* EDIT MODE */}
                      {editingId === conv.id && (
                        <div
                          className="flex items-center gap-1 flex-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            autoFocus
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="flex-1 text-[14px] outline-none  bg-transparent"
                          />
                          <button onClick={() => setEditingId(null)}>
                            <Check
                              className="text-[#878787] relative right-5 cursor-pointer"
                              size={16}
                            />
                          </button>
                          <button onClick={() => setEditingId(null)}>
                            <X
                              className="text-[#878787] relative right-5 cursor-pointer"
                              size={16}
                            />
                          </button>
                        </div>
                      )}

                      {/* 3 dots */}
                      {editingId !== conv.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenId(
                              menuOpenId === conv.id ? null : conv.id,
                            );
                          }}
                          className="opacity-0 group-hover:opacity-100 ml-[4px] cursor-pointer"
                        >
                          <MoreVertical size={16} />
                        </button>
                      )}

                      {/* DROPDOWN */}
                      {menuOpenId === conv.id && (
                        <div className="absolute right-[-10px] top-[3px]  mt-[40px] bg-card border border-[#EBEBEB] rounded-[8px] shadow-md z-10 py-[4px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(conv.id);
                              setEditingTitle(conv.title);
                              setMenuOpenId(null);
                            }}
                            className="px-[16px] py-[8px] flex items-center gap-[10px] text-foreground body-text1-400 w-full text-left cursor-pointer hover:bg-[#F6F6F6]"
                          >
                            <PencilLine className="text-[#878787]" size={16} />
                            Edit
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(conv.id);
                              setMenuOpenId(null);
                            }}
                            className="px-[16px] py-[8px] flex items-center gap-[10px] text-foreground body-text1-400  w-full text-left cursor-pointer hover:bg-[#F6F6F6]"
                          >
                            <Trash2 className="text-[#878787]" size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
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
