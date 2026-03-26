import { Navigate, Route, Routes } from "react-router-dom";
import AlexSidebar from "./components/AlexSidebar";
import {
  useCreateConversation,
  useGetAvatarProfile,
  useGetConversationById,
  useGetConversations,
  useGetQuickActions,
  useSendAvatarMessage,
} from "@/hooks/useAvatar";
import { useCallback, useEffect, useState } from "react";
import AlexDashboard from "./components/AlexDashboard";
import AlexProfile from "./components/AlexProfile";
import AvatarTrain from "./components/AvatarTrain";
import type { AvatarConversation, AvatarQuickAction } from "./types";
import AvatarChat from "./components/AvatarChat";

export default function Alex() {
  // ── API hooks ──────────────────────────────────────────────────────────────
  const profile = useGetAvatarProfile();
  const conversations = useGetConversations();
  const sendMessage = useSendAvatarMessage();
  const conversationById = useGetConversationById();
  const quickActionsHook = useGetQuickActions();
  const createConversation = useCreateConversation();

  // ── Local state ────────────────────────────────────────────────────────────
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [localConversation, setLocalConversation] =
    useState<AvatarConversation | null>(null);

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  useEffect(() => {
    profile.execute("alex");
    conversations.execute();
    quickActionsHook.execute();
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

  // ── Quick action ───────────────────────────────────────────────────────────
  const handleQuickAction = useCallback(
    (action: AvatarQuickAction) => {
      handleSendMessage(action.label);
    },
    [handleSendMessage],
  );

  return (
    <div className="flex-col lg:flex lg:flex-row  gap-[20px] h-full">
      {/* Sidebar (Fixed) */}
      <div className=" flex-shrink-0">
        <div className=" h-full">
          <AlexSidebar profile={profile.data} />
        </div>
      </div>

      {/* Content (Scrollable) */}
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AlexDashboard />} />
        <Route path="profile" element={<AlexProfile />} />
        <Route path="train" element={<AvatarTrain />} />
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
