import React, { useState } from "react";

interface TimelineItem {
  title: string;
  desc: string;
  expanded: boolean;
}

interface TimelineSection {
  year: string;
  items: TimelineItem[];
}

const timelineData: TimelineSection[] = [
  {
    year: "FUTURE",
    items: [
      {
        title: "Q3 AGF smart contract deployment",
        desc: "Deployment of AGF smart contract pave the foundation for the Game Fund, allowing users to crowdfund and developers to grant.",
        expanded: true,
      },
      {
        title: "Airdrops and ecosystem development",
        desc: "More opportunities to partnership and collaborate with other projects to initiate airdrops and bring other communities into ATM to foster a more inclusive and functional ecosystem.",
        expanded: false,
      },
    ],
  },
  {
    year: "2025",
    items: [
      {
        title: "WebApp redesign",
        desc: `New WebApp now equipped with a fresh interface and clear instructions on connecting to ATM through the "ATM Connect" wallet.`,
        expanded: false,
      },
      {
        title: "Travel Agency collaboration",
        desc: "Collaboration with travel Agency to explore more real-world use case of LUCA, bringing the crypto to life.",
        expanded: false,
      },
      {
        title: "AGF Game release",
        desc: "Launching the platform enticing more developers to join the ecosystem and enriching the gaming experience for community users.",
        expanded: false,
      },
    ],
  },
  {
    year: "2024",
    items: [
      {
        title: "iOS App live",
        desc: "“ATM connect” iOS App available on App Store unlocking exclusive experience in ATM ecosystem.",
        expanded: false,
      },
      {
        title: "Q2 Upgrading website",
        desc: "New fresh look of ATM website upgrades the concept visualization, animated illustrations, and multi-language support boosting user experience when surfing in ATM.",
        expanded: false,
      },
      {
        title: "Q1 End of recovery plan",
        desc: "Recovery from the previous incident.",
        expanded: false,
      },
    ],
  },
  {
    year: "2023",
    items: [
      {
        title: "AVATAR AI launch",
        desc: "Our aim is to boost Luca value by intensifying our Avatar purchase mechanism to increase scarcity. Strategies will focus on gradually escalating Luca destruction aligned with Avatar popularity. We aim to empower our community, allowing users to freely generate Avatar links, engage in diverse interactions.",
        expanded: false,
      },
      {
        title: "Recovery plan",
        desc: "As of October 21st, notable achievements include significant system security updates, reactivation of our rewarding system, successful minting process completion, and seamless reward retrieval.",
        expanded: false,
      },
    ],
  },
  {
    year: "2022",
    items: [
      {
        title: "Q4 TokenPR",
        desc: "The introduction of Token PR, ATM’s token launch pad.",
        expanded: false,
      },
      {
        title: "Complete the transition of all PR nodes becoming decentralised",
        desc: "All resulting data from the PR calculation results will be completely decentralised and stored on the chain, making the data safer, immutable, and thus more reliable.",
        expanded: false,
      },
    ],
  },
  {
    year: "2021",
    items: [
      {
        title: "Smart contracts undergo audit",
        desc: "We found that we could create a platform that uses the blockchain to connect people on a new type of social network – a relative consensus network, which we hope will be a more stable and stronger economic system.",
        expanded: false,
      },
      {
        title: "The concept was born",
        desc: "In the first steps to be verified as a beacon of trust in the cryptocurrency community ATM underwent an audit by the CertiK Cybersecurity company.",
        expanded: false,
      },
    ],
  },
];
const Timeline: React.FC = () => {
  const [activeItem, setActiveItem] = useState<{
    year: string;
    index: number;
  } | null>({
    year: "FUTURE",
    index: 0,
  });

  const toggleExpand = (year: string, index: number): void => {
    if (activeItem?.year === year && activeItem?.index === index) {
      setActiveItem(null);
    } else {
      setActiveItem({ year, index });
    }
  };

  return (
    <div className="w-full bg-[url(/source_bggalaxy-19.png)]  h-full bg-cover bg-no-repeat mx-auto p-6 md:px-20 font-sans text-white">
      {timelineData.map(({ year, items }) => (
        <div key={year} className="mb-5">
          <div
            className="text-4xl md:text-5xl font-bold uppercase tracking-widest select-none mb-8 text-transparent"
            style={{
              WebkitTextStroke: "1px #E0F7FA",
            }}
          >
            {year}
          </div>

          <div className="relative">
            {items.map(({ title, desc }, idx) => {
              const isExpanded =
                activeItem?.year === year && activeItem?.index === idx;
              return (
                <div
                  key={idx}
                  className="relative pl-8 mb-6 cursor-pointer"
                  onClick={() => toggleExpand(year, idx)}
                >
                  {/* Line */}
                  <div className="absolute left-[7px] top-2 bottom-0 w-[1px] bg-gray-700"></div>

                  {/* Dot */}
                  <span
                    className={`absolute left-1 top-2 block w-2 h-2 rounded-full border border-gray-500 z-10 ${
                      isExpanded ? "bg-white" : "bg-transparent"
                    }`}
                  />

                  {/* Card */}
                  <div className="relative flex-col shadow-md backdrop-blur-2xl border border-[linear-gradient(96deg,#C6C6C6_69.03%,#2B2B2B_102.49%)] rounded-[10px] px-[10px] py-[20px] transition-colors flex justify-between select-text">
                    <div className="flex justify-between">
                      <p className="text-[#DCDCDC] text-[14px] leading-[19px]">
                        {title}
                      </p>
                      <span
                        className={`inline-block transform transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-[#2EA8AF]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </span>
                    </div>
                    {isExpanded && desc && (
                      <div className="mt-2 text-[#DCDCDC] text-[12px] leading-[17px]">
                        {desc}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
