import { HeadingWithDots } from "@/components/HeadingWithDots";
import { Card, CardContent } from "@/components/ui/card";
import ProposalsDisplay from "./ProposalsDisplay";

export const AutonomyProposalSection = (): JSX.Element => {

    return (
      <section className="pt-[60px] desktop:pt-[100px]">
        <HeadingWithDots text="autonomy proposal" />
        <div className="px-0 tablet:px-[77px] desktop:px-[134px] large:px-[203px]">
            <p className="pt-[20px] pb-[40px] font-light text-[18px] leading-[24px] desktop:text-[20px] desktop:leading-[27px] tablet:max-w-[500px] 
                desktop:max-w-[740px] large:max-w-[1160px]">
                ATM is a decentralised distribution mechanism. 
                This means that users need to manage it as a community to allow it to continuously evolve and stay relevant.{" "}
                <span className="font-medium">
                    We hope that this should offer stability when the economic environment changes unpredictably around us.{" "}          
                </span>
                 In short, the community manages the ATM functions, algorithms and technical architectures by voting on proposed changes.
            </p>

            {/* Proposal Section */}
            <div className="mt-[40px] deskttop:mt-[90px] flex flex-col items-center">
                <h5 className="text-center font-normal text-[20px] leading-[27px] desktop:text-[26px] desktop:leading-[34px]">
                    Different proposals are passed under diffferent conditions 
                </h5>
                <p className="text-card-foreground text-[12px] font-normal leading-[17px]">
                    Tap numbers to view 2 proposal modes
                </p>

                <ProposalsDisplay />

                <Card className="flex max-w-[515px] items-center gap-2.5 px-2.5 py-3 rounded-[10px] bg-transparent border border-primary">
                    <CardContent className="flex items-start gap-2.5 p-0 flex-1">
                        <img className="w-6 h-6" alt="Tip icon" src="/light-bulb.svg" />
                        <p className="text-primary text-[12px] font-normal leading-[17px]">
                            AGT stands for ATM Governance Token. When users establish a
                            consensus connection with LUCA, they become eligible to receive
                            AGT distributed by the ATM.
                            </p>
                    </CardContent>
                </Card>

            </div>

        </div>
      </section>        
    )
}