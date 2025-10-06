import { HeadingWithDots } from "@/components/HeadingWithDots";
import { useTranslation } from "react-i18next";

export const CommunityFoundationSection = (): JSX.Element => {
  const { t } = useTranslation("community");

  return (
    <section className="pt-[60px] xl:pt-[100px]">
        <HeadingWithDots text={t("communityFoundationSection.heading")} />
        <div className="px-0 tablet:px-[77px] xl:px-[134px] large:px-[203px] flex flex-col xl:flex-row xl:gap-[50px]">
          <div
            className="pt-[20px] flex flex-col gap-[20px] font-light text-[18px] leading-[24px] xl:text-[20px] xl:leading-[27px] max-w-[516px] 
              xl:max-w-[782px]"
          >
            <p>
                {t("communityFoundationSection.paragraph.0.part1")} {" "}
                <span className="font-medium">
                    {t("communityFoundationSection.paragraph.0.boldPart")}
                </span>
            </p>

            <p>
                {t("communityFoundationSection.paragraph.1.part1")} {" "}
                <span className="font-medium">
                    {t("communityFoundationSection.paragraph.1.boldPart")} {" "}
                </span>
                {t("communityFoundationSection.paragraph.1.part2")}
            </p>

            <p>
                <span className="font-medium">
                    {t("communityFoundationSection.paragraph.2.boldPart")}{" "}
                </span>
                {t("communityFoundationSection.paragraph.2.part2")}
            </p>
          </div>
          <div className="flex justify-end">
            <img
                className="w-full max-w-[370px] xl:w-[514px] h-auto object-contain"
                alt="LUCA Rewards Illustration"
                src="/comm-foundation-img.svg"
            />
          </div>
        </div>
    </section>
  );
};
