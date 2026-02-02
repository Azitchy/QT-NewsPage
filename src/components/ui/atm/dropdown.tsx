import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type DropdownOption = {
  label: string;
  value: string;
};

type DropdownProps = {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-64">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-sm cursor-pointer bg-[#F8F8F8] border-none px-4 py-3  text-[#4F5555] body-text2-400 ring-1 ring-white hover:bg-gray-50"
      >
        <span>{selectedOption?.label ?? placeholder}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Menu */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl bg-white shadow-lg ring-1 ring-black/5">
          <ul className="py-1">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <button
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2 body-text2-400 transition hover:bg-gray-100 cursor-pointer ${
                      isSelected ? "text-[#4F5555]" : "text-[#4F5555]"
                    }`}
                  >
                    {option.label}
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
