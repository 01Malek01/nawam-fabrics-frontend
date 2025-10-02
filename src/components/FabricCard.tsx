import { X, Maximize2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Fabric } from "@/types";
import { Button } from "./ui/button";
import { FabricOrderForm } from "./FabricOrderForm";

const FabricCard = ({ fabric, buttonTitle, buttonAction, href }: { 
  fabric: Fabric; 
  buttonTitle: string; 
  buttonAction: () => void;
  href?: string;
}) => {
  const [isOrderFormDialogOpen, setIsOrderFormDialogOpen] = useState(false);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  return (
    <div className="group relative">
      {/* Image Overlay */}
      {isImageExpanded && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsImageExpanded(false)}
        >
          <button
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
      {isOrderFormDialogOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOrderFormDialogOpen(false)}
        ></div>
      )}

      {/* Order Form Dialog */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
          isOrderFormDialogOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div 
          className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setIsOrderFormDialogOpen(false)}
            className="cursor-pointer absolute left-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
          <FabricOrderForm 
            fabric={fabric} 
            onCancel={() => setIsOrderFormDialogOpen(false)}
          />
        </div>
      </div>

      {/* Product Card */}
      <div className="relative">
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
          <Link to={href} className="absolute inset-0 z-10" aria-label={`View ${fabric.name}`} />
        )}
      </div>
      
      <div className="mt-4 flex flex-col">
        <div className="flex items-center justify-between py-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {fabric?.name}
          </h3>
          <p className="text-2xl font-bold text-primary">
            {fabric?.price} <span className="text-base font-medium text-gray-500">/ متر</span>
          </p>
        </div>
        <Button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOrderFormDialogOpen(true);
          }}
          className="mt-2 w-full cursor-pointer rounded-lg p-6 text-lg font-bold"
        >
          {buttonTitle}
        </Button>
      </div>
    </div>
  );
};

export default FabricCard;