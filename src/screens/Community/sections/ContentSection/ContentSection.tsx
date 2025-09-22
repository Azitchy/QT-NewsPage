import { AvatarTabs } from "../AvatarSection/AvatarTabs";
import { AvatarContent } from "../AvatarSection/AvatarContent";
import { LucaRewardsSection } from "../LucaRewardsSection/LucaRewardsSection";
import { ATeamSection } from "../ATeamSection";
import { MessagingPlatformSection } from "../MessagingPlatformSection";
import { SocialPlatformSection } from "../SocialPlatformSection";
import { AutonomyProposalSection } from "../AutonomyProposalSection/AutonomyProposalSection";
import { ProposalDecisionSection } from "../ProposalDecisionSection/ProposalDecisionSection";
import { CommunityFoundationSection } from "../CommunityFoundationSection/CommunityFoundationSection";
import { AvatarGallery } from "../AvatarSection/AvatarGallery";

export const ContentSection = (): JSX.Element => {
  return (
    <section className="px-[16px] md:px-[70px] large:px-[120px] py-[60px]">
      <AvatarContent />
      <AvatarGallery />
      <AvatarTabs />

      <LucaRewardsSection />

      <ATeamSection />
      <MessagingPlatformSection />
      <SocialPlatformSection />

      <AutonomyProposalSection />

      <ProposalDecisionSection />

      <CommunityFoundationSection />
    </section>
  );
};
