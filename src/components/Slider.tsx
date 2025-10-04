import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState } from "react";
import Slider, { type Settings } from "react-slick";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

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
      style={{ ...style, right: '10px' }}
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
      style={{ ...style, left: '10px' }}
      onClick={onClick}
      aria-label="Previous slide"
    >
      <ChevronLeft className="w-6 h-6" />
    </div>
  );
};

const ImagesSlider: React.FC<{ images: string[] }> = ({ images }) => {
  const settings: Settings = {
    dots: window.innerWidth >= 768, // Show dots only on medium screens and up
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
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="slider-container relative group">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div className="px-2" key={index}>
            <div className="relative overflow-hidden rounded-lg cursor-zoom-in">
              <img 
                src={image} 
                alt={`Fabric ${index + 1}`} 
                className="w-full h-96 object-cover rounded-lg transition-transform duration-300 hover:scale-105" 
                loading={index === 0 ? 'eager' : 'lazy'}
                onClick={() => setSelectedImage(image)}
              />
            </div>
          </div>
        ))}
      </Slider>

      {/* Image Modal */}
      <Dialog.Root open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <Dialog.Content 
              className="relative max-w-4xl w-full max-h-[90vh]"
              onPointerDownOutside={(e) => e.preventDefault()}
            >
              <Button 
                variant="default" 
                size="icon" 
                className="absolute -top-5 z-10 right-0 text-white hover:bg-white/20"
                onClick={() => setSelectedImage(null)}
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </Button>
              
              <div className="relative h-full w-full flex items-center justify-center">
                <img 
                  src={selectedImage || ''} 
                  alt="Enlarged view" 
                  className="max-h-[80vh] max-w-full object-contain rounded-lg"
                />
              </div>
              
              <div className="flex justify-center mt-4 space-x-2">
                {images.map((image, idx) => (
                  <button
                    key={idx}
                    className={`w-16 h-16 rounded overflow-hidden border-2 ${
                      selectedImage === image ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img 
                      src={image} 
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default ImagesSlider;
