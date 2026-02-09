import { useState } from "react";
import { ChevronDown } from "lucide-react";
import LucaIcon from "@/assets/tokens/luca.svg?react";
import PolygonIcon from "@/assets/tokens/polygon.svg?react";
import { Button } from "@/components/ui/atm/button";

export default function AtmCrossChainTransfer() {
  const [amount, setAmount] = useState<number>(0);
  const [receivingAddress, setReceivingAddress] = useState('');
  const balance = 24242.23;

  const handleAmountChange = (value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setAmount(numValue);
    }
  };

  const handleMaxClick = () => {
    setAmount(balance);
  };

  return (
    <div className="py-[30px] px-[20px] bg-white rounded-[15px] h-full"> 

      <text className="block body-text1-400 text-foreground mb-[30px]">
        You can transfer assets to any address on different chains through the ATM cross-chain transfer tool
      </text>

      {/* Transfer Form */}
      <div className="max-w-[500px] p-[30px] rounded-[15px] bg-white border border-[#EBEBEB]">

        {/* Amount */}
        <div className="space-y-[5px] mb-[30px]">

          <div className='flex justify-between'>
            <span className="block text-[#8E8E93] body-text1-400">Amount</span>

            <div className='space-x-[5px]'>
              <span className="text-[#868686] body-label-400">Balance: {balance}</span>

              <button 
                onClick={handleMaxClick}
                className="px-[10px] py-[5px] border border-[#EBEBEB] rounded-[20px] text-foreground body-label-400">
                MAX
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className='flex justify-between py-[12px] px-[15px] rounded-[12px] bg-[#F8F8F8]'>
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0"
              className='placeholder:text-[#B5B5B5] font-h1 focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              min="0"
            />

            {/* Currency Dropdown */}
            <div className='flex items-center'> 
              <LucaIcon className='w-[62px] h-[62px]' />
              <ChevronDown className='w-[14px] h-[14px] text-[#434343]' />
            </div>

          </div>
        </div>

        {/* Receiving Address */}
        <div className="space-y-[5px]">

          <div className='flex justify-between items-center'>
            <span className="block text-[#8E8E93] body-text1-400">Receiving address</span>

            <div className='flex items-center space-x-[5px]'>
              <PolygonIcon className='w-[30px] h-[30px]' />
              <span className="text-foreground body-label-400"> Polygon </span>
              <ChevronDown className='w-[14px] h-[14px] text-[#434343]' />
            </div>
          </div>

          {/* Receiving Address Input */}
          <input
            type="text"
            value={receivingAddress}
            onChange={(e) => setReceivingAddress(e.target.value)}
            placeholder="0x1234a1fdc2f345a6b1f2rae1ee12f345adbf0000"
            className="w-full px-[16px] py-[15px] rounded-[12px] bg-[#F8F8F8] placeholder:text-[#B5B5B5] text-foreground body-text1-400 focus:outline-none"
          />
        </div>

        <div className="p-[15px] bg-[#F8F8F8] rounded-[15px] my-[40px] space-y-[20px]">
          <div className="flex justify-between">
            <span className="text-[#4F5555] body-text2-400">Estimated amount to be received</span>
            <span className="text-foreground body-text2-400">{0} LUCA</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#4F5555] body-text2-400">Cross-chain transfer fee</span>
            <span className="text-foreground body-text2-400">{0} LUCA</span>
          </div>
        </div>

        {/* Transfer Button */}
        <Button 
          className="w-full" 
          disabled={amount <= 0 || receivingAddress === ''}
          variant={amount <= 0 || receivingAddress === '' ? 'disabled' : 'default'}
        >
          Confirm Transfer
        </Button>

      </div>
    </div>
  )
}