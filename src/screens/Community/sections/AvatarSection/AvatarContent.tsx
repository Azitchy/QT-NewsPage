import { HeadingWithDots } from "@/components/HeadingWithDots";
import { Button } from "@/components/ui/button";

export const AvatarContent = (): JSX.Element => {

    return (
      <section>
        <HeadingWithDots text="ai avatars" />
        <div className="px-0 tablet:px-[77px] desktop:px-[134px] large:px-[203px]">
            <p className="pt-[20px] pb-[40px] font-light text-[18px] leading-[24px] desktop:text-[20px] desktop:leading-[27px] tablet:max-w-[516px] 
                desktop:max-w-[782px]">
                In our ATM community, we're transforming the way we interact with AI. Imagine a world where humans and AI coexist seamlessly,{" "}
                <span className="font-medium">
                    blurring boundaries and enriching every interaction. Our innovative AI technology brings this vision to life, 
                    creating a vibrant and dynamic community where the possibilities are endless.                
                </span>
            </p>

            <div className="flex flex-col desktop:flex-row justify-center desktop:justify-start desktop:gap-[150px]">
                <div className="flex flex-col w-full desktop:w-[702px] items-start gap-[20px] order-2 desktop:order-1">
                    {/* Badge */}
                    <div className="flex items-center justify-center w-fit gap-[8px] px-[10px] py-[5px] bg-[#f9f2ff] rounded-[30px] border border-solid border-[#8e1bf4] backdrop-blur-md">
                        <img
                            className="w-[18px] h-[18px]"
                            alt="Face icon"
                            src="/face_icon.svg"
                        />
                        <span className="text-[#8E1BF4] font-inter text-[12px] font-normal leading-[17px]">
                            AVATARS
                        </span>
                    </div>

                    {/* Content */}
                    <p className="font-normal text-[16px] leading-[22px] desktop:text-[18px] desktop:leading-[24px]">
                        Meet Lucy, your next-generation conversational agent, expertly trained to respond to your queries with ease. 
                        Curious about LUCA, ATM-Rank, or Consensus Connections?
                        <br></br> <br></br>
                        Lucy has you covered. With advanced natural language processing, she recognises your intent and delivers accurate information. 
                        Experience the convenience of Lucy as she expertly guides you through ATM.
                    </p>

                    <Button className="inline-flex items-center justify-center gap-[5px] px-5 py-3 bg-primary rounded-[30px] hover:bg-[#A2DEE2]">
                        <span className="text-white font-sans text-[14px] leading-[19px] font-normal desktop:text-[16px] desktop:leading-[24px]">
                            Chat with Lucy 
                        </span>
                    </Button>
                
                </div>
                
                <div className="relative w-[370px] h-[370px] mx-auto desktop:mx-0 order-1 desktop:order-2">
                    {/* Lucy Logo */}
                    <img
                        className="w-full h-full object-contain"
                        alt="Lucy Logo"
                        src="/lucy-logo.png"
                    />

                    {/* Hi Lucy GIF */}
                    <img
                        className="absolute top-4 -right-[140px] object-contain"
                        alt="Hi Lucy GIF"
                        src="/hi-lucy.gif"
                    />
                    </div>
            </div>
        </div>
      </section>        
    )
}