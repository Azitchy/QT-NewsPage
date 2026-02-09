import { useState, useEffect } from 'react';

interface SliderProps {
  onChange?: (percentage: number) => void;
  value: number;
}

export function Slider({ onChange, value }: SliderProps) {
  const [percentage, setPercentage] = useState(value);

  useEffect(() => {
    setPercentage(value);
  }, [value]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setPercentage(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="relative pt-[18px] pb-[2px]">
      {/* Percentage Display */}
      <div
        className="absolute top-0 transition-all duration-300 ease-out"
        style={{ 
          left: percentage <= 10 
            ? `${percentage}%` 
            : `calc(${percentage}% - 4rem)`
        }}
        >
        <div className="text-[20px] body-label-400 text-[#8E8E93]">
          {percentage}%
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative h-[5px]">
        {/* Background Track */}
        <div className="absolute w-full h-full bg-[#E5E5E5] rounded-full border border-white"></div>

        {/* Progress Track */}
        <div
          className="absolute h-full rounded-full bg-gradient-to-r from-[#A5DC53] to-[#5DD27A] border border-white transition-all duration-300 ease-out"
          style={{
            width: `${percentage}%`
          }}
        ></div>

        {/* Custom Slider Input */}
        <input
          type="range"
          min="0"
          max="100"
          value={percentage}
          onChange={handleSliderChange}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
      </div>
    </div>
  );
}