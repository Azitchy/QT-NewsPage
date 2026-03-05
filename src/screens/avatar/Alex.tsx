import { Navigate, Route, Routes } from "react-router-dom";
import AlexSidebar from "./components/AlexSidebar";
import {
  useGetAvatarProfile,
  useGetConversations,
  useGetQuickActions,
} from "@/hooks/useAvatar";
import { useEffect } from "react";
import AlexDashboard from "./components/AlexDashboard";

export default function Alex() {
  // ── API hooks ──────────────────────────────────────────────────────────────
  const profile = useGetAvatarProfile();
  const conversations = useGetConversations();

  const quickActionsHook = useGetQuickActions();

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  useEffect(() => {
    profile.execute("alex");
    conversations.execute();
    quickActionsHook.execute();
  }, []);

  return (
    <div className=" flex-col lg:flex lg:flex-row  gap-[20px] h-full">
      {/* ── Sidebar ──────────────────────────────────────── */}
      <AlexSidebar profile={profile.data} />

      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AlexDashboard />} />
      </Routes>
    </div>
  );
}
