import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "../../../../components/ui/toggle-group";

export const ContentSection = (): JSX.Element => {
  // Section data for AI Avatars
  const aiAvatarsData = {
    title: "ai AVATARS",
    badge: "AVATARS",
    description: [
      "Meet Lucy, your next-generation conversational agent, expertly trained to respond to your queries with ease. Curious about LUCA, ATM-Rank, or Consensus Connections?",
      "Lucy has you covered. With advanced natural language processing, she recognises your intent and delivers accurate information. Experience the convenience of Lucy as she expertly guides you through ATM.",
    ],
    buttonText: "Chat with Lucy",
    introText:
      "In our ATM community, we're transforming the way we interact with AI. Imagine a world where humans and AI coexist seamlessly, blurring boundaries and enriching every interaction. Our innovative AI technology brings this vision to life, creating a vibrant and dynamic community where the possibilities are endless.",
  };

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

  // Section data for What is AVATAR
  const whatIsAvatarData = {
    title: "What is AVATAR?",
    description:
      "AVATARS redefine digital presence by extending your consciousness and enhancing your abilities in the virtual realm. They go beyond mere assistants, representing the various facets of your life - from professional to personal spheres.",
  };

  // Toggle items for avatar section
  const toggleItems = ["About", "Create", "Train", "Share"];

  // Section data for LUCA Rewards
  const lucaRewardsData = {
    title: "luca rewards",
    description:
      "Earn LUCA rewards through consensus connections and staking with LUCA, the native cryptocurrency of ATM. Dive into our rewarding ecosystem where 85% of daily issuance is dedicated to consensus connection rewards, distributed based on your PR values. The remaining 15% is for staking rewards, with top users qualifying for issuance.",
  };

  // Section data for A-Team
  const aTeamData = {
    title: "a-team",
    badge: "AVATARS",
    description: [
      "A financial expert team for Researchers, Journalists, and Business Consultants. Whether exploring, working on projects, or making critical decisions, our AI agents assist you every step of the way.",
      "The Innovation Oracle offers a comprehensive, personalised overview. Experience the power of our AI agents today and unlock new possibilities!",
    ],
    buttonText: "Chat with multi-agents",
  };

  // Section data for Messaging Platform
  const messagingPlatformData = {
    title: "messaging platform",
    badge: "Connect",
    description: [
      "Coming soon",
      "Our messaging platform fosters vibrant discussions within the ATM community. Whether you're a seasoned enthusiast or a newcomer, connect, share insights, and stay updated on trends. Create custom chatrooms, join existing ones, or engage in direct messaging. Stay informed, exchange ideas, and build connections.",
    ],
  };

  // Section data for Social Platform
  const socialPlatformData = {
    title: "social platform",
    badge: "Connect",
    description: [
      "Coming soon",
      "Our platform is a dynamic hub for members to share news, posts, and insights, fostering engaging discussions on topics relevant to the ATM ecosystem. Stay updated, interact with enthusiasts, and forge connections in a seamless, intuitive space. Customise your experience with interactive tools for a personalised social experience.",
    ],
  };

  // Section data for Autonomy Proposal
  const autonomyProposalData = {
    title: "AUTONOMY PROPOSAL",
    description:
      "ATM is a decentralised distribution mechanism. This means that users need to manage it as a community to allow it to continuously evolve and stay relevant. We hope that this should offer stability when the economic environment changes unpredictably around us. In short, the community manages the ATM functions, algorithms and technical architectures by voting on proposed changes.",
  };

  // Section data for Proposal & Decision
  const proposalDecisionData = {
    title: "PROPOSAL & DECISION",
    proposalTitle: "New Year's Celebration Rewarding 2025",
    proposalDescription:
      "Community Funds need to be unlocked, 540,000 LUCA, to reward those who contributed to build ATM community. The funds will be refunded after the activity is completed.",
    proposalDate: "08/02/2025, 13:45:21 - 13/02/2025, 13:45:21",
  };

  // Section data for Community Foundation
  const communityFoundationData = {
    title: "COMMUNITY FOUNDATION",
    description: [
      "The community foundation belongs to all users. Its accounts are fully autonomous, and the private key of the foundation wallet is jointly held by the directors of the foundation.",
      "The fund management board is composed of the 47 users with the highest PR value in the community. The board of directors has executive power, but the final decision always belongs to all members of the community via voting on proposals.",
      "Funds require approval by over half of the board of directors. Inactive members are replaced by the algorithm, with the next highest PR user taking their place as director.",
    ],
  };

  return (
    <section className="flex flex-col w-full items-start gap-[100px] py-[100px]">
      {/* AI Avatars Section */}
      <div className="relative w-full">
        <div className="relative w-[195px] h-[99px] ml-[71px]">
          <div className="relative w-[183px] h-[99px]">
            <img
              className="absolute w-[99px] h-[99px] top-0 left-0"
              alt="Dots"
              src="/dots.svg"
            />
            <h2 className="absolute h-11 top-[27px] left-[49px] font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] whitespace-nowrap [font-style:var(--titles-h2-sectionheading-400-font-style)]">
              {aiAvatarsData.title}
            </h2>
          </div>
        </div>

        <div className="w-full max-w-[1454px] mx-auto mt-[100px]">
          <p className="max-w-[782px] mb-10 [font-family:'Inter',Helvetica] font-normal text-[#1c1c1c] text-xl tracking-[0] leading-5">
            <span className="font-light leading-[27px]">
              In our ATM community, we&#39;re transforming the way we interact
              with AI. Imagine a world where humans and AI coexist seamlessly,{" "}
            </span>
            <span className="font-[number:var(--body-body1-500-font-weight)] leading-[var(--body-body1-500-line-height)] font-body-body1-500 [font-style:var(--body-body1-500-font-style)] tracking-[var(--body-body1-500-letter-spacing)] text-[length:var(--body-body1-500-font-size)]">
              blurring boundaries and enriching every interaction. Our
              innovative AI technology brings this vision to life, creating a
              vibrant and dynamic community where the possibilities are endless.
            </span>
          </p>

          <div className="flex items-end justify-center gap-[50px]">
            <div className="flex flex-col items-start gap-5 flex-1">
              <Badge className="flex w-[90px] items-center justify-center gap-2 px-2.5 py-[5px] bg-[#f9f2ff] rounded-[30px] border border-solid border-[#8e1bf4] backdrop-blur-md backdrop-brightness-[100%]">
                <img
                  className="w-[18px] h-[18px] ml-[-4.00px]"
                  alt="Face icon"
                  src="/face-icon.svg"
                />
                <span className="w-fit mt-[-0.50px] mr-[-4.00px] font-body-labeltext-400 font-[number:var(--body-labeltext-400-font-weight)] text-[#8e1bf4] text-[length:var(--body-labeltext-400-font-size)] tracking-[var(--body-labeltext-400-letter-spacing)] leading-[var(--body-labeltext-400-line-height)] whitespace-nowrap [font-style:var(--body-labeltext-400-font-style)]">
                  {aiAvatarsData.badge}
                </span>
              </Badge>

              {aiAvatarsData.description.map((paragraph, index) => (
                <p
                  key={index}
                  className="font-body-body2-400 font-[number:var(--body-body2-400-font-weight)] text-[#1c1c1c] text-[length:var(--body-body2-400-font-size)] tracking-[var(--body-body2-400-letter-spacing)] leading-[var(--body-body2-400-line-height)] [font-style:var(--body-body2-400-font-style)]"
                >
                  {paragraph}
                </p>
              ))}

              <Button className="inline-flex items-center justify-center gap-[5px] px-5 py-3 bg-[#2ea8af] rounded-[30px] text-white">
                {aiAvatarsData.buttonText}
              </Button>
            </div>

            <div className="flex-1 relative">
              <div className="relative w-[448px] h-[370px] left-[100px]">
                <img
                  className="absolute w-[370px] h-[370px] top-0 left-0 object-cover"
                  alt="Lucy logo final"
                  src="/lucy-logo-final-1.png"
                />
                <img
                  className="absolute w-[285px] h-[170px] top-10 left-[163px] object-cover"
                  alt="Hi lucy gif"
                  src="/hi-lucy-gif-1.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatars Gallery Section */}
      <div className="relative w-full h-[680px]">
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
      </div>

      {/* What is AVATAR Section */}
      <div className="relative w-full">
        <div className="w-full max-w-[1599px] mx-auto">
          <ToggleGroup
            type="single"
            className="flex w-[339px] h-[49px] items-center gap-2.5 p-[5px] ml-auto rounded-[40px] border border-solid border-[#eeeeee]"
          >
            {toggleItems.map((item, index) => (
              <ToggleGroupItem
                key={index}
                value={item.toLowerCase()}
                className={`inline-flex items-center justify-center gap-2.5 px-[15px] py-2.5 rounded-[100px] overflow-hidden ${index === 0 ? "bg-[#e9f6f7]" : ""}`}
              >
                <span className="w-fit mt-[-1.00px] font-body-body-4-400 font-[number:var(--body-body-4-400-font-weight)] text-[#2ea8af] text-[length:var(--body-body-4-400-font-size)] tracking-[var(--body-body-4-400-letter-spacing)] leading-[var(--body-body-4-400-line-height)] whitespace-nowrap [font-style:var(--body-body-4-400-font-style)]">
                  {item}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className="flex items-center gap-[50px] mt-[69px] rounded-[20px]">
            <img
              className="w-[682px] h-[370px] rounded-[20px] object-cover"
              alt="Rectangle"
              src="/rectangle-60.png"
            />
            <div className="flex flex-col h-[302px] items-start gap-5 flex-1">
              <h3 className="self-stretch mt-[-1.00px] font-titles-h5-large-text-400 font-[number:var(--titles-h5-large-text-400-font-weight)] text-[#1c1c1c] text-[length:var(--titles-h5-large-text-400-font-size)] tracking-[var(--titles-h5-large-text-400-letter-spacing)] leading-[var(--titles-h5-large-text-400-line-height)] [font-style:var(--titles-h5-large-text-400-font-style)]">
                {whatIsAvatarData.title}
              </h3>
              <p className="self-stretch font-body-body3-400 font-[number:var(--body-body3-400-font-weight)] text-[#1c1c1c] text-[length:var(--body-body3-400-font-size)] tracking-[var(--body-body3-400-letter-spacing)] leading-[var(--body-body3-400-line-height)] [font-style:var(--body-body3-400-font-style)]">
                {whatIsAvatarData.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LUCA Rewards Section */}
      <div className="relative w-full">
        <div className="relative w-[195px] h-[99px] ml-[71px]">
          <div className="relative w-[233px] h-[99px]">
            <img
              className="absolute w-[99px] h-[99px] top-0 left-0"
              alt="Dots"
              src="/dots.svg"
            />
            <h2 className="absolute h-11 top-[27px] left-[49px] font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] whitespace-nowrap [font-style:var(--titles-h2-sectionheading-400-font-style)]">
              {lucaRewardsData.title}
            </h2>
          </div>
        </div>

        <div className="flex justify-between mt-[100px]">
          <div className="max-w-[782px] ml-[275px] [font-family:'Inter',Helvetica] font-normal text-[#1c1c1c] text-xl tracking-[0] leading-5">
            <span className="font-light leading-[27px]">
              Earn LUCA rewards through consensus connections and staking with
              LUCA, the native cryptocurrency of ATM.{" "}
            </span>
            <span className="font-[number:var(--body-body1-500-font-weight)] leading-[var(--body-body1-500-line-height)] font-body-body1-500 [font-style:var(--body-body1-500-font-style)] tracking-[var(--body-body1-500-letter-spacing)] text-[length:var(--body-body1-500-font-size)]">
              Dive into our rewarding ecosystem where 85% of daily issuance is
              dedicated to consensus connection rewards, distributed based on
              your PR values. The remaining 15% is for staking rewards, with top
              users qualifying for issuance.{" "}
            </span>
          </div>
          <div className="relative">
            <div className="w-[1173px] h-[377px] bg-[url(/group.svg)] bg-[100%_100%]">
              <img
                className="absolute w-[406px] h-[254px] top-[74px] left-12 object-cover"
                alt="Lucarewards"
                src="/lucarewards-1.png"
              />
            </div>
          </div>
        </div>
      </div>

      {/* A-Team Section */}
      <div className="relative w-full">
        <div className="relative w-[195px] h-[99px] ml-[71px]">
          <div className="relative w-[139px] h-[99px]">
            <img
              className="absolute w-[99px] h-[99px] top-0 left-0"
              alt="Dots"
              src="/dots.svg"
            />
            <h2 className="absolute h-11 top-[27px] left-[49px] font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] whitespace-nowrap [font-style:var(--titles-h2-sectionheading-400-font-style)]">
              {aTeamData.title}
            </h2>
          </div>
        </div>

        <div className="flex w-full max-w-[1454px] mx-auto mt-[100px] items-end justify-center gap-[50px]">
          <div className="flex flex-col items-start gap-5 flex-1">
            <Badge className="inline-flex items-center justify-center gap-2 px-2.5 py-[5px] bg-[#f9f2ff] rounded-[30px] border border-solid border-[#8e1bf4] backdrop-blur-md backdrop-brightness-[100%]">
              <img
                className="w-[18px] h-[18px]"
                alt="Face icon"
                src="/face-icon.svg"
              />
              <span className="w-fit mt-[-0.50px] font-body-labeltext-400 font-[number:var(--body-labeltext-400-font-weight)] text-[#8e1bf4] text-[length:var(--body-labeltext-400-font-size)] tracking-[var(--body-labeltext-400-letter-spacing)] leading-[var(--body-labeltext-400-line-height)] whitespace-nowrap [font-style:var(--body-labeltext-400-font-style)]">
                {aTeamData.badge}
              </span>
            </Badge>

            {aTeamData.description.map((paragraph, index) => (
              <p
                key={index}
                className="font-body-body2-400 font-[number:var(--body-body2-400-font-weight)] text-[#1c1c1c] text-[length:var(--body-body2-400-font-size)] tracking-[var(--body-body2-400-letter-spacing)] leading-[var(--body-body2-400-line-height)] [font-style:var(--body-body2-400-font-style)]"
              >
                {paragraph}
              </p>
            ))}

            <Button className="inline-flex items-center justify-center gap-[5px] px-5 py-3 bg-[#2ea8af] rounded-[30px] text-white">
              {aTeamData.buttonText}
            </Button>
          </div>

          <div className="[background:url(..//media.png)_50%_50%_/_cover] flex-1 h-[370px] rounded-[20px]" />
        </div>
      </div>

      {/* Messaging Platform Section */}
      <div className="relative w-full">
        <div className="relative w-[195px] h-[99px] ml-[71px]">
          <div className="relative w-[319px] h-[99px]">
            <img
              className="absolute w-[99px] h-[99px] top-0 left-0"
              alt="Dots"
              src="/dots.svg"
            />
            <h2 className="absolute h-11 top-[27px] left-[49px] font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] whitespace-nowrap [font-style:var(--titles-h2-sectionheading-400-font-style)]">
              {messagingPlatformData.title}
            </h2>
          </div>
        </div>

        <div className="flex w-full max-w-[1454px] mx-auto mt-[100px] items-end justify-center gap-[50px]">
          <div className="bg-[url(/media-1.png)] bg-cover bg-[50%_50%] flex-1 h-[370px] rounded-[20px]" />

          <div className="flex flex-col items-start gap-5 flex-1">
            <Badge className="inline-flex items-center justify-center gap-2 px-2.5 py-[5px] bg-[#eafaff] rounded-[30px] border border-solid border-[#2ea8af] backdrop-blur-md backdrop-brightness-[100%]">
              <img
                className="w-[18px] h-[18px]"
                alt="React icons bs"
                src="/react-icons-bs-bsshare.svg"
              />
              <span className="w-fit mt-[-0.50px] font-body-labeltext-400 font-[number:var(--body-labeltext-400-font-weight)] text-[#2ea8af] text-[length:var(--body-labeltext-400-font-size)] tracking-[var(--body-labeltext-400-letter-spacing)] leading-[var(--body-labeltext-400-line-height)] whitespace-nowrap [font-style:var(--body-labeltext-400-font-style)]">
                {messagingPlatformData.badge}
              </span>
            </Badge>

            {messagingPlatformData.description.map((paragraph, index) => (
              <p
                key={index}
                className="font-body-body2-400 font-[number:var(--body-body2-400-font-weight)] text-[#1c1c1c] text-[length:var(--body-body2-400-font-size)] tracking-[var(--body-body2-400-letter-spacing)] leading-[var(--body-body2-400-line-height)] [font-style:var(--body-body2-400-font-style)]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Social Platform Section */}
      <div className="relative w-full">
        <div className="relative w-[195px] h-[99px] ml-[71px]">
          <div className="relative w-[265px] h-[99px]">
            <img
              className="absolute w-[99px] h-[99px] top-0 left-0"
              alt="Dots"
              src="/dots.svg"
            />
            <h2 className="absolute h-11 top-[27px] left-[49px] font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] whitespace-nowrap [font-style:var(--titles-h2-sectionheading-400-font-style)]">
              {socialPlatformData.title}
            </h2>
          </div>
        </div>

        <div className="flex w-full max-w-[1454px] mx-auto mt-[100px] items-end justify-center gap-[50px]">
          <div className="flex flex-col items-start gap-5 flex-1">
            <Badge className="inline-flex items-center justify-center gap-2 px-2.5 py-[5px] bg-[#eafaff] rounded-[30px] border border-solid border-[#2ea8af] backdrop-blur-md backdrop-brightness-[100%]">
              <img
                className="w-[18px] h-[18px]"
                alt="React icons bs"
                src="/react-icons-bs-bsshare.svg"
              />
              <span className="w-fit mt-[-0.50px] font-body-labeltext-400 font-[number:var(--body-labeltext-400-font-weight)] text-[#2ea8af] text-[length:var(--body-labeltext-400-font-size)] tracking-[var(--body-labeltext-400-letter-spacing)] leading-[var(--body-labeltext-400-line-height)] whitespace-nowrap [font-style:var(--body-labeltext-400-font-style)]">
                {socialPlatformData.badge}
              </span>
            </Badge>

            {socialPlatformData.description.map((paragraph, index) => (
              <p
                key={index}
                className="font-body-body2-400 font-[number:var(--body-body2-400-font-weight)] text-[#1c1c1c] text-[length:var(--body-body2-400-font-size)] tracking-[var(--body-body2-400-letter-spacing)] leading-[var(--body-body2-400-line-height)] [font-style:var(--body-body2-400-font-style)]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="[background:url(..//media-2.png)_50%_50%_/_cover] flex-1 h-[370px] rounded-[20px]" />
        </div>
      </div>

      {/* Autonomy Proposal Section */}
      <div className="flex flex-col w-full gap-20">
        <div className="relative w-full">
          <div className="relative w-[312px] h-[100px] ml-[70px]">
            <div className="relative h-[99px]">
              <h2
                className="absolute h-11 top-[27px] left-[49px] font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-
[var(--titles-h2-sectionheading-400-line-height)] whitespace-nowrap [font-style:var(--titles-h2-sectionheading-400-font-style)]"
              >
                {autonomyProposalData.title}
              </h2>
              <img
                className="absolute w-[99px] h-[99px] top-0 left-0"
                alt="Dots"
                src="/dots.svg"
              />
            </div>
          </div>

          <div className="max-w-[1160px] mx-auto mt-[100px] ml-[274px] [font-family:'Inter',Helvetica] font-normal text-[#1c1c1c] text-xl tracking-[0] leading-5">
            <span className="font-light leading-[27px]">
              ATM is a decentralised distribution mechanism. This means that
              users need to manage it as a community to allow it to continuously
              evolve and stay relevant.{" "}
            </span>
            <span className="font-[number:var(--body-body1-500-font-weight)] leading-[var(--body-body1-500-line-height)] font-body-body1-500 [font-style:var(--body-body1-500-font-style)] tracking-[var(--body-body1-500-letter-spacing)] text-[length:var(--body-body1-500-font-size)]">
              We hope that this should offer stability when the economic
              environment changes unpredictably around us.{" "}
            </span>
            <span className="font-light leading-[27px]">
              In short, the community manages the ATM functions, algorithms and
              technical architectures by voting on proposed changes.
            </span>
          </div>
        </div>

        <div className="relative w-full">
          <div className="inline-flex flex-col h-14 items-center justify-center gap-[5px] mx-auto ml-[929px]">
            <h3 className="inline-flex items-start justify-center gap-[5px] font-titles-h5-large-text-400 font-[number:var(--titles-h5-large-text-400-font-weight)] text-[#1c1c1c] text-[length:var(--titles-h5-large-text-400-font-size)] tracking-[var(--titles-h5-large-text-400-letter-spacing)] leading-[var(--titles-h5-large-text-400-line-height)] whitespace-nowrap [font-style:var(--titles-h5-large-text-400-font-style)]">
              Different proposals are passed under different conditions
            </h3>
            <p className="w-fit font-body-labeltext-400 font-[number:var(--body-labeltext-400-font-weight)] text-[#4f5555] text-[length:var(--body-labeltext-400-font-size)] tracking-[var(--body-labeltext-400-letter-spacing)] leading-[var(--body-labeltext-400-line-height)] whitespace-nowrap [font-style:var(--body-labeltext-400-font-style)]">
              Tap numbers to view 3 reward modes
            </p>
          </div>

          <div className="inline-flex items-start gap-[15px] mt-[76px] ml-[737px]">
            <div className="flex w-[790px] items-center gap-[15px]">
              <div className="w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-bold text-[#2ea8af] text-[250px] tracking-[0] leading-[normal]">
                1
              </div>
              <p className="flex-1 font-body-body3-400 font-[number:var(--body-body3-400-font-weight)] text-[#1c1c1c] text-[length:var(--body-body3-400-font-size)] tracking-[var(--body-body3-400-letter-spacing)] leading-[var(--body-body3-400-line-height)] [font-style:var(--body-body3-400-font-style)]">
                In general proposals community members can vote for or against,
                and the voting will conclude once the total votes exceed 1% of
                AGT in circulation. The proposal will pass if it receives two
                thirds of the vote in its favour. If the proposal fails to meet
                this threshold, it is deemed unsuccessful.
              </p>
            </div>

            <div className="flex w-[282px] items-center gap-[15px]">
              <div className="w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-bold text-[#f2f9ff] text-[250px] tracking-[0] leading-[normal]">
                2
              </div>
              <p className="w-[617px] h-[72px] mr-[-508.00px] blur-[1.5px] bg-[linear-gradient(270deg,rgba(255,255,255,0)_0%,rgba(79,85,85,1)_81%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] font-body-body3-400 font-[number:var(--body-body3-400-font-weight)] text-transparent text-[length:var(--body-body3-400-font-size)] tracking-[var(--body-body3-400-letter-spacing)] leading-[var(--body-body3-400-line-height)] [font-style:var(--body-body3-400-font-style)]">
                In special proposals there is no for and against, but instead
                the terms of execution are laid out for the community members to
                discuss. If there is any objection during this period, the
                proposal will be reintroduced with modifications.
              </p>
            </div>
          </div>

          <Card className="flex w-[515px] items-center justify-center gap-2.5 px-2.5 py-3 mt-[399px] ml-[1023px] bg-white rounded-[10px] border border-solid border-[#2ea8af]">
            <CardContent className="flex items-start gap-2.5 p-0 flex-1 self-stretch">
              <img className="w-6 h-6" alt="Tip icon" src="/tip-icon.svg" />
              <p className="flex-1 mt-[-1.00px] font-body-labeltext-400 font-[number:var(--body-labeltext-400-font-weight)] text-[#2ea8af] text-[length:var(--body-labeltext-400-font-size)] tracking-[var(--body-labeltext-400-letter-spacing)] leading-[var(--body-labeltext-400-line-height)] [font-style:var(--body-labeltext-400-font-style)]">
                AGT stands for ATM Governance Token. When users establish a
                consensus connection with LUCA, they become eligible to receive
                AGT distributed by the ATM.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Proposal & Decision Section */}
      <div className="relative w-full">
        <div className="relative w-[195px] h-[99px] ml-[71px]">
          <div className="relative w-[312px] h-[99px]">
            <img
              className="absolute w-[99px] h-[99px] top-0 left-0"
              alt="Dots"
              src="/dots.svg"
            />
            <h2 className="absolute h-11 top-[27px] left-[49px] font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] whitespace-nowrap [font-style:var(--titles-h2-sectionheading-400-font-style)]">
              {proposalDecisionData.title}
            </h2>
          </div>
        </div>

        <div className="w-full max-w-[1318px] mx-auto mt-[100px] ml-[273px] relative">
          <img
            className="absolute w-[607px] h-[193px] top-[62px] right-0"
            alt="Proposal img svg"
            src="/proposal-img-svg.svg"
          />

          <Card className="flex flex-col w-[785px] items-start gap-5 p-5 bg-[#fbfbfb] rounded-[10px] border border-solid border-[#eeeeee] shadow-soft-shadow">
            <CardContent className="flex flex-col items-start gap-5 p-0 w-full">
              <h3 className="self-stretch mt-[-1.00px] font-body-body1-500 font-[number:var(--body-body1-500-font-weight)] text-[#1c1c1c] text-[length:var(--body-body1-500-font-size)] tracking-[var(--body-body1-500-letter-spacing)] leading-[var(--body-body1-500-line-height)] [font-style:var(--body-body1-500-font-style)]">
                {proposalDecisionData.proposalTitle}
              </h3>
              <p className="self-stretch font-body-body2-400 font-[number:var(--body-body2-400-font-weight)] text-[#1c1c1c] text-[length:var(--body-body2-400-font-size)] tracking-[var(--body-body2-400-letter-spacing)] leading-[var(--body-body2-400-line-height)] [font-style:var(--body-body2-400-font-style)]">
                {proposalDecisionData.proposalDescription}
              </p>
              <p className="self-stretch font-body-labeltext-400 font-[number:var(--body-labeltext-400-font-weight)] text-[#4f5555] text-[length:var(--body-labeltext-400-font-size)] tracking-[var(--body-labeltext-400-letter-spacing)] leading-[var(--body-labeltext-400-line-height)] [font-style:var(--body-labeltext-400-font-style)]">
                {proposalDecisionData.proposalDate}
              </p>
              <div className="inline-flex items-center gap-[15px]">
                <div className="relative w-20 h-[39px] rounded-[48px]">
                  <div className="absolute h-[19px] top-2.5 left-[18px] font-body-body-4-400 font-[number:var(--body-body-4-400-font-weight)] text-[#858585] text-[length:var(--body-body-4-400-font-size)] text-center tracking-[var(--body-body-4-400-letter-spacing)] leading-[var(--body-body-4-400-line-height)] whitespace-nowrap [font-style:var(--body-body-4-400-font-style)]">
                    Ended
                  </div>
                </div>
                <div className="inline-flex items-center gap-2.5 rounded-[30px]">
                  <span className="w-fit font-body-body-4-400 font-[number:var(--body-body-4-400-font-weight)] text-primary-colour text-[length:var(--body-body-4-400-font-size)] tracking-[var(--body-body-4-400-letter-spacing)] leading-[var(--body-body-4-400-line-height)] whitespace-nowrap [font-style:var(--body-body-4-400-font-style)]">
                    View proposal
                  </span>
                  <div className="relative w-[38.53px] h-[38.53px]">
                    <img
                      className="absolute w-[33px] h-[33px] top-[3px] left-0.5"
                      alt="Arrow right icon"
                      src="/arrow-right-icon.svg"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="inline-flex items-center gap-2.5 mt-[50px] ml-[273px] rounded-[30px]">
          <span className="w-fit font-body-body-4-400 font-[number:var(--body-body-4-400-font-weight)] text-primary-colour text-[length:var(--body-body-4-400-font-size)] tracking-[var(--body-body-4-400-letter-spacing)] leading-[var(--body-body-4-400-line-height)] whitespace-nowrap [font-style:var(--body-body-4-400-font-style)]">
            View all
          </span>
          <div className="relative w-[38.53px] h-[38.53px]">
            <img
              className="absolute w-[33px] h-[33px] top-[3px] left-0.5"
              alt="Arrow right icon"
              src="/arrow-right-icon.svg"
            />
          </div>
        </div>
      </div>

      {/* Community Foundation Section */}
      <div className="relative w-full">
        <div className="relative w-[195px] h-[99px] ml-[71px]">
          <div className="relative w-[350px] h-[99px]">
            <img
              className="absolute w-[99px] h-[99px] top-0 left-0"
              alt="Dots"
              src="/dots.svg"
            />
            <h2 className="absolute h-11 top-[27px] left-[49px] font-titles-h2-sectionheading-400 font-[number:var(--titles-h2-sectionheading-400-font-weight)] text-primary-colour text-[length:var(--titles-h2-sectionheading-400-font-size)] tracking-[var(--titles-h2-sectionheading-400-letter-spacing)] leading-[var(--titles-h2-sectionheading-400-line-height)] whitespace-nowrap [font-style:var(--titles-h2-sectionheading-400-font-style)]">
              {communityFoundationData.title}
            </h2>
          </div>
        </div>

        <div className="flex mt-[100px]">
          <div className="flex flex-col w-[782px] items-start gap-5 ml-[271px]">
            {communityFoundationData.description.map((paragraph, index) => (
              <div
                key={index}
                className="self-stretch h-20 [font-family:'Inter',Helvetica] font-normal text-[#1c1c1c] text-xl tracking-[0] leading-5"
              >
                {index === 0 && (
                  <>
                    <span className="font-light leading-[27px]">
                      The community foundation belongs to all users. Its{" "}
                    </span>
                    <span className="font-[number:var(--body-body1-500-font-weight)] leading-[var(--body-body1-500-line-height)] font-body-body1-500 [font-style:var(--body-body1-500-font-style)] tracking-[var(--body-body1-500-letter-spacing)] text-[length:var(--body-body1-500-font-size)]">
                      accounts are fully autonomous, and the private key of the
                      foundation wallet is jointly held by the directors of the
                      foundation.
                    </span>
                  </>
                )}
                {index === 1 && (
                  <>
                    <span className="font-light leading-[27px]">
                      The fund management board is composed of the 47 users with
                      the highest PR value in the community. The board of
                      directors has executive power, but{" "}
                    </span>
                    <span className="font-[number:var(--body-body1-500-font-weight)] leading-[var(--body-body1-500-line-height)] font-body-body1-500 [font-style:var(--body-body1-500-font-style)] tracking-[var(--body-body1-500-letter-spacing)] text-[length:var(--body-body1-500-font-size)]">
                      the final decision always belongs to all members of the
                      community
                    </span>
                    <span className="font-light leading-[27px]">
                      {" "}
                      via voting on proposals.
                    </span>
                  </>
                )}
                {index === 2 && (
                  <>
                    <span className="font-[number:var(--body-body1-500-font-weight)] leading-[var(--body-body1-500-line-height)] font-body-body1-500 [font-style:var(--body-body1-500-font-style)] tracking-[var(--body-body1-500-letter-spacing)] text-[length:var(--body-body1-500-font-size)]">
                      Funds require approval by over half of the board of
                      directors.
                    </span>
                    <span className="font-light leading-[27px]">
                      {" "}
                      Inactive members are replaced by the algorithm, with the
                      next highest PR user taking their place as director.
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
          <img
            className="w-[514px] h-[316px] ml-auto"
            alt="Element svg"
            src="/3-76ea0a83-svg.svg"
          />
        </div>
      </div>
    </section>
  );
};
