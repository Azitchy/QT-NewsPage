import React, { useEffect, useState, useRef } from "react";

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
    year: "Future",
    items: [
      {
        title: "Q3 AGF smart contract deployment",
        description:
          "Deployment of AGF smart contract pave the foundation for the Game Fund, allowing users to crowdfund and developers to grant.",
        side: "right",
      },
      {
        title: "Airdrops and ecosystem development",
        description:
          "More opportunities to partnership and collaborate with other projects to initiate airdrops and bring other communities into ATM.",
        side: "left",
      },
      {
        title: "Third Feature",
        description:
          "Launching the platform enticing more developers to join the ecosystem and enriching the gaming experience for community users.",
        side: "right",
      },
    ],
  },
  {
    year: "2025",
    items: [
      {
        title: "WebApp redesign",
        description:
          "New WebApp now equipped with a fresh interface and clear instructions on connecting to ATM.",
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
        title: "Upgrading website",
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
          "ATM connect iOS App available on App Store unlocking exclusive experience.",
        side: "right",
      },
      {
        title: "Upgrading website",
        description:
          "Fresh look of ATM website with visualization, animations, and multi-language support.",
        side: "left",
      },
      {
        title: "Third Feature",
        description:
          "Launching the platform enticing more developers to join the ecosystem and enriching the gaming experience for community users.",
        side: "right",
      },
    ],
  },
];

export const RoadmapSection: React.FC = () => {
  return (
    <div className="relative bg-[url(/source_slidebggalaxy.png)] bg-cover text-white min-h-screen overflow-hidden pt-28 large:pt-40">
      {roadmapData.map((section, i) => (
        <div
          key={i}
          className="relative py-10 flex flex-col items-center gap-0"
        >
          {/* Row: Year center + First item right side */}
          <div className="relative w-full flex items-center justify-between">
            {/* Left empty space */}
            <div className="flex-1"></div>

            {/* Year in center */}
            <div className="flex flex-col items-center mx-4">
              <h1
                className="uppercase text-[40px] md:text-[150px] leading-[160px] font-bold text-transparent"
                style={{ WebkitTextStroke: "2px white" }}
              >
                {section.year}
              </h1>
              <div className="w-[2px] h-full bg-white/40 mt-2"></div>
            </div>

            {/* First item on right side */}
            <div className="flex-1 flex justify-start pl-6">
              {section.items[0] && (
                <RoadmapItem
                  title={section.items[0].title}
                  description={section.items[0].description}
                  side="right"
                />
              )}
            </div>
          </div>

          <div className="relative w-full  mt-10">
            <div className="absolute left-[50%] top-0 bottom-0 w-[2px] bg-white/40"></div>
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
                    side={item.side}
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

interface RoadmapItemProps {
  title: string;
  description: string;
  side: "left" | "right";
}

const RoadmapItem: React.FC<RoadmapItemProps> = ({
  title,
  description,
  side,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`p-4 rounded-xl w-[280px] md:w-[382px] transition-all duration-700 ease-out transform
        ${isVisible ? "opacity-100 translate-x-0" : "opacity-0"}
        ${!isVisible && side === "left" ? "-translate-x-10" : ""}
        ${!isVisible && side === "right" ? "translate-x-10" : ""}`}
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