import { HeadingWithDots } from "@/components/HeadingWithDots";
import { Button } from "@/components/ui/button";

export const ATeamSection = (): JSX.Element => {

    return (
      <section className="pt-[60px] desktop:pt-[100px]">
        <HeadingWithDots text="a-team" />
        <div className="pt-[20px] flex flex-col desktop:flex-row items-start justify-center desktop:gap-[50px] max-w-[1454px] mx-auto">

            {/* Content */}
            <div className="flex flex-col w-full desktop:w-[702px] items-start gap-[20px] order-2 desktop:order-1">
                    {/* Badge */}
                <div className="flex items-center w-fit gap-[8px] px-[10px] py-[5px] bg-[#f9f2ff] rounded-[30px] border border-solid border-[#8e1bf4] backdrop-blur-md">
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
                    A financial expert team for Researchers, Journalists, and Business Consultants.
                    Whether exploring, working on projects, or making critical decisions, our AI agents assist you every step of the way.
                    <br></br> <br></br>
                    The Innovation Oracle offers a comprehensive, personalised overview.
                    Experience the power of our AI agents today and unlock new possibilities!
                </p>

                <Button className="inline-flex items-center justify-center gap-[5px] px-5 py-3 bg-primary rounded-[30px] hover:bg-[#A2DEE2]">
                    <span className="text-white font-sans text-[14px] leading-[19px] font-normal desktop:text-[16px] desktop:leading-[24px]">
                        Chat with multi-agents
                    </span>
                </Button>                
            </div>

            {/* A-Team Image */}
            <div className="mb-[50px] desktop:mb-0 desktop:flex-shrink-0 w-full desktop:w-fit order-1 desktop:order-2">
                <img
                    src="/ateam-img.png"
                    alt="A-Team"
                    className="w-full h-[300px] desktop:h-[370px] object-cover rounded-3xl"
                />
            </div>
        </div>
      </section>        
    )
}