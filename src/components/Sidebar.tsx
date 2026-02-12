import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUnified } from "@/context/Context";
import DashboardIcon from "@/assets/icons/dashboard-btn-icon.svg?react";
import ConnectionIcon from "@/assets/icons/connections-btn-icon.svg?react";
import ProposalIcon from "@/assets/icons/proposals-btn-icon.svg?react";
import TradingIcon from "@/assets/icons/trading-btn-icon.svg?react";
import ChatIcon from "@/assets/icons/chat-btn-icon.svg?react";
import AvatarIcon from "@/assets/icons/avatar-btn-icon.svg?react";
import GamesIcon from "@/assets/icons/games-btn-icon.svg?react";
import SettingsIcon from "@/assets/icons/setting-btn-icon.svg?react";
import CreateConnectionIcon from "@/assets/icons/create-connection-btn-icon.svg?react";
import BellIcon from "@/assets/icons/notification-btn-icon.svg?react";
import LeaveIcon from "@/assets/icons/leave-btn-icon.svg?react";
import ExploreIcon from "@/assets/icons/explore-btn-icon.svg?react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/atm/tooltip";

interface SidebarProps {
  className?: string;
}

interface NavItem {
  id: string;
  Icon: React.ComponentType<{ className?: string }>;
  label?: string;
  to: string;
  pages?: { label: string; to: string }[];
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUnified();

  const navItems: NavItem[] = [
    {
      id: "dashboard",
      Icon: DashboardIcon,
      label: "Dashboard",
      to: "/dashboard",
      pages: [
        { label: "Portfolio", to: "/dashboard/portfolio" },
        { label: "Income", to: "/dashboard/income" },
      ],
    },
    {
      id: "connections",
      Icon: ConnectionIcon,
      label: "Connections",
      to: "/connections",
      pages: [
        { label: "Token connection", to: "/connections/token-connection" },
        { label: "NFT connection", to: "/connections/nft-connection" },
        { label: "PR node", to: "/connections/pr-node" },
      ],
    },
    {
      id: "proposals",
      Icon: ProposalIcon,
      label: "Proposals",
      to: "/proposals",
      pages: [
        { label: "Proposal participate", to: "/proposals/proposal-participate" },
        { label: "Proposal initiated", to: "/proposals/proposal-initiated" },
        { label: "Recovery Plan", to: "/proposals/recovery-plan" },
        { label: "AGF Contribution", to: "/proposals/agf-contribution" },
        { label: "Your Contribution", to: "/proposals/your-contribution" },
      ],
    },
    {
      id: "trading",
      Icon: TradingIcon,
      label: "Trading tools",
      to: "/trading",
      pages: [{ label: "ATM cross-chain transfer", to: "/trading/atm-cross-chain-transfer" }],
    },
    {
      id: "chat",
      Icon: ChatIcon,
      label: "Chat",
      to: "/chat",
    },
    {
      id: "avatar",
      Icon: AvatarIcon,
      label: "Avatar",
      to: "/avatar",
      pages: [
        { label: "Lucy", to: "/avatar/lucy" },
        { label: "Alex", to: "/avatar/alex" },
      ],
    },
    {
      id: "games",
      Icon: GamesIcon,
      label: "Games",
      to: "/games",
      pages: [
        { label: "Dashboard", to: "/games/dashboard" },
        { label: "Games", to: "/games/games" },
        { label: "Contributions", to: "/games/contributions" },
        { label: "Propose game", to: "/games/propose-game" },
      ],
    },
    {
      id: "settings",
      Icon: SettingsIcon,
      label: "Settings",
      to: "/settings",
    },
  ];

  const isCreateConnection = location.pathname === "/create-connection";

  const activeSection =
    isCreateConnection
      ? null
      : navItems.find((i) => location.pathname === i.to || location.pathname.startsWith(`${i.to}/`)) ??
        navItems[0];

  function handleSectionClick(item: NavItem) {
    navigate(item.to);
  }

  function SidebarNavIcon({ Icon, active }: { Icon: NavItem["Icon"]; active: boolean }) {
    return (
      <Icon
        className={[
          "w-[24px] h-auto [&_*]:transition-all [&_*]:duration-300 hover:cursor-pointer",
          active
            ? "[&_*]:fill-[url(#icon-gradient)] [&_*]:stroke-[url(#icon-gradient)] drop-shadow-[0_0_10px_rgba(93,210,122,0.5)]"
            : "text-[#959595] group-hover:[&_*]:fill-[url(#icon-gradient-hover)] group-hover:[&_*]:stroke-[url(#icon-gradient-hover)] group-hover:drop-shadow-[0_0_8px_rgba(93,210,122,0.3)]",
        ].join(" ")}
      />
    );
  }

