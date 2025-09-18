import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Wallet, LogOut, User, Shield } from "lucide-react";

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

export const HeaderSection = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    wallet, 
    connectWallet, 
    disconnectWallet, 
    isConnecting,
    session 
  } = useWeb3Auth();

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
        },
        {
          image: "/travel.png",
          subLabel: ["Travel"],
          subLabelImage: ["travel-holidays.svg"],
        },
        {
          image: "/ecology.png",
          subLabel: ["Ecology"],
          subLabelImage: ["/plant.svg"],
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
      navigate('/webapp');
    } else {
      try {
        await connectWallet();
        // Navigation will happen automatically via useEffect below
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setShowUserMenu(false);
    // Redirect away from protected routes
    if (location.pathname === '/webapp') {
      navigate('/');
    }
  };

  // Auto-navigate to webapp after successful authentication
  useEffect(() => {
    if (isAuthenticated && !location.pathname.includes('/webapp')) {
      // Only navigate if user just authenticated and isn't already on webapp
      const wasConnecting = sessionStorage.getItem('wasConnecting');
      if (wasConnecting === 'true') {
        navigate('/webapp');
        sessionStorage.removeItem('wasConnecting');
      }
    }
  }, [isAuthenticated, navigate, location.pathname]);

  // Track connecting state
  useEffect(() => {
    if (isConnecting) {
      sessionStorage.setItem('wasConnecting', 'true');
    }
  }, [isConnecting]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu && !(event.target as Element).closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const WalletButton = ({ className, isMobile = false }: { className: string, isMobile?: boolean }) => {
    // Only show the dropdown for the WalletButton that is currently visible (desktop or mobile)
    const isVisible =
      (isMobile && window.innerWidth < 1024) ||
      (!isMobile && window.innerWidth >= 1024);

    if (isAuthenticated && wallet) {
      return (
        <div className="relative user-menu-container">
          <Button
            className={`${className} flex items-center gap-2`}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            {isMobile ? formatAddress(wallet.address) : 'Connected'}
          </Button>
          
          {/* User dropdown menu */}
          {showUserMenu && isVisible && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Connected Wallet</div>
                    <div className="text-sm text-gray-500">{formatAddress(wallet.address)}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    <Shield className="w-4 h-4" />
                    <span>Authenticated via SIWE</span>
                  </div>
                  
                  {session && (
                    <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                      <div>Session expires: {new Date(session.expiresAt).toLocaleTimeString()}</div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(wallet.address);
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Copy Address</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/webapp');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 text-sm text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Go to WebApp</span>
                  </button>
                </div>
                
                <div className="border-t border-gray-100 pt-3">
                  <button
                    onClick={handleDisconnect}
                    className="w-full flex items-center gap-2 text-sm text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
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
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            {isMobile ? 'Connecting...' : 'Connecting...'}
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4 mr-2" />
            {isMobile ? 'Connect Wallet' : 'Connect Wallet'}
          </>
        )}
      </Button>
    );
  };

  return (
    <header className="sticky top-0 w-full h-[90px] bg-white dark:bg-[#090920] shadow-[0px_4px_30px_#0000000f] z-50">
      <div className="h-full w-full mx-auto px-4 sm:px-6 lg:px-[70px] lg:py-[19px] flex items-center justify-between">
        {/* Logo area */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/">
            <img
              src="/atm-logo.png"
              alt="ATM Logo"
              className="h-[52px] w-[160px] object-contain"
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
                      className={`inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-full font-body-body-4-400 text-[14px] font-normal leading-[19px] cursor-pointer transition-colors hover:bg-slate-100 hover:text-[#2EA8AF] ${
                        location.pathname === item.path
                          ? "bg-[#FBFBFB] text-[#2ea8af] dark:text-black"
                          : "text-[#1c1c1c] dark:text-[#dcdcdc]"
                      }`}
                      asChild
                    >
                      <Link to={item.path}>{item.label}</Link>
                    </NavigationMenuTrigger>

                    {/* dropdown card */}
                    <NavigationMenuContent asChild>
                      <div className="absolute left-0 top-full mt-2  h-[221px] rounded-2xl shadow-lg bg-[#FBFBFB] dark:bg-[#1c1c1c] px-[60px] py-[40px] flex gap-[150px] z-20">
                        <div className="flex w-[225px] flex-col gap-[10px] flex-1">
                          <p className="text-[18px] leading-6 font-normal text-[#4F5555] dark:text-gray-200 [font-family:'Inter',Helvetica]">
                            {item.description}
                          </p>
                          <Link
                            to={item.path}
                            className="max-w-[115px] inline-flex items-center gap-[8px] px-[15px] py-[8px] rounded-full bg-[#f5f5f5] hover:bg-slate-200 transition-colors text-[14px] font-normal text-[#1C1C1C]"
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
                                  {sub.subLabel &&
                                    sub.subLabel.map((label, labelIndex) => (
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
                                        <span className="text-sm text-[#1C1C1C] dark:text-white hover:text-[#2ea8af] cursor-pointer">
                                          {label}
                                        </span>
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
                      className={`inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-full font-body-body-4-400 text-[14px] font-normal leading-[19px] hover:bg-slate-100 hover:text-[#2EA8AF] cursor-pointer transition-colors ${
                        location.pathname === item.path
                          ? "bg-[#FBFBFB] text-[#2ea8af] dark:text-black"
                          : "text-[#1c1c1c] dark:text-[#dcdcdc]"
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
        <div className="flex items-center gap-[10px] flex-shrink-0">
          {/* Desktop Web app button */}
          <WalletButton className="hidden lg:flex h-[38px] px-[15px] py-2.5 rounded-full bg-[linear-gradient(136deg,#AADA5D_0%,#0DAEB9_98.28%)] hover:opacity-90 transition-opacity text-white font-normal text-[14px]" />
          
          {/* Mobile Web app button */}
          <WalletButton 
            className="lg:hidden flex h-[39px] w-[86px] px-[15px] py-2.5 rounded-full bg-[linear-gradient(136deg,#AADA5D_0%,#0DAEB9_98.28%)] hover:opacity-90 transition-opacity text-white font-normal text-[14px]" 
            isMobile={true} 
          />

          {/* Language and theme buttons */}
          <div className="hidden lg:flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="w-5 h-5 rounded-full hover:bg-slate-100"
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
              className="w-10 h-10 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <img
                className="w-5 h-5"
                alt="Dark mode toggle"
                src="/moon-dark.svg"
              />
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden w-10 h-10 p-2 rounded-full dark:text-white "
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-[#090920] border-t shadow-lg">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/"
              className="block px-4 py-3 hover:bg-slate-100 rounded-lg transition-colors font-normal text-[14px]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Homepage
            </Link>
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`block px-4 py-3 hover:bg-slate-100 dark:text-white rounded-lg transition-colors font-normal text-[14px] ${
                  location.pathname === item.path
                    ? "bg-[#e9f6f7] text-[#2ea8af]"
                    : "text-[#1c1c1c]"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t space-y-3">
              <WalletButton 
                className="w-full h-[40px] px-6 py-2.5 rounded-full bg-[linear-gradient(136deg,rgba(170,218,93,1)_0%,rgba(13,174,185,1)_100%)] hover:opacity-90 transition-opacity text-white font-normal text-[14px]" 
                isMobile={true}
              />
              
              {isAuthenticated && (
                <button
                  onClick={() => {
                    handleDisconnect();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect Wallet
                </button>
              )}
              
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 p-2 rounded-full hover:bg-slate-100"
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
                  className="w-10 h-10 p-2 rounded-full hover:bg-slate-100"
                >
                  <img
                    className="w-5 h-5"
                    alt="Dark mode toggle"
                    src="/moon-dark.svg"
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};