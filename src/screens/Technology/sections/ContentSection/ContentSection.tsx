import { ResourcesSection } from "../ResourcesSection/ResourcesSection";
import { CommunitySection } from "../CommunitySection/CommunitySection";
import { PrAlgorithmSection } from "../PrAlgorithmSection/PrAlgorithmSection";
import { AutonomySection } from "../AutonomySection/AutonomySection";
import { TechnologySection } from "../TechnologySection/TechnologySection";
import { ContractsCarousel } from "../TechnologySection/ContractsCarousel";

export const ContentSection = (): JSX.Element => {
  return (
    <section className="py-[60px]">
        <ResourcesSection/>
      <div className="w-full mx-auto max-w-[1600px] px-[16px] md:px-[70px] large:px-[120px]">
        <CommunitySection/>
        <PrAlgorithmSection/>

        <AutonomySection/>
        <TechnologySection/>
      </div>
      <ContractsCarousel/>
    </section>
  );
};