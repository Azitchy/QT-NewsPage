import { HeadingWithDots } from "@/components/HeadingWithDots";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const prTabs = {
  pr: {
    id: "pr",
    name: "PR",
    heading: "What is PageRank?",
    image: "./pr-img.png",
    alt: "PageRank Algorithm",
  },
  strengths: {
    id: "strengths",
    name: "Strengths",
    heading: "Strengths of PageRank",
    image: "./strengths-img.png",
    alt: "PageRank Strengths",
  },
  create: {
    id: "create",
    name: "Create",
    heading: "How to create a PR node",
    image: "./create-img.png",
    alt: "Create PR Node",
  },
  income: {
    id: "income",
    name: "Income",
    heading: "Income from PR node",
    image: "./income-img.png",
    alt: "Income from PR Node",
  },
};

// Reusable Image Component
const TabImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="mb-[20px] desktop:mb-0 desktop:flex-shrink-0 w-full desktop:w-fit">
    <img
      src={src}
      alt={alt}
      className="w-full h-[300px] desktop:h-[370px] object-cover rounded-3xl"
    />
  </div>
);

export const PrAlgorithmSection = (): JSX.Element => {
  return (
    <div className="pt-[60px] desktop:pt-[100px]">
      <HeadingWithDots text="Pr Algorithm" />
      <Tabs defaultValue="pr" className="mx-auto flex flex-col">
        {/* Tabs Header */}
        <div className="flex justify-center desktop:justify-end">
          <TabsList className="flex bg-transparent rounded-[40px] border border-[#eeeeee] p-[5px] h-auto gap-[10px] my-[20px]">
            {Object.values(prTabs).map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="inline-flex items-start justify-center px-[15px] py-2.5 rounded-[100px] overflow-hidden hover:bg-[#f6f6f6] data-[state=active]:bg-[#e9f6f7] !shadow-none"
              >
                <span className="relative text-primary-colour w-fit mt-[-1px] ">
                  {tab.name}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* PR Tab */}
        <TabsContent value={prTabs.pr.id} className="w-full">
          <div className="flex flex-col desktop:flex-row items-start desktop:gap-[50px]">
            <TabImage src={prTabs.pr.image} alt={prTabs.pr.alt} />
            <div className="text-center desktop:text-left desktop:flex-1">
              <h3 className="self-stretch text-[#1C1C1C] text-left font-normal font-inter text-[20px] leading-[27px] desktop:text-[26px] desktop:leading-[34px] mb-[20px]">
                {prTabs.pr.heading}
              </h3>
              <div className="text-left font-normal font-inter text-[14px] leading-[19px] desktop:text-[16px] desktop:leading-[24px]">
                <p className="self-stretch text-[#1C1C1C]">
                  PageRank refers to the core algorithm of Google’s search engine, and it is an algorithm for ranking the importance of webpages on the Internet. The reason why it is called “PageRank” is that such algorithm is used to rank webpages and was first proposed by Larry Page, the Google co-founder. Equivalently, we use the consensus connection between users to replace the link between web pages in the original PageRank algorithm, and calculate the PR value of each user node in the ATM network to represent the user's influence in the community.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Strengths Tab */}
        <TabsContent value={prTabs.strengths.id} className="w-full">
          <div className="flex flex-col desktop:flex-row items-start desktop:gap-[50px]">
            <TabImage src={prTabs.strengths.image} alt={prTabs.strengths.alt} />
            <div className="text-center desktop:text-left desktop:flex-1">
              <h3 className="self-stretch text-[#1C1C1C] text-left font-normal font-inter text-[20px] leading-[27px] desktop:text-[26px] desktop:leading-[34px] mb-[20px]">
                {prTabs.strengths.heading}
              </h3>
              <div className="text-left font-normal font-inter text-[14px] leading-[19px] desktop:text-[16px] desktop:leading-[24px]">
                <p className="self-stretch text-[#1C1C1C] mb-[20px]">
                  When Google was first established websites were ranked by traffic, not by an intelligent algorithm. This method was unstable and was open to exploitation - which meant that important websites often got lost.
                </p>
                <p>
                  By looking at the relationships between websites, and not their network traffic, PageRank looks to solve this problem. The algorithm is naturally resistant to various cheating websites, and only those that are influential can be found.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Create Tab */}
        <TabsContent value={prTabs.create.id} className="w-full">
          <div className="flex flex-col desktop:flex-row items-start desktop:gap-[50px]">
            <TabImage src={prTabs.create.image} alt={prTabs.create.alt} />
            <div className="text-center desktop:text-left desktop:flex-1">
              <h3 className="self-stretch text-[#1C1C1C] text-left font-normal font-inter text-[20px] leading-[27px] desktop:text-[26px] desktop:leading-[34px] mb-[20px]">
                {prTabs.create.heading}
              </h3>
              <div className="text-left font-normal font-inter text-[14px] leading-[19px] desktop:text-[16px] desktop:leading-[24px]">
                <p className="self-stretch text-[#1C1C1C] mb-[20px]">
                  Any user can build ATM&apos;s PageRank computing server, and elect the top 11 servers with the highest stake by pledging ATM&apos;s native currency (LUCA). These servers work together for executing the PageRank algorithm, calculate and synchronise the daily PR value of all users on the ATM network.
                </p>
                <Button
                  variant="ghost"
                  className="w-fit inline-flex items-center gap-[10px] p-0 rounded-[30px]"
                >
                  <span className="text-primary-colour font-inter text-[14px] font-normal leading-[19px]">
                    Create node
                  </span>
                  <img
                    className="w-[33px] h-[33px]"
                    alt="Arrow right icon"
                    src="/arrow-right-icon.svg"
                  />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Income Tab */}
        <TabsContent value={prTabs.income.id} className="w-full">
          <div className="flex flex-col desktop:flex-row items-start desktop:gap-[50px]">
            <TabImage src={prTabs.income.image} alt={prTabs.income.alt} />
            <div className="text-center desktop:text-left desktop:flex-1">
              <h3 className="self-stretch text-[#1C1C1C] text-left font-normal font-inter text-[20px] leading-[27px] desktop:text-[26px] desktop:leading-[34px] mb-[20px]">
                {prTabs.income.heading}
              </h3>
              <div className="text-left font-normal font-inter text-[14px] leading-[19px] desktop:text-[16px] desktop:leading-[24px]">
                <p className="self-stretch text-[#1C1C1C] mb-[20px]">
                  <span className="text-primary-colour">Operation rewards</span> <br />
                  Users and server operators involving in the PageRank computing server stake will receive the corresponding node operation rewards.
                </p>
                <p className="self-stretch text-[#1C1C1C] mb-[20px]">
                  <span className="text-primary-colour">Stake rewards</span> <br />
                  User with a higher pledging ratio in the server node could receive more rewards.
                </p>
                <p className="self-stretch text-[#1C1C1C] mb-[20px]">
                  <span className="text-primary-colour">Consensus rewards</span> <br />
                  The greater the strength of the consensus connection between users, the higher the income distributed by PR computing power.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
