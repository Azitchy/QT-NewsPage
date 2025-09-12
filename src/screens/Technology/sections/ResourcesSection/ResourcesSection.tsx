import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const ResourcesSection = (): JSX.Element => {
  return (
    <div className="w-full bg-[#fbfbfb]">
      <Tabs
        defaultValue="white-paper"
        className="max-w-[1226px] px-[16px] pb-[85px] mx-auto flex flex-col items-center"
      >
        {/* Tabs Header */}
        <TabsList className="flex bg-transparent rounded-[40px] border border-[#eeeeee] p-[5px] h-auto gap-[10px] my-[20px]">
          <TabsTrigger
            value="white-paper"
            className="inline-flex items-center justify-center  px-[15px] py-2.5 rounded-[100px] overflow-hidden hover:bg-[#f6f6f6] data-[state=active]:bg-[#e9f6f7] !shadow-none"
          >
            <span className="w-fit mt-[-1px] font-body-body-4-400 font-[number:var(--body-body-4-400-font-weight)] text-[#2ea8af] text-[length:var(--body-body-4-400-font-size)] tracking-[var(--body-body-4-400-letter-spacing)] leading-[var(--body-body-4-400-line-height)] whitespace-nowrap [font-style:var(--body-body-4-400-font-style)]">
              White Paper
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="audit-report"
            className="inline-flex items-center justify-center  px-[15px] py-2.5 rounded-[100px] overflow-hidden hover:bg-[#f6f6f6] data-[state=active]:bg-[#e9f6f7] !shadow-none"
          >
            <span className="w-fit mt-[-1px] font-body-body-4-400 font-[number:var(--body-body-4-400-font-weight)] text-[#2ea8af] text-[length:var(--body-body-4-400-font-size)] tracking-[var(--body-body-4-400-letter-spacing)] leading-[var(--body-body-4-400-line-height)] whitespace-nowrap [font-style:var(--body-body-4-400-font-style)]">
              Audit Report
            </span>
          </TabsTrigger>
        </TabsList>

        {/* White Paper Content */}
        <TabsContent value="white-paper" className="w-full">
          <div className="flex flex-col desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-[190px] gap-[40px]">
            {/* Left Side Text */}
            <div className="flex flex-col desktop:max-w-[474px] tablet:px-[140px] desktop:px-0 gap-[20px]">
              <p className="self-stretch text-[#1c1c1c] font-inter text-[20px] font-[300] leading-[27px] ">
                Explore our white paper if you're interested in the behind the
                scenes and brains of the project - it outlines our aims,
                ambitions and technical solutions.
              </p>
              <Button
                variant="ghost"
                className="w-fit inline-flex items-center gap-[10px] p-0 rounded-[30px]"
              >
                <span className="text-primary-colour font-inter text-[14px] font-normal leading-[19px]">
                  View white paper
                </span>
                <img
                  className="w-[33px] h-[33px]"
                  alt="Arrow right icon"
                  src="/arrow-right-icon.svg"
                />
              </Button>
            </div>

            {/* Right Side Images */}
            <div className="flex justify-center items-center gap-[24px]">
              <img
                className="w-[291px] h-[413px] object-cover"
                alt="Whitepaper"
                src="/whitepaper-1.png"
              />
              <img
                className="w-[246px] h-[349px] object-cover hidden md:block"
                alt="Certij"
                src="/certij-1.png"
              />
            </div>
          </div>
        </TabsContent>

        {/* Audit Report Content */}
        <TabsContent value="audit-report" className="w-full">
          <div className="flex flex-col desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-[190px] gap-[40px]">
            {/* Left Side Text */}
            <div className="flex flex-col desktop:max-w-[474px] tablet:px-[140px] desktop:px-0 gap-6">
              <p className="self-stretch text-[#1c1c1c] font-inter text-[18px] leading-[24px] font-[300] desktop:text-[20px] desktop:leading-[27px] desktop:font-light">
                Dive into our project's detailed documentation for an in-depth
                look at its intricacies and strong foundation.
              </p>
              <Button
                variant="ghost"
                className="w-fit inline-flex items-center gap-[10px] p-0 rounded-[30px]"
              >
                <span className="text-primary-colour font-inter text-[14px] font-normal leading-[19px]">
                  View audit report
                </span>
                <img
                  className="w-[33px] h-[33px]"
                  alt="Arrow right icon"
                  src="/arrow-right-icon.svg"
                />
              </Button>
            </div>

            {/* Right Side Images (can replace with audit visuals) */}
            <div className="flex justify-center items-center gap-[24px]">
              <img
                className="w-[291px] h-[413px] object-cover"
                alt="Certij"
                src="/certij-1.png"
              />
              <img
                className="w-[246px] h-[349px] object-cover hidden md:block"
                alt="Whitepaper"
                src="/whitepaper-1.png"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
