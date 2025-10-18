import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`flex items-center space-x-3 rounded-full shadow-lg px-5 py-3 ${
          type === "success"
            ? "bg-[#464646] text-white"
            : "bg-[#464646] text-white"
        }`}
      >
        <img
          src={type === "success" ? "/success-icon.png" : "/cross-icon.png"}
          alt={type}
          className="w-6 h-6"
        />
        <span className="text-[16px] leading-[21px] font-normal">
          {message}
        </span>
      </div>
    </div>
  );
};
