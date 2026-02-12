/**
 * Avatar API layer — all functions return mock data for now.
 * Replace implementations with real API calls when backend is ready.
 */

import {
  mockAvatarProfiles,
  mockConversations,
  mockDashboardData,
  mockQuickActions,
} from "./avatarMockData";
import type {
  AvatarProfile,
  AvatarConversation,
  AvatarChatMessage,
  AvatarDashboardData,
  AvatarQuickAction,
} from "@/screens/avatar/types";

// Simulate network delay
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// ── Profiles ─────────────────────────────────────────────────────────────────

export async function getAvatarProfile(
  avatarId: string
): Promise<AvatarProfile | null> {
  await delay();
  return mockAvatarProfiles.find((p) => p.id === avatarId) ?? null;
}

export async function getAvatarProfiles(): Promise<AvatarProfile[]> {
  await delay();
  return mockAvatarProfiles;
}

// ── Conversations ────────────────────────────────────────────────────────────

export async function getConversations(): Promise<AvatarConversation[]> {
  await delay();
  return [...mockConversations];
}

export async function getConversationById(
  conversationId: string
): Promise<AvatarConversation | null> {
  await delay();
  return mockConversations.find((c) => c.id === conversationId) ?? null;
}

export async function createConversation(
  title: string
): Promise<AvatarConversation> {
  await delay(500);
  const conv: AvatarConversation = {
    id: `conv-${Date.now()}`,
    title,
    messages: [],
    createdAt: new Date().toISOString().split("T")[0],
  };
  mockConversations.unshift(conv);
  return conv;
}

export async function deleteConversation(
  conversationId: string
): Promise<void> {
  await delay(300);
  const idx = mockConversations.findIndex((c) => c.id === conversationId);
  if (idx !== -1) mockConversations.splice(idx, 1);
}

export async function sendAvatarMessage(
  conversationId: string,
  content: string
): Promise<AvatarChatMessage> {
  await delay(200);

  const userMsg: AvatarChatMessage = {
    id: `msg-${Date.now()}`,
    role: "user",
    content,
    timestamp: new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  const conv = mockConversations.find((c) => c.id === conversationId);
  if (conv) {
    conv.messages.push(userMsg);
  }

  // Simulate AI response after a short delay
  setTimeout(() => {
    const aiMsg: AvatarChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: "assistant",
      content: getMockResponse(content),
      timestamp: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    if (conv) conv.messages.push(aiMsg);
  }, 800);

  return userMsg;
}

// ── Dashboard ────────────────────────────────────────────────────────────────

export async function getDashboardData(): Promise<AvatarDashboardData> {
  await delay();
  return { ...mockDashboardData };
}

// ── Quick Actions ────────────────────────────────────────────────────────────

export async function getQuickActions(): Promise<AvatarQuickAction[]> {
  await delay();
  return [...mockQuickActions];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("atm") || lower.includes("what is")) {
    return "Autonomous Trust Momentum is a web3 community allowing users to earn rewards through peer-to-peer staking connections. A connection consists of two users contractually locking a certain amount of token for a specific amount of time. ATM uses a sophisticated algorithm called ATM-Rank to rank the influence of users in their network.";
  }
  if (lower.includes("game")) {
    return "I can help you create a game! What type of game would you like to create? I support various genres including platformers, puzzles, and arcade games.";
  }
  if (lower.includes("connect")) {
    return "To create a connection, you'll need the recipient's wallet address and decide on the token amount and duration. Would you like to proceed with a token connection or an NFT connection?";
  }
  if (lower.includes("news") || lower.includes("crypto")) {
    return "Here are today's top crypto highlights: Major exchanges are reporting increased trading volumes, new DeFi protocols are gaining traction, and the NFT market continues to evolve with innovative use cases.";
  }
  return "I understand your question. Let me help you with that. Could you provide more details about what you're looking for?";
}
