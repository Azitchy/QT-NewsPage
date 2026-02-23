import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AvatarSidebar from "./components/AvatarSidebar";
import AvatarDashboard from "./components/AvatarDashboard";
import AvatarChat from "./components/AvatarChat";
import {
  useGetAvatarProfile,
  useGetConversations,
  useGetConversationById,
  useCreateConversation,
  useDeleteConversation,
  useSendAvatarMessage,
  useGetQuickActions,
} from "@/hooks/useAvatar";
import type { AvatarConversation, AvatarQuickAction } from "./types";

export default function Lucy() {
  const navigate = useNavigate();

  // ── API hooks ──────────────────────────────────────────────────────────────
  const profile = useGetAvatarProfile();
  const conversations = useGetConversations();
  const conversationById = useGetConversationById();
  const createConversation = useCreateConversation();
  const deleteConversation = useDeleteConversation();
  const sendMessage = useSendAvatarMessage();
  const quickActionsHook = useGetQuickActions();

  // ── Local state ────────────────────────────────────────────────────────────
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [localConversation, setLocalConversation] =
    useState<AvatarConversation | null>(null);

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  useEffect(() => {
    profile.execute("lucy");
    conversations.execute();
    quickActionsHook.execute();
  }, []);

  // ── Select conversation ────────────────────────────────────────────────────
  const handleSelectConversation = useCallback(
    async (id: string) => {
      setActiveConversationId(id);
      const result = await conversationById.execute(id);
      if (result) setLocalConversation(result);
      navigate("/avatar/lucy/chat");
    },
    [conversationById, navigate],
  );

  // ── New chat (clear active) ────────────────────────────────────────────────
  const handleNewChat = useCallback(() => {
    setActiveConversationId(null);
    setLocalConversation(null);
  }, []);

  // ── Send message ───────────────────────────────────────────────────────────
  const handleSendMessage = useCallback(
    async (content: string) => {
      let convId = activeConversationId;

      // Create a new conversation if none is active
      if (!convId) {
        const title =
          content.length > 30 ? content.slice(0, 30) + "..." : content;
        const newConv = await createConversation.execute(title);
        if (newConv) {
          convId = newConv.id;
          setActiveConversationId(convId);
        }
      }

      if (!convId) return;

      await sendMessage.execute({ conversationId: convId, content });

      // Refresh conversation to get both user + AI messages
      setTimeout(async () => {
        const updated = await conversationById.execute(convId!);
        if (updated) setLocalConversation(updated);
        // Refresh sidebar list
        conversations.execute();
      }, 1000);
    },
    [
      activeConversationId,
      createConversation,
      sendMessage,
      conversationById,
      conversations,
    ],
  );

  // ── Delete conversation ────────────────────────────────────────────────────
  const handleDeleteConversation = useCallback(
    async (id: string) => {
      await deleteConversation.execute(id);
      if (activeConversationId === id) {
        setActiveConversationId(null);
        setLocalConversation(null);
      }
      conversations.execute();
    },
    [activeConversationId, deleteConversation, conversations],
  );

  // ── Quick action ───────────────────────────────────────────────────────────
  const handleQuickAction = useCallback(
    (action: AvatarQuickAction) => {
      handleSendMessage(action.label);
    },
    [handleSendMessage],
  );

  return (
    <div className=" flex-col lg:flex lg:flex-row  gap-[20px] h-full">
      {/* ── Sidebar ──────────────────────────────────────── */}
      <AvatarSidebar
        profile={profile.data}
        conversations={conversations.data ?? []}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onNewChat={handleNewChat}
      />

      {/* ── Content area (sub-routes) ────────────────────── */}
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AvatarDashboard />} />
        <Route
          path="chat"
          element={
            <AvatarChat
              profile={profile.data}
              conversation={localConversation}
              quickActions={quickActionsHook.data ?? []}
              onSendMessage={handleSendMessage}
              onQuickAction={handleQuickAction}
              loading={sendMessage.loading}
            />
          }
        />
      </Routes>
    </div>
  );
}
