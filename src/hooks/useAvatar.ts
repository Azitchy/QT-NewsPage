import { useApiCall } from "./useWebAppService";
import * as avatarApi from "@/lib/avatarApi";

// ── Profile hooks ────────────────────────────────────────────────────────────

export const useGetAvatarProfile = () => {
  return useApiCall(avatarApi.getAvatarProfile);
};

export const useGetAvatarProfiles = () => {
  return useApiCall(avatarApi.getAvatarProfiles);
};

// ── Conversation hooks ───────────────────────────────────────────────────────

export const useGetConversations = () => {
  return useApiCall(avatarApi.getConversations);
};

export const useGetConversationById = () => {
  return useApiCall(avatarApi.getConversationById);
};

export const useCreateConversation = () => {
  return useApiCall(avatarApi.createConversation);
};

export const useDeleteConversation = () => {
  return useApiCall(avatarApi.deleteConversation);
};

export const useSendAvatarMessage = () => {
  return useApiCall(
    (params: { conversationId: string; content: string }) =>
      avatarApi.sendAvatarMessage(params.conversationId, params.content)
  );
};

// ── Dashboard hooks ──────────────────────────────────────────────────────────

export const useGetDashboardData = () => {
  return useApiCall(avatarApi.getDashboardData);
};

// ── Quick action hooks ───────────────────────────────────────────────────────

export const useGetQuickActions = () => {
  return useApiCall(avatarApi.getQuickActions);
};
