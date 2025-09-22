import React from "react";

export const AuthorizationManagement = (): JSX.Element => {
  const contracts = [
    {
      title: "Consensus connection factory contract",
      address: "0x7b749e4d4C23556a772Aca4E00E283BEFd575b9B",
    },
    {
      title: "PR node stake contract",
      address: "0xEC56a45abFf41DF1746fDf4dedc45E909601aa02",
    },
    {
      title: "Private contract",
      address: "0x08b6FB844B40a218E44EA3a75a69634c0bbD2e5F",
    },
  ];

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 flex justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-8 text-center">
            Authorization Management
          </h2>
          <div className="space-y-4 sm:space-y-8">
            {contracts.map((contract) => (
              <div
                key={contract.address}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-teal-500 dark:bg-teal-400" />
                  <span className="font-medium text-gray-800 dark:text-gray-200 text-sm sm:text-base break-words">
                    {contract.title}
                  </span>
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm break-all pl-4 sm:pl-5">
                  {contract.address}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};