import { HeadingWithDots } from "@/components/HeadingWithDots";
import { CourseCarousel } from "./CourseCarousel";
import { useTranslation } from "react-i18next";

export const UsageGuideSection = (): JSX.Element => {
    const { t } = useTranslation("help");
    const content = {
        text: t("usageGuideSection.text"),
    };

    return (
      <section className="px-[16px] md:px-[70px] large:px-[120px]">
        <HeadingWithDots text={t("usageGuideSection.heading")} />
        <div className="px-0 tablet:px-[77px] xl:px-[134px] large:px-[203px]">
            <p className="py-[20px] font-light font-body text-[18px] leading-[24px] xl:text-[20px] xl:leading-[27px] tablet:max-w-[516px] 
                xl:max-w-[782px]">
                {content.text}
            </p>
        </div>
        <CourseCarousel />
      </section>        
    )
}