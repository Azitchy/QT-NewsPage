import { HeadingWithDots } from "@/components/HeadingWithDots";
import { StyledLink } from "@/components/StyledLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export const ProposalDecisionSection = (): JSX.Element => {
  const { t } = useTranslation("community");

    return (
      <section className="pt-[60px] xl:pt-[100px]">
        <HeadingWithDots text={t("proposalDecisionSection.heading")} />
        <div className="pt-[20px] px-0 tablet:px-[77px] xl:px-[134px] large:px-[203px]">

          <div className="flex flex-col xl:items-end xl:flex-row mb-[20px]">

            <div className="flex flex-col items-start gap-[20px] order-2 xl:order-1 dark:border-gradient rounded-[10px]">
              <Card className="max-w-[785px] p-[20px] bg-card rounded-[10px] border border-border shadow-soft-shadow">
                <CardContent className="flex flex-col gap-[20px] p-0">
                  <h3 className="text-foreground font-medium text-[18px] leading-[24px] xl:text-[20px] xl:leading-[27px]">
                    {t("proposalDecisionSection.title")}
                  </h3>
                  <p className="text-foreground font-normal text-[16px] leading-[22px] xl:text-[18px] xl:leading-[24px]">
                      {t("proposalDecisionSection.description")}
                  </p>
                  <p className="font-normal font-[Inter] text-[12px] leading-[17px]">
                    08/02/2025, 13:45:21 - 13/02/2025, 13:45:21
                  </p>
                  <div className="flex gap-[15px] items-center">
                    <Button variant="ghost" className="pointer-events-none py-[10px] px-[18px] text-center font-normal font-[Inter] text-[14px] leading-[19px]">
                      {t("proposalDecisionSection.ended")}
                    </Button>
                    
                    <StyledLink text={t("proposalDecisionSection.viewButton")} link="/webapp" />
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

            <StyledLink text={t("proposalDecisionSection.viewAllButton")} link="/webapp" />
        </div>

      </section>        
    )
}