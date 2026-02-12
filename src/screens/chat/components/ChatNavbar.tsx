import { useNavigate, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Connection", to: "/connections" },
  { label: "Community\nproposal", to: "/proposals" },
  { label: "Trading\ntools", to: "/trading" },
  { label: "Chat", to: "/chat" },
  { label: "Avatar", to: "/avatar" },
  { label: "Games", to: "/games" },
  { label: "Travel", to: "/travel" },
];

export default function ChatNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-full bg-white rounded-[20px] px-[20px] py-[20px] flex items-center justify-between">
      {/* Logo */}
      <button
        type="button"
        className="cursor-pointer shrink-0"
        onClick={() =>
          window.open("https://atm.network", "_blank", "noopener,noreferrer")
        }
      >
        <img src="/atm.svg" alt="ATM Logo" className="w-[50px] h-[50px]" />
      </button>

      {/* Nav Links */}
      <nav className="flex items-center gap-[60px]">
        {navLinks.map((link) => {
          const isActive =
            location.pathname === link.to ||
            location.pathname.startsWith(`${link.to}/`);
          return (
            <button
              key={link.to}
              onClick={() => navigate(link.to)}
              className={`text-center text-[16px] font-inter leading-[21px] whitespace-pre-line cursor-pointer ${
                isActive
                  ? "text-primary font-bold"
                  : "text-[#1C1C1C] font-normal"
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Right side: notification, BCS, Text button */}
      <div className="flex items-center gap-[20px]">
        {/* Notification */}
        <div className="relative">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary"
          >
            <path
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="absolute -top-[3px] -right-[2px] w-[10px] h-[10px] bg-[#FE5572] rounded-full" />
        </div>

        {/* BCS Badge */}
        <div className="flex items-center gap-[5px] px-[20px] py-[16px] bg-[#E9F6F7] rounded-[30px]">
          <img
            src="/src/assets/tokens/bsc1.svg"
            alt="BSC"
            className="w-[16px] h-[16px]"
          />
          <span className="text-primary text-[16px] font-medium font-inter">
            BCS
          </span>
        </div>

        {/* Text Button */}
        <button className="px-[20px] py-[16px] bg-primary rounded-[30px] text-white text-[16px] font-normal font-inter leading-[21px] cursor-pointer">
          Text
        </button>
      </div>
    </div>
  );
}
