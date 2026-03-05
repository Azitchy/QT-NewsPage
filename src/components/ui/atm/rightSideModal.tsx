import { X, Search, Mic } from "lucide-react";
import { Button } from "@/components/ui/atm/button";
import type { ReactNode } from "react";

type RightSideModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;

  // Search
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Footer Buttons
  primaryButtonText?: string;
  onPrimaryClick?: () => void;
  primaryDisabled?: boolean;
  primaryVariant?: "default" | "success" | "disabled";

  secondaryButtonText?: string;
  onSecondaryClick?: () => void;
  secondaryVariant?: "success" | "ghost" | "default";

  loading?: boolean;
  children: ReactNode;
};

export default function RightSideModal({
  isOpen,
  onClose,
  title,

  showSearch = false,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search",

  primaryButtonText,
  onPrimaryClick,
  primaryDisabled,
  primaryVariant = "default",

  secondaryButtonText,
  onSecondaryClick,
  secondaryVariant = "success",

  loading = false,
  children,
}: RightSideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="w-105 bg-card p-6 h-full rounded-l-2xl shadow-xl relative flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-h4-400 text-foreground">{title}</h2>
          <X className="text-primary cursor-pointer" onClick={onClose} />
        </div>

        {/* SEARCH */}
        {showSearch && (
          <div className="relative w-full mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Search size={16} />
            </span>

            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-[10px] bg-[#F8F8F8] dark:bg-[#383D4C]"
            />

            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <Mic size={16} />
            </span>
          </div>
        )}

        {/* SCROLLABLE CONTENT */}
        <div
          className="flex-1 overflow-y-auto pr-2
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]"
        >
          {children}
        </div>

        {/* FOOTER */}
        {(primaryButtonText || secondaryButtonText) && (
          <div className="pt-4 flex justify-end gap-3">
            {secondaryButtonText && (
              <Button
                variant={secondaryVariant}
                onClick={onSecondaryClick || onClose}
              >
                {secondaryButtonText}
              </Button>
            )}

            {primaryButtonText && (
              <Button
                disabled={primaryDisabled}
                variant={primaryVariant}
                onClick={onPrimaryClick}
              >
                {primaryButtonText}
              </Button>
            )}
          </div>
        )}

        {/* LOADING OVERLAY */}
        {loading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-l-2xl">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
