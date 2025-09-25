import React from "react";
import { Input } from "../../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { FooterSection } from "../../components/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

export const Explorer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationTabs = [
    { id: "overview", label: "Overview", path: "/explorer" },
    { id: "galaxy", label: "Galaxy", path: "/explorer/galaxy" },
    { id: "ranking", label: "Overall ranking", path: "/explorer/ranking" },
    {
      id: "consensus",
      label: "Consensus Connection",
      path: "/explorer/consensus",
    },
    { id: "pr-node", label: "PR Node", path: "/explorer/pr-node" },
    { id: "stake", label: "Stake Transaction", path: "/explorer/stake" },
    { id: "user", label: "User Information", path: "/explorer/user" },
    {
      id: "contract",
      label: "Contract Information",
      path: "/explorer/contract",
    },
  ];

  return (
    <div>
      <HeroSection />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="dark:bg-card rounded-2xl shadow-none md:shadow-sm px-[20px] py-[15px] mt-8 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Tabs Section */}
            <div className="order-2 lg:order-1 flex-1 min-w-0">
              <Tabs value={location.pathname} className="w-full">
                <div
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                  className="overflow-x-auto -mx-2 px-2 "
                >
                  <TabsList className="flex gap-0 bg-transparent h-auto p-0 whitespace-nowrap flex-nowrap w-max">
                    {navigationTabs.map((tab) => (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.path}
                        onClick={() => navigate(tab.path)}
                        className={`px-3 py-2 h-auto bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-lg  transition-colors whitespace-nowrap ${
                          location.pathname === tab.path
                            ? "!text-background dark:!text-primary-foreground md:!text-foreground font-normal !bg-primary md:!bg-transparent rounded-[20px]"
                            : "text-card-foreground font-normal"
                        } text-sm`}
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </Tabs>
            </div>

            {/* Address + Search Section */}
            <div className="flex flex-row sm:flex-row w-full lg:w-auto order-1 lg:order-2 flex-shrink-0">
              <div className="relative inline-block">
                <select
                  className="h-10 px-2 py-2 pr-10 rounded-lg border border-border dark:border-[#454545] bg-transparent hover:bg-gray-50 flex items-center gap-3 appearance-none text-sm text-[#858585] focus:outline-none focus:ring-0"
                  defaultValue="Address"
                >
                  <option value="Address">Address</option>
                  <option value="Test">Contract</option>
                  <option value="Test1">Hash</option>
                </select>
                <img
                  className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  alt="Dropdown Icon"
                  src="/icon.svg"
                />
              </div>

              <div className="relative w-full sm:w-[200px]">
                <Input
                  placeholder="Search..."
                  className="h-10 pl-4 pr-12 py-2 rounded-lg border border-border dark:border-[#454545] bg-transparent text-sm text-[#858585] placeholder:text-[#858585] focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <img
                  src="/search-icon.svg"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                />
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <main
        className={
          location.pathname === "/explorer/galaxy"
            ? "w-full mt-1 md:mt-8 space-y-8"
            : "max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-1 md:mt-8 space-y-8"
        }
      >
        <Outlet />
      </main>

      <FooterSection />
    </div>
  );
};