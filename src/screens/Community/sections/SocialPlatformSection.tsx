import { HeadingWithDots } from "@/components/HeadingWithDots";
import { Share2 } from "lucide-react";

export const SocialPlatformSection = (): JSX.Element => {

    return (
      <section className="pt-[60px] desktop:pt-[100px]">
        <HeadingWithDots text="social platform" />
        <div className="pt-[20px] flex flex-col desktop:flex-row items-start justify-center desktop:gap-[50px] max-w-[1454px] mx-auto">

            {/* Content */}
            <div className="flex flex-col w-full desktop:w-[702px] items-start gap-[20px] order-2 desktop:order-1">
                    {/* Badge */}
                <div className="flex items-center w-fit gap-[8px] px-[10px] py-[5px] bg-primary-foreground rounded-[30px] border border-solid border-primary-colour backdrop-blur-md">
                    <Share2 className="w-[18px] h-[18px] text-primary-colour"/>
                    <span className="text-primary font-inter text-[12px] font-normal leading-[17px]">
                        Connect
                    </span>
                </div>

                {/* Content */}
                <p className="font-normal text-[16px] leading-[22px] desktop:text-[18px] desktop:leading-[24px]">
                    Coming Soon
                    <br></br> <br></br>
                    Our platform is a dynamic hub for members to share news, posts, and insights, 
                    fostering engaging discussions on topics relevant to the ATM ecosystem. 
                    Stay updated, interact with enthusiasts, and forge connections in a seamless, intuitive space. 
                    Customise your experience with interactive tools for a personalised social experience.
                </p>
              
            </div>

            {/* A-Team Image */}
            <div className="mb-[50px] desktop:mb-0 desktop:flex-shrink-0 w-full desktop:w-fit order-1 desktop:order-2">
                <img
                    src="/socialplatform-img.png"
                    alt="A-Team"
                    className="w-full h-[300px] desktop:h-[370px] object-cover rounded-3xl"
                />
            </div>
        </div>
      </section>        
    )
}