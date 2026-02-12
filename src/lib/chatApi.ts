/**
 * Chat API layer — all functions return mock data for now.
 * Replace implementations with real API calls when backend is ready.
 */

import {
  mockRooms,
  mockDirectMessages,
  mockCurrentUser,
  mockUsers,
} from "./chatMockData";
import type {
  ChatRoom,
  DirectMessage,
  ChatUser,
  ChatMessage,
  CreateRoomPayload,
  AddMemberPayload,
} from "@/screens/chat/types";

// Simulate network delay
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// ── Rooms ───────────────────────────────────────────────────────────────────

export async function getRooms(): Promise<ChatRoom[]> {
  await delay();
  return mockRooms;
}

export async function getRoomById(roomId: string): Promise<ChatRoom | null> {
  await delay();
  return mockRooms.find((r) => r.id === roomId) ?? null;
}

export async function createRoom(payload: CreateRoomPayload): Promise<ChatRoom> {
  await delay(500);
  const newRoom: ChatRoom = {
    id: `room-${Date.now()}`,
    name: payload.name,
    type: payload.isPrivate ? "private" : "public",
    rules: payload.rules,
    memberCount: payload.members.length + 1,
    members: [
      { ...mockCurrentUser, role: "owner" },
      ...payload.members.map((addr) => ({
        id: `u-${Date.now()}-${Math.random()}`,
        name: "New Member",
        walletAddress: addr,
        role: "member" as const,
      })),
    ],
    messages: [],
  };
  mockRooms.push(newRoom);
  return newRoom;
}

export async function addMemberToRoom(
  payload: AddMemberPayload
): Promise<void> {
  await delay(500);
  const room = mockRooms.find((r) => r.id === payload.roomId);
  if (room) {
    room.members.push({
      id: `u-${Date.now()}`,
      name: "New Member",
      walletAddress: payload.walletAddress,
      role: "member",
    });
    room.memberCount += 1;
  }
}

export async function sendMessage(
  roomId: string,
  content: string
): Promise<ChatMessage> {
  await delay(200);
  const msg: ChatMessage = {
    id: `msg-${Date.now()}`,
    senderId: mockCurrentUser.id,
    senderName: mockCurrentUser.name,
    content,
    timestamp: new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    type: "text",
  };
  const room = mockRooms.find((r) => r.id === roomId);
  if (room) {
    room.messages.push(msg);
    room.lastMessage = content;
    room.lastMessageTime = msg.timestamp;
  }
  return msg;
}

// ── Direct Messages ─────────────────────────────────────────────────────────

export async function getDirectMessages(): Promise<DirectMessage[]> {
  await delay();
  return mockDirectMessages;
}

// ── Users ───────────────────────────────────────────────────────────────────

export async function searchUsers(query: string): Promise<ChatUser[]> {
  await delay(200);
  const q = query.toLowerCase();
  return mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      u.walletAddress.toLowerCase().includes(q)
  );
}

export async function getUserProfile(userId: string): Promise<ChatUser | null> {
  await delay();
  return mockUsers.find((u) => u.id === userId) ?? null;
}

export async function getCurrentUser(): Promise<ChatUser> {
  await delay();
  return mockCurrentUser;
}
