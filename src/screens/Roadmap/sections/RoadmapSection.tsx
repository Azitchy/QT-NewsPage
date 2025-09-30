import React, { useEffect, useRef, useState } from "react";

type Side = "left" | "right";

interface RoadmapItemType {
  title: string;
  description: string;
  side: Side;
}

interface RoadmapSection {
  year: string;
  items: RoadmapItemType[];
}

const roadmapData: RoadmapSection[] = [
  {
    year: "FUTURE",
    items: [
      {
        title: "",
        description: "",
        side: "right",
      },
      {
        title: "Q3 AGF smart contract deployment",
        description:
          "Deployment of AGF smart contract pave the foundation for the Game Fund, allowing users to crowdfund and developers to grant.",
        side: "right",
      },
      {
        title: "Airdrops and ecosystem development",
        description:
          "More opportunities to partnership and collaborate with other projects to initiate airdrops and bring other communities into ATM to foster a more inclusive and functional ecosystem.",
        side: "left",
      },
    ],
  },
  {
    year: "2025",
    items: [
      {
        title: "WebApp redesign",
        description: `New WebApp now equipped with a fresh interface and clear instructions on connecting to ATM through the "ATM Connect" wallet.`,
        side: "right",
      },
      {
        title: "Travel Agency collaboration",
        description:
          "Collaboration with travel Agency to explore more real-world use case of LUCA, bringing the crypto to life.",
        side: "left",
      },
      {
        title: "AGF Game release",
        description:
          "Launching the platform enticing more developers to join the ecosystem and enriching the gaming experience for community users.",
        side: "right",
      },
    ],
  },
  {
    year: "2024",
    items: [
      {
        title: "iOS App live",
        description:
          "“ATM connect” iOS App available on App Store unlocking exclusive experience in ATM ecosystem.",
        side: "right",
      },
      {
        title: "Q2 Upgrading website",
        description:
          "New fresh look of ATM website upgrades the concept visualization, animated illustrations, and multi-language support boosting user experience when surfing in ATM.",
        side: "left",
      },
      {
        title: "Q1 End of recovery plan",
        description: "Recovery from the previous incident.",
        side: "right",
      },
    ],
  },
  {
    year: "2023",
    items: [
      {
        title: "AVATAR AI launch",
        description:
          "Our aim is to boost Luca value by intensifying our Avatar purchase mechanism to increase scarcity. Strategies will focus on gradually escalating Luca destruction aligned with Avatar popularity. We aim to empower our community, allowing users to freely generate Avatar links, engage in diverse interactions.",
        side: "right",
      },
      {
        title: "Recovery plan",
        description:
          "As of October 21st, notable achievements include significant system security updates, reactivation of our rewarding system, successful minting process completion, and seamless reward retrieval.",
        side: "left",
      },
    ],
  },
  {
    year: "2022",
    items: [
      {
        title: "Q4 TokenPR",
        description: "The introduction of Token PR, ATM’s token launch pad.",
        side: "right",
      },
      {
        title: "Complete the transition of all PR nodes becoming decentralised",
        description:
          "All resulting data from the PR calculation results will be completely decentralised and stored on the chain, making the data safer, immutable, and thus more reliable.",
        side: "left",
      },
    ],
  },
  {
    year: "2021",
    items: [
      {
        title: "Smart contracts undergo audit",
        description:
          "We found that we could create a platform that uses the blockchain to connect people on a new type of social network – a relative consensus network, which we hope will be a more stable and stronger economic system.",
        side: "right",
      },
      {
        title: "The concept was born",
        description:
          "In the first steps to be verified as a beacon of trust in the cryptocurrency community ATM underwent an audit by the CertiK Cybersecurity company.",
        side: "left",
      },
    ],
  },
];

// Main Roadmap Section
export const RoadmapSection: React.FC = () => {
  const [visibleYears, setVisibleYears] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const year = entry.target.getAttribute("data-year");
          if (entry.isIntersecting && year && !visibleYears.has(year)) {
            setVisibleYears((prev) => new Set(prev).add(year));
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    Object.entries(sectionRefs.current).forEach(([_, el]) => {
      if (el) observer.observe(el);
    });

    return () => {
      Object.entries(sectionRefs.current).forEach(([_, el]) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="relative bg-[url(/source_slidebggalaxy.png)] bg-cover text-white min-h-screen overflow-hidden pt-28 large:pt-40">
      {roadmapData.map((section, i) => (
        <div
          key={i}
          ref={(el) => (sectionRefs.current[section.year] = el)}
          data-year={section.year}
          className="relative py-10 flex flex-col items-center gap-0 min-h-[800px]"
        >
          {/* Year + First Item Row */}
          <div className="relative w-full flex items-center justify-between">
            <div className="flex-1"></div>
            <div className="flex flex-col items-center mx-4">
              <h1
                className="uppercase text-[40px] md:text-[150px] leading-[160px] font-bold text-transparent"
                style={{ WebkitTextStroke: "2px white" }}
              >
                {section.year}
              </h1>
              <div className="w-[2px] h-full bg-white/40 mt-2"></div>
            </div>
            <div className="flex-1 flex justify-start pl-6">
              {section.items[0] && (
                <RoadmapItem
                  title={section.items[0].title}
                  description={section.items[0].description}
                  visible={visibleYears.has(section.year)}
                />
              )}
            </div>
          </div>

          {/* Remaining Items */}
          <div className="relative w-full mt-10">
            <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-gray-700 min-h-[530px]"></div>
            <div className="flex flex-col gap-10">
              {section.items.slice(1).map((item, j) => (
                <div
                  key={j}
                  className={`w-full flex ${
                    item.side === "left"
                      ? "justify-end pr-[65%] large:pr-[60%]"
                      : "justify-start pl-[55%]"
                  }`}
                >
                  <RoadmapItem
                    title={item.title}
                    description={item.description}
                    visible={visibleYears.has(section.year)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Roadmap Item Component
interface RoadmapItemProps {
  title: string;
  description: string;
  visible: boolean;
}

const RoadmapItem: React.FC<RoadmapItemProps> = ({
  title,
  description,
  visible,
}) => {
  return (
    <div
      className={`p-4 rounded-xl w-[280px] md:w-[400px] transition-all duration-700 ease-out transform ${
        visible ? "translate-y-0 opacity-100" : "translate-y-40 opacity-0"
      }`}
    >
      <h2 className="text-[18px] leading-[24px] text-[#DCDCDC] font-normal mb-2">
        {title}
      </h2>
      <p className="text-[16px] leading-[24px] font-normal text-gray-300">
        {description}
      </p>
    </div>
  );
};
