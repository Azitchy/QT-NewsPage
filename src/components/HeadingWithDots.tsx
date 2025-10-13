import * as React from "react";

interface HeadingWithDotsProps {
  text: string;
}

export const HeadingWithDots: React.FC<HeadingWithDotsProps> = ({ text }) => {
  return (
    <div className="relative w-[195px] h-[99px]">
      {/* Decorative dots */}
      <img
        src="/dots.svg"
        alt="Dots"
        className="absolute top-0 left-0 w-[99px] h-[99px]"
      />

      {/* Heading text */}
      <h2
        className="
          absolute left-[49px] top-[27px] h-11
          font-bebas-neue
          font-normal
          text-primary-colour
          text-[38px]
          tracking-[0px]
          leading-[42px]
          whitespace-nowrap
        "
      >
        {text}
      </h2>
    </div>
  );
};
