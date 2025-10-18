import React from "react";

interface LoadingAnimationProps {
  isVisible: boolean;
  loadingImage?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  isVisible,
  loadingImage = "/loading-animation-icon.svg",
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <img
        src={loadingImage}
        alt="Loading..."
        className="w-16 h-16 animate-spin-slow"
      />
    </div>
  );
};
