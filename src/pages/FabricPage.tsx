// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useOrderDialog } from "@/context/OrderDialogContext";
import type { Fabric } from "@/types";
import usePublicApi from "@/hooks/usePublicApi";
import ImagesSlider from "@/components/Slider";
import LazyImage from "@/components/LazyImage";
import { Button } from "@/components/ui/button";
import useCartApi from "@/hooks/useCartApi";
import toast from "react-hot-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FabricOrderForm } from "@/components/FabricOrderForm";
import VideoIframe from "@/components/VideoIframe";
import { Helmet } from "react-helmet";
import { getImageUrl } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import ShareSheet from "@/components/ShareSheet";
import AddToCartForm from "@/components/AddToCartForm";

export default function FabricPage() {
  const navigate = useNavigate();
  const { fabricId } = useParams();
  const {
    isOrderDialogOpen,
    selectedFabricId,
    openOrderDialogFor,
    closeOrderDialog,
  } = useOrderDialog();
  const { getProductById } = usePublicApi();
  const [fabric, setFabric] = useState<Fabric | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { addItemToCart } = useCartApi();
  const [adding, setAdding] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { checkAuth } = useAuth();

  useEffect(() => {
    const fetchFabric = async () => {
      const fabricData = await getProductById(fabricId as string);
      const rawImages = fabricData?.Image || [];

      setFabric({
        id: fabricData._id,
        images: rawImages.map((img: string) => getImageUrl(img) || "") || [],
        name: fabricData.Name,
        price: fabricData.PricePerMeter,
        description: fabricData?.Description || "",
        mainCategory: fabricData.MainCategory,
        subCategory: fabricData.SubCategory,
        videoUrl: fabricData.VideoUrl || "",
        stock: Array.isArray(fabricData.stock) ? fabricData.stock : [],
      });
    };
    if (fabricId) fetchFabric();
  }, [fabricId, getProductById]);

  const navigateToPreviousPage = () => {
    navigate(
      `/categories/${fabric?.mainCategory._id / fabric?.subCategory._id}`
    );
  };
  if (!fabric) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="animate-pulse">
          <LazyImage
            src="/logo.png"
            alt="Loading..."
            className="h-32 w-32 md:h-48 md:w-48"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{fabric?.name || "قماش"} - النوام للأقمشة</title>
        <meta
          name="description"
          content={fabric?.description || "تفاصيل القماش في النوام للأقمشة"}
        />
      </Helmet>
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {/* Product Images */}
          <div className="bg-white rounded-lg shadow lg:order-2 p-6 lg:p-8">
            {fabric.images && fabric.images.length > 0 ? (
              <ImagesSlider
                images={fabric.images}
                onBackClick={navigateToPreviousPage}
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                <span>No images available</span>
              </div>
            )}
            <p className="text-3xl font-bold text-(--color-text-tertiary) flex  items-center  gap-2">
              {fabric?.price}
              <span className="  text-(--color-text-tertiary)">جنيه</span>{" "}
              <span className="text-base font-medium text-gray-500">/ متر</span>
            </p>

            {fabric.description && (
              <div className="mt-6">
                <h2 className="text-3xl font-medium text-gray-900">الوصف</h2>
                <p className="mt-2 text-gray-600 whitespace-pre-line text-2xl">
                  {fabric.description}
                </p>
              </div>
            )}

            {fabric.stock && fabric.stock.length > 0 && (
              <div className="mt-6 w-1/2">
                <h2 className="text-2xl font-medium text-gray-900 mb-3">
                  المخزون حسب اللون
                </h2>
                <div className="overflow-x-auto rounded-lg border border-gray-200 p-4">
                  <table className="min-w-full text-right text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 font-medium text-gray-700">اللون</th>
                        <th className="p-3 font-medium text-gray-700">
                          المخزون (متر)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {fabric.stock.map((s: any, i: number) => (
                        <tr key={s?._id || i} className="border-t">
                          <td className="p-3 align-middle">
                            <div className="flex items-center justify-start gap-3">
                              <span className="text-lg font-medium">
                                {s?.color || "-"}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 align-middle">
                            <span className="text-lg font-semibold">
                              {s?.meters ?? 0} م
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 space-x-2">
              <Button
                className="w-full md:w-auto cursor-pointer"
                onClick={() => openOrderDialogFor(fabric.id)}
              >
                طلب الآن
              </Button>
              <Button
                className="w-full md:w-auto mt-2 md:mt-0 md:ml-3 border border-gray-200 dark:border-gray-700"
                onClick={async () => {
                  try {
                    const auth = await checkAuth();
                    if (!auth?.loggedIn) {
                      navigate("/signup");
                      return;
                    }
                    setShowAddDialog(true);
                  } catch (err) {
                    navigate("/signup");
                  }
                }}
              >
                أضف إلى السلة
              </Button>

              <Button
                variant="outline"
                className="w-full md:w-auto mt-2 md:mt-0 md:ml-3 border border-gray-200 dark:border-gray-700"
                onClick={async () => {
                  // Use Web Share API on supported devices
                  const shareData = {
                    title: fabric.name,
                    text: fabric.description || fabric.name,
                    url: window.location.href,
                  };
                  if (navigator.share) {
                    try {
                      await navigator.share(shareData);
                    } catch (err) {
                      // user cancelled or error
                    }
                  } else {
                    // fallback: open custom share sheet on mobile
                    setIsShareOpen(true);
                  }
                }}
              >
                مشاركة
              </Button>

              {/* Order Form Dialog */}
              <Dialog
                open={isOrderDialogOpen && selectedFabricId === fabric.id}
                onOpenChange={(open) => {
                  if (!open) closeOrderDialog();
                }}
              >
                <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                  {fabric && <FabricOrderForm fabric={fabric} />}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        {fabric.videoUrl && (
          <div className="product-video w-full mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              مقطع الفيديو للمنتج
            </h2>
            <VideoIframe videoUrl={getImageUrl(fabric.videoUrl)} />
          </div>
        )}
        {/* Fallback share sheet for non-supporting devices */}
        <ShareSheet
          open={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          name={fabric.name}
          url={typeof window !== "undefined" ? window.location.href : undefined}
          description={fabric.description}
        />
        {showAddDialog && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowAddDialog(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <AddToCartForm
                fabric={fabric}
                onClose={() => setShowAddDialog(false)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
