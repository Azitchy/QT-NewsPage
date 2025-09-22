import { HeadingWithDots } from "@/components/HeadingWithDots";

export const CommunityFoundationSection = (): JSX.Element => {
  return (
    <section className="pt-[60px] xl:pt-[100px]">
        <HeadingWithDots text="community foundation" />
        <div className="px-0 tablet:px-[77px] xl:px-[134px] large:px-[203px] flex flex-col xl:flex-row xl:gap-[50px]">
          <div
            className="pt-[20px] flex flex-col gap-[20px] font-light text-[18px] leading-[24px] xl:text-[20px] xl:leading-[27px] max-w-[516px] 
              xl:max-w-[782px]"
          >
            <p>
                The community foundation belongs to all users. Its {" "}
                <span className="font-medium">
                    accounts are fully autonomous, and the private key of the foundation wallet is jointly held by the directors of the foundation.
                </span>
            </p>

            <p>
                The fund management board is composed of the 47 users with the highest PR value in the community. 
                The board of directors has executive power, {" "}
                <span className="font-medium">
                    but the final decision always belongs to all members of the community {" "}
                </span>
                via voting on proposals.
            </p>

            <p>
                <span className="font-medium">
                    Funds require approval by over half of the board of directors.{" "}
                </span>
                Inactive members are replaced by the algorithm, with the next highest PR user taking their place as director.
            </p>
          </div>
          <div className="flex justify-end">
            <img
                className="w-full max-w-[370px] xl:w-[514px] h-auto object-contain"
                alt="LUCA Rewards Illustration"
                src="/comm-foundation-img.svg"
            />
          </div>
        </div>
    </section>
  );
};
