import React from "react";

const contracts = [
  {
    title: "Issuance Contract",
    address: "0x51E6Ac1533032E72e92094867fD5921e3ea1bfa0",
    transactions: 1259,
    balance: "1545092.480800884688485621 LUCA",
    lastUpdate: "Block #37086783",
    buttons: ["View all"],
  },
  {
    title: "Community Fund Contract",
    address: "0x0d5A17FE28089e7C16d219e25B7277E0f6B70C39",
    transactions: 0,
    balance: "0 LUCA",
    lastUpdate: "Block #",
    buttons: ["View all"],
  },
  {
    title: "Consensus Connection Factory Contract",
    address: "0x8f827eCe944A0d54cfcD94D8775b23A980F37cdA",
    transactions: 67604,
    balance: "67042 LUCA",
    lastUpdate: "Block #37100247",
    buttons: ["View source code", "View all connections"],
  },
  {
    title: "PR Node Stake Contract",
    address: "0xEC56a45abFf41DF1746fDf4dedc45E909601aa02",
    transactions: 34405,
    balance: "36267658.5691000859 LUCA",
    lastUpdate: "Block #37100207",
    buttons: ["View source code", "View all connections"],
  },
];

const ContractCard: React.FC<(typeof contracts)[0]> = ({
  title,
  address,
  transactions,
  balance,
  lastUpdate,
  buttons,
}) => {
  return (
    <div className="dark:bg-card rounded-[10px] w-full font-inter p-4 lg:p-6 flex flex-col gap-1">
      <div className="flex justify-between items-center mb-[4px]">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-primary"></span>
          <h2 className="font-light font-inter text-foreground text-[16px] leading-[22px] lg:text-[20px] lg:leading-[27px]">
            {title}
          </h2>
        </div>
        <span className="text-[12px] text-foreground leading-[17px] px-[10px] py-[8px] bg-[#EEEEEE] dark:bg-[#504F63] rounded-full">
          {transactions} Transactions
        </span>
      </div>

      <p className="text-[14px] max-w-[300px] md:max-w-full truncate leading-[19px] font-normal text-card-foreground mb-[40px]">
        {address}
      </p>

      <div className="mb-[40px]">
        <p className="text-[14px] leading-[19px] font-normal text-foreground mb-[5px]">
          Contract account balance
        </p>
        <p className="font-light text-[16px] leading-[22px] lg:text-[20px] lg:leading-[27px] text-foreground mb-[5px]">
          {balance}
        </p>
        <p className="text-[12px] leading-[17px] font-normal text-card-foreground">
          Last Balance Update: {lastUpdate}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mt-2">
        {buttons.map((btn, i) => (
          <button
            key={i}
            className="flex-1 text-center text-[14px] leading-[19px] font-normal px-[10px] lg:px-[20px] py-[12px] rounded-full bg-primary-foreground text-primary hover:bg-sky-100 transition"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

const ContractInformation = () => {
  return (
    <div className="grid grid-cols-1 mt-10 md:mt-0 md:grid-cols-2 gap-12 md:gap-6 p-0 lg:p-6">
      {contracts.map((contract, idx) => (
        <ContractCard key={idx} {...contract} />
      ))}
    </div>
  );
};

export default ContractInformation;
