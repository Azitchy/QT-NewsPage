import { Copy } from "lucide-react";
import { Button } from "@/components/ui/atm/button";
import type { ChatUser } from "../types";
import UserAvatar from "./UserAvatar";

interface UserProfileModalProps {
  isOpen: boolean;
  user: ChatUser | null;
  onClose: () => void;
  onSendMessage: (userId: string) => void;
  onConnect: (userId: string) => void;
}

export default function UserProfileModal({
  isOpen,
  user,
  onClose,
  onSendMessage,
  onConnect,
}: UserProfileModalProps) {
  if (!isOpen || !user) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(user.walletAddress);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[15px] p-[24px] w-[90%] max-w-[380px] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* User info */}
        <div className="flex items-center gap-[12px] mb-[16px]">
          <UserAvatar name={user.name} avatar={user.avatar} size="lg" />
          <div className="min-w-0">
            <h3 className="text-[18px] font-medium text-foreground">
              {user.name}
            </h3>
            <div className="flex items-center gap-[6px]">
              <p className="text-[13px] text-[#959595] truncate">
                {user.walletAddress}
              </p>
              <button
                onClick={handleCopyAddress}
                className="text-[#959595] hover:text-primary cursor-pointer"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* PR Value */}
        {user.prValue != null && (
          <p className="text-[14px] text-foreground mb-[20px]">
            PR value:{" "}
            <span className="font-semibold">{user.prValue.toFixed(4)}</span>
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-[10px]">
          <Button
            variant="success"
            onClick={() => onSendMessage(user.id)}
          >
            Send message
          </Button>
          <Button
            variant="default"
            onClick={() => onConnect(user.id)}
          >
            Connect
          </Button>
        </div>
      </div>
    </div>
  );
}
