import { X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Fabric } from "@/types";
import { Button } from "./ui/button";
import { FabricOrderForm } from "./FabricOrderForm";
import { useOrderDialog } from "@/context/OrderDialogContext";
import LazyImage from "./LazyImage";
import NoDownloadImage from "./NoDownloadImage";
import { getImageUrl } from "@/lib/utils";

const FabricCard = ({
  fabric,
  buttonTitle,
  href,
  buttonAction,
  isLazyLoaded = true,
}: {
  fabric: Fabric;
  buttonTitle: string;
  href?: string;
  buttonAction: () => void;
  isLazyLoaded?: boolean;
}) => {
  const { isOrderDialogOpen, closeOrderDialog, selectedFabricId } =
    useOrderDialog();
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const displayPrice =
    fabric?.price ||
    (fabric as any)?._raw?.Price ||
    (fabric as any)?._raw?.price ||
    (fabric as any)?._raw?.سعر ||
    "—";

  const images = (fabric as any)?.images || [];
  const imageCount = images.length || (fabric?.image ? 1 : 0);
  const discountText = (fabric as any)?.discountText || "";

  return (
    <div className="group relative flex flex-col h-full fabric-card rounded-xl shadow-sm border-(--color-border-accent) transition-all duration-300 hover:shadow-lg overflow-hidden">
      {/* 1. Full-screen Image Modal */}
      {isImageExpanded && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-2"
          onClick={() => setIsImageExpanded(false)}
        >
          <button
            className="absolute right-6 top-6 z-[110] rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setIsImageExpanded(false);
            }}
          >
            <X className="h-6 w-6" />
          </button>
          <NoDownloadImage
            src={fabric?.image}
            alt={fabric?.name}
            className="max-h-[85vh] w-auto object-contain rounded-lg"
          />
        </div>
      )}

      {/* 2. Order Dialog Overlay logic remains similar but with z-index safety */}
      {isOrderDialogOpen && selectedFabricId === fabric.id && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeOrderDialog}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={closeOrderDialog}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <FabricOrderForm fabric={fabric} />
          </div>
        </div>
      )}

      {/* 3. Main Card Image Section */}
      <div className="relative overflow-hidden aspect-[4/3] sm:aspect-square">
        <div className="absolute top-2 right-2 z-20 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-white" />
          <span className="text-base text-white font-semibold">
            {imageCount}
          </span>
        </div>

        {discountText && (
          <div className="absolute top-2 left-2 z-20">
            <span className="bg-red-500 text-white text-base font-bold px-3 py-1 rounded-full shadow-sm">
              {discountText}
            </span>
          </div>
        )}
        <div
          className="h-full w-full cursor-zoom-in"
          onClick={() => setIsImageExpanded(true)}
        >
          {isLazyLoaded ? (
            <LazyImage
              src={fabric?.image}
              alt={fabric?.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <NoDownloadImage
              src={fabric?.image}
              alt={fabric?.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        {href && <Link to={href} className="absolute inset-0 z-10 sm:hidden" />}
      </div>

      {/* 4. Details Section */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 text-right" dir="rtl">
        <div className="flex flex-col gap-1 mb-3">
          <h3 className="text-2xl sm:text-3xl font-bold text-(--color-secondary) dark:text-gray-100 leading-tight">
            {fabric?.name}
          </h3>
        </div>

        {/* Pricing Block */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl sm:text-4xl font-black text-(--color-text-tertiary)">
            {displayPrice}
          </span>
          <span className="text-base font-medium text-gray-500">
            جنيه / متر
          </span>
        </div>

        {/* Thumbnails - Hidden on very small screens to save vertical space, or kept small */}
        {images.length > 1 && (
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 no-scrollbar">
            {images.slice(1, 4).map((img: any, idx: number) => (
              <div
                key={idx}
                className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden border border-gray-100 dark:border-gray-700"
                onClick={() => setIsImageExpanded(true)}
              >
                <NoDownloadImage
                  src={getImageUrl(img)}
                  alt="thumb"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-auto">
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              buttonAction();
            }}
            className="w-full h-12 sm:h-14 text-lg sm:text-xl font-bold shadow-sm active:scale-[0.98] transition-transform"
          >
            {buttonTitle}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FabricCard;
