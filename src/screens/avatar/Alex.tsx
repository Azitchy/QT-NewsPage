import { Navigate, Route, Routes } from "react-router-dom";
import AlexSidebar from "./components/AlexSidebar";
import {
  useGetAvatarProfile,
  useGetConversations,
  useGetQuickActions,
} from "@/hooks/useAvatar";
import { useEffect } from "react";
import AlexDashboard from "./components/AlexDashboard";
import AlexProfile from "./components/AlexProfile";
import AvatarTrain from "./components/AvatarTrain";

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
    <div className="flex-col lg:flex lg:flex-row  gap-[20px] h-full">
      {/* Sidebar (Fixed) */}
      <div className=" flex-shrink-0">
        <div className=" h-full">
          <AlexSidebar profile={profile.data} />
        </div>
      </div>

      {/* Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AlexDashboard />} />
          <Route path="profile" element={<AlexProfile />} />
          <Route path="train" element={<AvatarTrain />} />
        </Routes>
      </div>
    </div>
  );
}
