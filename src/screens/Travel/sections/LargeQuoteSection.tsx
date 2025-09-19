export const LargeQuoteSection = (): JSX.Element => {
  return (
    <section className="">
        <div className="relative pt-[60px] pb-[130px] desktop:pt-[100px] max-w-[749px] desktop:max-w-[1159px] mx-auto text-center space-y-[20px]">
            <p className="text-[20px] font-normal leading-[27px] desktop:text-[26px] desktop:leading-[34px]">
                A shared vision
            </p>

            <h1 className="font-['Space_Grotesk'] text-[26px] font-bold leading-[34px] desktop:text-[38px] desktop:leading-[48px]">
                We aim to offer a{" "}
                <span className="bg-gradient-to-tr from-[#AADA5D] to-[#0DAEB9] bg-clip-text text-transparent font-bold">
                seamless and efficient solution for booking hotels, providing highly
                competitive rates
                </span>
            </h1>

            <p className="text-[18px] font-light leading-[24px] desktop:text-[20px] desktop:leading-[27px]">
                Sourced from a wide network of trusted providers that benefits ATM
                community
            </p>

            {/* Background image */}
            <img
                src="/imgbgflight-1.png"
                alt="Plane Flight Background"
                className="absolute left-1/4 translate-x-2/4 md:left-3/4 md:translate-x-1/2 tablet:left-3/4 tablet:translate-x-3/4 bottom-4/4 -translate-y-1/4 md:top-1/3 md:-translate-y-1/2 tablet:top-6 tablet:-translate-y-4 w-[271px] h-[242px] desktop:w-[338px] desktop:h-[302px]"
            />
        </div>
    </section>
  );
};
