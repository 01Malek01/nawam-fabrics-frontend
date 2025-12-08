import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useEffect, useCallback } from "react";
import Slider, { type Settings } from "react-slick";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import NoDownloadImage from "@/components/NoDownloadImage";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
const ImagesSlider: React.FC<{ images: string[] }> = ({ images }) => {
  const [slider1, setSlider1] = useState<Slider | null>(null);
  const [slider2, setSlider2] = useState<Slider | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const isRtl =
    typeof document !== "undefined" &&
    (document.dir === "rtl" ||
      document.documentElement.dir === "rtl" ||
      document.body.dir === "rtl");
  const [nav1, setNav1] = useState<Slider | null>(null);
  const [nav2, setNav2] = useState<Slider | null>(null);

  // Sync sliders
  useEffect(() => {
    if (nav1 && nav2) {
      const target = isRtl ? images.length - 1 - currentSlide : currentSlide;
      nav1.slickGoTo(target);
      nav2.slickGoTo(target);
    }
  }, [currentSlide, nav1, nav2, isRtl, images.length]);

  // Main slider settings
  const mainSettings: Settings = {
    dots: window.innerWidth >= 768,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "ease-in-out",
    // default arrows (no custom arrows)
    dotsClass: "slick-dots !bottom-4 hidden md:block",
    customPaging: () => (
      <div className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors duration-200" />
    ),
    beforeChange: (current: number, next: number) => {
      const logicalNext = isRtl ? images.length - 1 - next : next;
      setCurrentSlide(logicalNext);
    },
  };

  // Overlay slider settings - FIXED: Remove initialSlide to prevent conflict
  const overlaySettings: Settings = {
    dots: window.innerWidth >= 768,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "ease-in-out",
    // default arrows (no custom arrows)
    dotsClass: "slick-dots !bottom-8",
    customPaging: () => (
      <div className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors duration-200" />
    ),
    afterChange: (current: number) => {
      const logical = isRtl ? images.length - 1 - current : current;
      setCurrentSlide(logical);
    },
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

  // Ensure overlay slider navigates to the logical current slide when it opens
  useEffect(() => {
    if (isOverlayOpen && slider2) {
      const target = isRtl ? images.length - 1 - currentSlide : currentSlide;
      slider2.slickGoTo(target);
    }
  }, [isOverlayOpen, slider2, currentSlide, isRtl, images.length]);

  const handleImageClick = (index: number) => {
    setCurrentSlide(index);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentSlide(index);
    if (slider1) {
      const target = isRtl ? images.length - 1 - index : index;
      slider1.slickGoTo(target);
    }
  };

  const handleOverlayThumbnailClick = (index: number) => {
    setCurrentSlide(index);
    if (slider2) {
      const target = isRtl ? images.length - 1 - index : index;
      slider2.slickGoTo(target);
    }
  };

  return (
    <div className="slider-container relative group">
      {/* Main Slider */}
      <div className="relative">
        <Slider
          {...mainSettings}
          ref={(slider) => {
            setSlider1(slider);
            setNav1(slider);
          }}
        >
          {images.map((image, index) => (
            <div className="lg:px-2" key={index}>
              <div className="relative overflow-hidden rounded-lg cursor-zoom-in">
                <NoDownloadImage
                  src={image}
                  alt={`Fabric ${index + 1}`}
                  className="w-full h-96 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                  loading={index === 0 ? "eager" : "lazy"}
                  onClick={() => handleImageClick(index)}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>

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
                onClick={() => handleThumbnailClick(idx)}
                aria-label={`View image ${idx + 1}`}
              >
                <NoDownloadImage
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
                  ref={(slider) => {
                    setSlider2(slider);
                    setNav2(slider);
                  }}
                >
                  {images.map((image, index) => (
                    <div key={index} className="outline-none">
                      <div className="flex items-center justify-center h-[70vh]">
                        <TransformWrapper>
                          <TransformComponent>
                            <NoDownloadImage
                              src={image}
                              alt={`Fabric ${index + 1} - Full view`}
                              className="max-h-full max-w-full object-contain rounded-lg"
                            />
                          </TransformComponent>
                        </TransformWrapper>
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
                        onClick={() => handleOverlayThumbnailClick(idx)}
                      >
                        <NoDownloadImage
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
