import React from "react";
import { X } from "lucide-react";
import { Button } from "./button";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: VariantProps<typeof buttonVariants>["variant"];
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
  confirmVariant = "default",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
      <div className="bg-modal rounded-2xl p-6 w-[90%] max-w-lg shadow-lg relative">
        {/* Close Icon */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 cursor-pointer"
        >
          <X size={20} className="text-primary" />
        </button>

        {/* Title */}
        <h2 className="text-[20px] font-normal text-foreground mb-2">
          {title}
        </h2>

        {/* Description */}
        <p className="text-[#4F5555] dark:text-gray-300 text-[16px] mb-2">
          {description}
        </p>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 font-medium text-[16px] mb-7">
          {message}
        </p>

        {/* Actions */}
        <div className="flex justify-start space-x-3">
          <Button
            className="px-9"
            onClick={onCancel}
            disabled={loading}
            variant="success"
          >
            {cancelText}
          </Button>

          <Button
            className="px-9"
            onClick={onConfirm}
            disabled={loading}
            variant={confirmVariant}
          >
            {loading ? "Removing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
