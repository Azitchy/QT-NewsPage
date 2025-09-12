import { HeadingWithDots } from "@/components/HeadingWithDots"

export const AutonomySection = (): JSX.Element => {
    return (
        <div className="relative pt-[60px] desktop:pt-[100px]">

        {/* Background image */}
        <img
            className="absolute top-0 right-0 large:-right-96 w-[556px] h-[556px] object-cover z-0"
            alt="Bg"
            src="/bg-decentralisedmsgsg-1.svg"
        />

        {/* Heading (ensure above bg) */}
        <div className="relative z-10">
            <HeadingWithDots text="autonomy" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-5 text-center">
            <h2 className="font-titles-h5-large-text-400 text-[#1c1c1c] tracking-[var(--titles-h5-large-text-400-letter-spacing)] leading-[var(--titles-h5-large-text-400-line-height)]">
            Unlock a new era of communication
            </h2>

            <h1 className="text-[#1C1C1C] font-light text-[26px] leading-[32px] tablet:text-[32px] tablet:leading-[40px] font-['Space_Grotesk']">
            Say goodbye to centralised control and hello to security.{" "}
            <span className="bg-gradient-to-tr from-[#AADA5D] to-[#0DAEB9] bg-clip-text text-transparent font-bold">
                Experience true ownership of your data and the power to communicate
            </span>{" "}
            without fear of censorship or surveillance.
            </h1>

            <p className="font-body-body1-300 text-[#1c1c1c] tracking-[var(--body-body1-300-letter-spacing)] leading-[var(--body-body1-300-line-height)] md:pb-[60px]">
            Try our platform today and embrace the future of messaging!
            </p>
        </div>
        </div>        
    )
}

