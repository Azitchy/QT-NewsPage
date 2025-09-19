import { HeadingWithDots } from "@/components/HeadingWithDots";
import { CourseCarousel } from "./CourseCarousel";

export const UsageGuideSection = (): JSX.Element => {
    const content = {
        text: "If you are a new user of ATM and want to get a better understanding of the technology, we offer a series of tutorials on our core applications and functions. From the basic concepts and white paper explanations to more in-depth application operations, our goal is to give you a more comprehensive understanding of ATM.",
    };

    return (
      <section className="px-[16px] md:px-[70px] large:px-[120px]">
        <HeadingWithDots text="usage guide" />
        <div className="px-0 tablet:px-[77px] desktop:px-[134px] large:px-[203px]">
            <p className="py-[20px] font-light font-body text-[18px] leading-[24px] desktop:text-[20px] desktop:leading-[27px] tablet:max-w-[516px] 
                desktop:max-w-[782px]">
                {content.text}
            </p>
        </div>
        <CourseCarousel />
      </section>        
    )
}