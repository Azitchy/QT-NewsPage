import React, { useEffect, useState } from "react";
import { RoadmapSection } from "./sections/RoadmapSection";
import Timeline from "./sections/TimeLine";
import { FooterSection } from "../../components/FooterSection";

export const Roadmap = () => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isLargeScreen = windowWidth >= 1024;

  return (
    <div>
      {isLargeScreen ? (
        <>
          {" "}
          <RoadmapSection />
          <FooterSection />
        </>
      ) : (
        <>
          {" "}
          <Timeline />
          <FooterSection />
        </>
      )}
    </div>
  );
};
