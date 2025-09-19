export const HeroSection = (): JSX.Element => {
    const heroSection = {
        highlightedtext: "Unleash the power of connection:",
        text: "redefining community interactions through decentralisation",

    };

    return (
      <section className="w-full flex justify-center">
        {/* Desktop / Tablet Hero */}
        <div
          className="hidden md:flex relative w-full max-w-[1728px] h-[450px] items-center justify-end bg-no-repeat bg-contain bg-right"
          style={{ backgroundImage: "url('../community-heroimg.png')" }}
        >
          <div className="w-1/2 flex justify-center pr-6">
            <h1 className="relative z-10 text-left font-[300] text-[26px] leading-[32px] tablet:text-[32px] tablet:leading-[40px] font-['Space_Grotesk'] max-w-[512px] max-w-[758px]">
              <span className="bg-gradient-to-tr from-[#AADA5D] to-[#0DAEB9] bg-clip-text text-transparent font-bold">
                {heroSection.highlightedtext}{" "}
              </span>
              {heroSection.text}
            </h1>
          </div>
        </div>

        {/* Mobile Hero */}
        <div
          className="flex md:hidden relative w-[393px] h-[415px] items-end justify-center bg-no-repeat bg-contain bg-center"
          style={{ backgroundImage: "url('../community-mob-heroimg.png')" }}
        >
          <h1 className="z-10 px-4 pb-4 font-[300] text-[20px] leading-[28px] font-['Space_Grotesk'] max-w-[360px]">
            <span className="bg-gradient-to-tr from-[#AADA5D] to-[#0DAEB9] bg-clip-text text-transparent font-bold">
              {heroSection.highlightedtext}{" "}
            </span>
            {heroSection.text}
          </h1>
        </div>
      </section>        
    )
}
