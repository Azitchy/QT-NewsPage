import { InfoIcon, PenLine, Check } from "lucide-react";
import React, { useState } from "react";
import LucaIcon from "@/assets/icons/luca-icon.png";
import UserIcon from "@/assets/icons/user-icon.png";

type BalanceSectionProps = {
  onSeeHistory: () => void;
};

export default function BalanceSection({ onSeeHistory }: BalanceSectionProps) {
  const [name, setName] = useState("Peter");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  const hideAddress = (address: string) => {
    return address
      ? `${address.substring(0, 6)}...${address.substring(address.length - 6)}`
      : "";
  };

  const handleEditClick = () => {
    setTempName(name);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setName(tempName.trim() || name);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col flex-1 md:min-w-110">
      {/* Main Profile Card */}
      <div className="bg-card rounded-2xl p-5 w-full max-w-xl shadow relative">
        <div className="flex items-center gap-4">
          <img
            src={UserIcon}
            alt="Avatar"
            className="w-17.5 h-17.5 rounded-full object-cover"
          />

          <div className="flex flex-col">
            {/* Name Row */}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="body-text-600 text-foreground bg-transparent focus:outline-none w-fit"
                    autoFocus
                  />
                  <Check
                    className="text-primary w-5 h-5 cursor-pointer"
                    onClick={handleSaveClick}
                  />
                </>
              ) : (
                <>
                  <span className="body-text-600 text-foreground">{name}</span>
                  <PenLine
                    className="text-primary w-5 h-5 cursor-pointer"
                    onClick={handleEditClick}
                  />
                </>
              )}
            </div>

            {/* Address */}
            <div className="flex items-center gap-2 body-text1-400 text-foreground">
              {hideAddress("0xb6c83fa7bb9b5c23e96130cdefd70977460031b9")}

              <div className="relative group">
                <InfoIcon className="w-5 h-5 cursor-pointer text-[#B5B5B5]" />

                {/* Tooltip */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 
                  hidden group-hover:block z-50"
                >
                  {/* Arrow */}
                  <div className="w-4 h-2 bg-background rotate-45 mx-auto -mb-1"></div>

                  <div className="bg-background body-text2-400 px-3 py-5 rounded-lg shadow-lg whitespace-nowrap">
                    0xb6c83fa7bb9b5c23e96130cdefd70977460031b9
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="flex items-center justify-between mt-5">
          <div>
            <p className="text-foreground font-h4-400">Balance</p>
            <p className="text-[#119B56] font-h2  mt-1">232.23 LUCA</p>
          </div>
          <div>
            <img src={LucaIcon} alt="luca" className="w-14 h-14" />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mt-4 w-full max-w-xl h-[105px] md:h-35">
        <div className="bg-card  rounded-2xl p-3 md:p-5 shadow">
          <p className="text-[#878787] text-[12px] md:text-[15px]  font-normal">
            PR Value
          </p>
          <p className="font-h4-600 mt-1">15.33</p>
        </div>

        <div className="bg-card rounded-2xl p-3 md:p-5 shadow">
          <p className="text-[#878787] text-[12px] md:text-[15px]  font-normal">
            ATM stars
          </p>
          <p className="font-h4-600 mt-1">234</p>
        </div>

        <div className="bg-card rounded-2xl p-3 md:p-5 shadow relative">
          <p className="text-[#878787] text-[12px] md:text-[15px] font-normal">
            AGT Balance
          </p>
          <p className="font-h4-600 mt-1">180</p>
          <a
            onClick={onSeeHistory}
            className="body-text2-500 text-primary mt-2 cursor-pointer"
          >
            See history
          </a>
        </div>
      </div>
    </div>
  );
}
