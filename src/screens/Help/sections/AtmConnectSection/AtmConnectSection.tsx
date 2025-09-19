import { HeadingWithDots } from "@/components/HeadingWithDots";

export const AtmConnectSection = (): JSX.Element => {

    return (
      <section className="px-[16px] md:px-[70px] large:px-[120px] pt-[60px] desktop:pt-[100px] flex flex-col md:flex-row items-start md:items-center gap-[50px] desktop:gap-[120px]">
        <div>
            <HeadingWithDots text="atm connect" />
            <div className="pl-0 tablet:pl-[77px] desktop:pl-[134px] large:pl-[203px] gap-[20px] desktop:gap-[40px] flex flex-col">
                <p className="pt-[20px] font-light font-body text-[18px] leading-[24px] desktop:text-[20px] desktop:leading-[27px] tablet:max-w-[516px] desktop:max-w-[782px]">
                    Unlock the ultimate convenience with the {" "}
                    <span className="font-medium">
                    ATM Connect app – your go-to solution for seamless connectivity on the go! {" "}
                    </span>
                        Seamlessly connect with friends, access your wallet, keep track of your connections, 
                    and dive into your personalised dashboard, all from the palm of your hand.
                </p>
                <div>
                    <h5 className="font-normal not-italic leading-[27px] text-[20px] md:text-[26px] md:leading-[34px] font-[Inter]">
                        Download the ATM Connect app now!
                    </h5>
                    <div className="py-[20px] flex items-center gap-[20px]">
                        <img
                            className="w-[174px] h-[51px]"
                            alt="Google Play Store"
                            src="/google-play-badge.png"
                        />
                        <img
                            className="w-[150px] h-[51px]"
                            alt="App Store"
                            src="/apple-store-badge.png"
                        />
                    </div>
                </div>
            </div>
        </div>
        <img
            className="w-[342px] desktop:w-[592px] h-[283px] desktop:h-[386px] object-contain mx-auto tablet:mx-0"
            alt="ATM Connect App"
            src="/atm-connect-img.png"
        />
      </section>        
    )
}