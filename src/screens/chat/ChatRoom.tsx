import { useState, useEffect, useCallback } from "react";
import { Star, Users, MoreHorizontal } from "lucide-react";
import {
  useGetRooms,
  useGetDirectMessages,
  useSendMessage,
  useCreateRoom,
  useAddMember,
} from "@/hooks/useChat";
import { mockCurrentUser } from "@/lib/chatMockData";
import type { ChatUser } from "./types";

import ChatSidebar from "./components/ChatSidebar";
import ChatMessages from "./components/ChatMessages";
import ChatRightPanel from "./components/ChatRightPanel";
import AddMemberModal from "./components/AddMemberModal";
import CreateRoomModal from "./components/CreateRoomModal";
import UserProfileModal from "./components/UserProfileModal";

export default function ChatRoom() {
  // ── Data ────────────────────────────────────────────────────────────────
  const { data: rooms, execute: fetchRooms } = useGetRooms();
  const { data: directMessages, execute: fetchDMs } = useGetDirectMessages();
  const { execute: sendMsg } = useSendMessage();
  const { execute: createRoom } = useCreateRoom();
  const { execute: addMember } = useAddMember();

  // ── UI State ────────────────────────────────────────────────────────────
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [profileUser, setProfileUser] = useState<ChatUser | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  // ── Bootstrap ───────────────────────────────────────────────────────────
  useEffect(() => {
    fetchRooms();
    fetchDMs();
  }, []);

  useEffect(() => {
    if (rooms && rooms.length > 0 && !activeRoomId) {
      setActiveRoomId(rooms[0].id);
    }
  }, [rooms]);

  // ── Derived ─────────────────────────────────────────────────────────────
  const activeRoom = rooms?.find((r) => r.id === activeRoomId) ?? null;

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!activeRoomId) return;
      await sendMsg({ roomId: activeRoomId, content });
      await fetchRooms();
    },
    [activeRoomId, sendMsg, fetchRooms]
  );

  const handleCreateRoom = useCallback(
    async (data: {
      name: string;
      rules: string;
      isPrivate: boolean;
      members: string[];
    }) => {
      await createRoom(data);
      setShowCreateRoom(false);
      await fetchRooms();
    },
    [createRoom, fetchRooms]
  );

  const handleAddMember = useCallback(
    async (walletAddress: string) => {
      if (!activeRoomId) return;
      await addMember({ roomId: activeRoomId, walletAddress });
      await fetchRooms();
    },
    [activeRoomId, addMember, fetchRooms]
  );

  const handleClickMember = useCallback(
    (memberId: string) => {
      const member = activeRoom?.members.find((m) => m.id === memberId);
      if (member) {
        setProfileUser({
          id: member.id,
          name: member.name,
          walletAddress: member.walletAddress,
          prValue: 1081.2345,
        });
        setShowProfile(true);
      }
    },
    [activeRoom]
  );

  return (
    <>
      {/* ── Chat Left Sidebar ──────────────────────────────────── */}
      <ChatSidebar
        currentUser={mockCurrentUser}
        rooms={rooms ?? []}
        directMessages={directMessages ?? []}
        activeRoomId={activeRoomId}
        onSelectRoom={setActiveRoomId}
        onSelectDM={() => {}}
        onCreateRoom={() => setShowCreateRoom(true)}
      />

      {/* ── Main Content Column (header + messages + right panel) */}
      <div className="flex-1 flex flex-col gap-[20px] min-w-0 min-h-0">
        {/* ── Room Header Bar ────────────────────────────────── */}
        {activeRoom && (
          <div className="w-full h-[70px] shrink-0 px-[20px] py-[15px] bg-white rounded-[15px] flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-[10px]">
              <span className="text-[16px] font-normal text-[#1C1C1C] leading-[21px]">
                {activeRoom.name}
              </span>
              <span className="px-[10px] py-[7px] bg-[#DDF0BE] rounded-[20px] text-[16px] font-normal text-[#1C1C1C] leading-[21px]">
                {activeRoom.type === "public" ? "Public" : "Private"}
              </span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-[20px] text-primary">
              <button className="hover:opacity-80 cursor-pointer">
                <Star size={24} />
              </button>
              <button
                onClick={() => setShowAddMember(true)}
                className="flex items-end gap-[5px] hover:opacity-80 cursor-pointer"
              >
                <Users size={24} />
                <span className="text-[18px] font-normal text-[#1C1C1C] leading-[21px]">
                  {activeRoom.memberCount}
                </span>
              </button>
              <button className="hover:opacity-80 cursor-pointer">
                <MoreHorizontal size={24} />
              </button>
            </div>
          </div>
        )}

        {/* ── Messages + Right Panel Row ─────────────────────── */}
        <div className="flex-1 flex gap-[20px] min-h-0">
          <ChatMessages
            room={activeRoom}
            currentUserId={mockCurrentUser.id}
            onSendMessage={handleSendMessage}
            onClickMember={handleClickMember}
          />

          {/* Right panel — visible on xl+ screens */}
          <div className="hidden xl:flex">
            <ChatRightPanel
              room={activeRoom}
              onClickMember={handleClickMember}
              onOpenAddMember={() => setShowAddMember(true)}
            />
          </div>
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────── */}
      <AddMemberModal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        onAddMember={handleAddMember}
        members={activeRoom?.members ?? []}
      />

      <CreateRoomModal
        isOpen={showCreateRoom}
        onClose={() => setShowCreateRoom(false)}
        onCreate={handleCreateRoom}
      />

      <UserProfileModal
        isOpen={showProfile}
        user={profileUser}
        onClose={() => setShowProfile(false)}
        onSendMessage={() => setShowProfile(false)}
        onConnect={() => setShowProfile(false)}
      />
    </>
  );
}
