import { Outlet } from "react-router-dom";
import Sidebar, { MobileBottomBar, MobileTopBar }  from "@/components/Sidebar";

function AppLayout() {
  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen bg-[#F6F6F6] overflow-hidden">
        <div className="flex flex-1 gap-[20px] overflow-hidden">
          <Sidebar className="my-[30px] ml-[30px] overflow-y-auto"/>
          <main className="flex-1 py-[30px] pr-[30px] overflow-y-auto">
            <Outlet /> {/* App pages */}
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen bg-[#F6F6F6]">
        <MobileTopBar />
        <main className="flex-1 overflow-y-auto px-[16px] pt-[16px] pb-[24px]">
          <Outlet /> {/* App pages */}
        </main>
        <MobileBottomBar />
      </div>
    </>
  );
}

export default AppLayout;