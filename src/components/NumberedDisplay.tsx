import { useState } from "react";

export type NumberedItem = {
  id: number;
  number: string | number;
  description: string;
};

export type NumberedDisplayProps = {
  items: NumberedItem[];
  className?: string;
  activeColor?: string; 
  inactiveColor?: string; 
};

const NumberedDisplay: React.FC<NumberedDisplayProps> = ({
  items,
  className = "",
  activeColor = "text-primary",
  inactiveColor = "text-[#F2F9FF] dark:text-[#40576A]",
}) => {
  const [active, setActive] = useState<number>(items[0]?.id ?? 0);
  const activeIndex = items.findIndex((p) => p.id === active);

  return (
    <div
      className={`max-w-[1145px] flex justify-center items-center relative w-full py-[20px] ${className}`}
    >
      {/* Desktop / Large Screen */}
      <div className="hidden md:flex flex-row items-center transition-all duration-700 ease-in-out space-x-8">
        {items.map((item) => {
          const isActive = item.id === active;
          const isNext =
            active !== items.length && item.id === items[activeIndex + 1]?.id;

          return (
            <div
              key={item.id}
              onClick={() => setActive(item.id)}
              className="flex items-center cursor-pointer transition-all duration-700 ease-in-out"
            >
              {/* Number */}
              <span
                className={`font-bold transition-all duration-700 ease-in-out ${
                  isActive
                    ? `text-[150px] xl:text-[250px] ${activeColor}`
                    : `text-[150px] xl:text-[250px] ${inactiveColor}`
                }`}
              >
                {item.number}
              </span>

              {/* Active Description */}
              {isActive && (
                <div className="ml-4 transition-all duration-700 ease-in-out">
                  <p className="font-normal font-[Inter] text-[14px] leading-[19px] xl:text-[16px] xl:leading-[24px]">
                    {item.description}
                  </p>
                </div>
              )}

              {/* Next blurred preview */}
              {isNext && (
                <div className="ml-4 relative w-[150px] h-[80px] overflow-hidden">
                  <p className="font-normal font-[Inter] text-[14px] leading-[19px] xl:text-[16px] xl:leading-[24px] opacity-70 blur-[1.5px]">
                    {item.description}
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/70 to-background"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Version */}
      <div className="flex flex-col items-center justify-center space-y-6 md:hidden w-full">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-[15px] items-center justify-center"
          >
            <span className={`w-[105px] text-[140px] font-bold ${inactiveColor}`}>
              {item.number}
            </span>
            <p className="text-[14px] leading-[19px] w-[240px]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NumberedDisplay;
