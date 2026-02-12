import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/atm/button";
import type { RoomMember } from "../types";
import UserAvatar from "./UserAvatar";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (walletAddress: string) => void;
  members: RoomMember[];
}

export default function AddMemberModal({
  isOpen,
  onClose,
  onAddMember,
  members,
}: AddMemberModalProps) {
  const [address, setAddress] = useState("");

  if (!isOpen) return null;

  const handleAdd = () => {
    const trimmed = address.trim();
    if (!trimmed) return;
    onAddMember(trimmed);
    setAddress("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-[15px] p-[24px] w-[90%] max-w-[480px] shadow-lg relative max-h-[80vh] flex flex-col">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px] text-[#959595] hover:text-foreground cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-[18px] font-medium text-foreground mb-[16px]">
          User wallet address
        </h2>

        {/* Input */}
        <div className="flex items-center gap-[10px] mb-[12px]">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter a wallet address"
            className="flex-1 bg-[#F6F6F6] rounded-[30px] px-[16px] py-[10px] text-[14px] outline-none placeholder:text-[#B5B5B5]"
          />
          <span className="text-[13px] text-[#959595] uppercase">LUCA</span>
        </div>

        <Button variant="success" onClick={handleAdd} className="w-fit mb-[20px]">
          Add member
        </Button>

        {/* Members list */}
        <h3 className="text-[16px] font-medium text-foreground mb-[12px]">
          Members
        </h3>

        <div className="flex-1 overflow-y-auto flex flex-col gap-[12px]">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-[10px]">
              <UserAvatar name={member.name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[6px]">
                  <span className="text-[14px] font-medium text-foreground">
                    {member.name}
                  </span>
                  {(member.role === "admin" || member.role === "owner") && (
                    <span className="text-[11px] px-[8px] py-[2px] rounded-[20px] bg-[#E9F6F7] text-primary">
                      Settings
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[#959595] truncate">
                  {member.walletAddress}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
