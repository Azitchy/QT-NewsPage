import { Button } from "@/components/ui/button";

export const FooterSection = (): JSX.Element => {
    const downloadButtons = [
        {
        icon: "/frame-1138.svg",
        text: "Download for Android",
        },
        {
        icon: "/frame-1139.svg",
        text: "Download for iOS",
        },
    ];
    const socialLinks = [
        {
            src: "/x-logo.png",
            alt: "X",
            link: "https://x.com/",
        },
        {
            src: "/telegram-logo.png",
            alt: "Telegram",
            link: "https://dummy.com/",
        },
        {
            src: "/discord-logo.svg",
            alt: "Discord",
            link: "https://dummy.com/",
        },
        {
            src: "/reddit-logo.png",
            alt: "Reddit",
            link: "https://dummy.com/",
        },
        {
            src: "/tiktok-logo.png",
            alt: "Tiktok",
            link: "https://dummy.com/",
        },
        {
            src: "/youtube-logo.png",
            alt: "Youtube",
            link: "https://dummy.com/",
        },
    ];
        
    return (
        <footer className="mt-16 tablet:mt-[100px]">
            <div className="relative w-full desktop:min-h-[225px] overflow-hidden tablet:overflow-visible bg-[linear-gradient(136deg,rgba(170,218,93,1)_0%,rgba(13,174,185,1)_100%)]">
                {/* Background Wallet Image - visible only on small screens */}
                <img
                    className="absolute w-[347px] h-[275px] bottom-0 inset-x-[124px] m-auto opacity-20 object-contain tablet:hidden"
                    alt="Wallet promotion"
                    src="/walletpromo.svg"
                />

                <div className="relative w-fit tablet:mx-auto tablet:translate-x-[50%] px-[26px] py-[20px]">
                    {/* Background Wallet Image - visible only on tablet/desktop */}
                    <img
                        className="absolute w-[443px] h-[351px] -left-[440px] desktop:-left-[560px] -bottom-[62px] object-contain hidden tablet:block"
                        alt="Wallet promotion desktop"
                        src="/walletpromo.svg"
                    />

                    {/* Text above image */}
                    <div className="flex-0 tablet:flex relative z-10 text-white font-[400] text-[38px] leading-[42px] font-['Bebas_Neue']">
                        <h2>DOWNLOAD &nbsp;</h2>
                        <h2>ATM.CONNECT NOW</h2>
                    </div>

                    <p className="relative z-10 text-white font-[300] text-[18px] leading-[24px] font-['Inter']">
                        Access to your wallet anytime, anywhere.
                    </p>

                    {/* Store Badges */}
                    <div className="relative z-10 flex gap-[15px] py-[10px]">
                        <img
                            className="w-[174px] h-[51px]"
                            alt="Google Play Store"
                            src="/google-play-badge.png"
                        />
                        <img
                            className="w-[150px] h-[51px]"
                            alt="App Store"
                            src="/apple-store-badge.png"
                        />
                    </div>
                </div>
            </div>

            {/* Main Footer Section */}
            <div className="w-full min-h-[286px] bg-neutral-50 relative py-8 px-4 desktop:py-0 desktop:px-0">
                <img
                    className="absolute w-[550px] h-[202px] bottom-0 left-0 right-0 mx-auto m-auto"
                    alt="Logo img"
                    src="/footer-img.svg"
                />

                {/* Mobile/Tablet Layout (below desktop breakpoint) */}
                <div className="flex flex-col items-center gap-6 relative z-10 desktop:hidden">
                    {/* ATM Logo - Hidden on mobile/tablet */}
                    
                    {/* Download Buttons Row */}
                    <div className="flex items-center justify-center gap-2.5 w-full max-w-md">
                        {downloadButtons.map((button, index) => (
                            <Button
                                key={`download-button-${index}`}
                                className="gap-[5px] px-5 py-3 bg-[#e9f6f7] rounded-[20.8px] inline-flex items-center justify-center hover:bg-[#d8eef0] w-full sm:w-auto"
                                variant="ghost"
                            >
                                <img
                                    className="w-[15px] h-[15px]"
                                    alt="Icon"
                                    src={button.icon}
                                />
                                <span className="font-semibold text-[#2ea8af] text-[12.5px] leading-[20.5px]">
                                    {button.text}
                                </span>
                            </Button>
                        ))}
                    </div>

                    {/* Email */}
                    <p className="font-body-body3-mob-400 font-[number:var(--body-body3-mob-400-font-weight)] text-[#1c1c1c] text-[length:var(--body-body3-mob-400-font-size)] text-center tracking-[var(--body-body3-mob-400-letter-spacing)] leading-[var(--body-body3-mob-400-line-height)] [font-style:var(--body-body3-mob-400-font-style)]">
                        Email: autonomoustrustmomentum@gmail.com
                    </p>

                    {/* Copyright */}
                    <p className="font-body-labeltext-400 font-[number:var(--body-labeltext-400-font-weight)] text-[#4f5555] text-[length:var(--body-labeltext-400-font-size)] text-center tracking-[var(--body-labeltext-400-letter-spacing)] leading-[var(--body-labeltext-400-line-height)] [font-style:var(--body-labeltext-400-font-style)]">
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
                        <p className="font-body-body3-mob-400 font-[number:var(--body-body3-mob-400-font-weight)] text-[#1c1c1c] text-[length:var(--body-body3-mob-400-font-size)] text-center tracking-[var(--body-body3-mob-400-letter-spacing)] leading-[var(--body-body3-mob-400-line-height)] [font-style:var(--body-body3-mob-400-font-style)]">
                            Discover us on:
                        </p>

                        <div className="flex items-center gap-[15px]">
                            <img
                                className="w-[108px] h-[18px]"
                                alt="Brand Coin Market Cap"
                                src="/vector-4.svg"
                            />
                            <img
                                className="w-[64px] h-[18px]"
                                alt="Brand dextools light"
                                src="/dex-logo.png"
                            />
                        </div>
                    </div>

                    {/* Version Number */}
                    <p className="font-body-labeltext-400 font-[number:var(--body-labeltext-400-font-weight)] text-[#858585] text-[length:var(--body-labeltext-400-font-size)] tracking-[var(--body-labeltext-400-letter-spacing)] leading-[var(--body-labeltext-400-line-height)] [font-style:var(--body-labeltext-400-font-style)]">
                        Version 2.0.0
                    </p>
                </div>

                {/* Desktop Layout (desktop:1728px and bigger) - Keep original layout */}
                <div className="hidden desktop:block">
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
                            <p className="w-fit mt-[-1.00px] font-body-body3-mob-400 font-[number:var(--body-body3-mob-400-font-weight)] text-[#1c1c1c] text-[length:var(--body-body3-mob-400-font-size)] text-right tracking-[var(--body-body3-mob-400-letter-spacing)] leading-[var(--body-body3-mob-400-line-height)] whitespace-nowrap [font-style:var(--body-body3-mob-400-font-style)]">
                                Discover us on:
                            </p>

                            <div className="flex items-center gap-[15px]">
                                <img
                                    className="w-[108px] h-[18px]"
                                    alt="Brand Coin Market Cap"
                                    src="/vector-4.svg"
                                />
                                <img
                                    className="w-[64px] h-[18px]"
                                    alt="Brand dextools light"
                                    src="/dex-logo.png"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Download Buttons and Contact Info */}
                    <div className="flex flex-col h-[110px] items-end gap-[15px] absolute top-[70px] right-[69px]">
                        <div className="flex items-start justify-end gap-2.5 relative self-stretch w-full">
                            {downloadButtons.map((button, index) => (
                                <Button
                                    key={`download-button-${index}`}
                                    className="gap-[5px] px-5 py-3 bg-[#e9f6f7] rounded-[20.8px] inline-flex items-center justify-center hover:bg-[#d8eef0] w-auto"
                                    variant="ghost"
                                >
                                    <img
                                        className="w-[15px] h-[15px]"
                                        alt="Icon"
                                        src={button.icon}
                                    />
                                    <span className="font-semibold text-[#2ea8af] text-[12.5px] text-right leading-[20.5px]">
                                        {button.text}
                                    </span>
                                </Button>
                            ))}
                        </div>

                        <p className="self-stretch font-body-body3-mob-400 font-[number:var(--body-body3-mob-400-font-weight)] text-[#1c1c1c] text-[length:var(--body-body3-mob-400-font-size)] text-right tracking-[var(--body-body3-mob-400-letter-spacing)] leading-[var(--body-body3-mob-400-line-height)] [font-style:var(--body-body3-mob-400-font-style)]">
                            Email: autonomoustrustmomentum@gmail.com
                        </p>

                        <p className="self-stretch font-body-labeltext-400 font-[number:var(--body-labeltext-400-font-weight)] text-[#4f5555] text-[length:var(--body-labeltext-400-font-size)] text-right tracking-[var(--body-labeltext-400-letter-spacing)] leading-[var(--body-labeltext-400-line-height)] [font-style:var(--body-labeltext-400-font-style)]">
                            © 2020 - 2024 Autonomous Trust Momentum All Rights Reserved
                        </p>
                    </div>

                    {/* Version Number - Desktop */}
                    <p className="absolute h-[17px] top-[244px] left-[70px] font-body-labeltext-400 font-[number:var(--body-labeltext-400-font-weight)] text-[#858585] text-[length:var(--body-labeltext-400-font-size)] tracking-[var(--body-labeltext-400-letter-spacing)] leading-[var(--body-labeltext-400-line-height)] whitespace-nowrap [font-style:var(--body-labeltext-400-font-style)]">
                        Version 2.0.0
                    </p>
                </div>
            </div>
        </footer>
    );
};