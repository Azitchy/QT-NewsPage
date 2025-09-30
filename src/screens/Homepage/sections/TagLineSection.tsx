import { useTranslation } from "react-i18next";

export const TagLineSection = () => {
  const { t } = useTranslation('home');

  return (
    <div className="w-full text-center px-0 lg:px-0 lg:py-[46px]">
      <p className="text-[26px] md:text-3xl lg:text-[38px] text-foreground mx-auto tracking-[0px] font-space-grotesk ml-0 lg:ml-24">
        <span className="text-foreground dark:text-[#DCDCDC] font-extralight ">
          {t('taglineSection.normal')}{" "}
        </span>
        <span className=" bg-[linear-gradient(358deg,#AADA5D_52%,#0DAEB9_100%)] bg-clip-text text-transparent font-bold">
          {t('taglineSection.highlight')}
        </span>
      </p>
    </div>
  );
};