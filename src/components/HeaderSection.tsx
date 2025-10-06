import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Wallet, LogOut, User, Shield, Sun, Moon, Globe, ChevronDown } from "lucide-react";

import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";

import { useWeb3Auth, WalletType } from "../contexts/Web3AuthContext";
import { useTheme } from "@/components/theme-provider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export const HeaderSection = (): JSX.Element => {
  const { t, i18n } = useTranslation("common");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<"main" | "submenu" | "language">("main");
  const [activeSubMenu, setActiveSubMenu] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
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

  const navItems = [
    {
      label: t("navbar.navigation.technology.label"),
      path: "/technology",
      description: t("navbar.navigation.technology.description"),
      subItems: [
        {
          image: "/roadmap.png",
          subLabel: [t("navbar.navigation.technology.subItems.roadmap")],
          subLabelImage: ["/route.svg"],
          href: ["/roadmap"],
        },
      ],
    },
    {
      label: t("navbar.navigation.ecosystem.label"),
      path: "/ecosystem",
      description: t("navbar.navigation.ecosystem.description"),
      subItems: [
        {
          image: "/agf.png",
          subLabel: [
            t("navbar.navigation.ecosystem.subItems.agf"),
            t("navbar.navigation.ecosystem.subItems.games"),
          ],
          subLabelImage: ["/game-launcher.svg", "/game-launcher.svg"],
          href: ["/ecosystem#agf", "/games"],
        },
        {
          image: "/travel.png",
          subLabel: [t("navbar.navigation.ecosystem.subItems.travel")],
          subLabelImage: ["/travel-holidays.svg"],
          href: ["/ecosystem/travel"],
        },
        {
          image: "/ecology.png",
          subLabel: [t("navbar.navigation.ecosystem.subItems.ecology")],
          subLabelImage: ["/plant.svg"],
          href: ["/ecosystem#ecology"],
        },
      ],
    },
    { label: t("navbar.navigation.community"), path: "/community" },
    { label: t("navbar.navigation.explorer"), path: "/explorer" },
    { label: t("navbar.navigation.news"), path: "/news" },
    { label: t("navbar.navigation.help"), path: "/help" },
  ];

  const walletOptions: Array<{type: WalletType; name: string; icon: string}> = [
    { type: 'metamask', name: 'MetaMask', icon: '/webapp/MetaMask-icon-fox.svg' },
    { type: 'walletconnect', name: 'WalletConnect', icon: 'https://avatars.githubusercontent.com/u/37784886' },
    { type: 'coinbase', name: 'Coinbase Wallet', icon: 'https://www.coinbase.com/img/favicon/favicon-32x32.png' },
  ];

  const formatAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const getWalletDisplayName = () => {
    if (!wallet) return '';
    const walletInfo = walletOptions.find(w => w.type === wallet.type);
    return walletInfo?.name || 'Unknown Wallet';
  };

  const getWalletIcon = () => {
    if (!wallet) return '/webapp/MetaMask-icon-fox.svg';
    const walletInfo = walletOptions.find(w => w.type === wallet.type);
    return walletInfo?.icon || '/webapp/MetaMask-icon-fox.svg';
  };

  const handleWebAppClick = () => {
    if (isAuthenticated) {
      navigate("/webapp");
    } else {
      setShowWalletSelector(true);
    }
  };

  const handleWalletConnect = async (walletType: WalletType) => {
    setShowWalletSelector(false);
    try {
      await connectWallet(walletType);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setShowUserMenu(false);
    if (location.pathname === "/webapp") navigate("/");
  };

  const handleThemeToggle = () => setTheme(theme === "dark" ? "light" : "dark");

  useEffect(() => {
    if (isAuthenticated && !location.pathname.includes("/webapp")) {
      const wasConnecting = sessionStorage.getItem("wasConnecting");
      if (wasConnecting === "true") {
        navigate("/webapp");
        sessionStorage.removeItem("wasConnecting");
      }
    }
  }, [isAuthenticated, navigate, location.pathname]);

  useEffect(() => {
    if (isConnecting) sessionStorage.setItem("wasConnecting", "true");
  }, [isConnecting]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu && !(event.target as Element).closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
      if (showWalletSelector && !(event.target as Element).closest(".wallet-selector-container")) {
        setShowWalletSelector(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu, showWalletSelector]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  const WalletButton = ({ className, isMobile = false }: { className: string; isMobile?: boolean }) => {
    if (isAuthenticated && wallet) {
      return (
        <div className="relative user-menu-container">
          <Button className={`${className} flex items-center gap-1.5 sm:gap-2`} onClick={() => setShowUserMenu(!showUserMenu)}>
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img src={getWalletIcon()} alt={getWalletDisplayName()} className="w-full h-full object-contain" />
            </div>
            <span className="truncate min-w-0">{formatAddress(wallet.address)}</span>
          </Button>

          {showUserMenu && (
            <div
              className={`absolute ${
                isMobile ? "right-0" : "right-0"
              } mt-2 w-64 bg-background dark:bg-card rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-4`}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img src={getWalletIcon()} alt={getWalletDisplayName()} className="w-8 h-8 object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100 text-xs">
                      {getWalletDisplayName()}
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
                        Session expires: {new Date(session.expiresAt).toLocaleTimeString()}
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
      <div className="relative wallet-selector-container">
        <Button className={className} onClick={handleWebAppClick} disabled={isConnecting}>
          {isConnecting ? (
            <>
              <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2 flex-shrink-0"></div>
              <span className="truncate">Connecting...</span>
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Connect</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </>
          )}
        </Button>

        {showWalletSelector && !isConnecting && (
          <div className="absolute right-0 mt-2 w-56 bg-background dark:bg-card rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 font-medium">
              Choose Wallet
            </div>
            {walletOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleWalletConnect(option.type)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <img 
                    src={option.icon} 
                    alt={option.name} 
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/webapp/default-wallet-icon.svg';
                    }}
                  />
                </div>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {option.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 w-full h-[70px] sm:h-[90px] bg-background dark:bg-background shadow-[0px_4px_30px_#0000000f] z-50">
      <div className="h-full w-full mx-auto px-3 sm:px-4 lg:px-[70px] lg:py-[19px] flex items-center justify-between">
        <div className="flex items-center flex-shrink-0">
          <Link to="/">
            <img
              src="/atm-logo.png"
              alt={t("navbar.logo.alt")}
              className="h-8 w-24 sm:h-[52px] sm:w-[160px] object-contain"
            />
          </Link>
        </div>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="flex items-center justify-center lg:gap-0 xl:gap-[25px] 2xl:gap-[100px] xl:mr-20 2xl:mr-0">
            {navItems.map((item, index) => (
              <NavigationMenuItem key={index} className="group relative">
                {item.description ? (
                  <>
                    <NavigationMenuTrigger
                      className={`inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-full font-body-body-4-400 text-[14px] font-normal leading-[19px] cursor-pointer transition-colors hover:bg-card hover:text-primary dark:hover:bg-card dark:hover:text-primary ${
                        location.pathname === item.path
                          ? "bg-background text-primary dark:bg-foreground dark:text-card"
                          : "text-foreground dark:text-foreground"
                      }`}
                      asChild
                    >
                      <Link to={item.path}>{item.label}</Link>
                    </NavigationMenuTrigger>

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
                              <div key={subIndex} className="flex flex-col items-start justify-start">
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
                                    <div key={labelIndex} className="flex gap-[12px] items-start">
                                      {sub.subLabelImage?.[labelIndex] && (
                                        <img src={sub.subLabelImage[labelIndex]} alt="label icon" className="w-5 h-5" />
                                      )}
                                      <a
                                        href={sub.href?.[labelIndex] || "#"}
                                        target={sub.href?.[labelIndex]?.startsWith("http") ? "_blank" : "_self"}
                                        rel="noopener noreferrer"
                                        className="text-sm text-foreground dark:text-primary-foreground hover:text-primary cursor-pointer"
                                      >
                                        {label}
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
                      className={`inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-full font-body-body-4-400 text-[14px] font-normal leading-[19px] cursor-pointer transition-colors hover:bg-card hover:text-primary dark:hover:text-primary ${
                        location.pathname === item.path
                          ? "bg-background text-primary dark:bg-foreground dark:text-card"
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

        <div className="flex items-center gap-1 sm:gap-2 lg:gap-[10px] flex-shrink-0 min-w-0">
          <WalletButton
            className="flex h-[32px] sm:h-[36px] lg:h-[38px] px-2 sm:px-3 lg:px-[15px] py-1.5 sm:py-2 lg:py-2.5 rounded-full bg-[linear-gradient(136deg,#AADA5D_0%,#0DAEB9_98.28%)] hover:opacity-90 transition-opacity text-background font-normal text-[11px] sm:text-[13px] lg:text-[14px] min-w-0 max-w-[140px] sm:max-w-[160px] lg:max-w-none"
            isMobile={false}
          />

          <div className="hidden lg:flex items-center px-2 gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-card-foreground dark:hover:bg-slate-700 cursor-pointer"
              onClick={handleThemeToggle}
            >
              {theme === "dark" ? <Sun className="w-10 h-10 text-foreground" /> : <Moon className="w-10 h-10 -scale-x-100" />}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2 rounded-full dark:text-primary-foreground flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background dark:bg-background rounded-b-[20px] border-t dark:border-gray-700 shadow-lg">
          {/* Mobile menu content - keeping existing structure */}
        </div>
      )}
    </header>
  );
};