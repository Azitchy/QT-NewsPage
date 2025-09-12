import { Button } from "../../../components/ui/button";

export const CommunitySection = () => {
  return (
    <div className="relative w-full px-4 lg:px-0">
      <div className="relative h-[99px] ml-0 lg:ml-[71px]">
        <div className="left-10 absolute h-11 top-[27px] lg:left-[49px] font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] whitespace-nowrap [font-style:var(--titles-h2-sectionheading-400-font-style)]">
          COMMUNITY
        </div>
        <img
          className="w-[99px] h-[99px] absolute top-0 left-0"
          alt="Dots"
          src="/dots-1.svg"
        />
      </div>

      <div className="flex flex-col w-full max-w-[1316px] h-auto lg:h-[287px] items-center gap-5 mx-auto mt-6 md:px-4">
        <div className="relative self-stretch mt-[-1.00px] font-titles-h5-large-text-400 font-[number:var(--titles-h5-large-text-400-font-weight)] text-[#1c1c1c] dark:text-[#DCDCDC] text-[20px] lg:text-[length:var(--titles-h5-large-text-400-font-size)] text-center tracking-[var(--titles-h5-large-text-400-letter-spacing)] leading-[30px] lg:leading-[var(--titles-h5-large-text-400-line-height)] [font-style:var(--titles-h5-large-text-400-font-style)]">
          Unleash your influence
        </div>

        <div className="relative w-full [font-family:'Space_Grotesk',Helvetica] font-[number:var(--body-body1-300-font-weight)] text-[#1c1c1c] dark:text-gray-400 text-[26px] lg:text-[38px] text-center tracking-[var(--body-body1-300-letter-spacing)] leading-[34px] lg:leading-[48px] [font-style:var(--body-body1-300-font-style)]">
          Your voice holds power –{" "}
          <span className="bg-[linear-gradient(136deg,#AADA5D_0%,#0DAEB9_98.28%)] font-extrabold bg-clip-text text-transparent">
            become a part of our vibrant community
          </span>
          ,{" "}
          <span className="bg-[linear-gradient(136deg,#AADA5D_0%,#0DAEB9_98.28%)] font-extrabold  bg-clip-text text-transparent">
            make your mark
          </span>
          , and lead the way to a groundbreaking tomorrow.
        </div>

        <div className="text-[18px] text-center lg:text-[20px] max-w-[750px] font-light text-[#4f5555] [font-family:'Inter',Helvetica] dark:text-[#DCDCDC] leading-6">
          Step into a world where your influence matters. Be a Key Opinion
          Leader (KOL) who shapes the future of ATM Innovation
        </div>

        <Button className="bg-[#2EA8AF] rounded-[30px] px-[15px] py-[12px] md:px-5 md:py-6 z-20">
          <a href="#">
            <span className="font-body-body3-400 font-[number:var(--body-body3-400-font-weight)] text-white text-[14px] md:text-[length:var(--body-body3-400-font-size)] tracking-[var(--body-body3-400-letter-spacing)] leading-[var(--body-body3-400-line-height)] whitespace-nowrap [font-style:var(--body-body3-400-font-style)]">
              Become KOL today
            </span>
          </a>
        </Button>
      </div>

      <div className="hidden lg:block absolute w-[344px] h-[781px] top-[-46px] left-[252px] rotate-[-60deg] blur-[22.5px] opacity-10">
        <div className="relative w-[516px] h-[937px] top-[-58px] left-[-72px]">
          <img
            className="w-[272px] h-[271px] top-[376px] left-[55px] absolute rotate-[60deg]"
            alt="Vector"
            src="/vector-1.svg"
          />
          <img
            className="w-[313px] h-[311px] top-[568px] left-[147px] absolute rotate-[60deg]"
            alt="Vector"
            src="/vector-3.svg"
          />
          <img
            className="w-[183px] h-[182px] top-[34px] left-[102px] absolute rotate-[60deg]"
            alt="Vector"
            src="/vector-5.svg"
          />
          <img
            className="w-[228px] h-[229px] top-[180px] left-[42px] absolute rotate-[60deg]"
            alt="Vector"
            src="/vector.svg"
          />
        </div>
      </div>
    </div>
  );
};
