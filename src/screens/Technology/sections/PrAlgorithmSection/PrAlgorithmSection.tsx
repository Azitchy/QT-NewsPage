import { HeadingWithDots } from "@/components/HeadingWithDots";
import { StyledLink } from "@/components/StyledLink";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

// Reusable Image Component
const TabImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="mb-[20px] xl:mb-0 xl:flex-shrink-0 w-full xl:w-fit">
    <img
      src={src}
      alt={alt}
      className="w-full h-[300px] xl:h-[370px] object-cover rounded-3xl"
    />
  </div>
);

export const PrAlgorithmSection = (): JSX.Element => {
  const { t } = useTranslation('technology');

  const prTabs = {
    pr: {
      id: "pr",
      name: t('prAlgorithmSection.tabs.pr'),
      heading: t('prAlgorithmSection.pr.title'),
      image: "./pr-img.png",
      alt: "PageRank Algorithm",
    },
    strengths: {
      id: "strengths",
      name: t('prAlgorithmSection.tabs.strengths'),
      heading: t('prAlgorithmSection.strengths.title'),
      image: "./strengths-img.png",
      alt: "PageRank Strengths",
    },
    create: {
      id: "create",
      name: t('prAlgorithmSection.tabs.create'),
      heading: t('prAlgorithmSection.create.title'),
      image: "./create-img.png",
      alt: "Create PR Node",
    },
    income: {
      id: "income",
      name: t('prAlgorithmSection.tabs.income'),
      heading: t('prAlgorithmSection.income.title'),
      image: "./income-img.png",
      alt: "Income from PR Node",
    },
  };

  return (
    <div className="pt-[60px] xl:pt-[100px]">
      <HeadingWithDots text={t('prAlgorithmSection.heading')} />
      <Tabs defaultValue="pr" className="pt-[20px] max-w-[1600px] mx-auto flex flex-col">
        {/* Tabs Header */}
        <div className="flex justify-center xl:justify-end my-[20px]">
          <TabsList gradientBorder className="flex bg-background rounded-[40px] border border-border p-[5px] h-auto gap-[10px]">
            {Object.values(prTabs).map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="inline-flex items-start justify-center px-[15px] py-2.5 rounded-[100px] overflow-hidden hover:bg-[#f6f6f6] data-[state=active]:bg-primary-foreground !shadow-none"
              >
                <span className="relative text-primary w-fit mt-[-1px] ">
                  {tab.name}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* PR Tab */}
        <TabsContent value={prTabs.pr.id} className="w-full">
          <div className="flex flex-col xl:flex-row items-start xl:gap-[50px]">
            <TabImage src={prTabs.pr.image} alt={prTabs.pr.alt} />
            <div className="text-center xl:text-left xl:flex-1">
              <h3 className="self-stretch  text-left font-normal font-inter text-[20px] leading-[27px] xl:text-[26px] xl:leading-[34px] mb-[20px]">
                {prTabs.pr.heading}
              </h3>
              <div className="text-left font-normal font-inter text-[14px] leading-[19px] xl:text-[16px] xl:leading-[24px]">
                <p className="self-stretch ">
                  {t('prAlgorithmSection.pr.description')}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Strengths Tab */}
        <TabsContent value={prTabs.strengths.id} className="w-full">
          <div className="flex flex-col xl:flex-row items-start xl:gap-[50px]">
            <TabImage src={prTabs.strengths.image} alt={prTabs.strengths.alt} />
            <div className="text-center xl:text-left xl:flex-1">
              <h3 className="self-stretch  text-left font-normal font-inter text-[20px] leading-[27px] xl:text-[26px] xl:leading-[34px] mb-[20px]">
                {prTabs.strengths.heading}
              </h3>
              <div className="text-left font-normal font-inter text-[14px] leading-[19px] xl:text-[16px] xl:leading-[24px]">
                <p className="self-stretch  mb-[20px]">
                  {t('prAlgorithmSection.strengths.description1')}
                </p>
                <p>
                  {t('prAlgorithmSection.strengths.description2')}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Create Tab */}
        <TabsContent value={prTabs.create.id} className="w-full">
          <div className="flex flex-col xl:flex-row items-start xl:gap-[50px]">
            <TabImage src={prTabs.create.image} alt={prTabs.create.alt} />
            <div className="text-center xl:text-left xl:flex-1">
              <h3 className="self-stretch  text-left font-normal font-inter text-[20px] leading-[27px] xl:text-[26px] xl:leading-[34px] mb-[20px]">
                {prTabs.create.heading}
              </h3>
              <div className="text-left font-normal font-inter text-[14px] leading-[19px] xl:text-[16px] xl:leading-[24px]">
                <p className="self-stretch  mb-[20px]">
                  {t('prAlgorithmSection.create.description')}
                </p>
                
                <StyledLink text={t('prAlgorithmSection.create.createNode')} link="/webapp" />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Income Tab */}
        <TabsContent value={prTabs.income.id} className="w-full">
          <div className="flex flex-col xl:flex-row items-start xl:gap-[50px]">
            <TabImage src={prTabs.income.image} alt={prTabs.income.alt} />
            <div className="text-center xl:text-left xl:flex-1">
              <h3 className="self-stretch  text-left font-normal font-inter text-[20px] leading-[27px] xl:text-[26px] xl:leading-[34px] mb-[20px]">
                {prTabs.income.heading}
              </h3>
              <div className="text-left font-normal font-inter text-[14px] leading-[19px] xl:text-[16px] xl:leading-[24px]">
                <p className="self-stretch  mb-[20px]">
                  <span className="text-primary-colour">{t('prAlgorithmSection.income.operationRewards.title')}</span> <br />
                  {t('prAlgorithmSection.income.operationRewards.description')}
                </p>
                <p className="self-stretch  mb-[20px]">
                  <span className="text-primary-colour">{t('prAlgorithmSection.income.stakeRewards.title')}</span> <br />
                  {t('prAlgorithmSection.income.stakeRewards.description')}
                </p>
                <p className="self-stretch  mb-[20px]">
                  <span className="text-primary-colour">{t('prAlgorithmSection.income.consensusRewards.title')}</span> <br />
                  {t('prAlgorithmSection.income.consensusRewards.description')}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};