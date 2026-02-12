import { Outlet } from "react-router-dom";
import ChatNavbar from "@/screens/chat/components/ChatNavbar";

/**
 * ChatLayout — a dedicated layout for the /chat section.
 *
 * Differences from AppLayout:
 *  • Uses a horizontal top navbar instead of the vertical icon sidebar.
 *  • The content area is fully flex-based so the chat can fill the
 *    remaining viewport height without an outer scrollbar.
 *  • Padding mirrors the Figma spec: 20px gap between navbar and body,
 *    40px horizontal inset, 30px top.
 */
function ChatLayout() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex flex-col h-screen bg-[#F6F6F6] overflow-hidden">
        {/* Top Navbar */}
        <div className="pt-[30px] px-[40px]">
          <ChatNavbar />
        </div>

        {/* Body — sidebar + main chat area */}
        <main className="flex-1 flex gap-[20px] px-[40px] pt-[20px] pb-[30px] overflow-hidden min-h-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile — simplified */}
      <div className="md:hidden flex flex-col h-screen bg-[#F6F6F6]">
        <div className="px-[16px] pt-[12px]">
          <ChatNavbar />
        </div>
        <main className="flex-1 overflow-hidden flex px-[16px] pt-[12px] pb-[16px] gap-[12px]">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default ChatLayout;
