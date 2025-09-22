import { HeadingWithDots } from "@/components/HeadingWithDots";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const ProposalDecisionSection = (): JSX.Element => {

    return (
      <section className="pt-[60px] xl:pt-[100px]">
        <HeadingWithDots text="proposal & decision" />
        <div className="pt-[20px] px-0 tablet:px-[77px] xl:px-[134px] large:px-[203px]">

          <div className="flex flex-col xl:items-end xl:flex-row">

            <div className="flex flex-col items-start gap-[20px] order-2 xl:order-1">
              <Card className="max-w-[785px] p-[20px] bg-card rounded-[10px] border border-solid border-[#eeeeee] shadow-soft-shadow">
                <CardContent className="flex flex-col gap-[20px] p-0">
                  <h3 className="text-foreground font-medium text-[18px] leading-[24px] xl:text-[20px] xl:leading-[27px]">
                    New Year's Celebration Rewarding 2025
                  </h3>
                  <p className="text-foreground font-normal text-[16px] leading-[22px] xl:text-[18px] xl:leading-[24px]">
                      Community Funds need to be unlocked, 540,000 LUCA, to reward those who contributed to build ATM community. 
                      The funds will be refunded after the activity is completed.
                  </p>
                  <p className="font-normal font-[Inter] text-[12px] leading-[17px]">
                    08/02/2025, 13:45:21 - 13/02/2025, 13:45:21
                  </p>
                  <div className="flex gap-[15px] items-center">
                    <Button variant="ghost" className="pointer-events-none py-[10px] px-[18px] text-center font-normal font-[Inter] text-[14px] leading-[19px]">
                      Ended
                    </Button>
                    <Button variant="ghost" className="inline-flex items-center gap-2.5 p-0 rounded-[30px] hover:bg-transparent">
                      <span className="text-primary font-inter"> View Proposal </span>
                      <div className="w-[38px] h-[38px] flex items-center justify-center">
                        <img className="w-[33px] h-[33px]" alt="Arrow right icon" src="/arrow-right-icon.svg" />
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <img
              src="/proposal-img.png"
              alt="Hands Clapping"
              className="opacity-40 order-1 xl:order-2 w-[392px] h-[135px] xl:max-w-[546px] xl:max-h-[173px]"
            />
          </div>

            <Button variant="ghost" className="mt-[20px] inline-flex items-center gap-2.5 p-0 rounded-[30px] hover:bg-transparent">
              <span className="text-primary"> View all </span>
              <div className="w-[38px] h-[38px] flex items-center justify-center">
                <img className="w-[33px] h-[33px]" alt="Arrow right icon" src="/arrow-right-icon.svg" />
              </div>
            </Button>
        </div>

      </section>        
    )
}