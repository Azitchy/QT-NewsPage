import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/atm/button";
import { Switch } from "@/components/ui/atm/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/atm/tabs";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    rules: string;
    isPrivate: boolean;
    members: string[];
  }) => void;
}

export default function CreateRoomModal({
  isOpen,
  onClose,
  onCreate,
}: CreateRoomModalProps) {
  const [activeTab, setActiveTab] = useState("room");
  const [name, setName] = useState("");
  const [rules, setRules] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [members, setMembers] = useState<string[]>([""]);

  if (!isOpen) return null;

  const handleAddMemberField = () => {
    setMembers((prev) => [...prev, ""]);
  };

  const handleMemberChange = (index: number, value: string) => {
    setMembers((prev) => prev.map((m, i) => (i === index ? value : m)));
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({
      name: name.trim(),
      rules: rules.trim(),
      isPrivate,
      members: members.filter((m) => m.trim()),
    });
    // reset
    setName("");
    setRules("");
    setIsPrivate(false);
    setMembers([""]);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-[15px] p-[24px] w-[90%] max-w-[480px] shadow-lg relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px] text-[#959595] hover:text-foreground cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-[20px]">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="room">Room</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <p className="text-[14px] text-[#959595]">
              Start a direct message by entering a wallet address.
            </p>
          </TabsContent>

          <TabsContent value="room">
            {/* Room's name */}
            <label className="block mb-[16px]">
              <span className="text-[14px] font-medium text-foreground block mb-[6px]">
                Room's name
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a room's name"
                className="w-full bg-[#F6F6F6] rounded-[30px] px-[16px] py-[12px] text-[14px] outline-none placeholder:text-[#B5B5B5]"
              />
            </label>

            {/* Rules */}
            <label className="block mb-[16px]">
              <span className="text-[14px] font-medium text-foreground block mb-[6px]">
                Rules{" "}
                <span className="text-[#959595] font-normal">(optional)</span>
              </span>
              <input
                type="text"
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                placeholder="Enter rules"
                className="w-full bg-[#F6F6F6] rounded-[30px] px-[16px] py-[12px] text-[14px] outline-none placeholder:text-[#B5B5B5]"
              />
            </label>

            {/* Private toggle */}
            <div className="flex items-center justify-between mb-[16px]">
              <span className="text-[14px] text-foreground">
                Private room{" "}
                <span className="text-[#959595]">
                  (only for invited guests)
                </span>
              </span>
              <Switch
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
            </div>

            {/* Add members */}
            <button
              onClick={handleAddMemberField}
              className="flex items-center gap-[6px] text-primary text-[14px] font-medium mb-[12px] cursor-pointer"
            >
              <Plus size={16} />
              Add a member
            </button>

            {members.map((addr, i) => (
              <input
                key={i}
                type="text"
                value={addr}
                onChange={(e) => handleMemberChange(i, e.target.value)}
                placeholder="Enter wallet address"
                className="w-full bg-[#F6F6F6] rounded-[30px] px-[16px] py-[12px] text-[14px] outline-none placeholder:text-[#B5B5B5] mb-[8px]"
              />
            ))}

            {/* Create button */}
            <Button
              variant="success"
              onClick={handleCreate}
              className="mt-[12px]"
            >
              Create the room
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
