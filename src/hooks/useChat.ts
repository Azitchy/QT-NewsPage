import { useApiCall } from "./useWebAppService";
import * as chatApi from "@/lib/chatApi";

// ── Room hooks ──────────────────────────────────────────────────────────────

export const useGetRooms = () => {
  return useApiCall(chatApi.getRooms);
};

export const useGetRoomById = () => {
  return useApiCall(chatApi.getRoomById);
};

export const useCreateRoom = () => {
  return useApiCall(chatApi.createRoom);
};

export const useAddMember = () => {
  return useApiCall(chatApi.addMemberToRoom);
};

export const useSendMessage = () => {
  return useApiCall(
    (params: { roomId: string; content: string }) =>
      chatApi.sendMessage(params.roomId, params.content)
  );
};

// ── Direct message hooks ────────────────────────────────────────────────────

export const useGetDirectMessages = () => {
  return useApiCall(chatApi.getDirectMessages);
};

// ── User hooks ──────────────────────────────────────────────────────────────

export const useSearchUsers = () => {
  return useApiCall(chatApi.searchUsers);
};

export const useGetUserProfile = () => {
  return useApiCall(chatApi.getUserProfile);
};

export const useGetCurrentUser = () => {
  return useApiCall(chatApi.getCurrentUser);
};
