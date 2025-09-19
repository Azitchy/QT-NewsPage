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
          "Collaboration with travel Agency to explore real-world use case of LUCA.",
        side: "left",
      },
    ],
  },
  {
    year: "2024",
    items: [
      {
        title: "iOS App live",
        description:
          "ATM connect iOS App available on App Store unlocking exclusive experience.",
        side: "left",
      },
      {
        title: "Upgrading website",
        description:
          "Fresh look of ATM website with visualization, animations, and multi-language support.",
        side: "right",
      },
    ],
  },
  {
    year: "2023",
    items: [
      {
        title: "iOS App live",
        description:
          "ATM connect iOS App available on App Store unlocking exclusive experience.",
        side: "left",
      },
      {
        title: "Upgrading website",
        description:
          "Fresh look of ATM website with visualization, animations, and multi-language support.",
        side: "right",
      },
    ],
  },
];

export const RoadmapSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative bg-[url(/roadmap.png)] bg-cover text-white min-h-screen overflow-hidden">
      {roadmapData.map((section, i) => (
        <div
          key={i}
          className="relative min-h-screen flex flex-col items-center justify-start py-2"
        >
          {/* Year Title */}
          <h1
            className="z-20 uppercase text-[60px] md:text-[100px] font-bold text-center text-transparent mb-10"
            style={{
              opacity: i === 0 ? 1 : Math.min(1, scrollY / 400),
              WebkitTextStroke: "2px white",
            }}
          >
            {section.year}
          </h1>

          {/* Glowing Star */}
          <div
            className="w-5 h-5 bg-[url(/roadmap-star.svg)] bg-cover z-10 rounded-full mb-10"
            style={{
              animation: "glow 2s infinite",
            }}
          />
          <style>
            {`
              @keyframes glow {
                0%, 100% { box-shadow: 0 0 20px 5px rgba(255,255,255,0.3); }
                50% { box-shadow: 0 0 60px 20px rgba(255,255,255,0.8); }
              }
            `}
          </style>

          {/* Timeline container */}
          <div className="relative w-full flex justify-center">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 bg-white w-[1px] h-full" />

            {/* Roadmap Items */}
            <div className="flex flex-col gap-0 w-full max-w-5xl relative">
              {section.items.map((item, j) => (
                <RoadmapItem
                  key={j}
                  title={item.title}
                  description={item.description}
                  side={item.side}
                />
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
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
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
      className={`w-full flex ${
        side === "left" ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`p-6 rounded-xl w-[300px] md:w-[400px] transition-all duration-700 ease-out transform 
        ${isVisible ? "opacity-100 translate-x-0" : "opacity-0"} 
        ${!isVisible && side === "left" ? "-translate-x-20" : ""} 
        ${!isVisible && side === "right" ? "translate-x-20" : ""}`}
      >
        <h2 className="text-[18px] leading-[24px] text-[#DCDCDC] font-normal mb-2">
          {title}
        </h2>
        <p className="text-[16px] leading-[24px] font-normal text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
};
