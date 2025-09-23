import { Button } from "@/components/ui/button";

export const FooterSection = (): JSX.Element => {
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
    <footer className="mt-16 tablet:mt-[100px]">
      <div className="relative w-full xl:min-h-[225px] overflow-hidden tablet:overflow-visible bg-[linear-gradient(136deg,rgba(170,218,93,1)_0%,rgba(13,174,185,1)_100%)]">
        {/* Background Wallet Image - visible only on small screens */}
        <img
          className="absolute w-[347px] h-[275px] bottom-0 inset-x-[124px] m-auto opacity-20 object-contain tablet:hidden"
          alt="Wallet promotion"
          src="/walletpromo.svg"
        />

        <div className="relative w-fit tablet:mx-auto tablet:translate-x-[50%] px-[26px] py-[20px]">
          {/* Background Wallet Image - visible only on tablet/xl */}
          <img
            className="absolute w-[443px] h-[351px] -left-[440px] xl:-left-[560px] -bottom-[62px] object-contain hidden tablet:block"
            alt="Wallet promotion xl"
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
            <a
              href={downloadButtons[0].link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="w-[174px] h-[51px]"
                alt="Google Play Store"
                src="/google-play-badge.png"
              />
            </a>
            <a
              href={downloadButtons[1].link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="w-[150px] h-[51px]"
                alt="App Store"
                src="/apple-store-badge.png"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="w-full min-h-[286px] bg-[#FAFAFA] dark:bg-[#2B2F3E] relative py-8 px-4 xl:py-0 xl:px-0">
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
          <p className="font-body-body3-mob-400 ... text-center">
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
            <p className="font-body-body3-mob-400 ... text-center">
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
    </footer>
  );
};
