import * as React from "react";

export function InstallWalletCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full max-w-[360px] h-[558px] 2xl:h-[720px] 2xl:max-w-[480px] bg-card border border-border shadow-md rounded-2xl overflow-hidden ${className}`}
    >
      <header className="px-6 py-4 flex items-center justify-center bg-primary-foreground">
        <h3 className="text-primary text-[20px] leading-[27px] font-normal 2xl:text-[26px] 2xl:leading-[34px]">
          1. Install wallet*
        </h3>
      </header>

      <div className="p-6 space-y-[10px] 2xl:space-y-[30px] font-normal font-[Inter] text-[16px] leading-[22px] 2xl:text-[18px] 2xl:leading-[24px]">
        <div className="border border-primary rounded-2xl p-3 flex items-start gap-3">
          <img className="w-5 h-5" alt="Tip icon" src="/light-bulb.svg" />
          <p className="text-primary text-[12px] leading-[17px] font-normal">
            To use ATM you need to have a wallet that is connected to the Binance Smart Chain.
          </p>
        </div>

        <p>
          Install or sign in to MetaMask using the button below and complete the setup.
        </p>

        <div className="flex justify-center">
          <a
            href="https://metamask.io/en-GB"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#e0f7fa] rounded-full"
          >
            <img className="w-5 h-5" alt="Metamask" src="/metamask.svg" />
            <span className="text-primary font-normal text-[14px] leading-[19px] 2xl:text-[16px] 2xl:leading-[24px]">
              MetaMask
            </span>
          </a>
        </div>

        <p>
          2. Click the 'Add BSC network' button to switch to the BSC network.
        </p>

        <div className="flex justify-center">
          <a
            href=""
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#e0f7fa] rounded-full"
          >
            <img className="w-5 h-5" alt="Binance" src="/binance-1.svg" />
            <span className="text-primary font-normal text-[14px] leading-[19px] 2xl:text-[16px] 2xl:leading-[24px]">
              Add BSC network
            </span>
          </a>
        </div>

        <p>
          If you're on mobile, reopen this page in the MetaMask app (Menu → Browser). Add LUCA, USDC, and AGT to your wallet using the buttons below.
        </p>

        <div className="flex gap-3 justify-center">
          <a
            href=""
            className="flex items-center gap-2 px-3 py-2 bg-[#e0f7fa] rounded-full"
          >
            <img className="w-4 h-4" alt="Luca" src="/luca.svg" />
            <span className="text-primary font-normal text-[14px] leading-[19px] 2xl:text-[16px] 2xl:leading-[24px]">
              LUCA
            </span>
          </a>

          <a
            href=""
            className="flex items-center gap-2 px-3 py-2 bg-[#e0f7fa] rounded-full"
          >
            <img className="w-4 h-4" alt="USDC" src="/usdc.svg" />
            <span className="text-primary font-normal text-[14px] leading-[19px] 2xl:text-[16px] 2xl:leading-[24px]">
              USDC
            </span>
          </a>

          <a
            href="/"
            className="flex items-center gap-2 px-3 py-2 bg-[#e0f7fa] rounded-full"
          >
            <img className="w-4 h-4" alt="AGT" src="/coin-icon.svg" />
            <span className="text-primary font-normal text-[14px] leading-[19px] 2xl:text-[16px] 2xl:leading-[24px]">
              AGT
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export function ConnectToATMCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full max-w-[360px] h-[558px] 2xl:h-[720px] 2xl:max-w-[480px] bg-card border border-border shadow-md rounded-2xl overflow-hidden ${className}`}
    >
      <header className="px-6 py-4 flex items-center justify-center bg-primary-foreground">
        <h3 className="text-primary text-[20px] leading-[27px] font-normal 2xl:text-[26px] 2xl:leading-[34px]">
          2. Connect to ATM
        </h3>
      </header>

      <div className="p-6 space-y-[10px] 2xl:space-y-[30px] font-normal text-[16px] leading-[22px] 2xl:text-[18px] 2xl:leading-[24px]">
        <p>Click 'Connect ATM' and sign the message to link your wallet.</p>

        <p>
          Don't worry, it's totally secure - it just lets us know that you're really the owner of the wallet!
        </p>

        <div className="border border-primary rounded-2xl p-3 flex items-start gap-3">
          <img className="w-5 h-5" alt="Tip icon" src="/light-bulb.svg" />
          <p className="text-primary text-[12px] leading-[17px] font-normal">
            Explore your dashboard to find everything you need, and click 'Create Connection' when you're ready to start building your social network.
          </p>
        </div>

        <p>
          Well, that's it! Click the button below and sign the message to begin your journey with ATM:
        </p>

        <div className="flex justify-center">
          <a
            href="/webapp"
            className="px-6 py-2 rounded-[20px] text-white font-normal text-[14px] leading-[19px] 2xl:text-[16px] 2xl:leading-[24px]"
            style={{
              background:
                "linear-gradient(136deg, rgba(170,218,93,1) 0%, rgba(13,174,185,1) 100%)",
            }}
          >
            Connect ATM
          </a>
        </div>
      </div>
    </div>
  );
}

export function FundWalletCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full max-w-[360px] h-[558px] 2xl:h-[720px] 2xl:max-w-[480px] bg-card border border-border shadow-md rounded-2xl overflow-hidden ${className}`}
    >
      <header className="px-6 py-4 flex items-center justify-center bg-primary-foreground">
        <h3 className="text-primary text-[20px] leading-[27px] font-normal 2xl:text-[26px] 2xl:leading-[34px]">
          3. Fund your wallet
        </h3>
      </header>

      <div className="space-y-[10px] 2xl:space-y-[30px] font-normal text-[16px] leading-[22px] 2xl:text-[18px] 2xl:leading-[24px]">
        <div className="px-6 pt-6 space-y-[10px] 2xl:space-y-[30px]">
          <p>
            If you have a new wallet, you'll need to fund it with BNB to use the Binance Smart Chain.
          </p>

          <p>
            Buy BNB in MetaMask using MoonPay or Transak, or purchase from Binance and send it to your wallet (recommended for advanced users).
          </p>
        </div>

        <div
          className="w-full bg-[#f9f4fe] rounded-lg px-[40px] py-[20px] flex flex-col gap-[5px] overflow-hidden"
        >
          <img
            className="w-[184px] h-[35px] object-contain"
            alt="MoonPay"
            src="/moonpay.svg"
          />
          <p className="text-[#1C1C1C] font-medium text-[18px] leading-[24px] 2xl:text-[20px] 2xl:leading-[27px]">
            Buy BNB with MoonPay
          </p>
          <p className="text-[#1C1C1C] font-normal text-[14px] leading-[19px]">
            MoonPay supports popular payment methods, including Visa, Mastercard, Apple / Google / Samsung Pay, and bank transfers in 145+ countries.
          </p>
        </div>

        <p className="pb-6 px-6">
          Once you have BNB, swap it for LUCA in MetaMask, or use PancakeSwap if you're more experienced. You can then stake LUCA in the network.
        </p>
      </div>
    </div>
  );
}
