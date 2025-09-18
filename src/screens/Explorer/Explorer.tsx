import { SearchIcon } from "lucide-react";
import React from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ContentSection } from "./sections/ContentSection/ContentSection";
import { DashboardSection } from "./sections/ContentSection/DashboardSection";
import { FooterSection } from "../../components/FooterSection";

export const Explorer = (): JSX.Element => {
  const navigationTabs = [
    { id: "overview", label: "Overview", active: true },
    { id: "galaxy", label: "Galaxy", active: false },
    { id: "ranking", label: "Overall ranking", active: false },
    { id: "consensus", label: "Consensus Connection", active: false },
    { id: "pr-node", label: "PR Node", active: false },
    { id: "stake", label: "Stake Transaction", active: false },
    { id: "user", label: "User Information", active: false },
    { id: "contract", label: "Contract Information", active: false },
  ];

  return (
    <div className="min-h-screen bg-white">

      <header className="relative w-full mt-0">
        <div className="relative w-full h-[400px]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(../img.png)" }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-2xl px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Discover the Power of LUCA
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                Building Stability Through Consensus
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex w-full items-center justify-between px-6 py-4 mt-8 bg-[#fbfbfb] rounded-2xl shadow-sm">
        <Tabs defaultValue="overview" className="flex-1">
          <TabsList className="bg-transparent h-auto p-0 gap-5">
            {navigationTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={`px-3 py-2 h-auto bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-lg hover:bg-gray-100 transition-colors ${
                  tab.active
                    ? "text-[#1c1c1c] font-medium"
                    : "text-[#858585] font-normal"
                } text-sm`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-start">
          <Button
            variant="outline"
            className="h-10 px-4 py-2 rounded-l-lg border border-[#eeeeee] bg-transparent hover:bg-gray-50 flex items-center gap-3"
          >
            <span className="text-sm text-[#858585]">
              Address
            </span>
            <img className="w-3.5 h-3.5" alt="Icon" src="/icon.svg" />
          </Button>

          <div className="relative w-64">
            <Input
              placeholder="Search..."
              className="h-10 pl-4 pr-12 py-2 rounded-r-lg border-t border-r border-b border-[#eeeeee] border-l-0 bg-transparent text-sm text-[#858585] placeholder:text-[#858585] focus:ring-2 focus:ring-[#2ea8af] focus:border-transparent"
            />
            <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-[18px] h-[18px] text-[#858585]" />
          </div>
        </div>
        </nav>

        <main className="w-full mt-8 space-y-8">
          <DashboardSection />
          <ContentSection />
        </main>
      </div>

      <FooterSection />
    </div>
  );
};
