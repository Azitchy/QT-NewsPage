  import { Check, X } from "lucide-react";
  import React, { useEffect } from "react";

  interface ToastProps {
    message: string;
    type: "success" | "error";
    onClose: () => void;
  }

  export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => onClose(), 5000);
      return () => clearTimeout(timer);
    }, [onClose]);

    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 backdrop-blur-sm">
        <div className="flex items-center space-x-3 rounded-full shadow-lg px-5 py-3 bg-[#464646]  opacity-95">
          {type === "success" ? (
            <Check className="bg-[#12B463] rounded-full p-1 w-6 h-6" />
          ) : (
            <X className="bg-[#FE5572] rounded-full p-1 w-6 h-6" />
          )}

          <span className="body-text1-500 text-white">{message}</span>
        </div>
      </div>
    );
  };
