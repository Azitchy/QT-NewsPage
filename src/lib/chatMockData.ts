import type {
  ChatUser,
  ChatRoom,
  DirectMessage,
  ChatMessage,
} from "@/screens/chat/types";

// ── Mock Users ──────────────────────────────────────────────────────────────

export const mockUsers: ChatUser[] = [
  {
    id: "u1",
    name: "Peter",
    walletAddress: "0x696dca4e2c357423abac1db8970e68180...",
    avatar: undefined,
    prValue: 1250.5678,
    isOnline: true,
  },
  {
    id: "u2",
    name: "Jack",
    walletAddress: "0x696dca4e2c357423abac1db8970e68180...",
    avatar: undefined,
    prValue: 980.1234,
    isOnline: true,
  },
  {
    id: "u3",
    name: "Nikita",
    walletAddress: "0x696dca4e2c357423abac1db8970e68180...",
    avatar: undefined,
    prValue: 1081.2345,
    isOnline: true,
  },
  {
    id: "u4",
    name: "Miki",
    walletAddress: "0x696dca4e2c357423abac1db8970e68180...",
    avatar: undefined,
    prValue: 870.456,
    isOnline: false,
  },
  {
    id: "u5",
    name: "Lily",
    walletAddress: "0x696dca4e2c357423abac1db8970e68180...",
    avatar: undefined,
    prValue: 1120.789,
    isOnline: true,
  },
  {
    id: "u6",
    name: "Lilly",
    walletAddress: "0x696dca4e2c357423abac1db8970e68180...",
    avatar: undefined,
    prValue: 1120.789,
    isOnline: true,
  },
  {
    id: "u7",
    name: "Brian",
    walletAddress: "0x696dca4e2c357423abac1db8970e68180...",
    avatar: undefined,
    prValue: 650.321,
    isOnline: false,
  },
];

// ── Mock Messages ───────────────────────────────────────────────────────────

const cryptoExpertsMessages: ChatMessage[] = [
  {
    id: "m1",
    senderId: "u3",
    senderName: "Nikita",
    content:
      "Hey everyone, have you heard about that new DeFi project launching on Ethereum?",
    timestamp: "13:41",
    type: "text",
  },
  {
    id: "m2",
    senderId: "u4",
    senderName: "Miki",
    content: "Yeah, caught wind of it. The one promising high yields, right?",
    timestamp: "13:42",
    type: "text",
  },
  {
    id: "m3",
    senderId: "u1",
    senderName: "Peter",
    content:
      "Indeed. But remember, high rewards usually come with high risks.",
    timestamp: "13:43",
    type: "text",
  },
  {
    id: "m4",
    senderId: "u5",
    senderName: "Lily",
    content:
      "Good call, Peter. Security is paramount. I'm always cautious with new projects.",
    timestamp: "13:45",
    type: "text",
  },
  {
    id: "m5",
    senderId: "u2",
    senderName: "Jack",
    content:
      "I dug into it a bit. Tokenomics seem solid, but the team is relatively unknown.",
    timestamp: "13:46",
    type: "text",
  },
  {
    id: "m6",
    senderId: "u3",
    senderName: "Nikita",
    content:
      "Agreed. And how about the team behind it? Transparency and credibility is crucial.",
    timestamp: "13:46",
    type: "text",
  },
  {
    id: "m7",
    senderId: "u4",
    senderName: "Miki",
    content:
      "I saw their AMA. Seemed legit, but you never know. Always good to be cautious.",
    timestamp: "13:47",
    type: "text",
  },
  {
    id: "m8",
    senderId: "u1",
    senderName: "Peter",
    content:
      "So, are we thinking about getting in, or are there any red flags waving?",
    timestamp: "13:48",
    type: "text",
  },
  {
    id: "m9",
    senderId: "u5",
    senderName: "Lily",
    content:
      "I'm considering it, but cautiously. Maybe we can pool our thoughts and do a deeper dive together?",
    timestamp: "13:49",
    type: "text",
  },
  {
    id: "m10",
    senderId: "u2",
    senderName: "Jack",
    content:
      "Great idea! The strength of this community is in our collective wisdom. Let's keep each other in the loop.",
    timestamp: "13:51",
    type: "text",
  },
];

// ── Mock Rooms ──────────────────────────────────────────────────────────────

export const mockRooms: ChatRoom[] = [
  {
    id: "room1",
    name: "Crypto experts",
    type: "public",
    rules:
      "1. Be kind: Treat others with respect and kindness.\n2. No offence: Avoid offensive language or behaviour.\n3. No advertising: Refrain from promoting products or services.\n\nKeep it friendly, informative, and enjoyable for everyone!",
    memberCount: 10,
    members: [
      {
        id: "u2",
        name: "Jack",
        walletAddress: "0x696dca4e2c357423abac1db8970e68180...",
        role: "admin",
      },
      {
        id: "u3",
        name: "Nikita",
        walletAddress: "0x696dca4e2c357423abac1db8970e68180...",
        role: "admin",
      },
      {
        id: "u4",
        name: "Miki",
        walletAddress: "0x696dca4e2c357423abac1db8970e68180...",
        role: "admin",
      },
      {
        id: "u1",
        name: "Peter",
        walletAddress: "0x696dca4e2c357423abac1db8970e68180...",
        role: "member",
      },
      {
        id: "u6",
        name: "Lilly",
        walletAddress: "0x696dca4e2c357423abac1db8970e68180...",
        role: "member",
      },
      {
        id: "u7",
        name: "Brian",
        walletAddress: "0x696dca4e2c357423abac1db8970e68180...",
        role: "member",
      },
    ],
    messages: cryptoExpertsMessages,
    lastMessage: "Great idea! The strength of this community...",
    lastMessageTime: "13:51",
    unreadCount: 0,
  },
  {
    id: "room2",
    name: "General",
    type: "public",
    rules: "Be respectful and stay on topic.",
    memberCount: 3,
    members: [
      {
        id: "u1",
        name: "Peter",
        walletAddress: "0x696dca4e2c357423abac1db8970e68180...",
        role: "owner",
      },
      {
        id: "u2",
        name: "Jack",
        walletAddress: "0x696dca4e2c357423abac1db8970e68180...",
        role: "member",
      },
    ],
    messages: [],
    lastMessage: "Welcome to General!",
    lastMessageTime: "10:00",
    unreadCount: 2,
  },
];

// ── Mock Direct Messages ────────────────────────────────────────────────────

export const mockDirectMessages: DirectMessage[] = [
  {
    id: "dm1",
    participant: mockUsers[1], // Jack
    messages: [
      {
        id: "dm-m1",
        senderId: "u2",
        senderName: "Jack",
        content: "Hey, did you check out that new token?",
        timestamp: "14:20",
        type: "text",
      },
    ],
    lastMessage: "Hey, did you check out that new token?",
    lastMessageTime: "14:20",
    unreadCount: 1,
  },
];

// ── Current User (mock) ─────────────────────────────────────────────────────

export const mockCurrentUser: ChatUser = mockUsers[0]; // Peter
