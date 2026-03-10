import { useState, useEffect, useRef } from "react";
import type { ImgHTMLAttributes } from "react";
import NoDownloadImage from "./NoDownloadImage";

// In-memory cache for loaded images
const imageCache = new Set<string>();

// Preload image into cache
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (imageCache.has(src)) {
      resolve();
      return;
    }

    const img = new Image();
    img.onload = () => {
      imageCache.add(src);
      resolve();
    };
    img.onerror = reject;
    img.src = src;
  });
};

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="%23999"%3ELoading...%3C/text%3E%3C/svg%3E',
  className = "",
  onLoad,
  onError,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholderSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Check if image is already in cache
    if (imageCache.has(src)) {
      setImageSrc(src);
      setIsLoading(false);
      return;
    }

    // Create intersection observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load image when it enters viewport
            preloadImage(src)
              .then(() => {
                setImageSrc(src);
                setIsLoading(false);
                onLoad?.();
              })
              .catch(() => {
                setHasError(true);
                setIsLoading(false);
                onError?.();
              });

            // Stop observing once loaded
            if (imgRef.current && observerRef.current) {
              observerRef.current.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before entering viewport
        threshold: 0.01,
      },
    );

    // Start observing
    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, onLoad, onError]);

  return (
    <div ref={imgRef} className="w-full h-full">
      <NoDownloadImage
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? "blur-sm" : "blur-0"} ${
          hasError ? "opacity-50" : "opacity-100"
        } transition-all duration-300`}
        loading="lazy"
        decoding="async"
        {...props}
      />
    </div>
  );
};

export default LazyImage;
