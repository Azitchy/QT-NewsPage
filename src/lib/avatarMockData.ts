import type {
  AvatarProfile,
  AvatarConversation,
  AvatarDashboardData,
  AvatarQuickAction,
} from "@/screens/avatar/types";

// ── Avatar Profiles ──────────────────────────────────────────────────────────

export const mockAvatarProfiles: AvatarProfile[] = [
  {
    id: "lucy",
    name: "Lucy",
    image: undefined,
    greeting:
      "Hey, I'm Lucy! I'm here to help you and don't worry, our story will be our secret.",
  },
  {
    id: "alex",
    name: "Alex",
    image: undefined,
    greeting:
      "Hi, I'm Alex! I'm your go-to assistant for all things crypto and DeFi.",
  },
];

// ── Quick Actions ────────────────────────────────────────────────────────────

export const mockQuickActions: AvatarQuickAction[] = [
  { id: "create-connection", label: "Create a connection" },
  { id: "create-game", label: "Create a game" },
  { id: "crypto-news", label: "Crypto news" },
];

// ── Conversations ────────────────────────────────────────────────────────────

export const mockConversations: AvatarConversation[] = [
  {
    id: "conv-1",
    title: "Create connection",
    messages: [
      {
        id: "msg-1",
        role: "assistant",
        content: "What type of connection would you like to create?",
        timestamp: "10:30",
      },
      {
        id: "msg-2",
        role: "user",
        content: "I want to create a token connection with 100 LUCA.",
        timestamp: "10:31",
      },
      {
        id: "msg-3",
        role: "assistant",
        content:
          "Great choice! To create a token connection with 100 LUCA, you'll need to specify the recipient's wallet address and the duration. What wallet address would you like to connect with?",
        timestamp: "10:31",
      },
    ],
    createdAt: "2025-01-15",
  },
  {
    id: "conv-2",
    title: "Crypto news",
    messages: [
      {
        id: "msg-4",
        role: "user",
        content: "What's the latest crypto news?",
        timestamp: "14:00",
      },
      {
        id: "msg-5",
        role: "assistant",
        content:
          "Here are the top crypto headlines today: Bitcoin has crossed the $100K mark again, Ethereum's layer-2 ecosystem continues to grow rapidly, and several major institutions have announced new DeFi partnerships.",
        timestamp: "14:01",
      },
    ],
    createdAt: "2025-01-14",
  },
  {
    id: "conv-3",
    title: "Simple game",
    messages: [
      {
        id: "msg-6",
        role: "user",
        content:
          "Let's create a simple game, something similar to Doodle Jump. I need the code, and the game should work on both phones and desktops.",
        timestamp: "09:15",
      },
      {
        id: "msg-7",
        role: "assistant",
        content:
          "Got it! I'll create a playable game that works locally, supports both keyboard and mobile touch controls, and includes power-ups, different levels, and boss fights.",
        timestamp: "09:16",
      },
    ],
    createdAt: "2025-01-13",
  },
];

// ── Dashboard Data ───────────────────────────────────────────────────────────

export const mockDashboardData: AvatarDashboardData = {
  spent: 0.3,
  total: 40,
  currency: "LUCA",
  linksActivity: [
    { name: "Total", usage: 20, remaining: 201 },
    { name: "Mike", usage: 20, remaining: 101 },
  ],
  links: [
    {
      id: "link-1",
      name: "Mike",
      url: "https://atm.network/shared-link/lucy",
      lucaLimit: 2,
    },
  ],
};
