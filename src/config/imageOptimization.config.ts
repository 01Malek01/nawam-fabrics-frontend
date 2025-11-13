/**
 * Image Optimization Configuration
 * Adjust these settings to control image optimization behavior
 */

export const imageOptimizationConfig = {
  // Choose your optimization service
  // Options: 'weserv' (free, no signup), 'cloudinary', 'imagekit'
  provider: "weserv" as "weserv" | "cloudinary" | "imagekit",

  // API credentials (only needed for cloudinary or imagekit)
  credentials: {
    cloudinaryCloudName: "", // Your Cloudinary cloud name
    imagekitId: "", // Your ImageKit ID
  },

  // Default optimization settings
  defaults: {
    quality: 80, // 1-100, higher = better quality but larger file
    format: "webp" as "webp" | "avif" | "jpeg",
  },

  // Size presets for different use cases
  sizes: {
    thumbnail: { width: 200, quality: 70 },
    productCard: { width: 800, quality: 80 },
    productGallery: { width: 1200, quality: 85 },
    categoryImage: { width: 600, quality: 80 },
    hero: { width: 1920, quality: 85 },
  },

  // Enable/disable caching
  enableCache: true,

  // Enable/disable optimization (set to false to use original images)
  enabled: true,

  // Fallback to original image if optimization fails
  fallbackToOriginal: true,
};

export default imageOptimizationConfig;
