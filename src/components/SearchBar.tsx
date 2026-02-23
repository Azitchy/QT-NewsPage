import type React from "react";
import SearchIcon from "@/assets/icons/search-btn-icon.svg?react";
import MicIcon from "@/assets/icons/microphone-btn-icon.svg?react";
import { X } from "lucide-react";

interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onClear: () => void;
  containerClassName?: string;
}

export function SearchBar({
  value,
  placeholder = "Search",
  onChange,
  onKeyDown,
  onSearch,
  onClear,
  containerClassName,
}: SearchBarProps) {
  const hasText = value.trim().length > 0;

  return (
    <div className={`relative ${containerClassName || ""}`}>
      <SearchIcon
        onClick={onSearch}
        className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#959595] cursor-pointer hover:text-foreground"
      />

      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full px-[36px] py-[10px] rounded-[10px] body-text1-400 placeholder:text-[#8E8E93] text-[#8E8E93] focus:outline-none bg-[#F8F8F8]"
      />

      {hasText ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[24px] h-[24px] rounded-full bg-[#E0E0E0] flex items-center justify-center text-[#434343] hover:bg-[#D0D0D0] cursor-pointer"
        >
          <X className="w-[14px] h-[14px] text-black" />
        </button>
      ) : (
        <MicIcon
          className="absolute right-[12px] top-1/2 -translate-y-1/2 h-[18px] text-[#434343] cursor-pointer hover:text-foreground"
        />
      )}
    </div>
  );
}

