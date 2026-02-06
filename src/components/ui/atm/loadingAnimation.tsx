import React from "react";
import LoadingIcon from "@/assets/icons/loading-animation-icon.svg";


interface LoadingAnimationProps {
  isVisible: boolean;
  loadingImage?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  isVisible,
  loadingImage = LoadingIcon,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <img
        src={loadingImage}
        alt="Loading..."
        className="w-16 h-16 animate-spin"
        style={{ animation: "spin 1.5s linear infinite" }}
      />
    </div>
  );
};
