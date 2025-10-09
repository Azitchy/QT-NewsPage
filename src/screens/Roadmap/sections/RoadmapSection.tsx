import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

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

// Main Roadmap Section
export const RoadmapSection: React.FC = () => {
  const { t } = useTranslation("roadmap");

  // Build roadmap data from translations with alternating sides
  const roadmapData: RoadmapSection[] = [
    {
      year: t("future.futureHeading"),
      items: (t("future.items", { returnObjects: true }) as any[]).map(
        (_, idx) => ({
          title: t(`future.items.${idx}.title`),
          description: t(`future.items.${idx}.description`),
          side: (idx === 0
            ? "right"
            : idx % 2 === 0
            ? "right"
            : "left") as Side,
        })
      ),
    },
    {
      year: "2025",
      items: (t("year_2025.items", { returnObjects: true }) as any[]).map(
        (_, idx) => ({
          title: t(`year_2025.items.${idx}.title`),
          description: t(`year_2025.items.${idx}.description`),
          side: (idx === 0
            ? "right"
            : idx % 2 === 0
            ? "right"
            : "left") as Side,
        })
      ),
    },
    {
      year: "2024",
      items: (t("year_2024.items", { returnObjects: true }) as any[]).map(
        (_, idx) => ({
          title: t(`year_2024.items.${idx}.title`),
          description: t(`year_2024.items.${idx}.description`),
          side: (idx === 0
            ? "right"
            : idx % 2 === 0
            ? "right"
            : "left") as Side,
        })
      ),
    },
    {
      year: "2023",
      items: (t("year_2023.items", { returnObjects: true }) as any[]).map(
        (_, idx) => ({
          title: t(`year_2023.items.${idx}.title`),
          description: t(`year_2023.items.${idx}.description`),
          side: (idx === 0
            ? "right"
            : idx % 2 === 0
            ? "right"
            : "left") as Side,
        })
      ),
    },
    {
      year: "2022",
      items: (t("year_2022.items", { returnObjects: true }) as any[]).map(
        (_, idx) => ({
          title: t(`year_2022.items.${idx}.title`),
          description: t(`year_2022.items.${idx}.description`),
          side: (idx === 0
            ? "right"
            : idx % 2 === 0
            ? "right"
            : "left") as Side,
        })
      ),
    },
    {
      year: "2021",
      items: (t("year_2021.items", { returnObjects: true }) as any[]).map(
        (_, idx) => ({
          title: t(`year_2021.items.${idx}.title`),
          description: t(`year_2021.items.${idx}.description`),
          side: (idx === 0
            ? "right"
            : idx % 2 === 0
            ? "right"
            : "left") as Side,
        })
      ),
    },
  ];

  const [visibleYears, setVisibleYears] = useState<Set<string>>(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);
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
      { threshold: 0.3 }
    );

    Object.values(sectionRefs.current).forEach(
      (el) => el && observer.observe(el)
    );
    return () => observer.disconnect();
  }, []);

  // Track scroll to control star growth
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / docHeight, 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
          {/* Year + First Item */}
          <div className="relative w-full flex items-center justify-between">
            <div className="flex-1"></div>

            {/* Center Column with Year + Line + Star */}
            <div className="flex flex-col items-center mx-4 relative">
              {/* Glowing Star */}
              <img
                src="/roadmap-star.svg"
                alt="glowing star"
                className={`relative top-[215px] left-[12px] transition-all duration-700 ease-out drop-shadow-[0_0_15px_rgba(255,255,150,0.8)] transform
                ${
                  visibleYears.has(section.year)
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-20 scale-0"
                }`}
                style={{
                  transitionDelay: "100ms",
                  transform: visibleYears.has(section.year)
                    ? `translateY(0px) scale(${1 + scrollProgress * 2})`
                    : "translateY(-180px) scale(0)",
                  filter: `drop-shadow(0 0 ${
                    10 + scrollProgress * 30
                  }px rgba(255,255,150,0.9))`,
                }}
              />

              {/* Year Text */}
              <h1
                className="uppercase text-[40px] md:text-[150px] leading-[160px] font-bold text-transparent"
                style={{ WebkitTextStroke: "2px white" }}
              >
                {section.year}
              </h1>
              <div className="w-[2px] h-full bg-white/40 mt-2"></div>
            </div>

            {/* Right Side First Item */}
            <div className="flex-1 flex justify-start pl-6">
              {section.items[0] && (
                <RoadmapItem
                  title={section.items[0].title}
                  description={section.items[0].description}
                  visible={visibleYears.has(section.year)}
                  delay={800}
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
                    delay={800}
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
  delay?: number;
}

const RoadmapItem: React.FC<RoadmapItemProps> = ({
  title,
  description,
  visible,
  delay = 0,
}) => {
  return (
    <div
      className={`p-4 rounded-xl w-[280px] md:w-[400px] transition-all duration-700 ease-out transform ${
        visible ? "translate-y-0 opacity-100" : "translate-y-60 opacity-0"
      }`}
      style={{
        transitionDelay: visible ? `${delay + 800}ms` : "0ms",
      }}
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
