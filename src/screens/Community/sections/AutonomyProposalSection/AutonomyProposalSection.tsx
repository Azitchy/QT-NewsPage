import { HeadingWithDots } from "@/components/HeadingWithDots";
import { Card, CardContent } from "@/components/ui/card";
import ProposalsDisplay from "./ProposalsDisplay";
import { useTranslation } from "react-i18next";

export const AutonomyProposalSection = (): JSX.Element => {
    const { t } = useTranslation("community");

    return (
      <section className="pt-[60px] xl:pt-[100px]">
        <HeadingWithDots text={t("automonyProposalSection.heading")} />
        <div className="px-0 tablet:px-[77px] xl:px-[134px] large:px-[203px]">
            <p className="pt-[20px] pb-[40px] font-light text-[18px] leading-[24px] xl:text-[20px] xl:leading-[27px] tablet:max-w-[500px] 
                xl:max-w-[740px] large:max-w-[1160px]">
                {t("automonyProposalSection.paragraph.text1")}{" "}
                <span className="font-medium">
                    {t("automonyProposalSection.paragraph.boldText")}{" "}          
                </span>
                 {t("automonyProposalSection.paragraph.text2")}
            </p>

            {/* Proposal Section */}
            <div className="mt-[40px] deskttop:mt-[90px] flex flex-col items-center">
                <h5 className="text-center font-normal text-[20px] leading-[27px] xl:text-[26px] xl:leading-[34px]">
                    {t("automonyProposalSection.proposalSection.heading")}
                </h5>
                <p className="text-card-foreground text-[12px] font-normal leading-[17px]">
                    {t("automonyProposalSection.proposalSection.subText")}
                </p>

                <ProposalsDisplay />

                <Card className="flex max-w-[515px] items-center gap-2.5 px-2.5 py-3 rounded-[10px] bg-transparent border border-primary">
                    <CardContent className="flex items-start gap-2.5 p-0 flex-1">
                        <img className="w-6 h-6" alt="Tip icon" src="/light-bulb.svg" />
                        <p className="text-primary text-[12px] font-normal leading-[17px]">
                            {t("automonyProposalSection.proposalSection.tip")}
                        </p>
                    </CardContent>
                </Card>

            </div>

        </div>
      </section>        
    )
}