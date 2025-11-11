import React, { useState } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LazyImage from "./LazyImage";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrow components
interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const NextArrow: React.FC<ArrowProps> = ({ className, onClick }) => {
  return (
    <div
      className={`${className} !flex items-center justify-center w-12 h-12 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg z-10 transition-all duration-300 absolute !right-5 !top-1/2 !transform !-translate-y-1/2`}
      onClick={onClick}
      aria-label="Next slide"
    >
      <ChevronRight className="w-6 h-6" />
    </div>
  );
};

const PrevArrow: React.FC<ArrowProps> = ({ className, onClick }) => {
  return (
    <div
      className={`${className} !flex items-center justify-center w-12 h-12 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg z-10 transition-all duration-300 absolute !left-5 !top-1/2 !transform !-translate-y-1/2`}
      onClick={onClick}
      aria-label="Previous slide"
    >
      <ChevronLeft className="w-6 h-6" />
    </div>
  );
};

// Hero slider data with placeholder images
const heroSlides = [
  {
    id: 1,
    image: "/banner1.jpeg",
    buttonLink: "/categories",
  },
  {
    id: 3,
    image: "/banner3.png",
    buttonLink: "/categories",
  },
  {
    id: 4,
    image: "/banner4.png",
    buttonLink: "/categories",
  },
];

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    cssEase: "ease-in-out",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots !bottom-6",
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors duration-200 mx-1" />
    ),
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg mb-8">
      <Slider {...settings}>
        {heroSlides.map((slide) => (
          <div key={slide.id} className="relative w-full">
            {/* Background Image */}
            <div className="relative w-full h-0 pb-[56.25%]">
              {" "}
              {/* 16:9 aspect ratio container */}
              <div className="absolute inset-0 w-full h-full">
                <LazyImage
                  src={slide.image}
                  alt={slide.image}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                {/* <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div> */}
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Slide Counter */}
      <div className="absolute bottom-6 right-6 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium">
        {currentSlide + 1} / {heroSlides.length}
      </div>
    </div>
  );
};

export default HeroSlider;
