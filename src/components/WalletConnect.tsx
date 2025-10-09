import * as React from "react";
import { useState } from "react";
import { WalletModal } from "@/components/WalletModal";

export const WalletConnect: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Hero Section with Background Image */}
      <div className="w-full h-[92vh] overflow-hidden bg-white dark:bg-[#1a1d2e] relative">
        <div
          className="absolute inset-0 bg-no-repeat bg-center bg-contain h-[70vh]"
          style={{ backgroundImage: "url('/atm-ecosystem.svg')" }}
        />

        <img
          src="/webapp/webApp-BG.0dd7e52b.png"
          alt="Characters and devices"
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[1300px] h-auto object-contain pointer-events-none"
        />

        {/* Centered Wallet Button */}
        <div className="absolute inset-0 -top-40 mobile:-top-48 flex items-center justify-center z-10">
          <button
            onClick={() => setShowModal(true)}
            className="px-[30px] sm:px-16 py-[20px] sm:py-5 bg-gradient-to-r from-[#AAD95D] to-[#0DAEB9] hover:from-[#9BC850] hover:to-[#0C9DA7] text-white text-[18px] sm:text-[20px] lg:text-[28px] rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Wallet
          </button>
        </div>
      </div>

      {/* Wallet Modal */}
      <WalletModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
};