  return (
    <div
      className={[
        "flex gap-[1px]",
        !isCreateConnection && "w-[285px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Hidden SVG with gradient definitions */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A5DC53" />
            <stop offset="100%" stopColor="#5DD27A" />
          </linearGradient>
          <linearGradient id="icon-gradient-hover" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A5DC53" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#5DD27A" stopOpacity="0.7" />
          </linearGradient>
        </defs>
      </svg>

      {/* Sidebar Icons */}
      <div
        className={[
          "w-[90px] py-[20px] px-[10px] bg-white mx-auto flex flex-col items-center gap-[20px]",
          isCreateConnection ? "rounded-[15px]" : "rounded-l-[15px]",
        ].join(" ")}
      >
        <button
          type="button"
          className="cursor-pointer"
          onClick={() =>
            window.open(
              "https://atm.network",
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          <img src="/atm.svg" alt="ATM Logo" />
        </button>
        
        {/* Navigation Icons */}
        {navItems.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleSectionClick(item)}
                className="group relative w-[24px] h-[24px] transition-all"
                aria-label={item.label}
              >
                <SidebarNavIcon
                  Icon={item.Icon}
                  active={location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={20}>
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}

        <div className="w-[44px] h-[1px] bg-[#EBEBEB]"></div>
        
        {/* Create Connection Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="group relative w-[24px] h-[24px] transition-all hover:cursor-pointer"
              aria-label="Create connection"
              onClick={() => navigate("/create-connection")}
            >
              <CreateConnectionIcon className="w-[24px] h-auto text-primary transition-all duration-300" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={20}>
            Create connection
          </TooltipContent>
        </Tooltip>

        <div className="mt-auto flex flex-col items-center gap-[20px]">
          {/* Network Badge */}
          <div className="w-[70px] flex gap-[5px] p-[10px] rounded-[30px] bg-[#E9F6F7] transition-all duration-300 cursor-pointer group">
            <img src="src/assets/tokens/bsc1.svg" alt="BSC Token" className=""/>
            <span className="font-inter text-[14px] font-medium leading-normal text-primary transition-colors duration-300">BCS</span>
          </div>

          {/* Notification & Leave Buttons */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="group relative w-[24px] h-[24px] transition-all cursor-pointer" aria-label="Notifications">
                <BellIcon className="w-[24px] h-auto text-primary group-hover:[&>path]:fill-[url(#icon-gradient)] group-hover:drop-shadow-[0_0_10px_rgba(93,210,122,0.4)] transition-all duration-300"/>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={20}>
              Notifications
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="group relative w-[24px] h-[24px] transition-all cursor-pointer"
                aria-label="Log out"
                onClick={logout}
              >
                <LeaveIcon className="w-[24px] h-auto text-primary group-hover:[&>path]:fill-[url(#icon-gradient)] group-hover:drop-shadow-[0_0_10px_rgba(93,210,122,0.4)] transition-all duration-300"/>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={20}>
              Log out
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Sidebar Menu */}
      {!isCreateConnection && (
        <div className="px-[15px] pt-[30px] pb-[20px] bg-white w-full rounded-r-[15px]">
          {activeSection && (
            <>
              <div className="font-h4-400">
                {activeSection.label ?? ""}
              </div>

              {activeSection.pages && activeSection.pages.length > 0 && (
                <div className="mt-[14px] flex flex-col gap-[10px]">
                  {activeSection.pages.map((p) => (
                    <NavLink
                      key={p.to}
                      to={p.to}
                      className={({ isActive }) =>
                        [
                          "group transition-all duration-300",
                          isActive
                            ? "text-primary body-text1-700"
                            : "text-foreground hover:text-primary body-text1-400",
                        ].join(" ")
                      }
                    >
                      {p.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function MobileTopBar() {
  const { logout } = useUnified();

  return (
    <div className="sticky top-0 bg-white border-b border-[#EBEBEB] px-[16px] py-[10px] z-50">
      {/* Hidden SVG with gradient definitions */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="icon-gradient-mobile" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A5DC53" />
            <stop offset="100%" stopColor="#5DD27A" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex items-center justify-between">
        <button
          type="button"
          className="cursor-pointer"
          onClick={() =>
            window.open(
              "https://atm.network",
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          <img src="/atm.svg" alt="ATM Logo" className="w-[40px]" />
        </button>

        <div className="flex items-center gap-[20px]">
          {/* Notification Button */}
          <button className="group relative transition-all cursor-pointer">
            <BellIcon className="w-[20px] h-auto text-primary group-hover:[&>path]:fill-[url(#icon-gradient-mobile)] group-hover:drop-shadow-[0_0_8px_rgba(93,210,122,0.4)] transition-all duration-300" />
          </button>

          {/* Settings Button */}
          <button className="group relative transition-all">
            <SettingsIcon className="w-[20px] h-auto text-primary group-hover:[&>path]:fill-[url(#icon-gradient-mobile)] group-hover:drop-shadow-[0_0_8px_rgba(93,210,122,0.4)] transition-all duration-300" />
          </button>

          {/* Logout Button */}
          <button
            className="group relative transition-all cursor-pointer"
            aria-label="Log out"
            onClick={logout}
          >
            <LeaveIcon className="w-[20px] h-auto text-primary group-hover:[&>path]:fill-[url(#icon-gradient-mobile)] group-hover:drop-shadow-[0_0_8px_rgba(93,210,122,0.4)] transition-all duration-300" />
          </button>

          {/* Network Badge */}
          <div className="flex gap-[5px] px-[20px] py-[10px] rounded-[30px] bg-[#E9F6F7] transition-all duration-300 cursor-pointer group">
            <img src="src/assets/tokens/bsc1.svg" alt="BSC Token" className="w-[16px] h-[16px]" />
            <span className="font-inter text-[12px] font-medium text-primary transition-colors duration-300">BCS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileBottomBar() {
  const location = useLocation();
  const navigate = useNavigate();
  type MobileNavItem =
    | { id: "quickaction"; label: string }
    | { id: string; label: string; Icon: React.ComponentType<{ className?: string }>; to: string };

  const navItems: MobileNavItem[] = [
    { id: "dashboard", Icon: DashboardIcon, label: "Dashboard", to: "/dashboard" },
    { id: "connections", Icon: ConnectionIcon, label: "Connection", to: "/connections" },
    { id: "quickaction", label: "Quick Action" },
    { id: "proposals", Icon: ProposalIcon, label: "Proposals", to: "/proposals" },
    { id: "explore", Icon: ExploreIcon, label: "Explore", to: "/dashboard" },
  ];

  return (
    <div className="sticky bottom-0 bg-[#F8F8F8] border-t border-[#EBEBEB] px-[16px] py-[5px] z-50">
      {/* Hidden SVG with gradient definitions */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="icon-gradient-bottom" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A5DC53" />
            <stop offset="100%" stopColor="#5DD27A" />
          </linearGradient>
          <linearGradient id="icon-gradient-bottom-hover" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A5DC53" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#5DD27A" stopOpacity="0.7" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          // Special handling for quick action button
          if (item.id === 'quickaction') {
            return (
              <button 
                key={item.id}
                className="w-[56px] flex flex-col items-center group"
              >
                <img 
                  src="src/assets/icons/quickaction-btn-icon.png" 
                  className="w-[32px] h-auto group-hover:drop-shadow-[0_0_10px_rgba(93,210,122,0.5)] group-hover:brightness-110 transition-all duration-300" 
                  alt={item.label}
                />
              </button>
            );
          }

          const navItem = item as Extract<MobileNavItem, { to: string }>;
          const isActive = location.pathname === navItem.to || location.pathname.startsWith(`${navItem.to}/`);

          return (
            <button 
              key={navItem.id}
              onClick={() => navigate(navItem.to)}
              className="w-[56px] flex flex-col items-center group"
            >
              {isActive ? (
                <navItem.Icon className="w-[24px] h-auto [&_*]:fill-[url(#icon-gradient-bottom)] [&_*]:stroke-[url(#icon-gradient-bottom)] [&_*]:transition-all [&_*]:duration-300 drop-shadow-[0_0_8px_rgba(93,210,122,0.5)]" />
              ) : (
                <navItem.Icon className="w-[24px] h-auto text-[#959595] [&_*]:transition-all [&_*]:duration-300 group-hover:[&_*]:fill-[url(#icon-gradient-bottom-hover)] group-hover:[&_*]:stroke-[url(#icon-gradient-bottom-hover)] group-hover:drop-shadow-[0_0_6px_rgba(93,210,122,0.3)]" />
              )}
              <span 
                className={`text-[10px] transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#A5DC53] to-[#5DD27A] bg-clip-text text-transparent font-medium' 
                    : 'text-[#959595] group-hover:bg-gradient-to-r group-hover:from-[#A5DC53] group-hover:to-[#5DD27A] group-hover:bg-clip-text group-hover:text-transparent'
                }`}
              >
                {navItem.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
