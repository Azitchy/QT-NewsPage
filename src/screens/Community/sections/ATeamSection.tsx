import { HeadingWithDots } from "@/components/HeadingWithDots";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const ATeamSection = (): JSX.Element => {
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
      <HeadingWithDots text={t("aTeamSection.heading")} />

      <div className="pt-[20px] flex flex-col xl:flex-row items-start justify-center xl:gap-[50px] max-w-[1454px] mx-auto">
        {/* Content */}
        <div className="flex flex-col w-full xl:w-[702px] items-start gap-[20px] order-2 xl:order-1">
          {/* Badge */}
          <div className="flex items-center w-fit gap-[8px] px-[10px] py-[5px] bg-[#f9f2ff] rounded-[30px] border border-solid border-[#8e1bf4] backdrop-blur-md">
            <img
              className="w-[18px] h-[18px]"
              alt="Face icon"
              src="/face_icon.svg"
              loading="lazy"
            />
            <span className="text-[#8E1BF4] font-inter text-[12px] font-normal leading-[17px] uppercase">
              {t("aTeamSection.avatarBadge")}
            </span>
          </div>

          {/* Text Content */}
          <p className="font-normal text-[16px] leading-[22px] xl:text-[18px] xl:leading-[24px]">
            {t("aTeamSection.para1")}
            <br /> <br />
            {t("aTeamSection.para2")}
          </p>

          <Button className="inline-flex items-center justify-center gap-[5px] px-5 py-3 bg-primary rounded-[30px] hover:bg-[#A2DEE2]">
            <span className="text-white font-sans text-[14px] leading-[19px] font-normal xl:text-[16px] xl:leading-[24px]">
              {t("aTeamSection.chatButton")}
            </span>
          </Button>
        </div>

        {/* A-Team Image */}
        <div className="mb-[50px] xl:mb-0 xl:flex-shrink-0 w-full xl:w-fit order-1 xl:order-2">
          <img
            src="/ateam-img.png"
            alt="A-Team"
            className="w-full h-[300px] xl:h-[370px] object-cover rounded-3xl"
            loading="lazy"
          />
        </div>
      </div>
    </motion.section>
  );
};
