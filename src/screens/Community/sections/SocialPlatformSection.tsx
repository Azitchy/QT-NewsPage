import { HeadingWithDots } from "@/components/HeadingWithDots";
import { Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const SocialPlatformSection = (): JSX.Element => {
  const { t } = useTranslation("community");

  const slideInVariants = {
    hidden: { opacity: 0, y: 200 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      className="pt-[60px] xl:pt-[100px]"
      variants={slideInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <HeadingWithDots text={t("socialPlatformSection.heading")} />

      <div className="pt-[20px] flex flex-col xl:flex-row items-start justify-center xl:gap-[50px] max-w-[1454px] mx-auto">
        {/* Content */}
        <div className="flex flex-col w-full xl:w-[702px] items-start gap-[20px] order-2 xl:order-1">
          {/* Badge */}
          <div className="flex items-center w-fit gap-[8px] px-[10px] py-[5px] bg-primary-foreground rounded-[30px] border border-solid border-primary-colour backdrop-blur-md">
            <Share2 className="w-[18px] h-[18px] text-primary-colour" />
            <span className="text-primary font-inter text-[12px] font-normal leading-[17px]">
              {t("socialPlatformSection.connectBadge")}
            </span>
          </div>

          {/* Text Content */}
          <p className="font-normal text-[16px] leading-[22px] xl:text-[18px] xl:leading-[24px]">
            {t("socialPlatformSection.comingSoon")}
            <br />
            <br />
            {t("socialPlatformSection.para")}
          </p>
        </div>

        {/* Social Platform Image */}
        <div className="mb-[50px] xl:mb-0 xl:flex-shrink-0 w-full xl:w-fit order-1 xl:order-2">
          <img
            src="/socialplatform-img.png"
            alt="Social Platform"
            className="w-full h-[300px] xl:h-[370px] object-cover rounded-3xl"
            loading="lazy"
          />
        </div>
      </div>
    </motion.section>
  );
};
