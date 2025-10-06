import * as React from "react";
import { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { FooterSection } from "../../components/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SearchResults from "./sections/ContentSection/SearchResults";

export const Explorer = () => {
  const { t } = useTranslation("explorer");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("Address");
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const navigationTabs = [
    { id: "overview", label: t("navigation.overview"), path: "/explorer" },
    { id: "galaxy", label: t("navigation.galaxy"), path: "/explorer/galaxy" },
    { id: "ranking", label: t("navigation.ranking"), path: "/explorer/ranking" },
    {
      id: "consensus",
      label: t("navigation.consensus"),
      path: "/explorer/consensus",
    },
    { id: "pr-node", label: t("navigation.prNode"), path: "/explorer/pr-node" },
    { id: "stake", label: t("navigation.stake"), path: "/explorer/stake" },
    { id: "user", label: t("navigation.user"), path: "/explorer/user" },
    {
      id: "contract",
      label: t("navigation.contract"),
      path: "/explorer/contract",
    },
  ];

  // Validate input length based on search type
  const isValidInput = () => {
    if (!searchQuery.trim()) return false;
    
    const trimmedQuery = searchQuery.trim();
    if (searchType === "Address" || searchType === "Contract") {
      return trimmedQuery.length === 42;
    } else if (searchType === "Hash") {
      return trimmedQuery.length === 66;
    }
    return false;
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      setShowSearchResults(true);
    }
  };


  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      setShowSearchResults(false);
    }
  };

  // Handle search type change
  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value);
    // Don't hide search results when changing search type
    // Only hide if there's no search query
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
    }
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      handleSearch();
    }
  };

  // Hide search results when location changes (browser navigation)
  useEffect(() => {
    setShowSearchResults(false);
  }, [location.pathname]);

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
                        onClick={() => {
                          setShowSearchResults(false);
                          navigate(tab.path);
                        }}
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
            <div className="flex flex-row sm:flex-row w-full lg:w-auto order-1 lg:order-2 flex-shrink-0 gap-2">
              <div className="relative inline-block">
                <select
                  className="h-10 px-2 py-2 pr-10 rounded-lg border border-border dark:border-[#454545] bg-transparent hover:bg-gray-50 flex items-center gap-3 appearance-none text-sm text-[#858585] focus:outline-none focus:ring-0"
                  value={searchType}
                  onChange={handleSearchTypeChange}
                >
                  <option value="Address"> {t("search.addressType")} </option>
                  <option value="Contract"> {t("search.contractType")} </option>
                  <option value="Hash"> {t("search.hashType")} </option>
                </select>
                <img
                  className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  alt="Dropdown Icon"
                  src="/icon.svg"
                />
              </div>

              <div className="relative w-full sm:w-[200px]">
                <Input
                  placeholder={t("search.placeholder")} 
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleKeyPress}
                  className="h-10 pl-4 pr-12 py-2 rounded-lg border border-border dark:border-[#454545] bg-transparent text-sm text-[#858585] placeholder:text-[#858585] focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={!searchQuery.trim()}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 border-none p-0 ${
                    searchQuery.trim() 
                      ? 'cursor-pointer hover:opacity-70' 
                      : 'cursor-not-allowed opacity-50'
                  }`}
                >
                  <img
                    src="/search-icon.svg"
                    alt="Search"
                    className="w-4 h-4"
                  />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>


      {/* Main content */}
      {showSearchResults ? (
        <SearchResults 
          searchQuery={searchQuery}
          searchType={searchType}
          isValidInput={isValidInput()}
        />
      ) : (
        <main
          className={
            location.pathname === "/explorer/galaxy"
              ? "w-full mt-1 md:mt-8 space-y-8"
              : "max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-1 md:mt-8 space-y-8"
          }
        >
          <Outlet />
        </main>
      )}

      <FooterSection />
    </div>
  );
};