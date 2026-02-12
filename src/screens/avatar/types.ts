// ── Avatar Types ──────────────────────────────────────────────────────────────

export interface AvatarProfile {
  id: string;
  name: string;
  image?: string;
  greeting: string;
}

export interface AvatarChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AvatarConversation {
  id: string;
  title: string;
  messages: AvatarChatMessage[];
  createdAt: string;
}

export interface AvatarLink {
  id: string;
  name: string;
  url: string;
  lucaLimit: number;
}

export interface AvatarLinkActivity {
  name: string;
  usage: number;
  remaining: number;
}

export interface AvatarDashboardData {
  spent: number;
  total: number;
  currency: string;
  linksActivity: AvatarLinkActivity[];
  links: AvatarLink[];
}

export interface AvatarQuickAction {
  id: string;
  label: string;
}
