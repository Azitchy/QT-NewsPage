import { HeadingWithDots } from "@/components/HeadingWithDots";
import { Share2 } from "lucide-react";
import { motion } from "framer-motion";

export const MessagingPlatformSection = (): JSX.Element => {
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
      <HeadingWithDots text="messaging platform" />

      <div className="pt-[20px] flex flex-col xl:flex-row items-start justify-center xl:gap-[50px] max-w-[1454px] mx-auto">
        {/* Content */}
        <div className="flex flex-col w-full xl:w-[702px] items-start gap-[20px] order-2">
          {/* Badge */}
          <div className="flex items-center w-fit gap-[8px] px-[10px] py-[5px] bg-primary-foreground rounded-[30px] border border-solid border-primary-colour backdrop-blur-md">
            <Share2 className="w-[18px] h-[18px] text-primary-colour" />
            <span className="text-primary text-[12px] font-normal leading-[17px]">
              Connect
            </span>
          </div>

          {/* Text Content */}
          <p className="font-normal text-[16px] leading-[22px] xl:text-[18px] xl:leading-[24px]">
            Coming Soon
            <br /> <br />
            Our messaging platform fosters vibrant discussions within the ATM
            community. Whether you're a seasoned enthusiast or a newcomer,
            connect, share insights, and stay updated on trends. Create custom
            chatrooms, join existing ones, or engage in direct messaging. Stay
            informed, exchange ideas, and build connections.
          </p>
        </div>

        {/* Messaging Image */}
        <div className="mb-[50px] xl:mb-0 xl:flex-shrink-0 w-full xl:w-fit order-1">
          <img
            src="/messaging-img.png"
            alt="Messaging Platform"
            className="w-full h-[300px] xl:h-[370px] object-cover rounded-3xl"
          />
        </div>
      </div>
    </motion.section>
  );
};
