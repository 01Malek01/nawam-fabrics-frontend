/**
 * Image Optimization Utility
 * Converts and compresses images to WebP format using free APIs
 */

// Cache for optimized image URLs
const optimizedImageCache = new Map<string, string>();

/**
 * Cloudinary free tier API for image optimization
 * You can also use other free APIs like:
 * - images.weserv.nl (recommended - no signup needed)
 * - imagekit.io (requires signup but generous free tier)
 * - cloudinary.com (requires signup)
 */

interface ImageOptimizerOptions {
  width?: number;
  quality?: number;
  format?: "webp" | "avif" | "jpeg";
}

/**
 * Optimize image using images.weserv.nl (no API key needed)
 * Documentation: https://images.weserv.nl/docs/
 */
export const optimizeImageWithWeserv = (
  imageUrl: string,
  options: ImageOptimizerOptions = {}
): string => {
  // Check cache first
  const cacheKey = `${imageUrl}-${JSON.stringify(options)}`;
  if (optimizedImageCache.has(cacheKey)) {
    return optimizedImageCache.get(cacheKey)!;
  }

  // Skip if not a valid URL
  if (!imageUrl || !imageUrl.startsWith("http")) {
    return imageUrl;
  }

  const {
    width = 800, // Default width for product images
    quality = 80, // 80% quality for good balance
    format = "webp",
  } = options;

  // Build weserv.nl URL
  const params = new URLSearchParams({
    url: imageUrl,
    w: width.toString(),
    q: quality.toString(),
    output: format,
    il: "", // Interlace/progressive loading
    af: "", // Auto-format (serve best format based on browser support)
  });

  const optimizedUrl = `https://images.weserv.nl/?${params.toString()}`;

  // Cache the result
  optimizedImageCache.set(cacheKey, optimizedUrl);

  return optimizedUrl;
};

/**
 * Optimize image using Cloudinary (requires account but has generous free tier)
 * Sign up at: https://cloudinary.com
 */
export const optimizeImageWithCloudinary = (
  imageUrl: string,
  cloudName: string, // Your Cloudinary cloud name
  options: ImageOptimizerOptions = {}
): string => {
  const cacheKey = `cloudinary-${imageUrl}-${JSON.stringify(options)}`;
  if (optimizedImageCache.has(cacheKey)) {
    return optimizedImageCache.get(cacheKey)!;
  }

  if (!imageUrl || !imageUrl.startsWith("http")) {
    return imageUrl;
  }

  const { width = 800, quality = 80, format = "webp" } = options;

  // Cloudinary transformation URL
  const optimizedUrl = `https://res.cloudinary.com/${cloudName}/image/fetch/f_${format},q_${quality},w_${width},c_limit/${encodeURIComponent(
    imageUrl
  )}`;

  optimizedImageCache.set(cacheKey, optimizedUrl);

  return optimizedUrl;
};

/**
 * Optimize image using ImageKit (requires account)
 * Sign up at: https://imagekit.io
 */
export const optimizeImageWithImageKit = (
  imageUrl: string,
  imageKitId: string, // Your ImageKit ID
  options: ImageOptimizerOptions = {}
): string => {
  const cacheKey = `imagekit-${imageUrl}-${JSON.stringify(options)}`;
  if (optimizedImageCache.has(cacheKey)) {
    return optimizedImageCache.get(cacheKey)!;
  }

  if (!imageUrl || !imageUrl.startsWith("http")) {
    return imageUrl;
  }

  const { width = 800, quality = 80, format = "webp" } = options;

  // ImageKit transformation URL
  const transformations = `tr=w-${width},q-${quality},f-${format}`;
  const optimizedUrl = `https://ik.imagekit.io/${imageKitId}/${transformations}/${encodeURIComponent(
    imageUrl
  )}`;

  optimizedImageCache.set(cacheKey, optimizedUrl);

  return optimizedUrl;
};

/**
 * Main optimization function - uses weserv.nl by default (no signup needed)
 */
export const optimizeImage = (
  imageUrl: string,
  options: ImageOptimizerOptions = {}
): string => {
  // Use weserv.nl as default (free, no signup required)
  return optimizeImageWithWeserv(imageUrl, options);
};

/**
 * Optimize multiple images at once
 */
export const optimizeImages = (
  imageUrls: string[],
  options: ImageOptimizerOptions = {}
): string[] => {
  return imageUrls.map((url) => optimizeImage(url, options));
};

/**
 * Get different sizes for responsive images
 */
export const getResponsiveImageUrls = (imageUrl: string) => {
  return {
    thumbnail: optimizeImage(imageUrl, { width: 200, quality: 70 }),
    small: optimizeImage(imageUrl, { width: 400, quality: 75 }),
    medium: optimizeImage(imageUrl, { width: 800, quality: 80 }),
    large: optimizeImage(imageUrl, { width: 1200, quality: 85 }),
    original: imageUrl,
  };
};

/**
 * Clear the optimization cache
 */
export const clearOptimizationCache = () => {
  optimizedImageCache.clear();
};

/**
 * Preload optimized images
 */
export const preloadOptimizedImage = (
  imageUrl: string,
  options?: ImageOptimizerOptions
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const optimizedUrl = optimizeImage(imageUrl, options);
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = optimizedUrl;
  });
};
