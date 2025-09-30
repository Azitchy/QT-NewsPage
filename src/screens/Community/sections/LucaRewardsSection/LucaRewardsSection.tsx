import { HeadingWithDots } from "@/components/HeadingWithDots";

export const LucaRewardsSection = (): JSX.Element => {
  return (
    <section id="rewards" className="relative pt-[60px] xl:pt-[100px]">
      {/* Background image*/}
      <img
        src="/luca-bg.svg"
        alt="Decorative background"
        className="hidden xl:block absolute right-1/4 translate-x-1/4 h-[365px] opacity-15 z-0 pointer-events-none"
      />

      <div className="relative z-10">
        <HeadingWithDots text="luca rewards" />
        <div className="px-0 tablet:px-[77px] xl:px-[134px] large:px-[203px] flex flex-col md:flex-row items-center tablet:gap-[50px]">
          <p
            className="pt-[20px] pb-[40px] font-light text-[18px] leading-[24px] xl:text-[20px] xl:leading-[27px] tablet:max-w-[516px] 
              xl:max-w-[782px]"
          >
            Earn LUCA rewards through consensus connections and staking with
            LUCA, the native cryptocurrency of ATM.{" "}
            <span className="font-medium">
              Dive into our rewarding ecosystem where 85% of daily issuance is
              dedicated to consensus connection rewards, distributed based on
              your PR values. The remaining 15% is for staking rewards, with top
              users qualifying for issuance.
            </span>
          </p>
          <img
            className="w-[285px] xl:w-[406px] h-[178px] xl:h-[254px] object-contain mx-auto tablet:mx-0"
            alt="LUCA Rewards Illustration"
            src="/luca-rewards.png"
          />
        </div>
      </div>
    </section>
  );
};
