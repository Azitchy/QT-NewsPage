import DashboardIcon from "@/assets/icons/dashboard-btn-icon.svg?react";
import ConnectionIcon from "@/assets/icons/connections-btn-icon.svg?react";
import ProposalIcon from "@/assets/icons/proposals-btn-icon.svg?react";
import TradingIcon from "@/assets/icons/trading-btn-icon.svg?react";
import ChatIcon from "@/assets/icons/chat-btn-icon.svg?react";
import AvatarIcon from "@/assets/icons/avatar-btn-icon.svg?react";
import GamesIcon from "@/assets/icons/games-btn-icon.svg?react";
import TravelIcon from "@/assets/icons/travel-btn-icon.svg?react";
import SettingsIcon from "@/assets/icons/setting-btn-icon.svg?react";
import CreateConnectionIcon from "@/assets/icons/create-connection-btn-icon.svg?react";
import BellIcon from "@/assets/icons/notification-btn-icon.svg";
import LeaveIcon from "@/assets/icons/leave-btn-icon.svg?react";

export default function Sidebar({ className = "" }) {
  return (
    <div
      className={`w-[282px] flex gap-[1px] ${className}`}
    >
      {/* Sidebar Icons */}
      <div className="w-[70px] py-[20px] px-[10px] rounded-l-[15px] bg-white mx-auto">
        <DashboardIcon className="w-full h-auto text-red-500"/>
    
      </div>

      {/* Sidebar Menu */}
      <div className="px-[15px] pt-[30px] pb-[20px] bg-white w-full rounded-r-[15px]">
        <span className="text-[20px]">Dashboard</span>
      </div>
    </div>
  )
}
