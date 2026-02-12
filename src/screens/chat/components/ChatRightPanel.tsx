import type { ChatRoom, RoomMember } from "../types";
import UserAvatar from "./UserAvatar";

interface ChatRightPanelProps {
  room: ChatRoom | null;
  onClickMember: (memberId: string) => void;
  onOpenAddMember: () => void;
}

export default function ChatRightPanel({
  room,
  onClickMember,
}: ChatRightPanelProps) {
  if (!room) return null;

  return (
    <div className="w-[450px] shrink-0 p-[20px] bg-white rounded-[15px] h-full overflow-hidden flex flex-col gap-[50px]">
      {/* ── Room Rules ───────────────────────────────────────── */}
      <div className="flex flex-col gap-[20px]">
        <h3 className="text-[20px] font-normal text-[#1C1C1C]">
          Rooms rules
        </h3>

        {room.rules ? (
          <>
            {/* Numbered rules */}
            <div className="text-[16px] font-normal text-[#1C1C1C] leading-[22px]">
              {room.rules
                .split("\n")
                .filter((line) => line.trim())
                .map((line, i) => {
                  /* If line already starts with a number/bullet, render as-is */
                  if (/^\d+\./.test(line.trim())) {
                    return (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    );
                  }
                  return (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  );
                })}
            </div>
          </>
        ) : (
          <p className="text-[16px] text-[#4F5555]">No rules set</p>
        )}
      </div>

      {/* ── Members ──────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        {/* Sticky header */}
        <div className="pb-[20px] bg-white">
          <h3 className="text-[20px] font-normal text-[#1C1C1C]">Members</h3>
        </div>

        {/* Scrollable member list */}
        <div className="overflow-y-auto flex flex-col gap-[26px]" style={{ maxHeight: "calc(100% - 54px)" }}>
          {room.members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              onClick={() => onClickMember(member.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MemberRow({
  member,
  onClick,
}: {
  member: RoomMember;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-[10px] text-left cursor-pointer"
    >
      <UserAvatar name={member.name} size="md" />

      <div className="flex-1 bg-white overflow-hidden flex flex-col gap-[5px]">
        <div className="flex items-center gap-[5px]">
          <span className="text-[16px] font-medium text-[#1C1C1C]">
            {member.name}
          </span>
          {(member.role === "admin" || member.role === "owner") && (
            <span className="text-[14px] font-normal px-[10px] py-[5px] rounded-[20px] bg-[#DDF0BE] text-[#1C1C1C] leading-[19px]">
              Settings
            </span>
          )}
        </div>
        <p className="text-[16px] font-normal text-[#1C1C1C] truncate">
          {member.walletAddress}
        </p>
      </div>
    </button>
  );
}
