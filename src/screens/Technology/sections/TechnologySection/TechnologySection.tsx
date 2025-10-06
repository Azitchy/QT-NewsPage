import { HeadingWithDots } from "@/components/HeadingWithDots";
import { StyledLink } from "@/components/StyledLink";
import { useTranslation } from "react-i18next";

export const TechnologySection = (): JSX.Element => {
  const { t } = useTranslation('technology');
  
  return (
    <section className="pt-[60px] tablet:pt-[100px]">
        {/* Technology Heading */}
        <HeadingWithDots text={t('technologySection.heading')} />

      <div className="px-0 tablet:px-[77px] xl:px-[134px] large:px-[203px]">

        {/* System Integration Section */}
        <div className="flex flex-col tablet:flex-row gap-[60px] tablet:gap-[80px] mt-8 tablet:mt-12 items-start justify-center">
          {/* Tech Image */}
          <img
            src="/tech-img.png"
            alt="Technology illustration"
            className="w-[269px] h-[300px] rounded-lg object-cover flex-shrink-0 mx-auto tablet:mx-0 order-2 tablet:order-1"
          />

          {/* Text Content */}
          <div className="flex-1 space-y-5 max-w-[954px] order-1 tablet:order-2">
            <h2 className="text-[20px] leading-[27px] font-normal xl:text-[26px] xl:leading-[34px] xl:font-normal">
              {t('technologySection.systemIntegration.title')}
            </h2>
            <p className="text-[16px] leading-[22px] font-light xl:text-[18px] xl:leading-[24px] xl:font-normal">
              {t('technologySection.systemIntegration.description1')}
            </p>
            <p className="text-[16px] leading-[22px] font-light xl:text-[18px] xl:leading-[24px] xl:font-normal">
              {t('technologySection.systemIntegration.description2')}
            </p>
            
            <StyledLink text={t('technologySection.systemIntegration.learnMore')} link="https://en.wikipedia.org/wiki/PageRank" newTab />
          </div>
        </div>

        {/* Smart Contracts Section */}
        <div className="max-w-[783px] mt-[60px]">
          <div className="space-y-5">
            <h2 className="text-[20px] leading-[27px] font-normal xl:text-[26px] xl:leading-[34px] xl:font-normal">
              {t('technologySection.smartContracts.title')}
            </h2>
            <p className="text-[16px] leading-[22px] font-normal xl:text-[18px] xl:leading-[24px]">
              {t('technologySection.smartContracts.description')}
              <br />
              <br />
              {t('technologySection.smartContracts.subtitle')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};