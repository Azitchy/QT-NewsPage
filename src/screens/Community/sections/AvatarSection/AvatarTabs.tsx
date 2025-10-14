import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

const avatarTabs = () => {
  const { t } = useTranslation("community");

  return {
    about: {
      id: "about",
      name: t("avatarTabs.about.name"),
      heading: t("avatarTabs.about.heading"),
      image: "./about-img.png",
      alt: "Avatar About",
      description: t("avatarTabs.about.description")
    },
    create: {
      id: "create",
      name: t("avatarTabs.create.name"),
      heading: t("avatarTabs.create.heading"),
      image: "./create-img.png",
      alt: "Avatar Create",
      description: t("avatarTabs.create.description"),
    },
    train: {
      id: "train",
      name: t("avatarTabs.train.name"),
      heading: t("avatarTabs.train.heading"),
      image: "./train-img.png",
      alt: "Avatar Train",
      description: t("avatarTabs.train.description"),
    },
    share: {
      id: "share",
      name: t("avatarTabs.share.name"),
      heading: t("avatarTabs.share.heading"),
      image: "./share-img.png",
      alt: "Avatar Share",
      description: t("avatarTabs.share.description"),
    },
  };
};


const TabImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="mb-[20px] xl:mb-0 xl:flex-shrink-0 w-full xl:w-fit">
    <img
      src={src}
      alt={alt}
      className="w-full h-[300px] xl:h-[370px] object-cover rounded-3xl"
    />
  </div>
);

export const AvatarTabs = (): JSX.Element => {
  const tabs = avatarTabs();
  return (
    <div className="pt-[60px] xl:pt-[100px] max-w-[1600px] mx-auto pb-[90px] tablet:pb-[75px] xl:pb-0">
      <Tabs defaultValue="about" className="mx-auto flex flex-col">
        {/* Tabs Header */}
        <div className="flex justify-center xl:justify-end">
          <TabsList gradientBorder className="flex bg-background rounded-[40px] border border-border p-[5px] h-auto gap-[10px]">
            {Object.values(tabs).map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="inline-flex items-start justify-center px-[15px] py-2.5 rounded-[100px] overflow-hidden hover:bg-border data-[state=active]:bg-primary-foreground !shadow-none"
              >
                <span className="relative text-primary w-fit mt-[-1px] ">
                  {tab.name}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tabs Content */}
        {Object.values(tabs).map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="w-full">
            <div className="flex flex-col xl:flex-row items-start xl:gap-[50px]">
              <TabImage src={tab.image} alt={tab.alt} />
              <div className="text-center xl:text-left xl:flex-1">
                <h3 className="self-stretch text-left font-normal font-inter text-[20px] leading-[27px] xl:text-[26px] xl:leading-[34px] mb-[20px]">
                  {tab.heading}
                </h3>
                <div className="text-left font-normal font-inter text-[14px] leading-[19px] xl:text-[16px] xl:leading-[24px]">
                  <p className="self-stretch mb-[20px]">{tab.description}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
