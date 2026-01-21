import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

function AppLayout() {
  return (
    <div className="flex h-screen bg-[#F6F6F6] overflow-hidden">
      <div className="flex flex-1 gap-[20px] overflow-hidden">
        <Sidebar className="my-[30px] ml-[30px] overflow-y-auto"/>
        <main className="flex-1 py-[30px] pr-[30px] overflow-y-auto">
          <Outlet /> {/* App pages */}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;