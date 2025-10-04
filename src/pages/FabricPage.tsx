// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useOrderDialog } from "@/context/OrderDialogContext";
import type { Fabric } from "@/types";
import { airtableService } from "@/services/airtable";
import ImagesSlider from "@/components/Slider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FabricOrderForm } from "@/components/FabricOrderForm";

export default function FabricPage() {
  const { fabricId } = useParams();
  const { isOrderDialogOpen, setOrderDialogOpen } = useOrderDialog();
  const [fabric, setFabric] = useState<Fabric | null>(null);

  useEffect(() => {
    const fetchFabric = async () => {
   const fabricData = await airtableService.getRecordById(fabricId as string);
   setFabric({
      id: fabricData.id,
      images: fabricData.Image?.map((image: { url:string}) => image.url) || [],
      name: fabricData.Name,
      price: fabricData.PricePerMeter,
      description: fabricData?.Description || "",
      mainCategory: fabricData.MainCategory,
      subCategory: fabricData.SubCategory,
   })
   console.log( 'fetched fabric by id:',fabric)
    }
    fetchFabric();
  }, [fabricId]);

  if (!fabric) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="animate-pulse">
          <img 
            src="/logo.png" 
            alt="Loading..." 
            className="h-32 w-32 md:h-48 md:w-48"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="bg-white p-4 rounded-lg shadow lg:order-2">
          {fabric.images && fabric.images.length > 0 ? (
            <ImagesSlider images={fabric.images} />
          ) : (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
              <span>No images available</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6 order-1">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{fabric.name}</h1>
          </div>

          <p className="text-2xl font-bold text-primary flex  items-center  gap-2">
            {fabric?.price}
            <span className="  text-green-600">جنيه</span>{" "}
            <span className="text-base font-medium text-gray-500">/ متر</span>
          </p>

          {fabric.description && (
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">الوصف</h2>
              <p className="mt-2 text-gray-600 whitespace-pre-line">
                {fabric.description}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <Button 
              className="w-full md:w-auto cursor-pointer"
              onClick={() => setOrderDialogOpen(true)}
            >
              طلب الآن
            </Button>

            {/* Order Form Dialog */}
            <Dialog open={isOrderDialogOpen} onOpenChange={setOrderDialogOpen}>
              <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                {fabric && <FabricOrderForm fabric={fabric} />}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
