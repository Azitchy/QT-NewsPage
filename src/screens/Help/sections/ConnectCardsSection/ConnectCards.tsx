import { useTranslation } from "react-i18next";

export function InstallWalletCard({ className = "" }: { className?: string }) {
  const { t } = useTranslation("help");

  return (
    <div className="p-[2px] rounded-2xl dark:border-gradient">
      <div
        className={`w-full max-w-[360px] h-[558px] 2xl:h-[720px] 2xl:max-w-[480px] bg-card shadow-md rounded-2xl overflow-hidden ${className}`}
      >
        <header className="px-6 py-4 flex items-center justify-center bg-primary-foreground">
          <h3 className="text-primary text-[20px] leading-[27px] font-normal 2xl:text-[26px] 2xl:leading-[34px]">
            {t("connectCardsSection.installWalletCard.title")}
          </h3>
        </header>

        <div className="p-6 space-y-[10px] 2xl:space-y-[30px] font-normal font-[Inter] text-[16px] leading-[22px] 2xl:text-[18px] 2xl:leading-[24px]">
          <div className="border border-primary rounded-2xl p-3 flex items-start gap-3">
            <img className="w-5 h-5" alt="Tip icon" src="/light-bulb.svg" />
            <p className="text-primary text-[12px] leading-[17px] font-normal">
              {t("connectCardsSection.installWalletCard.tip")}
            </p>
          </div>

          <p>{t("connectCardsSection.installWalletCard.instruction1")}</p>

          <div className="flex justify-center">
            <a
              href="https://metamask.io/en-GB"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#e0f7fa] rounded-full"
            >
              <img className="w-5 h-5" alt="Metamask" src="/metamask.svg" />
              <span className="text-primary font-normal text-[14px] leading-[19px] 2xl:text-[16px] 2xl:leading-[24px]">
                MetaMask
              </span>
            </a>
          </div>

          <p>{t("connectCardsSection.installWalletCard.instruction2")}</p>

          <div className="flex justify-center">
            <a
              href=""
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#e0f7fa] rounded-full"
            >
              <img className="w-5 h-5" alt="Binance" src="/binance-1.svg" />
              <span className="text-primary font-normal text-[14px] leading-[19px] 2xl:text-[16px] 2xl:leading-[24px]">
                {t("connectCardsSection.installWalletCard.bscNetworkText")}
              </span>
            </a>
          </div>

          <p>{t("connectCardsSection.installWalletCard.instruction3")}</p>

          <div className="flex gap-3 justify-center">
            <a
              href=""
              className="flex items-center gap-2 px-3 py-2 bg-[#e0f7fa] rounded-full"
            >
              <img className="w-4 h-4" alt="Luca" src="/luca.svg" />
              <span className="text-primary font-normal text-[14px] leading-[19px] 2xl:text-[16px] 2xl:leading-[24px]">
                LUCA
              </span>
            </a>

            <a
              href=""
              className="flex items-center gap-2 px-3 py-2 bg-[#e0f7fa] rounded-full"
            >
              <img className="w-4 h-4" alt="USDC" src="/usdc.svg" />
              <span className="text-primary font-normal text-[14px] leading-[19px] 2xl:text-[16px] 2xl:leading-[24px]">
                USDC
              </span>
            </a>

            <a
              href="/"
              className="flex items-center gap-2 px-3 py-2 bg-[#e0f7fa] rounded-full"
            >
              <img className="w-4 h-4" alt="AGT" src="/coin-icon.svg" />
              <span className="text-primary font-normal text-[14px] leading-[19px] 2xl:text-[16px] 2xl:leading-[24px]">
                AGT
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConnectToATMCard({ className = "" }: { className?: string }) {
  const { t } = useTranslation("help");

  return (
    <div className="p-[2px] rounded-2xl dark:border-gradient">
      <div
        className={`w-full max-w-[360px] h-[558px] 2xl:h-[720px] 2xl:max-w-[480px] bg-card shadow-md rounded-2xl overflow-hidden ${className}`}
      >
        <header className="px-6 py-4 flex items-center justify-center bg-primary-foreground">
          <h3 className="text-primary text-[20px] leading-[27px] font-normal 2xl:text-[26px] 2xl:leading-[34px]">
            {t("connectCardsSection.connectToATMCard.title")}
          </h3>
        </header>

        <div className="p-6 space-y-[10px] 2xl:space-y-[30px] font-normal text-[16px] leading-[22px] 2xl:text-[18px] 2xl:leading-[24px]">
          <p>{t("connectCardsSection.connectToATMCard.instruction1")}</p>
          <p>{t("connectCardsSection.connectToATMCard.instruction2")}</p>

          <div className="border border-primary rounded-2xl p-3 flex items-start gap-3">
            <img className="w-5 h-5" alt="Tip icon" src="/light-bulb.svg" />
            <p className="text-primary text-[12px] leading-[17px] font-normal">
              {t("connectCardsSection.connectToATMCard.tip")}
            </p>
          </div>

          <p>{t("connectCardsSection.connectToATMCard.instruction3")}</p>

          <div className="flex justify-center">
            <a
              href="/webapp"
              className="px-6 py-2 rounded-[20px] text-white font-normal text-[14px] leading-[19px] 2xl:text-[16px] 2xl:leading-[24px]"
              style={{
                background:
                  "linear-gradient(136deg, rgba(170,218,93,1) 0%, rgba(13,174,185,1) 100%)",
              }}
            >
              {t("connectCardsSection.connectToATMCard.buttonText")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FundWalletCard({ className = "" }: { className?: string }) {
  const { t } = useTranslation("help");

  return (
    <div className="p-[2px] rounded-2xl dark:border-gradient">
      <div
        className={`w-full max-w-[360px] h-[558px] 2xl:h-[720px] 2xl:max-w-[480px] bg-card shadow-md rounded-2xl overflow-hidden ${className}`}
      >
        <header className="px-6 py-4 flex items-center justify-center bg-primary-foreground">
          <h3 className="text-primary text-[20px] leading-[27px] font-normal 2xl:text-[26px] 2xl:leading-[34px]">
            {t("connectCardsSection.fundWalletCard.title")}
          </h3>
        </header>

        <div className="space-y-[10px] 2xl:space-y-[30px] font-normal text-[16px] leading-[22px] 2xl:text-[18px] 2xl:leading-[24px]">
          <div className="px-6 pt-6 space-y-[10px] 2xl:space-y-[30px]">
            <p>{t("connectCardsSection.fundWalletCard.instruction1")}</p>
            <p>{t("connectCardsSection.fundWalletCard.instruction2")}</p>
          </div>

          <div className="w-full bg-[#f9f4fe] rounded-lg px-[40px] py-[20px] flex flex-col gap-[5px] overflow-hidden">
            <img
              className="w-[184px] h-[35px] object-contain"
              alt="MoonPay"
              src="/moonpay.svg"
            />
            <p className="text-[#1C1C1C] font-medium text-[18px] leading-[24px] 2xl:text-[20px] 2xl:leading-[27px]">
              {t("connectCardsSection.fundWalletCard.moonpayHeading")}
            </p>
            <p className="text-[#1C1C1C] font-normal text-[14px] leading-[19px]">
              {t("connectCardsSection.fundWalletCard.moonpayDescription")}
            </p>
          </div>

          <p className="pb-6 px-6">
            {t("connectCardsSection.fundWalletCard.instruction3")}
          </p>
        </div>
      </div>
    </div>
  );
}
