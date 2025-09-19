import { HeadingWithDots } from "@/components/HeadingWithDots";
import { Share2 } from "lucide-react";

export const MessagingPlatformSection = (): JSX.Element => {

    return (
      <section className="pt-[60px] desktop:pt-[100px]">
        <HeadingWithDots text="messaging platform" />
        <div className="pt-[20px] flex flex-col desktop:flex-row items-start justify-center desktop:gap-[50px] max-w-[1454px] mx-auto">

            {/* Content */}
            <div className="flex flex-col w-full desktop:w-[702px] items-start gap-[20px] order-2">
                    {/* Badge */}
                <div className="flex items-center w-fit gap-[8px] px-[10px] py-[5px] bg-primary-foreground rounded-[30px] border border-solid border-primary-colour backdrop-blur-md">
                    <Share2 className="w-[18px] h-[18px] text-primary-colour"/>
                    <span className="text-primary text-[12px] font-normal leading-[17px]">
                        Connect
                    </span>
                </div>

                {/* Content */}
                <p className="font-normal text-[16px] leading-[22px] desktop:text-[18px] desktop:leading-[24px]">
                    Coming Soon
                    <br></br> <br></br>
                    Our messaging platform fosters vibrant discussions within the ATM community. 
                    Whether you're a seasoned enthusiast or a newcomer, connect, share insights, and stay updated on trends.
                     Create custom chatrooms, join existing ones, or engage in direct messaging. 
                     Stay informed, exchange ideas, and build connections.
                </p>
              
            </div>

            {/* A-Team Image */}
            <div className="mb-[50px] desktop:mb-0 desktop:flex-shrink-0 w-full desktop:w-fit order-1">
                <img
                    src="/messaging-img.png"
                    alt="A-Team"
                    className="w-full h-[300px] desktop:h-[370px] object-cover rounded-3xl"
                />
            </div>
        </div>
      </section>        
    )
}