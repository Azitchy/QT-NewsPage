import React from "react";

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
          font-titles-h2-sectionheading-400
          font-[number:var(--titles-h2-sectionheading-400-font-weight)]
          text-primary-colour
          text-[length:var(--titles-h2-sectionheading-400-font-size)]
          tracking-[var(--titles-h2-sectionheading-400-letter-spacing)]
          leading-[var(--titles-h2-sectionheading-400-line-height)]
          whitespace-nowrap
          [font-style:var(--titles-h2-sectionheading-400-font-style)]
        "
      >
        {text}
      </h2>
    </div>
  );
};
