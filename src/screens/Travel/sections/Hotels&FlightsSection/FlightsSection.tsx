import TravelCarousel, { CarouselContent } from '../TravelCarousel';
import travelHero1 from '/flight-1.png'
import travelHero2 from '/flight-2.png'
import travelHero3 from '/flight-3.png'
import { HeadingWithDots } from "@/components/HeadingWithDots";

export const FlightsSection = (): JSX.Element => {
  const travelImages = [
    travelHero1,
    travelHero2,
    travelHero3,
  ]
  return (
    <section className="pt-[60px] desktop:pt-[100px]">
      <HeadingWithDots text="flights" />
      <div className="pt-[20px] px-0 tablet:px-[77px] desktop:px-[134px] large:px-[203px] space-y-[15px] desktop:space-y-[20px]">

        <p className="text-[20px] font-normal leading-[27px] desktop:text-[26px] desktop:leading-[34px]">
            Book your hotel through
        </p>
        <div className="flex gap-[10px]">
          <img src="/lucatravel.svg" alt="Luca Travel" className='block dark:hidden'/>
          <img src="/lucatravel-dark.svg" alt="Luca Travel" className='block light:hidden'/>
          <span className="text-[18px] font-light leading-[24px] desktop:text-[20px] desktop:leading-[27px]"> with </span>
          <img src="/trip.com.svg" alt="Trip.com" />

        </div>
        <p className="pb-[40px] max-w-[519px] desktop:max-w-[784px] text-[16px] font-normal leading-[22px] desktop:text-[18px] desktop:leading-[24px]">
            Find exclusive hotel deals for your trip! Click ‘Book flight’ to sign up with your email and explore all the hottest deals!
        </p>

        <TravelCarousel images={travelImages} imageContainer='rounded-[20px]'
        className='max-w-[1586px] max-h-[353px] rounded-[20px] mx-auto'
        >
            <CarouselContent className='max-w-[517px] px-[12px] large:px-[52px] mx-auto large:mx-0'>
                <div className='px-[60px] py-[50px] rounded-[20px] bg-[rgba(124,124,124,0.20)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[15px] space-y-[10px] flex flex-col items-center'>
                  <p className="text-center text-white font-['Space_Grotesk'] font-bold not-italic text-[26px] leading-[34px] desktop:text-[38px] desktop:leading-[48px]">
                    Save up to 25%
                  </p>
                  <p className='text-center text-white font-normal text-[20px] leading-[27px] desktop:text-[26px] desktop:leading-[34px]'>
                    on your next flight booking
                  </p>

                  <button className='bg-primary-colour px-[50px] py-[25px] rounded-[40px]'>
                    <span className='text-white font-inter font-medium not-italic text-[18px] leading-[24px] md:text-[20px] md:leading-[27px]'>
                        Book flight
                    </span>
                  </button>
                </div>
            </CarouselContent>
        </TravelCarousel>
      </div>
      
    </section>
  );
};