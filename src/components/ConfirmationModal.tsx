import React from "react";
import { X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  description,
  confirmText = "Remove",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
      <div className="bg-white dark:bg-[#15152B] rounded-2xl p-6 w-[90%] max-w-lg shadow-lg relative">
        {/* Close Icon */}
        <button onClick={onCancel} className="absolute top-4 right-4">
          <X size={20} className="text-primary" />
        </button>

        {/* Title */}
        <h2 className="text-[20px] font-normal text-foreground mb-2">
          {title}
        </h2>

        {/* Description */}
        <p className="text-[#4F5555] dark:text-gray-300 text-[16px] leading-[21px] mb-2">
          {description}
        </p>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 font-medium text-[16px] leading-[21px] mb-7">
          {message}
        </p>

        {/* Actions */}
        <div className="flex justify-start space-x-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 border-2  border-primary text-primary rounded-full text-sm hover:bg-[#46A59B]/10 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-3 bg-primary text-white rounded-full text-sm transition"
          >
            {loading ? "Removing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
