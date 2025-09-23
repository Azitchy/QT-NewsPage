import { HeadingWithDots } from "@/components/HeadingWithDots";
import { Button } from "@/components/ui/button";

export const TechnologySection = (): JSX.Element => {
  return (
    <section className="pt-[60px] tablet:pt-[100px]">
        {/* Technology Heading */}
        <HeadingWithDots text="the technology" />

      <div className="px-0 tablet:px-[77px] xl:px-[134px] large:px-[203px]">

        {/* System Integration Section */}
        <div className="flex flex-col tablet:flex-row gap-[60px] tablet:gap-[80px] mt-8 tablet:mt-12 items-start">
          {/* Tech Image */}
          <img
            src="/tech-img.png"
            alt="Technology illustration"
            className="w-[269px] h-[300px] rounded-lg object-cover flex-shrink-0 mx-auto tablet:mx-0 order-2 tablet:order-1"
          />

          {/* Text Content */}
          <div className="flex-1 space-y-5 max-w-[954px] order-1 tablet:order-2">
            <h2 className="text-[20px] leading-[27px] font-normal xl:text-[26px] xl:leading-[34px] xl:font-normal">
              System integration
            </h2>
            <p className="text-[16px] leading-[22px] font-light xl:text-[18px] xl:leading-[24px] xl:font-normal">
              Through system integration, our platform leverages the revolutionary ATMRank algorithm, inspired by the groundbreaking PageRank. 
              The Lucy AI system and ATMRank together form the backbone of our ecosystem.
            </p>
            <p className="text-[16px] leading-[22px] font-light xl:text-[18px] xl:leading-[24px] xl:font-normal">
              Every cryptocurrency can join our platform after receiving community endorsement through a democratic vote. 
              Once integrated, the ATMRank algorithm processes the data in real-time and writes the valuation results into the smart contract. 
              Each cryptocurrency can also tailor its own reward system algorithm, seamlessly facilitated by Lucy. 
              This integration ensures continuous refinement and elevation of the ATMRank system, keeping it at the forefront of crypto valuation.
            </p>
            {/* Learn More Button */}
            <Button
              asChild
              variant="ghost"
              className="inline-flex items-center gap-2.5 p-0 rounded-[30px] hover:bg-transparent"
            >
              <a
                href="https://en.wikipedia.org/wiki/PageRank"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-primary">Learn more</span>
                <div className="w-[38px] h-[38px] flex items-center justify-center">
                  <img
                    className="w-[33px] h-[33px]"
                    alt="Arrow right icon"
                    src="/arrow-right-icon.svg"
                  />
                </div>
              </a>
            </Button>
          </div>
        </div>

        {/* Smart Contracts Section */}
        <div className="max-w-[783px] mt-[60px]">
          <div className="space-y-5">
            <h2 className="text-[20px] leading-[27px] font-normal xl:text-[26px] xl:leading-[34px] xl:font-normal">
              Our smart contracts
            </h2>
            <p className="text-[16px] leading-[22px] font-normal xl:text-[18px] xl:leading-[24px]">
              Consensus Contracts are the underlying technical feature of ATM. By using these contracts a connection can be established between users a relative consensus network can emerge.
              <br />
              <br />
              ATM also includes the following smart contracts:
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
