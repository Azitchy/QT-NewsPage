import { StasSection } from "../StasSection";
import { DescriptionSection } from "../DescriptionSection";
import { TagLineSection } from "../TagLineSection";
import { FeaturesSection } from "../FeaturesSection";
import { CommunitySection } from "../CommunitySection";
import { EcosystemSection } from "../EcosystemSection";
import { LatestNewsSection } from "../LatestNewsSection";
import { LetsConnectSection } from "../LetsConnectSection";

export const ContentSection = (): JSX.Element => {
  return (
    <section className="flex flex-col w-full items-start gap-16 lg:gap-[100px] mt-16 lg:mt-[10px] px-1 sm:px-6 lg:px-0">
      <StasSection />
      <DescriptionSection />
      <TagLineSection />
      <FeaturesSection />
      <CommunitySection />
      <EcosystemSection />
      <LatestNewsSection />
      <LetsConnectSection />
    </section>
  );
};
