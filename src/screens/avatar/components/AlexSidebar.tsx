import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { AvatarProfile } from "../types";

interface AlexSidebarProps {
  profile: AvatarProfile | null;
}

export default function AlexSidebar({ profile }: AlexSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const avatarId = profile?.id ?? "alex";
  const basePath = `/avatar/${avatarId}`;

  // Detect active tab dynamically
  const activeTab = location.pathname.split("/")[3] || "dashboard";

  useEffect(() => {
    const close = () => setMenuOpenId(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const navItems = [
    { label: "Dashboard", key: "dashboard", path: `${basePath}/dashboard` },
    { label: "Profile", key: "profile", path: `${basePath}/profile` },
    { label: "Chat", key: "chat", path: `${basePath}/chat`, newChat: true },
    { label: "Train Avatar", key: "train", path: `${basePath}/train` },
    { label: "New Avatar", key: "new", path: `${basePath}/new` },
  ];

  return (
    <>
      <div className="lg:w-[222px] mb-5 lg:mb-0 shrink-0 lg:bg-card rounded-r-[15px] lg:border border-[#EBEBEB] flex flex-col lg:h-full overflow-hidden">
        {/* Avatar Name (Desktop) */}
        <span className="text-[20px] hidden lg:flex font-normal text-foreground pt-[16px] px-[20px]">
          {profile?.name ?? "Alex"}
        </span>

        {/* Back Button */}
        <div className="px-[20px] pt-[20px]">
          <button
            onClick={() => navigate("/avatar")}
            className="cursor-pointer hover:opacity-70"
          >
            <ArrowLeft size={20} className="text-[#1C1C1C]" />
          </button>
        </div>

        {/* Avatar Image */}
        <div className="flex flex-col items-center gap-[10px] pt-[16px] px-[20px]">
          <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-b from-[#8E1BF4] to-[#100CD8] flex items-center justify-center">
            {profile?.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="w-[74px] h-[74px] rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-[28px] font-semibold">
                {profile?.name?.charAt(0) ?? "L"}
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-[4px] px-[12px] pt-[20px]">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;

            return (
              <div
                key={item.key}
                className={`rounded-[40px] ${
                  isActive
                    ? "p-[1px] bg-gradient-to-b from-[#8E1BF4] to-[#100CD8]"
                    : ""
                }`}
              >
                <button
                  onClick={() => {
                    navigate(item.path);
                  }}
                  className={`flex items-center gap-[10px] px-[12px] py-[10px] rounded-[40px] w-full cursor-pointer ${
                    isActive ? "bg-white font-semibold" : "hover:bg-[#F6F6F6]"
                  }`}
                >
                  {item.label}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
