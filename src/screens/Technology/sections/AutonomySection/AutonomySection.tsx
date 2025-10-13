import { HeadingWithDots } from "@/components/HeadingWithDots";
import { useTranslation } from "react-i18next";

export const AutonomySection = (): JSX.Element => {
  const { t } = useTranslation("technology");

  return (
    <div className="relative pt-[60px] xl:pt-[100px]">
      {/* Background image */}
      <img
        className="absolute top-0 right-0 large:-right-96 w-[556px] h-[556px] object-cover z-0"
        alt="Bg"
        src="/bg-decentralisedmsgsg-1.svg"
        loading="lazy"
      />

      <div className="relative z-10">
        <HeadingWithDots text={t("autonomySection.heading")} />
      </div>

      {/* Content */}
      <div className="pt-[20px] max-w-[1300px] mx-auto relative z-10 flex flex-col items-center gap-5 text-center">
        <h2 className="font-titlesh5-mob-large-text-400 xl:font-titlesh5-large-text-400">
          {t("autonomySection.title")}
        </h2>

        <h1 className="font-light text-[26px] leading-[32px] tablet:text-[32px] tablet:leading-[40px] font-['Space_Grotesk']">
          {t("autonomySection.description1")}{" "}
          <span className="bg-green-gradient bg-clip-text text-transparent font-bold">
            {t("autonomySection.highlightedText")}
          </span>{" "}
          {t("autonomySection.description2")}
        </h1>

        <p className="font-bodybody1-mob-300  xl:font-bodybody1-300 md:pb-[60px]">
          {t("autonomySection.cta")}
        </p>
      </div>
    </div>
  );
};
