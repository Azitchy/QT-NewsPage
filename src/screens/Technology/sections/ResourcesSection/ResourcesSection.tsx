import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { StyledLink } from "@/components/StyledLink";
import { useTranslation } from "react-i18next";

// Media query hook
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

function CardSwap({ activeTab }: { activeTab: "white-paper" | "audit-report" }) {
  const isSwapped = activeTab === "audit-report";
  const isLarge = useMediaQuery("(min-width: 720px)");

  const CARD_OFFSET = isLarge ? 150 : 40;

  const sharedTransition = { type: "spring", stiffness: 80, damping: 14, mass: 1 };

  const cardAVariants = {
    initial: {
      x: -CARD_OFFSET,
      scale: 1,
      zIndex: 2,
      transition: sharedTransition,
    },
    swapped: {
      x: CARD_OFFSET,
      scale: 0.83,
      zIndex: 1,
      transition: sharedTransition,
    },
  };

  const cardBVariants = {
    initial: {
      x: CARD_OFFSET,
      scale: 0.83,
      zIndex: 1,
      transition: sharedTransition,
    },
    swapped: {
      x: -CARD_OFFSET,
      scale: 1,
      zIndex: 2,
      transition: sharedTransition,
    },
  };

  return (
    <div className="relative w-[291px] h-[413px] flex items-center justify-center">
      <motion.div
        className="absolute"
        variants={cardAVariants}
        animate={isSwapped ? "swapped" : "initial"}
      >
        <img
          className="w-[291px] h-[413px] object-cover rounded-2xl shadow-lg border border-gray-300"
          src="/whitepaper-1.png"
          alt="White Paper"
        />
      </motion.div>
      <motion.div
        className="absolute"
        variants={cardBVariants}
        animate={isSwapped ? "swapped" : "initial"}
      >
        <img
          className="w-[291px] h-[413px] object-cover rounded-2xl shadow-lg border border-gray-700"
          src="/certij-1.png"
          alt="Audit Report"
        />
      </motion.div>
    </div>
  );
}

// Main Section
export const ResourcesSection = (): JSX.Element => {
  const { t } = useTranslation('technology');
  const [activeTab, setActiveTab] = useState<"white-paper" | "audit-report">(
    "white-paper"
  );

  return (
    <div className="w-full bg-card">
      <div className="max-w-[1000px] px-[16px] pb-[85px] mx-auto flex flex-col items-center">
        {/* Tabs Header */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className="w-full flex flex-col items-center"
        >
          <TabsList className="flex bg-transparent rounded-[40px] border border-border p-[5px] h-auto gap-[10px] my-[20px]">
            <TabsTrigger
              value="white-paper"
              className="inline-flex items-center justify-center px-[15px] py-2.5 rounded-[100px] overflow-hidden hover:bg-[#f6f6f6] data-[state=active]:bg-primary-foreground !shadow-none"
            >
              <span className="text-primary">{t('resourcesSection.tabs.whitePaper')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="audit-report"
              className="inline-flex items-center justify-center px-[15px] py-2.5 rounded-[100px] overflow-hidden hover:bg-[#f6f6f6] data-[state=active]:bg-primary-foreground !shadow-none"
            >
              <span className="text-primary">{t('resourcesSection.tabs.auditReport')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Content Layout */}
          <div className="w-full flex flex-col xl:flex-row xl:items-center xl:justify-between gap-[40px]">
            {/* Left Side - Tab Content */}
            <div className="flex flex-col xl:max-w-[430px] tablet:px-[140px] xl:px-0">
              {/* White Paper Content */}
              <TabsContent
                value="white-paper"
                className="w-full gap-[20px] flex flex-col data-[state=inactive]:hidden"
              >
                <p className="self-stretch font-inter text-[18px] leading-[24px] font-[300] xl:text-[20px] xl:leading-[27px] xl:font-light">
                  {t('resourcesSection.whitePaper.description')}
                </p>
                
                <StyledLink text={t('resourcesSection.whitePaper.link')} link="./pdf/ATMWhitePaper.pdf" newTab />
              </TabsContent>

              {/* Audit Report Content */}
              <TabsContent
                value="audit-report"
                className="w-full gap-6 flex flex-col data-[state=inactive]:hidden"
              >
                <p className="self-stretch font-inter text-[18px] leading-[24px] font-[300] xl:text-[20px] xl:leading-[27px] xl:font-light">
                  {t('resourcesSection.auditReport.description')}
                </p>
                
                <StyledLink text={t('resourcesSection.auditReport.link')} link="https://skynet.certik.com/projects/atm" newTab />
              </TabsContent>
            </div>

            {/* Right Side - Animated Cards */}
            <div className="flex justify-center xl:justify-end w-full xl:w-auto">
              <CardSwap activeTab={activeTab} />
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};