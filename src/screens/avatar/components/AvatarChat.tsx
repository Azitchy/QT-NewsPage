import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import type {
  AvatarProfile,
  AvatarConversation,
  AvatarChatMessage,
  AvatarQuickAction,
} from "../types";

interface AvatarChatProps {
  profile: AvatarProfile | null;
  conversation: AvatarConversation | null;
  quickActions: AvatarQuickAction[];
  onSendMessage: (content: string) => void;
  onQuickAction: (action: AvatarQuickAction) => void;
  loading?: boolean;
}

export default function AvatarChat({
  profile,
  conversation,
  quickActions,
  onSendMessage,
  onQuickAction,
  loading,
}: AvatarChatProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = conversation?.messages ?? [];
  const hasMessages = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col rounded-[15px] bg-white border border-[#EBEBEB] overflow-hidden">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="px-[20px] py-[16px] border-b border-[#EBEBEB] flex items-center gap-[10px]">
        <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-b from-[#8E1BF4] to-[#100CD8] flex items-center justify-center shrink-0">
          <span className="text-white text-[14px] font-semibold">
            {profile?.name?.charAt(0) ?? "L"}
          </span>
        </div>
        <div>
          <p className="text-[14px] font-semibold text-[#1C1C1C] leading-[18px]">
            {profile?.name ?? "Lucy"}
          </p>
          <p className="text-[11px] text-[#999] leading-[14px]">AI Assistant</p>
        </div>
      </div>

      {/* ── Messages area ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-[20px] py-[20px] flex flex-col gap-[16px]">
        {!hasMessages ? (
          /* Greeting / empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-[16px]">
            <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-b from-[#8E1BF4] to-[#100CD8] flex items-center justify-center">
              <span className="text-white text-[26px] font-semibold">
                {profile?.name?.charAt(0) ?? "L"}
              </span>
            </div>
            <p className="text-[14px] text-[#666] text-center max-w-[360px] leading-[20px]">
              {profile?.greeting ??
                "Hey, I'm here to help you and don't worry, our story will be our secret."}
            </p>
          </div>
        ) : (
          /* Message bubbles */
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} avatarName={profile?.name ?? "Lucy"} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick actions ─────────────────────────────── */}
      {!hasMessages && quickActions.length > 0 && (
        <div className="px-[20px] pb-[12px] flex flex-wrap gap-[8px]">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onQuickAction(action)}
              className="px-[14px] py-[8px] rounded-full border border-[#EBEBEB] text-[13px] text-[#1C1C1C] hover:bg-[#F6F6F6] transition-colors cursor-pointer"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Input area ────────────────────────────────── */}
      <div className="px-[20px] pb-[20px] pt-[8px]">
        <div className="flex items-center gap-[10px] border border-[#EBEBEB] rounded-[12px] px-[14px] py-[10px]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            disabled={loading}
            className="flex-1 text-[14px] text-[#1C1C1C] placeholder:text-[#BFBFBF] outline-none bg-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-[32px] h-[32px] rounded-full bg-gradient-to-b from-[#8E1BF4] to-[#100CD8] flex items-center justify-center cursor-pointer disabled:opacity-40"
          >
            <Send size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Message bubble                                                           */
/* ═══════════════════════════════════════════════════════════════════════════ */

function MessageBubble({
  message,
  avatarName,
}: {
  message: AvatarChatMessage;
  avatarName: string;
}) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-[10px] ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar circle */}
      {!isUser && (
        <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-b from-[#8E1BF4] to-[#100CD8] flex items-center justify-center shrink-0">
          <span className="text-white text-[12px] font-semibold">
            {avatarName.charAt(0)}
          </span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[70%] rounded-[12px] px-[14px] py-[10px] ${
          isUser
            ? "bg-gradient-to-b from-[#8E1BF4] to-[#100CD8] text-white"
            : "bg-[#F6F6F6] text-[#1C1C1C]"
        }`}
      >
        <p className="text-[14px] leading-[20px] whitespace-pre-wrap">
          {message.content}
        </p>
        <p
          className={`text-[11px] mt-[4px] ${
            isUser ? "text-white/60" : "text-[#999]"
          }`}
        >
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}
