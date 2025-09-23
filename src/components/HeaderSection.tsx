import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Wallet, LogOut, User, Shield, Sun, Moon } from "lucide-react";

import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";

import { useWeb3Auth } from "../contexts/Web3AuthContext";
import { useTheme } from "@/components/theme-provider";

export const HeaderSection = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<"main" | "submenu">("main");
  const [activeSubMenu, setActiveSubMenu] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isAuthenticated,
    wallet,
    connectWallet,
    disconnectWallet,
    isConnecting,
    session,
  } = useWeb3Auth();
  const { setTheme, theme } = useTheme();

  // Navigation menu items data
  const navItems = [
    {
      label: "Technology",
      path: "/technology",
      description: "Pioneering technology that shapes the future",
      subItems: [
        {
          image: "/roadmap.png",
          subLabel: ["Roadmap"],
          subLabelImage: ["/route.svg"],
          href: ["/roadmap"],
        },
      ],
    },
    {
      label: "Ecosystem",
      path: "/ecosystem",
      description: "Partnering to deliver unforgettable experiences",
      subItems: [
        {
          image: "/agf.png",
          subLabel: ["AFG", "Games"],
          subLabelImage: ["/game-launcher.svg", "/game-launcher.svg"],
          href: ["#", "/games"],
        },
        {
          image: "/travel.png",
          subLabel: ["Travel"],
          subLabelImage: ["travel-holidays.svg"],
          href: ["/ecosystem/travel"],
        },
        {
          image: "/ecology.png",
          subLabel: ["Ecology"],
          subLabelImage: ["/plant.svg"],
          href: ["#"],
        },
      ],
    },
    { label: "Community", path: "/community" },
    { label: "Explorer", path: "/explorer" },
    { label: "News", path: "/news" },
    { label: "Help", path: "/help" },
  ];

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleWebAppClick = async () => {
    if (isAuthenticated) {
      navigate("/webapp");
    } else {
      try {
        await connectWallet();
        // Navigation will happen automatically via useEffect below
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setShowUserMenu(false);
    // Redirect away from protected routes
    if (location.pathname === "/webapp") {
      navigate("/");
    }
  };

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Auto-navigate to webapp after successful authentication
  useEffect(() => {
    if (isAuthenticated && !location.pathname.includes("/webapp")) {
      // Only navigate if user just authenticated and isn't already on webapp
      const wasConnecting = sessionStorage.getItem("wasConnecting");
      if (wasConnecting === "true") {
        navigate("/webapp");
        sessionStorage.removeItem("wasConnecting");
      }
    }
  }, [isAuthenticated, navigate, location.pathname]);

  // Track connecting state
  useEffect(() => {
    if (isConnecting) {
      sessionStorage.setItem("wasConnecting", "true");
    }
  }, [isConnecting]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showUserMenu &&
        !(event.target as Element).closest(".user-menu-container")
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  const WalletButton = ({
    className,
    isMobile = false,
  }: {
    className: string;
    isMobile?: boolean;
  }) => {
    if (isAuthenticated && wallet) {
      return (
        <div className="relative user-menu-container">
          <Button
            className={`${className} flex items-center gap-1.5 sm:gap-2`}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-background" />
            </div>
            <span className="truncate min-w-0">
              {formatAddress(wallet.address)}
            </span>
          </Button>

          {/* User dropdown menu */}
          {showUserMenu && (
            <div
              className={`absolute ${
                isMobile ? "right-0" : "right-0"
              } mt-2 w-64 bg-background dark:bg-card rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-4`}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-background" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      Connected Wallet
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {formatAddress(wallet.address)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                    <Shield className="w-4 h-4 flex-shrink-0" />
                    <span>Authenticated via SIWE</span>
                  </div>

                  {session && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                      <div>
                        Session expires:{" "}
                        {new Date(session.expiresAt).toLocaleTimeString()}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(wallet.address);
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Copy Address</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/webapp");
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Go to WebApp</span>
                  </button>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                  <button
                    onClick={handleDisconnect}
                    className="w-full flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Disconnect Wallet</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <Button
        className={className}
        onClick={handleWebAppClick}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2 flex-shrink-0"></div>
            <span className="truncate">Connecting...</span>
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Connect Wallet</span>
          </>
        )}
      </Button>
    );
  };

  return (
    <header className="sticky top-0 w-full h-[70px] sm:h-[90px] bg-background dark:bg-background shadow-[0px_4px_30px_#0000000f] z-50">
      <div className="h-full w-full mx-auto px-3 sm:px-4 lg:px-[70px] lg:py-[19px] flex items-center justify-between">
        {/* Logo area */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/">
            <img
              src="/atm-logo.png"
              alt="ATM Logo"
              className="h-8 w-24 sm:h-[52px] sm:w-[160px] object-contain"
            />
          </Link>
        </div>

        {/* Desktop Navigation menu - centered */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="flex items-center justify-center lg:gap-0 xl:gap-[25px] 2xl:gap-[100px] xl:mr-20 2xl:mr-0">
            {navItems.map((item, index) => (
              <NavigationMenuItem key={index} className="group relative">
                {item.description ? (
                  <>
                    <NavigationMenuTrigger
                      className={`inline-flex items-center hover:shadow-sm justify-center gap-2.5 px-4 py-2.5 rounded-full font-body-body-4-400 text-[14px] font-normal leading-[19px] cursor-pointer transition-colors dark:hover:bg-card hover:bg-card hover:text-primary dark:hover:text-primary  ${
                        location.pathname === item.path
                          ? "bg-background text-primary dark:text-card dark:bg-foreground"
                          : "text-foreground dark:text-foreground"
                      }`}
                      asChild
                    >
                      <Link to={item.path}>{item.label}</Link>
                    </NavigationMenuTrigger>

                    {/* dropdown card */}
                    <NavigationMenuContent asChild>
                      <div className="absolute left-0 top-full mt-2 h-[221px] rounded-2xl shadow-lg bg-background dark:bg-card px-[60px] py-[40px] flex gap-[150px] z-20">
                        <div className="flex w-[225px] flex-col gap-[10px] flex-1">
                          <p className="text-[18px] leading-6 font-normal text-[#4F5555] dark:text-gray-200 font-inter">
                            {item.description}
                          </p>
                          <Link
                            to={item.path}
                            className="max-w-[115px] inline-flex items-center gap-[8px] px-[15px] py-[8px] rounded-full bg-[#f5f5f5] dark:bg-foreground hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors text-[14px] font-normal text-foreground dark:text-background"
                          >
                            {item.label}
                            <img src="/arrow.svg" alt="arrow" />
                          </Link>
                        </div>

                        {item.subItems && (
                          <div className="flex gap-[30px] items-start justify-center">
                            {item.subItems.map((sub, subIndex) => (
                              <div
                                key={subIndex}
                                className="flex flex-col items-start justify-start"
                              >
                                {sub.image && (
                                  <div className="w-[100px] h-[110px] mb-[8px]">
                                    <img
                                      src={sub.image}
                                      alt={sub.subLabel?.join(", ")}
                                      className="w-full h-full rounded-[10px] object-cover"
                                    />
                                  </div>
                                )}

                                <div className="flex flex-col gap-[6px] items-start">
                                  {sub.subLabel.map((label, labelIndex) => (
                                    <div
                                      key={labelIndex}
                                      className="flex gap-[12px] items-start"
                                    >
                                      {sub.subLabelImage?.[labelIndex] && (
                                        <img
                                          src={sub.subLabelImage[labelIndex]}
                                          alt="label icon"
                                          className="w-5 h-5"
                                        />
                                      )}
                                      <a
                                        href={sub.href?.[labelIndex] || "#"}
                                        target={
                                          sub.href?.[labelIndex]?.startsWith(
                                            "http"
                                          )
                                            ? "_blank"
                                            : "_self"
                                        }
                                        rel="noopener noreferrer"
                                      >
                                        <span className="text-sm text-foreground dark:text-primary-foreground hover:text-primary cursor-pointer">
                                          {label}
                                        </span>
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.path}
                      className={`inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-full font-body-body-4-400 text-[14px] font-normal leading-[19px] hover:bg-card hover:text-primary dark:hover:text-primary cursor-pointer transition-colors ${
                        location.pathname === item.path
                          ? "bg-background text-primary dark:text-card dark:bg-foreground"
                          : "text-foreground dark:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side actions */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-[10px] flex-shrink-0 min-w-0">
          {/* Single responsive Wallet button */}
          <WalletButton
            className="flex h-[32px] sm:h-[36px] lg:h-[38px] px-2 sm:px-3 lg:px-[15px] py-1.5 sm:py-2 lg:py-2.5 rounded-full bg-[linear-gradient(136deg,#AADA5D_0%,#0DAEB9_98.28%)] hover:opacity-90 transition-opacity text-background font-normal text-[11px] sm:text-[13px] lg:text-[14px] min-w-0 max-w-[120px] sm:max-w-[140px] lg:max-w-none"
            isMobile={false}
          />

          {/* Language and theme buttons */}
          <div className="hidden lg:flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="w-5 h-5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <img
                className="w-5 h-5 object-cover rounded-sm"
                alt="Language"
                src="/language.png"
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 m-2 rounded-full hover:bg-card-foreground dark:hover:bg-slate-700 cursor-pointer"
              onClick={handleThemeToggle}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 -scale-x-100" />
              )}
            </Button>
          </div>

          {/* Mobile theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 p-1.5 sm:p-2 rounded-full hover:bg-card-foreground dark:hover:bg-slate-700 cursor-pointer flex-shrink-0"
            onClick={handleThemeToggle}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 -scale-x-100" />
            )}
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2 rounded-full dark:text-primary-foreground flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>
        </div>
      </div>
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background dark:bg-background rounded-b-[20px] border-t dark:border-gray-700 shadow-lg">
          <div className="px-4 py-4 max-h-[calc(100vh-70px)] sm:max-h-[calc(100vh-90px)] overflow-y-auto transition-all duration-300 ease-in-out">
            {/* MAIN MENU SCREEN */}
            {currentMenu === "main" && (
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <div key={index}>
                    {item.subItems ? (
                      // Items with submenu
                      <button
                        onClick={() => {
                          setActiveSubMenu(item);
                          setCurrentMenu("submenu");
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left text-[14px] text-foreground dark:text-foreground"
                      >
                        {item.label}
                        <span className="text-primary">→</span>
                      </button>
                    ) : (
                      // Items without submenu
                      <Link
                        to={item.path}
                        className={`block px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-normal text-[14px] ${
                          location.pathname === item.path
                            ? "bg-primary-foreground text-primary dark:bg-slate-700 dark:text-primary"
                            : "text-foreground dark:text-foreground"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Wallet & Language Section */}
                <div className="pt-4 border-t dark:border-gray-700 space-y-3">
                  {isAuthenticated && (
                    <button
                      onClick={() => {
                        handleDisconnect();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Disconnect Wallet
                    </button>
                  )}

                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <img
                        className="w-5 h-5 object-cover rounded-sm"
                        alt="Language"
                        src="/language.png"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* SUBMENU SCREEN */}
            {currentMenu === "submenu" && activeSubMenu && (
              <div className="space-y-3 min-h-[520px] ">
                {/* Back button */}
                <button
                  onClick={() => setCurrentMenu("main")}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  <span className="text-primary">← </span> Back
                </button>

                <hr />

                {/* Section title */}
                <h3 className="text-[14px] text-foreground dark:text-foreground">
                  {activeSubMenu.label}
                </h3>

                {/* Submenu items */}
                {activeSubMenu.subItems.map((sub: any, idx: number) => (
                  <div key={idx} className="mt-2">
                    {sub.subLabel.map((label: string, labelIdx: number) => (
                      <a
                        key={labelIdx}
                        href={sub.href?.[labelIdx] || "#"}
                        target={
                          sub.href?.[labelIdx]?.startsWith("http")
                            ? "_blank"
                            : "_self"
                        }
                        rel="noopener noreferrer"
                        className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-[14px] text-foreground dark:text-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
