import { HeadingWithDots } from "@/components/HeadingWithDots";
import { Button } from "@/components/ui/button";

export const AvatarContent = (): JSX.Element => {
  return (
    <section>
      <HeadingWithDots text="ai avatars" />
      <div className="px-0 tablet:px-[77px] xl:px-[134px] large:px-[203px]">
        <p
          className="pt-[20px] pb-[40px] font-light text-[18px] leading-[24px] 
            xl:text-[20px] xl:leading-[27px] tablet:max-w-[516px] xl:max-w-[782px]"
        >
          In our ATM community, we're transforming the way we interact with AI.
          Imagine a world where humans and AI coexist seamlessly,{" "}
          <span className="font-medium">
            blurring boundaries and enriching every interaction. Our innovative
            AI technology brings this vision to life, creating a vibrant and
            dynamic community where the possibilities are endless.
          </span>
        </p>

        <div className="flex flex-col xl:flex-row justify-center xl:justify-start xl:gap-[150px]">
          <div className="flex flex-col w-full xl:w-[702px] items-start gap-[20px] order-2 xl:order-1">
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
            <p className="font-normal text-[16px] leading-[22px] xl:text-[18px] xl:leading-[24px]">
              Meet Lucy, your next-generation conversational agent, expertly
              trained to respond to your queries with ease. Curious about LUCA,
              ATM-Rank, or Consensus Connections?
              <br />
              <br />
              Lucy has you covered. With advanced natural language processing,
              she recognises your intent and delivers accurate information.
              Experience the convenience of Lucy as she expertly guides you
              through ATM.
            </p>

            <Button className="inline-flex items-center justify-center gap-[5px] px-5 py-3 bg-primary rounded-[30px] hover:bg-[#A2DEE2]">
              <span className="text-white font-sans text-[14px] leading-[19px] font-normal xl:text-[16px] xl:leading-[24px]">
                Chat with Lucy
              </span>
            </Button>
          </div>

          <div className="relative w-[220px] h-[220px] sm:w-[370px] sm:h-[370px] mx-auto xl:mx-0 order-1 xl:order-2">
            {/* Lucy Logo */}
            <img
              className="w-full h-full object-contain"
              alt="Lucy Logo"
              src="/lucy-logo.png"
            />

            {/* Hi Lucy GIF */}
            <img
              className="absolute top-1 -right-[80px] sm:top-4 sm:-right-[140px] object-contain"
              alt="Hi Lucy GIF"
              src="/hi-lucy.gif"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
