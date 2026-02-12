export interface ChatUser {
  id: string;
  name: string;
  walletAddress: string;
  avatar?: string;
  prValue?: number;
  isOnline?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string; // e.g. "13:41"
  type: "text" | "image" | "system";
}

export interface ChatRoom {
  id: string;
  name: string;
  type: "public" | "private";
  rules?: string;
  memberCount: number;
  members: RoomMember[];
  messages: ChatMessage[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface RoomMember {
  id: string;
  name: string;
  walletAddress: string;
  avatar?: string;
  role: "owner" | "admin" | "member";
}

export interface DirectMessage {
  id: string;
  participant: ChatUser;
  messages: ChatMessage[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface CreateRoomPayload {
  name: string;
  rules?: string;
  isPrivate: boolean;
  members: string[]; // wallet addresses
}

export interface AddMemberPayload {
  roomId: string;
  walletAddress: string;
}

export type ChatSection = "chat" | "rooms" | "direct-messages" | "pinned";
