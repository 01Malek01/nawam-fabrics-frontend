import React, { useState } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
    image: "/logo.png",
    title: "أقمشة صوفية فاخرة",
    description: "مجموعة متنوعة من أفضل أنواع الصوف والكشمير",
    buttonText: "تصفح الآن",
    buttonLink: "/categories"
  },
  {
    id: 2,
    image: "/logo.png",
    title: "بدلات  أنيقة",
    description: "خامات عالية الجودة لإطلالة مميزة",
    buttonText: "اكتشف المزيد",
    buttonLink: "/categories"
  },
  {
    id: 3,
    image: "/logo.png",
    title: "أقمشة قطنية فاخرة",
    description: "تصاميم أصيلة بلمسة عصرية",
    buttonText: "شاهد المجموعة",
    buttonLink: "/categories"
  }
];

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

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
          dots: true
        }
      }
    ]
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-lg mb-8">
      <Slider {...settings}>
        {heroSlides.map((slide) => (
          <div key={slide.id} className="relative">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-[40rem] flex items-center">
              <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                <div className="max-w-lg text-right">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 leading-relaxed drop-shadow-md">
                    {slide.description}
                  </p>
                  {/* <button
                    className="bg-[#A8511A] hover:bg-[#A8511A]/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    onClick={() => navigate(slide.buttonLink)}
                  >
                    {slide.buttonText}
                  </button> */}
                </div>
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
