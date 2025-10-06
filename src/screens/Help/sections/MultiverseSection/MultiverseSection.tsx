import { HeadingWithDots } from "@/components/HeadingWithDots";
import { CryptoCarousel } from "./CryptoCarousel";
import { useTranslation } from "react-i18next";

export const MultiverseSection = (): JSX.Element => {
  const { t } = useTranslation("help");
  return (
    <section className="pt-[60px] xl:pt-[100px]">
      <div className=" bg-[url('/multiverse.png')] bg-cover bg-center pb-[70px] xl:pb-[111px]">
        <div className="px-[16px] md:px-[70px] large:px-[120px] py-[30px]">
            <HeadingWithDots text={t("multiverseSection.heading")} />
        </div>

        {/* Crypto Carousel */}
        <div className="py-[25px]">
            <CryptoCarousel />
        </div>
      </div>
    </section>
  );
};
