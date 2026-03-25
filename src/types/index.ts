// Export other types

export interface Fabric {
  id: string;
  name: string;
  price: string;
  image: string;
  images: string[];
  description: string;
  mainCategory: string;
  subCategory: string;
  videoUrl?: string;
  soldOutImages?: string[];
  MostSold?: boolean;
  isNewArrival?: boolean;
  discountText?: string;
  discount?: number;
  isOutOfStock?: boolean;
}
