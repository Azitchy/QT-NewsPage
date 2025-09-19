import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface TravelCarouselProps {
  images: string[]
  autoAdvanceInterval?: number // in seconds
  className?: string
  imageContainer?: string
  children?: React.ReactNode
}

interface CarouselContentProps {
  className?: string
  children: React.ReactNode
}

export function CarouselContent({ className, children }: CarouselContentProps) {
  return (
    <div className={cn("relative z-10 flex h-full flex-col justify-center", className)}>
      {children}
    </div>
  )
}

export default function TravelCarousel({
  images,
  autoAdvanceInterval = 15,
  className,
  imageContainer,
  children,
}: TravelCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((current) => (current + 1) % images.length)
          return 0
        }
        return prev + 100 / (autoAdvanceInterval * 10)
      })
    }, 100)

    return () => clearInterval(interval)
  }, [images.length, autoAdvanceInterval])

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
    setProgress(0)
  }

  return (
    <div className={cn("flex h-screen w-full flex-col", className)}>
      {/* Image Container */}
      <div className={cn("relative flex-1 overflow-hidden", imageContainer)}>
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000",
              index === currentIndex ? "opacity-100" : "opacity-0",
            )}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        <div className="absolute inset-0" />
        {children}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center pt-[15px]">
        <div className="flex gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={cn(
                "relative overflow-hidden rounded-full transition-all duration-300",
                index === currentIndex
                  ? "h-[10px] w-[30px] bg-[#CECECE]"
                  : "h-[10px] w-[10px] bg-[#CECECE] hover:bg-gray-500",
              )}
            >
              {index === currentIndex && (
                <div
                  className="absolute left-0 top-0 h-full bg-primary-colour transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
