import { AvatarTabs } from "../AvatarSection/AvatarTabs";
import { AvatarContent } from "../AvatarSection/AvatarContent";
import { LucaRewardsSection } from "../LucaRewardsSection/LucaRewardsSection";
import { ATeamSection } from "../ATeamSection";
import { MessagingPlatformSection } from "../MessagingPlatformSection";
import { SocialPlatformSection } from "../SocialPlatformSection";
import { AutonomyProposalSection } from "../AutonomyProposalSection/AutonomyProposalSection";
import { ProposalDecisionSection } from "../ProposalDecisionSection/ProposalDecisionSection";
import { CommunityFoundationSection } from "../CommunityFoundationSection/CommunityFoundationSection";

export const ContentSection = (): JSX.Element => {
  // Avatar cards data
  const avatarCards = [
    {
      className:
        "w-[154px] h-[153px] top-[363px] left-[567px] bg-[url(/avatars-default.png)]",
    },
    {
      className:
        "w-[156px] h-[155px] top-[389px] left-[1108px] bg-[url(/avatars-default-1.png)]",
    },
    {
      className:
        "w-[89px] h-[89px] top-[459px] left-[184px] bg-[url(/avatars-default-2.png)]",
    },
    {
      className:
        "w-[121px] h-[121px] top-[689px] left-[849px] bg-[url(/avatars-default-3.png)]",
    },
    {
      className:
        "w-[101px] h-[101px] top-[621px] left-[1444px] bg-[url(/avatars-default-4.png)]",
    },
    {
      className:
        "w-[107px] h-[107px] top-[605px] left-[452px] bg-[url(/avatars-default-5.png)]",
    },
    {
      className:
        "w-[132px] h-[132px] top-[307px] left-[799px] bg-[url(/avatars-default-6.png)]",
    },
  ];

  return (
    <section className="px-[16px] md:px-[70px] large:px-[120px] py-[60px]">
      <AvatarContent />

      {/* Avatars Gallery Section */}
      {/* <div className="relative w-full h-[680px]">
        <div className="relative w-full h-[1117px]">
          {avatarCards.map((card, index) => (
            <div
              key={index}
              className={`absolute rounded-2xl shadow-shadow-card bg-[100%_100%] ${card.className}`}
            />
          ))}

          <div className="inline-flex items-center gap-2.5 absolute top-[602px] left-[799px] rounded-[30px]">
            <span className="relative w-fit font-body-body-4-400 font-[number:var(--body-body-4-400-font-weight)] text-primary-colour text-[length:var(--body-body-4-400-font-size)] tracking-[var(--body-body-4-400-letter-spacing)] leading-[var(--body-body-4-400-line-height)] whitespace-nowrap [font-style:var(--body-body-4-400-font-style)]">
              Watch video
            </span>
            <div className="relative w-[38.53px] h-[38.53px]">
              <div className="relative w-[22px] h-[22px] top-2 left-2 rounded-[11px]">
                <div className="absolute w-[22px] h-[22px] top-0 left-0 bg-[#e9f6f7] rounded-[11px] rotate-180 opacity-10" />
                <img
                  className="absolute w-[15px] h-[15px] top-1 left-1.5"
                  alt="Polygon"
                  src="/polygon-3.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}

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
