import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const avatarTabs = {
  about: {
    id: "about",
    name: "About",
    heading: "What is AVATAR?",
    image: "./about-img.png",
    alt: "Avatar About",
  },
  create: {
    id: "create",
    name: "Create",
    heading: "Craft your AVATAR",
    image: "./create-img.png",
    alt: "Avatar Create",
  },
  train: {
    id: "train",
    name: "Train",
    heading: "Train it to be like you",
    image: "./train-img.png",
    alt: "Avatar Train",
  },
  share: {
    id: "share",
    name: "Share",
    heading: "Share your AVATAR with friends",
    image: "./share-img.png",
    alt: "Avatar Share",
  },
};

const TabImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="mb-[20px] desktop:mb-0 desktop:flex-shrink-0 w-full desktop:w-fit">
    <img
      src={src}
      alt={alt}
      className="w-full h-[300px] desktop:h-[370px] object-cover rounded-3xl"
    />
  </div>
);

export const AvatarTabs = (): JSX.Element => {
  return (
    <div className="pt-[60px] desktop:pt-[100px] max-w-[1600px] mx-auto pb-[90px] tablet:pb-[75px] desktop:pb-0">
      <Tabs defaultValue="about" className="mx-auto flex flex-col">
        {/* Tabs Header */}
        <div className="flex justify-center desktop:justify-end">
          <TabsList className="flex bg-transparent rounded-[40px] border border-border p-[5px] h-auto gap-[10px] my-[20px]">
            {Object.values(avatarTabs).map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="inline-flex items-start justify-center px-[15px] py-2.5 rounded-[100px] overflow-hidden hover:bg-border data-[state=active]:bg-primary-foreground !shadow-none"
              >
                <span className="relative text-primary w-fit mt-[-1px] ">
                  {tab.name}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* About Tab */}
        <TabsContent value={avatarTabs.about.id} className="w-full">
          <div className="flex flex-col desktop:flex-row items-start desktop:gap-[50px]">
            <TabImage src={avatarTabs.about.image} alt={avatarTabs.about.alt} />
            <div className="text-center desktop:text-left desktop:flex-1">
              <h3 className="self-stretch text-left font-normal font-inter text-[20px] leading-[27px] desktop:text-[26px] desktop:leading-[34px] mb-[20px]">
                {avatarTabs.about.heading}
              </h3>
              <div className="text-left font-normal font-inter text-[14px] leading-[19px] desktop:text-[16px] desktop:leading-[24px]">
                <p className="self-stretch">
                  AVATARS redefine digital presence by extending your consciousness and enhancing your abilities in the virtual realm. 
                  They go beyond mere assistants, representing the various facets of your life - from professional to personal spheres.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Create Tab */}
        <TabsContent value={avatarTabs.create.id} className="w-full">
          <div className="flex flex-col desktop:flex-row items-start desktop:gap-[50px]">
            <TabImage src={avatarTabs.create.image} alt={avatarTabs.create.alt} />
            <div className="text-center desktop:text-left desktop:flex-1">
              <h3 className="self-stretch text-left font-normal font-inter text-[20px] leading-[27px] desktop:text-[26px] desktop:leading-[34px] mb-[20px]">
                {avatarTabs.create.heading}
              </h3>
              <div className="text-left font-normal font-inter text-[14px] leading-[19px] desktop:text-[16px] desktop:leading-[24px]">
                <p className="self-stretch mb-[20px]">
                  With Avatar, the power of creation is in your hands. Simply write a prompt, and watch as your vision comes to life before your eyes. 
                  Whether you envision a sleek professional or a whimsical adventurer, Avatar can embody any role you desire, bringing your digital dreams to fruition.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Train Tab */}
        <TabsContent value={avatarTabs.train.id} className="w-full">
          <div className="flex flex-col desktop:flex-row items-start desktop:gap-[50px]">
            <TabImage src={avatarTabs.train.image} alt={avatarTabs.train.alt} />
            <div className="text-center desktop:text-left desktop:flex-1">
              <h3 className="self-stretch text-left font-normal font-inter text-[20px] leading-[27px] desktop:text-[26px] desktop:leading-[34px] mb-[20px]">
                {avatarTabs.train.heading}
              </h3>
              <div className="text-left font-normal font-inter text-[14px] leading-[19px] desktop:text-[16px] desktop:leading-[24px]">
                <p className="self-stretch mb-[20px]">
                  Your Avatar isn't just a static creation; it's a dynamic entity that evolves alongside you. 
                  Through personalized training sessions, you can upload documents and engage in Q&A sessions to refine your Avatar's consciousness. 
                  Watch as it learns from your behaviors, interests, and preferences, becoming an accurate reflection of your digital self.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Share Tab */}
        <TabsContent value={avatarTabs.share.id} className="w-full">
          <div className="flex flex-col desktop:flex-row items-start desktop:gap-[50px]">
            <TabImage src={avatarTabs.share.image} alt={avatarTabs.share.alt} />
            <div className="text-center desktop:text-left desktop:flex-1">
              <h3 className="self-stretch text-left font-normal font-inter text-[20px] leading-[27px] desktop:text-[26px] desktop:leading-[34px] mb-[20px]">
                {avatarTabs.share.heading}
              </h3>
              <div className="text-left font-normal font-inter text-[14px] leading-[19px] desktop:text-[16px] desktop:leading-[24px]">
                <p className="self-stretch mb-[20px]">
                  Once you've crafted your perfect Avatar, it's time to share the magic with your friends. With just a click, 
                  you can generate an AVATAR link and invite others to interact with your digital creation.
                  Whether it's introducing your Avatar to your social circle or connecting with friends through their Avatars, 
                  the possibilities for meaningful interaction are boundless.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};