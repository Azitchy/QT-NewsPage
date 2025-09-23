import travelHero1 from '/travel-hero1.png'
import travelHero2 from '/travel-hero2.png'
import travelHero3 from '/travel-hero3.png'
import TravelCarousel, { CarouselContent } from './TravelCarousel'

export const HeroSection = (): JSX.Element => {
  const travelImages = [
    travelHero1,
    travelHero2,
    travelHero3,
  ]
  return (
    <section className="">
        {/* Hero Section */}
        <TravelCarousel images={travelImages}
        className='max-h-[175px] md:max-h-[300px] xl:max-h-[400px] xl:max-h-[450px]'
        >
            <CarouselContent className='px-[15px] md:px-[60px] xl:px-[70px] large:px-[273px]'>
                <h1 className='text-[#CDFAFF] font-bold uppercase text-[50px] leading-[45px] xl:text-[150px] xl:leading-[160px] xl:text-[150px] xl:leading-[160px]'>
                    LUCA.TRAVEL
                </h1>
            </CarouselContent>
        </TravelCarousel>

    </section>
  );
};