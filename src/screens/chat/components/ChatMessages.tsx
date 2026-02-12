import { useState, useRef, useEffect } from "react";
import { Smile, Maximize2, Paperclip, Mic, Send } from "lucide-react";
import type { ChatMessage, ChatRoom } from "../types";
import UserAvatar from "./UserAvatar";

interface ChatMessagesProps {
  room: ChatRoom | null;
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onClickMember: (memberId: string) => void;
}

export default function ChatMessages({
  room,
  currentUserId,
  onSendMessage,
  onClickMember,
}: ChatMessagesProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room?.messages.length]);

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

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#4F5555] text-[16px] bg-white rounded-[15px]">
        Select a room to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 p-[20px] bg-white rounded-[15px] overflow-hidden flex flex-col justify-end items-center gap-[20px]">
      {/* ── Scrollable messages ──────────────────────────────── */}
      <div className="w-full flex-1 overflow-y-auto overflow-x-hidden flex flex-col justify-end items-center gap-[20px]">
        {/* Date chip */}
        <div className="px-[10px] py-[5px] bg-[#EEEEEE] rounded-[20px]">
          <span className="text-[14px] font-normal text-[#1C1C1C] leading-[19px]">
            Mon 22 Jan
          </span>
        </div>

        {/* Messages */}
        <div className="w-full flex flex-col justify-end items-center gap-[25px]">
          {room.messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === currentUserId}
              onClickSender={() => onClickMember(msg.senderId)}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input bar ───────────────────────────────────────── */}
      <div className="w-full px-[20px] py-[15px] bg-white rounded-[32px] border border-[#EEEEEE] flex items-center gap-[15px]">
        {/* Left: emoji + text input */}
        <div className="flex-1 flex items-center gap-[15px]">
          <button className="text-primary hover:opacity-80 cursor-pointer shrink-0">
            <Smile size={24} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            className="flex-1 bg-transparent outline-none text-[14px] text-[#1C1C1C] leading-[19px] placeholder:text-[#4F5555]"
          />
        </div>

        {/* Right: action icons */}
        <div className="flex items-center gap-[15px]">
          <button className="text-primary hover:opacity-80 cursor-pointer">
            <Maximize2 size={20} />
          </button>
          <button className="text-primary hover:opacity-80 cursor-pointer">
            <Paperclip size={24} />
          </button>
          <button className="text-primary hover:opacity-80 cursor-pointer">
            <Mic size={24} />
          </button>
          {input.trim() && (
            <button
              onClick={handleSend}
              className="text-primary hover:opacity-80 cursor-pointer"
            >
              <Send size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Message Bubble ──────────────────────────────────────────────────────────

function MessageBubble({
  message,
  isOwn,
  onClickSender,
}: {
  message: ChatMessage;
  isOwn: boolean;
  onClickSender: () => void;
}) {
  return (
    <div className="w-full flex items-start gap-[10px]">
      <button onClick={onClickSender} className="shrink-0 cursor-pointer">
        <UserAvatar
          name={message.senderName}
          avatar={message.senderAvatar}
          size="sm"
        />
      </button>

      <div className="flex-1 bg-white overflow-hidden flex flex-col gap-[5px]">
        <div className="flex items-center gap-[10px]">
          <button
            onClick={onClickSender}
            className="text-[16px] font-medium text-[#1C1C1C] leading-[21px] hover:text-primary transition-colors cursor-pointer"
          >
            {message.senderName}
          </button>
          <span className="text-[14px] font-normal text-[#4F5555] leading-[19px]">
            {message.timestamp}
          </span>
        </div>
        <p className="text-[14px] font-normal text-[#1C1C1C] leading-[19px] break-words">
          {message.content}
        </p>
      </div>
    </div>
  );
}
