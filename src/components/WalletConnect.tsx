import * as React from "react";
import { useState, useEffect } from "react";
import { AlertCircle, Loader2, CheckCircle, Shield, Key } from 'lucide-react';
import { useWeb3Auth, WalletType } from '../contexts/Web3AuthContext';
import { Button } from "@/components/ui/button";

export const WalletConnect: React.FC = () => {
  const { connectWallet, isConnecting, error, isAuthenticated } = useWeb3Auth();
  const [connectionStep, setConnectionStep] = useState<'idle' | 'connecting' | 'requesting-nonce' | 'signing' | 'verifying' | 'success'>('idle');
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isConnecting) {
      setConnectionStep('connecting');
      
      const stepTimer = setTimeout(() => {
        setConnectionStep('requesting-nonce');
        
        setTimeout(() => {
          setConnectionStep('signing');
        }, 1000);
      }, 500);

      return () => clearTimeout(stepTimer);
    } else if (isAuthenticated) {
      setConnectionStep('success');
      const resetTimer = setTimeout(() => {
        setConnectionStep('idle');
        setShowModal(false);
      }, 2000);
      return () => clearTimeout(resetTimer);
    } else {
      setConnectionStep('idle');
    }
  }, [isConnecting, isAuthenticated]);

  const handleConnect = async (walletType: WalletType) => {
    setSelectedWallet(walletType);
    try {
      await connectWallet(walletType);
    } catch (err) {
      setConnectionStep('idle');
      console.error('Connection failed:', err);
    }
  };

  const getStepStatus = (step: string) => {
    const steps = ['connecting', 'requesting-nonce', 'signing', 'verifying', 'success'];
    const currentIndex = steps.indexOf(connectionStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const connectionSteps = [
    { 
      id: 'connecting', 
      label: 'Connect Wallet', 
      description: 'Opening wallet connection',
      icon: Shield
    },
    { 
      id: 'requesting-nonce', 
      label: 'Request Nonce', 
      description: 'Getting authentication challenge',
      icon: Key 
    },
    { 
      id: 'signing', 
      label: 'Sign Message', 
      description: 'Sign with your private key',
      icon: Shield 
    },
    { 
      id: 'success', 
      label: 'Access Granted', 
      description: 'Successfully authenticated!',
      icon: CheckCircle 
    }
  ];

  const wallets = [
    {
      type: 'metamask' as WalletType,
      name: 'MetaMask',
      icon: <img src="/webapp/MetaMask-icon-fox.svg" alt="MetaMask" className="w-6 h-6" />,
      isInstalled: typeof window !== 'undefined' && window.ethereum?.isMetaMask,
    },
    {
      type: 'walletconnect' as WalletType,
      name: 'WalletConnect',
      icon: <img src="https://avatars.githubusercontent.com/u/37784886" alt="WalletConnect" className="w-6 h-6" />,
      isInstalled: true,
    },
    {
      type: 'coinbase' as WalletType,
      name: 'WalletLink',
      icon: <img src="https://www.coinbase.com/img/favicon/favicon-32x32.png" alt="Coinbase" className="w-6 h-6" />,
      isInstalled: true,
    }
  ];

  const downloadButtons = [
    {
      icon: "/frame-1138.svg",
      text: "Download for Android",
      link: "https://play.google.com/store/apps/details?id=network.atm.atmconnect&hl=en_GB&gl=US&pli=1",
    },
    {
      icon: "/frame-1139.svg",
      text: "Download for iOS",
      link: "https://apps.apple.com/gb/app/atm-connect/id6463245714",
    },
  ];

  const socialLinks = [
    {
      src: "/x-logo.png",
      alt: "X",
      link: "https://x.com/ATMrank",
    },
    {
      src: "/telegram-logo.png",
      alt: "Telegram",
      link: "https://t.me/atm_luca",
    },
    {
      src: "/discord-logo.svg",
      alt: "Discord",
      link: "https://discord.com/invite/bwAtDM7Mp2",
    },
    {
      src: "/reddit-logo.png",
      alt: "Reddit",
      link: "https://www.reddit.com/r/atmrank/",
    },
    {
      src: "/tiktok-logo.png",
      alt: "Tiktok",
      link: "https://www.tiktok.com/@atm_rank?is_from_webapp=1&sender_device=pc",
    },
    {
      src: "/youtube-logo.png",
      alt: "Youtube",
      link: "https://www.youtube.com/@atmrank6968",
    },
  ];

  return (
    <>
      {/* Hero Section with Background Image */}
      <div className="fixed inset-0 w-screen h-screen flex flex-col overflow-hidden bg-white dark:bg-[#1a1d2e]">
        {/* Background Image - Resized to fit within viewport and sit on footer */}
        <div className="flex-1 flex items-end justify-center relative px-4 pb-0">
          <div className="relative w-full max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] h-auto">
            <img
              src="/webapp/webApp-BG.0dd7e52b.png"
              alt="Connect Background"
              className="w-full h-auto object-contain opacity-100 dark:opacity-70"
            />
            
            {/* Wallet Button - Positioned over image */}
            <div className="absolute top-[1%] sm:top-[10%] lg:top-[25%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-1">
              <button
                onClick={() => setShowModal(true)}
                className="px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-[#AAD95D] to-[#0DAEB9] hover:from-[#9BC850] hover:to-[#0C9DA7] text-white font-semibold text-base sm:text-lg rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Wallet
              </button>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="relative z-10 w-full min-h-[286px] bg-[#FAFAFA] dark:bg-[#2B2F3E] py-8 px-4 xl:py-0 xl:px-0">
          <img
            className="absolute w-[550px] h-[202px] bottom-0 left-0 right-0 mx-auto m-auto block dark:hidden"
            alt="Logo img"
            src="/footer-img.svg"
          />
          <img
            className="absolute w-[550px] h-[202px] bottom-0 left-0 right-0 mx-auto m-auto hidden dark:block"
            alt="Logo img"
            src="/footer-img-dark.svg"
          />

          {/* Mobile/Tablet Layout (below xl breakpoint) */}
          <div className="flex flex-col items-center gap-6 relative z-10 xl:hidden">
            {/* Download Buttons Row */}
            <div className="flex items-center justify-center gap-2.5 w-full max-w-md">
              {downloadButtons.map((button, index) => (
                <a
                  key={`download-link-${index}`}
                  href={button.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    className="gap-[5px] px-5 py-3 bg-primary-foreground rounded-[20.8px] inline-flex items-center justify-center hover:bg-[#d8eef0] w-full sm:w-auto"
                    variant="ghost"
                  >
                    <img
                      className="w-[15px] h-[15px]"
                      alt="Icon"
                      src={button.icon}
                    />
                    <span className="font-semibold text-primary text-[12.5px] leading-[20.5px]">
                      {button.text}
                    </span>
                  </Button>
                </a>
              ))}
            </div>

            {/* Email */}
            <p className="font-body-body3-mob-400 text-center">
              Email: autonomoustrustmomentum@gmail.com
            </p>

            {/* Copyright */}
            <p className="font-body-labeltext-400 text-card-primary text-center">
              © 2020 - 2024 Autonomous Trust Momentum All Rights Reserved
            </p>

            {/* Social Links Row */}
            <div className="flex justify-center gap-[30px]">
              {socialLinks.map((social, index) => (
                <a
                  key={`social-link-${index}`}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="w-[24px] h-[24px]"
                    alt={social.alt}
                    src={social.src}
                  />
                </a>
              ))}
            </div>

            {/* Discover us on Row */}
            <div className="flex items-center gap-[15px]">
              <p className="font-body-body3-mob-400 text-center">
                Discover us on:
              </p>

              <div className="flex items-center gap-[15px]">
                <a
                  href="https://coinmarketcap.com/community/profile/ATM_rank/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="w-[108px] h-[18px]"
                    alt="Brand Coin Market Cap"
                    src="/vector-4.svg"
                  />
                </a>
                <a
                  href="https://atm.network/www.dextools.io/app/en/bnb/pair-explorer/0x09e61856a0f4d63e26ea07c1ed8f65d06b61d2eb?t=1733737362452"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="w-[64px] h-[18px]"
                    alt="Brand dextools light"
                    src="/dex-logo.png"
                  />
                </a>
              </div>
            </div>

            {/* Version Number */}
            <p className="font-body-labeltext-400 text-[#858585]">
              Version 2.0.0
            </p>
          </div>

          {/* xl Layout (xl:1728px and bigger) */}
          <div className="hidden xl:block">
            {/* Left Section - Logo and Social Links */}
            <div className="flex flex-col w-[302px] items-start gap-[15px] absolute top-[70px] left-[69px]">
              <img
                className="w-[233px] h-[58px] object-cover"
                alt="ATM logo"
                src="/atm-logo.png"
              />

              <div className="flex justify-between gap-[30px]">
                {socialLinks.map((social, index) => (
                  <a
                    key={`social-link-${index}`}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="w-[24px] h-[24px]"
                      alt={social.alt}
                      src={social.src}
                    />
                  </a>
                ))}
              </div>

              <div className="flex items-start gap-[15px] self-stretch w-full">
                <p className="w-fit mt-[-1.00px] font-body-body3-mob-400 whitespace-nowrap">
                  Discover us on:
                </p>

                <div className="flex items-center gap-[15px]">
                  <a
                    href="https://coinmarketcap.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="w-[108px] h-[18px]"
                      alt="Brand Coin Market Cap"
                      src="/vector-4.svg"
                    />
                  </a>
                  <a
                    href="https://www.dextools.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="w-[64px] h-[18px]"
                      alt="Brand dextools light"
                      src="/dex-logo.png"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Section - Download Buttons and Contact Info */}
            <div className="flex flex-col h-[110px] items-end gap-[15px] absolute top-[70px] right-[69px]">
              <div className="flex items-start justify-end gap-2.5 w-full">
                {downloadButtons.map((button, index) => (
                  <a
                    key={`download-link-xl-${index}`}
                    href={button.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      className="gap-[5px] px-5 py-3 bg-primary-foreground rounded-[20.8px] inline-flex items-center justify-center hover:bg-[#d8eef0] w-auto"
                      variant="ghost"
                    >
                      <img
                        className="w-[15px] h-[15px]"
                        alt="Icon"
                        src={button.icon}
                      />
                      <span className="font-semibold text-primary text-[12.5px] text-right leading-[20.5px]">
                        {button.text}
                      </span>
                    </Button>
                  </a>
                ))}
              </div>

              <p className="self-stretch font-body-body3-mob-400 text-right">
                Email: autonomoustrustmomentum@gmail.com
              </p>

              <p className="self-stretch font-body-labeltext-400 text-card-foreground text-right">
                © 2020 - 2024 Autonomous Trust Momentum All Rights Reserved
              </p>
            </div>

            {/* Version Number - xl */}
            <p className="absolute h-[17px] top-[244px] left-[70px] font-body-labeltext-400 text-card-foreground whitespace-nowrap">
              Version 2.0.0
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative bg-white dark:bg-[#2B2F3E] rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Content */}
            <div className="space-y-6">
              {/* Wallet Options */}
              {!isConnecting && connectionStep === 'idle' && (
                <div className="space-y-3">
                  {wallets.map((wallet) => (
                    <button
                      key={wallet.type}
                      onClick={() => handleConnect(wallet.type)}
                      disabled={!wallet.isInstalled && wallet.type === 'metamask'}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        wallet.isInstalled
                          ? 'border-gray-200 dark:border-gray-700 hover:border-[#0DAEB9] dark:hover:border-[#0DAEB9] bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
                          : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        {wallet.icon}
                      </div>
                      
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {wallet.name}
                        </div>
                      </div>

                      {wallet.isInstalled ? (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                      ) : (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Not installed
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Connection Progress */}
              {(isConnecting || connectionStep !== 'idle') && connectionStep !== 'success' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authentication Progress
                    {selectedWallet && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({wallets.find(w => w.type === selectedWallet)?.name})
                      </span>
                    )}
                  </h3>
                  <div className="space-y-3">
                    {connectionSteps.map((step) => {
                      const status = getStepStatus(step.id);
                      const IconComponent = step.icon;
                      
                      return (
                        <div key={step.id} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            status === 'completed' 
                              ? 'bg-green-500 text-white' 
                              : status === 'active'
                              ? 'bg-[#0DAEB9] text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}>
                            {status === 'completed' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : status === 'active' ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <IconComponent className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`text-sm font-medium ${
                              status === 'active' ? 'text-[#0DAEB9] dark:text-[#0DAEB9]' : 
                              status === 'completed' ? 'text-green-700 dark:text-green-300' : 
                              'text-gray-500 dark:text-gray-400'
                            }`}>
                              {step.label}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {step.description}
                            </div>
                          </div>
                          {status === 'active' && step.id === 'signing' && (
                            <div className="text-xs text-[#0DAEB9] dark:text-[#0DAEB9] bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                              Check your wallet
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Success State */}
              {connectionStep === 'success' && (
                <div className="flex items-center justify-center p-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-green-800 dark:text-green-200">
                      Success! Redirecting...
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                      Authentication Failed
                    </div>
                    <div className="text-sm text-red-700 dark:text-red-300">{error}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};