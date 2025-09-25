import React, { useState, useEffect } from "react";
import { fetchContractInfo, ContractInfoItem } from "../../../../lib/webApi";

const ContractCard: React.FC<{
  contract: ContractInfoItem;
}> = ({ contract }) => {
  const getButtons = () => {
    switch (contract.type) {
      case 1:
      case 2:
        return [
          <a
            key="view-all"
            href={`https://bscscan.com/address/${contract.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-[14px] leading-[19px] font-normal px-[10px] lg:px-[20px] py-[12px] rounded-full bg-primary-foreground text-primary hover:bg-sky-100 transition"
          >
            View all
          </a>,
        ];
      case 3:
        return [
          <a
            key="source-code"
            href="https://github.com/ATM-Developer/atm-contract/tree/main/contracts"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-[14px] leading-[19px] font-normal px-[10px] lg:px-[20px] py-[12px] rounded-full bg-primary-foreground text-primary hover:bg-sky-100 transition"
          >
            View source code
          </a>,
          <button
            key="connections"
            className="flex-1 text-center text-[14px] leading-[19px] font-normal px-[10px] lg:px-[20px] py-[12px] rounded-full bg-primary-foreground text-primary hover:bg-sky-100 transition"
            onClick={() => {
              // Navigate to consensus connections tab
              window.location.hash = "#consensus";
            }}
          >
            View all connections
          </button>,
        ];
      case 4:
        return [
          <a
            key="source-code"
            href="https://github.com/ATM-Developer/atm-contract/tree/main/contracts"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-[14px] leading-[19px] font-normal px-[10px] lg:px-[20px] py-[12px] rounded-full bg-primary-foreground text-primary hover:bg-sky-100 transition"
          >
            View source code
          </a>,
          <button
            key="connections"
            className="flex-1 text-center text-[14px] leading-[19px] font-normal px-[10px] lg:px-[20px] py-[12px] rounded-full bg-primary-foreground text-primary hover:bg-sky-100 transition"
            onClick={() => {
              // Navigate to stake transactions tab
              window.location.hash = "#stake";
            }}
          >
            View all connections
          </button>,
        ];
      default:
        return [
          <a
            href={`https://bscscan.com/address/${contract.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-[14px] leading-[19px] font-normal px-[10px] lg:px-[20px] py-[12px] rounded-full bg-primary-foreground text-primary hover:bg-sky-100 transition"
          >
            View all
          </a>,
        ];
    }
  };

  const getContractName = () => {
    // Try to get localized name, fallback to English name
    return contract.name || contract.nameEn || "Unknown Contract";
  };

  return (
    <div className="dark:bg-card rounded-[10px] w-full font-inter p-4 lg:p-6 flex flex-col gap-1">
      <div className="flex justify-between items-center mb-[4px]">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-primary"></span>
          <h2 className="font-light font-inter text-foreground text-[16px] leading-[22px] lg:text-[20px] lg:leading-[27px]">
            {getContractName()}
          </h2>
        </div>
        <span className="text-[12px] text-foreground leading-[17px] px-[10px] py-[8px] bg-[#EEEEEE] dark:bg-[#504F63] rounded-full">
          {contract.transactions.toLocaleString()} Transactions
        </span>
      </div>

      <p
        className="text-[14px] max-w-[300px] md:max-w-full truncate leading-[19px] font-normal text-card-foreground mb-[40px]"
        title={contract.address}
      >
        {contract.address}
      </p>

      <div className="mb-[40px]">
        <p className="text-[14px] leading-[19px] font-normal text-foreground mb-[5px]">
          Contract account balance
        </p>
        <p className="font-light text-[16px] leading-[22px] lg:text-[20px] lg:leading-[27px] text-foreground mb-[5px]">
          {contract.balance}
        </p>
        <p className="text-[12px] leading-[17px] font-normal text-card-foreground">
          Last Balance Update: {contract.lastBlock || "N/A"}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mt-2">{getButtons()}</div>
    </div>
  );
};

const ContractInformation = () => {
  const [contracts, setContracts] = useState<ContractInfoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await fetchContractInfo();
        setContracts(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching contract information:", err);
        setError("Failed to load contract information");
        setContracts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 mt-10 md:mt-0 md:grid-cols-2 gap-12 md:gap-6 p-0 lg:p-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="dark:bg-card rounded-[10px] w-full p-4 lg:p-6 h-64 flex items-center justify-center"
          >
            <div className="text-card-foreground">
              Loading contract {idx + 1}...
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 mt-10 md:mt-0 md:grid-cols-2 gap-12 md:gap-6 p-0 lg:p-6">
        <div className="dark:bg-card rounded-[10px] w-full p-4 lg:p-6 h-64 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="grid grid-cols-1 mt-10 md:mt-0 md:grid-cols-2 gap-12 md:gap-6 p-0 lg:p-6">
        <div className="dark:bg-card rounded-[10px] w-full p-4 lg:p-6 h-64 flex items-center justify-center">
          <div className="text-card-foreground">
            No contract information available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 mt-10 md:mt-0 md:grid-cols-2 gap-12 md:gap-6 p-0 lg:p-6">
      {contracts.map((contract, idx) => (
        <ContractCard key={idx} contract={contract} />
      ))}
    </div>
  );
};

export default ContractInformation;
