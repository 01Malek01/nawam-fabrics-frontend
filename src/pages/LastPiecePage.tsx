// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useOrderDialog } from "@/context/OrderDialogContext";
import usePublicApi from "@/hooks/usePublicApi";
import ImagesSlider from "@/components/Slider";
import LazyImage from "@/components/LazyImage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FabricOrderForm } from "@/components/FabricOrderForm";
import { Helmet } from "react-helmet";
import { getImageUrl } from "@/lib/utils";
import VideoIframe from "@/components/VideoIframe";
import { useNavigate } from "react-router-dom";

export default function LastPiecePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    isOrderDialogOpen,
    selectedFabricId,
    openOrderDialogFor,
    closeOrderDialog,
  } = useOrderDialog();
  const { getLastPieceById } = usePublicApi();
  const [item, setItem] = useState<any | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      const data = await getLastPieceById(id as string);
      if (!data) return;
      const images = data?.image ? [getImageUrl(data.image) || ""] : [];
      setItem({
        id: data._id,
        images,
        name: data.name,
        price: data.price,
        length: data.length,
        product: data.product,
        category: data.category,
        description: data.description || "",
      });
    };
    fetchItem();
  }, [id, getLastPieceById]);

  if (!item) {
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
        <title>{item?.name || "قطعة"} - النوام للأقمشة</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow lg:order-2 lg:p-4">
            {item.images && item.images.length > 0 ? (
              <ImagesSlider
                images={item.images}
                onBackClick={() => navigate(-1)}
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                <span>No images available</span>
              </div>
            )}
          </div>

          <div className="space-y-6 order-1 text-right">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-(--color-primary) dark:text-white">
                {item.name}
              </h1>
            </div>

            <div>
              <p className="text-3xl font-bold text-(--color-text-tertiary)">
                {item.price ?? "-"}{" "}
                <span className="text-base font-medium text-gray-500">
                  جنيه
                </span>
              </p>
              <p className="mt-2 text-sm text-gray-500">
                الطول: {item.length ?? "-"}
              </p>
            </div>

            {item.description && (
              <div className="mt-6">
                <h2 className="text-xl font-medium text-gray-900">ملاحظات</h2>
                <p className="mt-2 text-gray-600 whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 flex gap-3">
              <Button
                className="flex-1"
                onClick={() => openOrderDialogFor(item.id)}
              >
                طلب القطعة
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={async () => {
                  const shareData = {
                    title: item.name,
                    text: item.description || item.name,
                    url: window.location.href,
                  };
                  if (navigator.share) {
                    try {
                      await navigator.share(shareData);
                    } catch (e) {}
                  } else {
                    setIsShareOpen(true);
                  }
                }}
              >
                مشاركة
              </Button>
            </div>

            <Dialog
              open={isOrderDialogOpen && selectedFabricId === item.id}
              onOpenChange={(open) => {
                if (!open) closeOrderDialog();
              }}
            >
              <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <FabricOrderForm
                  fabric={{
                    id: item.id,
                    images: item.images,
                    name: item.name,
                    price: item.price,
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      {isShareOpen && (
        <div className="share-sheet fixed inset-x-4 bottom-4 z-50 md:hidden">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">مشاركة</div>
              <button
                className="text-sm text-gray-600 dark:text-gray-300"
                onClick={() => setIsShareOpen(false)}
              >
                إغلاق
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  item.name + " - " + window.location.href
                )}`}
                target="_blank"
                rel="noreferrer"
                className="share-option p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100"
              >
                واتساب
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  window.location.href
                )}`}
                target="_blank"
                rel="noreferrer"
                className="share-option p-2 rounded-lg bg-blue-50 hover:bg-blue-100"
              >
                فيسبوك
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  item.name
                )}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="share-option p-2 rounded-lg bg-sky-50 hover:bg-sky-100"
              >
                تويتر
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  window.location.href
                )}&text=${encodeURIComponent(item.name)}`}
                target="_blank"
                rel="noreferrer"
                className="share-option p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100"
              >
                تليجرام
              </a>
            </div>
            <div className="mt-3">
              <button
                className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    alert("تم نسخ رابط المنتج");
                  } catch (err) {
                    alert("فشل نسخ الرابط");
                  }
                }}
              >
                نسخ الرابط
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
