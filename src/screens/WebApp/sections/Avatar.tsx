// Avatar.tsx
import React, { useEffect, useRef } from "react";
import { useWeb3Auth } from "@/contexts/Web3AuthContext";
import { Shield, Zap } from "lucide-react";

export const Avatar = (): JSX.Element => {
  const { session, checkLUCASupport } = useWeb3Auth();

  const isNetworkSupported = checkLUCASupport();

  // video ref to ensure autoplay works across browsers
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Ensure muted for autoplay to work in most browsers
    v.muted = true;
    v.loop = true;
    v.playsInline = true;

    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // autoplay blocked by browser – keep muted and try again silently
        // we intentionally do nothing here to avoid noisy errors
      });
    }
  }, []);

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
          {/* Header with status indicators */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Avatar
              </h3>
              {session && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-800 dark:text-green-300">
                    Authenticated
                  </span>
                </div>
              )}
              {isNetworkSupported && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium text-blue-800 dark:text-blue-300">
                    LUCA Network
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Text Content */}
            <div className="text-center space-y-4">
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
                Watch our captivating video showcasing the limitless possibilities of avatars. Immerse yourself in a world where you can create and 
                shape your unique avatar, freeing your digital identity.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
                But that's not all - unlock the full potential of Lucy! Boost your PR by making more connections to get access to all our amazing features.
              </p>
            </div>

            {/* Video Section */}
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <video
                  ref={videoRef}
                  className="w-full h-auto rounded-lg shadow-lg"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="/webapp/avatar.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};