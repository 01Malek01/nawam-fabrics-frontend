import { X, Maximize2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Fabric } from "@/types";
import { Button } from "./ui/button";
import { FabricOrderForm } from "./FabricOrderForm";
import { useOrderDialog } from "@/context/OrderDialogContext";

const FabricCard = ({
  fabric,
  buttonTitle,
  href,
  buttonAction,
}: {
  fabric: Fabric;
  buttonTitle: string;
  href?: string;
  buttonAction: () => void;
}) => {
  const { isOrderDialogOpen, closeOrderDialog } = useOrderDialog();
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  // Determine a safe display price. Airtable records sometimes have different
  // field names or the normalized `price` might be empty — fall back to the
  // raw record fields if available.
  const displayPrice =
    fabric?.price ||
    (fabric as any)?._raw?.Price ||
    (fabric as any)?._raw?.price ||
    (fabric as any)?._raw?.سعر ||
    "";

  return (
    <div className="group relative flex flex-col h-full">
      {/* Image Overlay */}
      {isImageExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsImageExpanded(false)}
        >
          <button
            title="Close"
            onClick={(e) => {
              e.stopPropagation();
              setIsImageExpanded(false);
            }}
            className="cursor-pointer absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={fabric?.image}
            alt={fabric?.name}
            className="max-h-[90vh] max-w-full object-contain "
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Order Form Overlay */}
      {isOrderDialogOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => closeOrderDialog()}
        ></div>
      )}

      {/* Order Form Dialog */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
          isOrderDialogOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            title="Close"
            onClick={() => closeOrderDialog()}
            className="cursor-pointer absolute left-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
          <FabricOrderForm
            fabric={fabric}
            
          />
        </div>
      </div>

      {/* Product Card */}
      <div className="relative flex flex-col h-full">
        {/* Image Section */}
        <div className="flex-shrink-0">
          <div
            className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
            onClick={() => setIsImageExpanded(true)}
          >
            <img
              src={fabric?.image}
              alt={fabric?.name}
              className="cursor-pointer h-full w-full object-cover object-center transition-all duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <Maximize2 className="h-8 w-8 text-white" />
            </div>
          </div>

          {href && (
            <Link
              to={href}
              className="absolute inset-0 z-10"
              aria-label={`View ${fabric.name}`}
            />
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col mt-3 sm:mt-4">
          <div className="flex items-start sm:items-center justify-between py-2 gap-2 min-h-[3rem] sm:min-h-[3.5rem]">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white leading-tight flex-1">
              {fabric?.name}
            </h3>
            <div className="text-right flex-shrink-0">
              <p className="text-lg sm:text-xl font-bold text-primary leading-tight">
                {displayPrice || "—"}
              </p>
              <div className="flex items-center justify-end gap-1 text-sm">
                <span className="text-green-600">جنيه</span>
                <span className="font-medium text-gray-500">/ متر</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-end">
            <Button
              onClick={(e) => {
                buttonAction();
                e.preventDefault();
                e.stopPropagation();
              }}
              className="w-full cursor-pointer rounded-lg p-3 sm:p-4 text-base sm:text-lg font-bold mt-auto"
            >
              {buttonTitle}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabricCard;
