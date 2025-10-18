import { InfoIcon, PenLine, Check } from "lucide-react";
import React, { useState } from "react";

export default function BalanceSection() {
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
    <div className="flex flex-col">
      {/* Main Profile Card */}
      <div className="bg-background dark:bg-[#15152B] rounded-2xl p-5 w-full max-w-xl shadow relative">
        <div className="flex items-center gap-4">
          <img
            src="/sidebar/user-icon.png"
            alt="Avatar"
            className="w-[70px] h-[70px] rounded-full object-cover"
          />

          <div className="flex flex-col">
            {/* Name Row */}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="font-semibold text-lg text-foreground bg-transparent focus:outline-none w-[100px]"
                    autoFocus
                  />
                  <Check
                    className="text-primary w-5 h-5 cursor-pointer"
                    onClick={handleSaveClick}
                  />
                </>
              ) : (
                <>
                  <span className="font-semibold text-lg text-foreground">
                    {name}
                  </span>
                  <PenLine
                    className="text-primary w-5 h-5 cursor-pointer"
                    onClick={handleEditClick}
                  />
                </>
              )}
            </div>

            {/* Address */}
            <div className="flex items-center gap-2 text-[16px] text-foreground">
              {hideAddress("0xb6c83fa7bb9b5c23e96130cdefd70977460031b9")}
              <InfoIcon className="w-5 h-5 cursor-pointer text-[#B5B5B5]" />
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="flex items-center justify-between mt-5">
          <div>
            <p className="text-foreground text-[20px]">Balance</p>
            <p className="text-[#119B56] text-3xl font-medium mt-1">
              232.23 LUCA
            </p>
          </div>
          <div>
            <img
              src="/sidebar/luca-icon.png"
              alt="luca"
              className="w-14 h-14"
            />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mt-4 w-full max-w-xl h-[105px] md:h-[140px]">
        <div className="bg-background dark:bg-[#15152B] rounded-2xl p-3 md:p-5 shadow">
          <p className="text-[#878787] text-[12px] md:text-[16px]  font-normal">
            PR Value
          </p>
          <p className="text-xl font-semibold mt-1">15.33</p>
        </div>

        <div className="bg-background dark:bg-[#15152B] rounded-2xl p-3 md:p-5 shadow">
          <p className="text-[#878787] text-[12px] md:text-[16px]  font-normal">
            ATM stars
          </p>
          <p className="text-xl font-semibold mt-1">234</p>
        </div>

        <div className="bg-background dark:bg-[#15152B] rounded-2xl p-3 md:p-5 shadow relative">
          <p className="text-[#878787] text-[12px] md:text-[16px] font-normal">
            AGT Balance
          </p>
          <p className="text-xl font-semibold mt-1">180</p>
          <a href="#" className=" text-sm text-primary font-medium mt-2">
            See history
          </a>
        </div>
      </div>
    </div>
  );
}
