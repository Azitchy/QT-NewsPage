import React, { useRef, useState } from "react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  captions?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  captions,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isUserControl, setIsUserControl] = useState(false);

  const handleActivateControls = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.controls = true;
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsUserControl(true);
    }
  };

  return (
    <div className="relative w-full h-[300px] lg:h-[385px] 2xl:h-full object-cover rounded-[20px] overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
      >
        <source src={src} type="video/mp4" />
        {captions && (
          <track
            src={captions}
            kind="subtitles"
            srcLang="en"
            label="English"
            default
          />
        )}
      </video>

      {!isUserControl && (
        <>
          <button
            onClick={handleActivateControls}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            aria-label="Activate video controls and sound"
          >
            {/* <img src="/play-button.svg" alt="Play" className="w-16 h-16" /> */}
          </button>
          
          <div 
            onClick={handleActivateControls}
            className="absolute bottom-4 right-4 text-white text-sm cursor-pointer hover:opacity-80 transition-opacity duration-300"
          >
            Click here to play sound
          </div>
        </>
      )}
    </div>
  );
};