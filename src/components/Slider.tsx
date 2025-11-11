import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useEffect, useCallback } from "react";
import Slider, { type Settings } from "react-slick";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import LazyImage from "./LazyImage";

// Define prop types for the arrow components
interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

// Custom arrow components
const NextArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => {
  return (
    <div
      className={`${className} !flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-lg z-10`}
      style={{ ...style, right: "10px" }}
      onClick={onClick}
      aria-label="Next slide"
    >
      <ChevronRight className="w-6 h-6" />
    </div>
  );
};

const PrevArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => {
  return (
    <div
      className={`${className} !flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-lg z-10`}
      style={{ ...style, left: "10px" }}
      onClick={onClick}
      aria-label="Previous slide"
    >
      <ChevronLeft className="w-6 h-6" />
    </div>
  );
};

const ImagesSlider: React.FC<{ images: string[] }> = ({ images }) => {
  const [slider1, setSlider1] = useState<Slider | null>(null);
  const [slider2, setSlider2] = useState<Slider | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Main slider settings
  const mainSettings: Settings = {
    dots: window.innerWidth >= 768,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "ease-in-out",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots !bottom-4 hidden md:block",
    customPaging: () => (
      <div className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors duration-200" />
    ),
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
  };

  // Overlay slider settings
  const overlaySettings: Settings = {
    dots: window.innerWidth >= 768,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "ease-in-out",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    initialSlide: currentSlide,
    dotsClass: "slick-dots !bottom-8",
    customPaging: () => (
      <div className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors duration-200" />
    ),
    afterChange: (current: number) => setCurrentSlide(current),
  };

  // Handle browser back button to close modal instead of navigating away
  const handlePopState = useCallback(() => {
    if (isOverlayOpen) {
      setIsOverlayOpen(false);
      window.history.pushState(null, "", window.location.href);
    } else {
      window.history.back();
    }
  }, [isOverlayOpen]);

  useEffect(() => {
    if (isOverlayOpen) {
      window.history.pushState({ modalOpen: true }, "", window.location.href);
    }
  }, [isOverlayOpen]);

  useEffect(() => {
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handlePopState]);

  const handleImageClick = (index: number) => {
    setCurrentSlide(index);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  return (
    <div className="slider-container relative group">
      {/* Main Slider */}
      <Slider {...mainSettings} ref={(slider) => setSlider1(slider)}>
        {images.map((image, index) => (
          <div className="px-2" key={index}>
            <div className="relative overflow-hidden rounded-lg cursor-zoom-in">
              <LazyImage
                src={image}
                alt={`Fabric ${index + 1}`}
                className="w-full h-96 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                onClick={() => handleImageClick(index)}
              />
            </div>
          </div>
        ))}
      </Slider>

      {/* Thumbnail Gallery - Always Visible */}
      {images.length > 1 && (
        <div className="mt-4 px-2">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-center">
            {images.length} صور متاحة - انقر للتصفح
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {images.map((image, idx) => (
              <button
                key={idx}
                className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  currentSlide === idx
                    ? "border-[#A8511A] ring-2 ring-[#A8511A]/20"
                    : "border-gray-200 hover:border-[#A8511A]/50"
                }`}
                onClick={() => {
                  if (slider1) {
                    slider1.slickGoTo(idx);
                    setCurrentSlide(idx);
                  }
                }}
                aria-label={`View image ${idx + 1}`}
              >
                <img
                  src={image}
                  alt={`Fabric thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Overlay indicator for current image */}
                {currentSlide === idx && (
                  <div className="absolute inset-0 bg-[#A8511A]/20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#A8511A] rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay Slider */}
      <Dialog.Root open={isOverlayOpen} onOpenChange={setIsOverlayOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <Dialog.Content
              className="relative max-w-6xl w-full max-h-[90vh]"
              onPointerDownOutside={handleCloseOverlay}
              onEscapeKeyDown={handleCloseOverlay}
            >
              <Button
                variant="default"
                size="icon"
                className="absolute -top-12 right-0 z-50 bg-gray-800 hover:bg-gray-700 text-white border-none"
                onClick={handleCloseOverlay}
                aria-label="Close overlay"
              >
                <X className="h-6 w-6" />
              </Button>
              <p className="text-white text-center absolute -top-12 inset-0">
                اسحب لليمين او لليسار لتصفح الصور
              </p>

              <div className="relative h-full w-full">
                <Slider
                  {...overlaySettings}
                  ref={(slider) => setSlider2(slider)}
                >
                  {images.map((image, index) => (
                    <div key={index} className="outline-none">
                      <div className="flex items-center justify-center h-[70vh]">
                        <img
                          src={image}
                          alt={`Fabric ${index + 1} - Full view`}
                          className="max-h-full max-w-full object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </Slider>

                {/* Thumbnail navigation */}
                <div className="mt-4 px-8">
                  <div className="flex justify-center space-x-2 overflow-x-auto py-2">
                    {images.map((image, idx) => (
                      <button
                        key={idx}
                        className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                          currentSlide === idx
                            ? "border-white scale-110"
                            : "border-transparent hover:border-white/50"
                        }`}
                        onClick={() => {
                          if (slider2) {
                            slider2.slickGoTo(idx);
                          }
                        }}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default ImagesSlider;
