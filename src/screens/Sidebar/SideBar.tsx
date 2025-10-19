import React, { useEffect } from "react";

const sidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "/sidebar/dashboard-icon.png",
    activeIcon: "/sidebar/dashboard-icon-active.png",
  },
  {
    id: "connection",
    label: "Connection",
    icon: "/sidebar/connection-icon.png",
    activeIcon: "/sidebar/connection-icon-active.png",
  },
  {
    id: "proposals",
    label: "Proposals",
    icon: "/sidebar/proposals-icon.png",
    activeIcon: "/sidebar/proposals-icon-active.png",
  },
  {
    id: "trading",
    label: "Trading tool",
    icon: "/sidebar/trading-icon.png",
    activeIcon: "/sidebar/trading-icon-active.png",
  },
  {
    id: "chat",
    label: "Chat",
    icon: "/sidebar/chat-icon.png",
    activeIcon: "/sidebar/chat-icon-active.png",
  },
  {
    id: "avatar",
    label: "Avatar",
    icon: "/sidebar/avatar-icon.png",
    activeIcon: "/sidebar/avatar-icon-active.png",
  },
  {
    id: "game",
    label: "Games",
    icon: "/sidebar/games-icon.png",
    activeIcon: "/sidebar/games-icon-active.png",
  },
  {
    id: "travel",
    label: "Travel",
    icon: "/sidebar/travel-icon.png",
    activeIcon: "/sidebar/travel-icon-active.png",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "/sidebar/setting-icon.png",
    activeIcon: "/sidebar/setting-icon-active.png",
  },
  {
    id: "create-connection",
    label: "Create Connection",
    icon: "/sidebar/create-connection-icon.png",
    activeIcon: "/sidebar/create-connection-icon.png",
  },
];

const subItems: Record<string, string[]> = {
  dashboard: ["Portfolio", "Income"],
  connection: ["Token connection", "NFT connection", "PR node"],
  proposals: [
    "Proposal participate",
    "Proposal initiated",
    "Recovery plan",
    "AGF contribution",
    "Your contribution",
  ],
  "trading tool": ["ATM cross-chain transfer"],
  chat: ["General", "Community", "Support"],
  avatar: ["Lucy"],
  games: ["Dashboard", "Games", "Contributions", "Propose game"],
  travel: [""],
  settings: [""],
};

interface SidebarProps {
  active: string;
  setActive: (value: string) => void;
  activeSub?: string | null;
  setActiveSub: (value: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  active,
  setActive,
  activeSub,
  setActiveSub,
}) => {
  useEffect(() => {
    const firstSub = subItems[active]?.[0] || null;
    setActiveSub(firstSub);
  }, [active]);

  const renderItem = (label: string) => (
    <p
      key={label}
      onClick={() => setActiveSub(label)}
      className={`text-[18px] md:text-base mt-3 cursor-pointer transition-colors duration-200 ${
        activeSub === label.toLowerCase().replace(/\s+/g, "-")
          ? "text-primary font-medium md:font-bold"
          : "text-foreground font-normal"
      }`}
    >
      {label}
    </p>
  );

  const renderContent = () => {
    const items = subItems[active] || [];
    const title =
      active.charAt(0).toUpperCase() + active.slice(1).replace("-", " ");
    return (
      <>
        <h1 className="hidden md:block text-[20px] font-normal text-foreground">
          {title}
        </h1>
        <div className="flex md:flex-col space-x-5 md:space-x-0">
          {items.map(renderItem)}
        </div>
      </>
    );
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex fixed top-6 left-4 h-screen items-start z-50">
        <div className="w-[282px] bg-background dark:bg-[#15152B] rounded-2xl shadow-md overflow-hidden">
          <div className="flex">
            {/* Left Sidebar */}
            <div className="w-[85px] flex flex-col items-center py-6 space-y-6">
              <div className="flex items-center justify-center">
                <a href="/" target="_blank">
                  <img
                    src="/sidebar/atm-logo.svg"
                    alt="logo"
                    className="w-12 h-12 object-contain"
                  />
                </a>
              </div>

              {/* Icons */}
              <nav className="flex-1 flex flex-col items-center mt-4 space-y-6">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    title={item.label}
                    className="relative w-6 h-6 flex items-center justify-center group"
                  >
                    <img
                      src={active === item.id ? item.activeIcon : item.icon}
                      alt={item.label}
                      className="w-6 h-6 object-contain transition-transform duration-200 group-hover:scale-110"
                    />
                    {/* tooltip */}
                    <span className="absolute left-10 opacity-0 group-hover:opacity-100 bg-white dark:bg-[#2B2F3E] text-foreground text-xs font-normal shadow-md rounded-[5px] px-2 py-2 whitespace-nowrap transition-all duration-200">
                      {item.label}
                    </span>
                  </button>
                ))}
              </nav>

              <div className="flex flex-col items-center space-y-4 mt-auto pt-16 2xl:pt-32 large:pt-40">
                <div className="bg-primary-foreground dark:bg-[#304344] rounded-full p-3 flex items-center gap-2">
                  <img
                    src="/sidebar/bsc-icon.png"
                    alt="bsc"
                    className="w-5 h-5"
                  />
                  <span className="text-sm text-primary font-medium">BCS</span>
                </div>

                <button className="w-8 h-8 flex items-center justify-center">
                  <img
                    src="/sidebar/notification.png"
                    alt="notifications"
                    className="w-6 h-6"
                  />
                </button>

                <button className="w-8 h-8 flex items-center justify-center">
                  <img
                    src="/sidebar/leave-icon.png"
                    alt="logout"
                    className="w-6 h-6"
                  />
                </button>
              </div>
            </div>

            <div className="w-px bg-[#EBEBEB] dark:bg-[#555888]" />
            <div className="flex-1 px-6 py-7">{renderContent()}</div>
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div className="md:hidden">
        {/* Fixed Top Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background dark:bg-[#15152B] backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <a href="/" target="_blank">
              <img
                src="/sidebar/atm-logo.svg"
                alt="logo"
                className="w-10 h-10"
              />
            </a>
            <div className="flex items-center gap-3">
              <button>
                <img
                  src="/sidebar/notification.png"
                  alt="notifications"
                  className="w-6 h-6"
                />
              </button>
              <button>
                <img
                  src="/sidebar/setting-icon.png"
                  alt="settings"
                  className="w-6 h-6"
                />
              </button>
              <div className="bg-primary-foreground dark:bg-[#304344] rounded-full px-3 py-1 flex items-center gap-2">
                <img
                  src="/sidebar/bsc-icon.png"
                  alt="bsc"
                  className="w-6 h-6"
                />
                <span className="text-xs text-foreground font-medium">BCS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background dark:bg-[#15152B] border-t border-border shadow-md flex items-center py-2 backdrop-blur-md overflow-x-auto no-scrollbar">
          <div className="flex flex-nowrap px-4 space-x-4 md:space-x-6">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className="flex flex-col items-center justify-center min-w-[60px]"
              >
                <img
                  src={active === item.id ? item.activeIcon : item.icon}
                  alt={item.label}
                  className="w-6 h-6"
                />
                <span
                  className={`text-[10px] md:text-xs mt-1 ${
                    active === item.id
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </nav>

        {/* Scrollable Content */}
        <div className="pt-[70px] md:pb-[70px] px-4 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
