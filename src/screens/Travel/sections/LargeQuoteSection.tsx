import { useTranslation } from "react-i18next";

export const LargeQuoteSection = (): JSX.Element => {
  const { t } = useTranslation("travel");
  return (
    <section>
      <div className="relative pt-[60px] pb-[130px] xl:pt-[100px] max-w-[749px] xl:max-w-[1159px] mx-auto text-center space-y-[20px]">
        <p className="text-[20px] font-normal leading-[27px] xl:text-[26px] xl:leading-[34px]">
          {t("largeQuoteSection.subtitle")}
        </p>

        <h1 className="font-['Space_Grotesk'] text-[26px] font-light leading-[34px] xl:text-[38px] xl:leading-[48px]">
          {
            t("largeQuoteSection.headline").split(
              t("largeQuoteSection.highlight")
            )[0]
          }
          <span className="bg-green-gradient bg-clip-text text-transparent font-bold">
            {t("largeQuoteSection.highlight")}
          </span>
          {
            t("largeQuoteSection.headline").split(
              t("largeQuoteSection.highlight")
            )[1]
          }
        </h1>

        <p className="text-[18px] font-light leading-[24px] xl:text-[20px] xl:leading-[27px]">
          {t("largeQuoteSection.description")}
        </p>

        {/* Background image */}
        <img
          src="/imgbgflight-1.png"
          alt="Plane Flight Background"
          className="absolute left-1/4 translate-x-2/4 md:left-3/4 md:translate-x-1/2 tablet:left-3/4 tablet:translate-x-3/4 bottom-4/4 -translate-y-1/4 md:top-1/3 md:-translate-y-1/2 tablet:top-6 tablet:-translate-y-4 w-[271px] h-[242px] xl:w-[338px] xl:h-[302px]"
          loading="lazy"
        />
      </div>
    </section>
  );
};
