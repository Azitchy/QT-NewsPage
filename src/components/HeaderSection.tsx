import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, Globe, ArrowRight } from "lucide-react";

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
import { WalletModal } from "./WalletModal";
import { useTranslation } from "react-i18next";

type MenuType = "main" | "submenu" | "language";

interface Language {
  code: string;
  label: string;
  icon: string;
}

const LANGUAGES: Language[] = [
  { code: "en", label: "EN", icon: "/lang-en.svg" },
  { code: "zh", label: "CN", icon: "/lang-zh.svg" },
];

const WALLET_OPTIONS: Array<{ type: WalletType; name: string; icon: string }> =
  [
    {
      type: "metamask",
      name: "MetaMask",
      icon: "/webapp/MetaMask-icon-fox.svg",
    },
    {
      type: "walletconnect",
      name: "WalletConnect",
      icon: "https://avatars.githubusercontent.com/u/37784886",
    },
    {
      type: "coinbase",
      name: "Coinbase Wallet",
      icon: "https://www.coinbase.com/img/favicon/favicon-32x32.png",
    },
  ];

export const HeaderSection = (): JSX.Element => {
  const { t, i18n } = useTranslation("common");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<MenuType>("main");
  const [activeSubMenu, setActiveSubMenu] = useState<any>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, wallet, disconnectWallet, isConnecting } =
    useWeb3Auth();
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

  // Helper functions
  const formatAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setCurrentMenu("main");
  };

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    closeMobileMenu();
  };

  // Event handlers
  const handleWalletButtonClick = () => {
    if (isAuthenticated) {
      navigate("/webapp");
    } else {
      setShowWalletModal(true);
    }
  };

  const handleThemeToggle = () => setTheme(theme === "dark" ? "light" : "dark");

  // Effects
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
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  // Components
  const WalletButton = ({ className }: { className: string }) => {
    if (isAuthenticated && wallet) {
      return (
        <Button
          className={`${className} flex items-center gap-1.5 sm:gap-2`}
          onClick={handleWalletButtonClick}
        >
          <span className="truncate min-w-0">
            {formatAddress(wallet.address)}
          </span>
        </Button>
      );
    }

    return (
      <Button
        className={className}
        onClick={handleWalletButtonClick}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2 flex-shrink-0"></div>
            <span className="truncate">Connecting...</span>
          </>
        ) : (
          <span className="text-white truncate">Connect</span>
        )}
      </Button>
    );
  };

  const MobileMenuItem = ({ item, index }: { item: any; index: number }) => (
    <div key={index}>
      {item.subItems ? (
        <button
          onClick={() => {
            setActiveSubMenu(item);
            setCurrentMenu("submenu");
          }}
          className="w-full flex items-center justify-between h-[50px] rounded-lg text-left text-[14px] text-foreground dark:text-foreground hover:text-primary transition-colors"
        >
          {item.label}
          <ArrowRight className="text-primary" />
        </button>
      ) : (
        <Link
          to={item.path}
          className={`block h-[50px] rounded-lg text-[14px] font-normal transition-colors ${
            location.pathname === item.path
              ? "text-primary"
              : "text-foreground dark:text-foreground"
          } hover:text-primary flex items-center`}
          onClick={closeMobileMenu}
        >
          {item.label}
        </Link>
      )}
      <hr className="border-border my-2" />
    </div>
  );

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
                      className={`inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-full font-inter text-[14px] font-normal leading-[19px] cursor-pointer transition-colors hover:bg-card hover:text-primary dark:hover:bg-card dark:hover:text-primary ${
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
                      className={`inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-full font-inter text-[14px] font-normal leading-[19px] cursor-pointer transition-colors hover:bg-card hover:text-primary dark:hover:text-primary ${
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
          <WalletButton className="flex h-[32px] sm:h-[36px] lg:h-[38px] px-2 sm:px-3 lg:px-[15px] py-1.5 sm:py-2 lg:py-2.5 rounded-full bg-green-gradient hover:opacity-90 transition-opacity text-background font-normal text-[11px] sm:text-[13px] lg:text-[14px] min-w-0 max-w-[140px] sm:max-w-[160px] lg:max-w-none" />

          <div className="hidden lg:flex items-center px-2 gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-card-foreground dark:hover:bg-slate-700 cursor-pointer"
              onClick={handleThemeToggle}
            >
              {theme === "dark" ? (
                <Sun className="w-10 h-10 text-foreground" />
              ) : (
                <Moon className="w-10 h-10 -scale-x-100" />
              )}
            </Button>
          </div>

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
        <div className="lg:hidden bg-background dark:bg-background rounded-b-[20px] border-t dark:border-gray-700 shadow-lg">
          <div className="flex flex-col h-[535px]">
            <div className="flex-1 overflow-y-auto px-[40px] mt-2">
              {/* Main Menu */}
              {currentMenu === "main" && (
                <>
                  {navItems.map((item, index) => (
                    <MobileMenuItem key={index} item={item} index={index} />
                  ))}

                  {/* Language Menu Button */}
                  <button
                    onClick={() => {
                      setActiveSubMenu({
                        label: t("navbar.language"),
                        subItems: LANGUAGES,
                      });
                      setCurrentMenu("language");
                    }}
                    className="w-full flex items-center justify-between h-[50px] rounded-lg text-left text-[14px] text-foreground dark:text-foreground hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-card-foreground" />
                      {t("navbar.language")}
                    </div>
                    <ArrowRight className="text-primary" />
                  </button>
                </>
              )}

              {/* Submenu */}
              {currentMenu === "submenu" && activeSubMenu && (
                <>
                  <button
                    onClick={() => setCurrentMenu("main")}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors px-4 h-[50px]"
                  >
                    <span className="text-primary">← </span>{" "}
                    {t("navbar.mobileMenu.back")}
                  </button>

                  <div className="px-4 h-[50px] rounded-lg text-[14px] font-normal text-foreground dark:text-foreground flex items-center">
                    {activeSubMenu.label}
                  </div>
                  <hr className="border-border my-2" />

                  {activeSubMenu.subItems.map((sub: any, idx: number) => (
                    <div key={idx}>
                      {sub.subLabel.map((label: string, labelIdx: number) => (
                        <div key={labelIdx}>
                          <a
                            href={sub.href?.[labelIdx] || "#"}
                            target={
                              sub.href?.[labelIdx]?.startsWith("http")
                                ? "_blank"
                                : "_self"
                            }
                            rel="noopener noreferrer"
                            className="block px-8 h-[50px] rounded-lg text-[14px] text-foreground dark:text-foreground hover:text-primary flex items-center"
                            onClick={closeMobileMenu}
                          >
                            {label}
                          </a>
                          <hr className="border-border my-2" />
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}

              {/* Language submenu */}
              {currentMenu === "language" && (
                <>
                  <button
                    onClick={() => setCurrentMenu("main")}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors h-[50px]"
                  >
                    <span className="text-primary">← </span>{" "}
                    {t("navbar.mobileMenu.back")}
                  </button>

                  {LANGUAGES.map((lang, idx) => (
                    <div key={lang.code}>
                      <button
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`flex items-center gap-3 w-full h-[50px] rounded-lg text-[14px] transition-colors ${
                          i18n.language === lang.code
                            ? "text-primary font-medium"
                            : "text-foreground dark:text-foreground hover:text-primary"
                        }`}
                      >
                        <img
                          src={lang.icon}
                          alt={lang.label}
                          className="w-5 h-5"
                        />
                        {lang.label}
                      </button>
                      {idx !== LANGUAGES.length - 1 && (
                        <hr className="border-border my-2" />
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Theme Toggle */}
            <div className="px-[40px] py-4 flex justify-end">
              <button
                className="p-2 rounded-full hover:bg-card-foreground dark:hover:bg-slate-700 cursor-pointer flex-shrink-0"
                onClick={handleThemeToggle}
              >
                {theme === "dark" ? (
                  <Sun className="text-foreground" />
                ) : (
                  <Moon className="-scale-x-100" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Modal */}
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />
    </header>
  );
};
