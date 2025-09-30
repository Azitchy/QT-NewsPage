import { useTranslation } from "react-i18next";
import TravelCarousel, { CarouselContent } from '../TravelCarousel';
import travelHero1 from '/flight-1.png';
import travelHero2 from '/flight-2.png';
import travelHero3 from '/flight-3.png';
import { HeadingWithDots } from "@/components/HeadingWithDots";

export const FlightsSection = (): JSX.Element => {
  const { t } = useTranslation("travel");
  const travelImages = [travelHero1, travelHero2, travelHero3];

  return (
    <section className="pt-[60px] xl:pt-[100px]">
      <HeadingWithDots text={t("flightsSection.heading")} />
      <div className="pt-[20px] px-0 tablet:px-[77px] xl:px-[134px] large:px-[203px] space-y-[15px] xl:space-y-[20px]">

        <p className="text-[20px] font-normal leading-[27px] xl:text-[26px] xl:leading-[34px]">
          {t("flightsSection.subtitle")}
        </p>
        <div className="flex gap-[10px]">
          <img src="/lucatravel.svg" alt="Luca Travel" className='block dark:hidden'/>
          <img src="/lucatravel-dark.svg" alt="Luca Travel" className='hidden dark:block'/>
          <span className="text-[18px] font-light leading-[24px] xl:text-[20px] xl:leading-[27px]"> {t("flightsSection.partnerText")} </span>
          <img src="/trip.com.svg" alt="Trip.com" />
        </div>

        <p className="pb-[40px] max-w-[519px] xl:max-w-[784px] text-[16px] font-normal leading-[22px] xl:text-[18px] xl:leading-[24px]">
          {t("flightsSection.description")}
        </p>

        <TravelCarousel images={travelImages} imageContainer='rounded-[20px]'
          className='max-w-[1586px] max-h-[353px] rounded-[20px] mx-auto'>
          <CarouselContent className='max-w-[517px] px-[12px] large:px-[52px] mx-auto large:mx-0'>
            <div className='px-[60px] py-[50px] rounded-[20px] bg-[rgba(124,124,124,0.20)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[15px] space-y-[10px] flex flex-col items-center'>
              <p className="text-center text-white font-['Space_Grotesk'] font-bold text-[26px] leading-[34px] xl:text-[38px] xl:leading-[48px]">
                {t("flightsSection.carousel.offerText")}
              </p>
              <p className='text-center text-white font-normal text-[20px] leading-[27px] xl:text-[26px] xl:leading-[34px]'>
                {t("flightsSection.carousel.details")}
              </p>

              <a
                href="https://www.trip.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-colour px-[50px] py-[25px] rounded-[40px] flex items-center justify-center"
              >
                <span className='text-white font-inter font-medium text-[18px] leading-[24px] md:text-[20px] md:leading-[27px]'>
                  {t("flightsSection.carousel.button")}
                </span>
              </a>
            </div>
          </CarouselContent>
        </TravelCarousel>
      </div>
    </section>
  );
};
