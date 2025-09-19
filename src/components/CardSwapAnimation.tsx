import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Simple media query hook
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

function CardSwapAnimation() {
  const [activeTab, setActiveTab] = useState<"white-paper" | "audit-report">(
    "white-paper"
  );
  const isSwapped = activeTab === "audit-report";

  // 👉 responsive offsets
  const isLarge = useMediaQuery("(min-width: 1024px)"); // tailwind `lg`

  let CARD_OFFSET = 60; // default (medium screens)
  if (isLarge) CARD_OFFSET = 100; // wider on large screens

  const sharedTransition = {
    type: "spring",
    stiffness: 80,
    damping: 14,
    mass: 1,
  };

  const cardAVariants = {
    initial: { x: -CARD_OFFSET, scale: 1, zIndex: 2, transition: sharedTransition },
    swapped: { x: CARD_OFFSET, scale: 0.83, zIndex: 1, transition: sharedTransition },
  };

  const cardBVariants = {
    initial: { x: CARD_OFFSET, scale: 0.83, zIndex: 1, transition: sharedTransition },
    swapped: { x: -CARD_OFFSET, scale: 1, zIndex: 2, transition: sharedTransition },
  };

  return (
    <div className="flex flex-col items-center space-y-12">
      {/* Tabs */}
      <div className="flex bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("white-paper")}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "white-paper"
              ? "bg-teal-500 text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          White paper
        </button>
        <button
          onClick={() => setActiveTab("audit-report")}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "audit-report"
              ? "bg-teal-500 text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          Audit report
        </button>
      </div>

      {/* Animation Container */}
      <div className="relative w-full max-w-xl h-80 flex items-center justify-center">
        <motion.div
          className="absolute"
          variants={cardAVariants}
          animate={isSwapped ? "swapped" : "initial"}
        >
          <div className="w-40 h-56 bg-blue-200 rounded-2xl shadow-lg border border-blue-300 flex items-center justify-center">
            <div className="text-blue-900 font-semibold text-lg">White Paper</div>
          </div>
        </motion.div>

        <motion.div
          className="absolute"
          variants={cardBVariants}
          animate={isSwapped ? "swapped" : "initial"}
        >
          <div className="w-40 h-56 bg-gray-900 rounded-2xl shadow-lg border border-gray-700 flex items-center justify-center">
            <div className="text-white font-semibold text-lg">Audit Report</div>
          </div>
        </motion.div>
      </div>

      {/* Info Text */}
      <div className="text-center text-gray-300 max-w-md">
        <p className="text-sm">Current gap: {CARD_OFFSET * 2}px</p>
      </div>
    </div>
  );
}

export default function ResourcesTabCards() {
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          3D Card Swap Animation
        </h1>
        <CardSwapAnimation />
      </div>
    </main>
  );
}
