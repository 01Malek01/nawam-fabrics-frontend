// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Fabric } from "@/types";
import usePublicApi from "@/hooks/usePublicApi";
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
import { Share2, ShoppingCart, X } from "lucide-react";
import AddToCartForm from "@/components/AddToCartForm";
import LengthPicker from "@/components/LengthPicker";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function FabricPage() {
  const navigate = useNavigate();
  const { fabricId } = useParams();
  // local state for order dialog (was previously global via OrderDialogContext)
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const pushedOrderStateRef = React.useRef(false);
  const ignoreNextPopRef = React.useRef(false);

  // Open order dialog and push a history entry so back button closes it first
  const openOrderLocal = () => {
    setIsOrderOpen(true);
    if (!pushedOrderStateRef.current && typeof window !== "undefined") {
      try {
        window.history.pushState({ fabricOrder: true }, "");
        pushedOrderStateRef.current = true;
      } catch (e) {
        /* ignore */
      }
    }
  };

  // Close order dialog and remove pushed history entry (if present)
  const closeOrderLocal = () => {
    setIsOrderOpen(false);
    if (pushedOrderStateRef.current && typeof window !== "undefined") {
      // we will go back one entry to remove our pushed state; ignore the resulting pop
      ignoreNextPopRef.current = true;
      try {
        window.history.back();
      } catch (e) {
        /* ignore */
      }
      pushedOrderStateRef.current = false;
    }
  };

  // Popstate handler: if we had pushed an order state, first back should close the dialog
  useEffect(() => {
    const onPop = (_ev: PopStateEvent) => {
      if (ignoreNextPopRef.current) {
        ignoreNextPopRef.current = false;
        return;
      }
      if (pushedOrderStateRef.current) {
        // clear pushed flag and close if open
        pushedOrderStateRef.current = false;
        if (isOrderOpen) setIsOrderOpen(false);
        return;
      }
      // otherwise allow normal back navigation
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [isOrderOpen]);
  const { getProductById } = usePublicApi();
  const [fabric, setFabric] = useState<Fabric | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { addItemToCart } = useCartApi();
  const [adding, setAdding] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedLengths, setSelectedLengths] = useState<number[]>([]);
  const { checkAuth } = useAuth();
  const [addingIndex, setAddingIndex] = useState<number | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const imageDialogPushedRef = React.useRef(false);

  const openImageDialog = (img: string) => {
    setSelectedImage(img);
    setIsImageDialogOpen(true);
    if (!imageDialogPushedRef.current && typeof window !== "undefined") {
      try {
        window.history.pushState({ imageDialog: true }, "");
        imageDialogPushedRef.current = true;
      } catch (e) {
        /* ignore */
      }
    }
  };

  const closeImageDialog = () => {
    setIsImageDialogOpen(false);
    if (imageDialogPushedRef.current && typeof window !== "undefined") {
      try {
        window.history.back();
      } catch (e) {
        /* ignore */
      }
      imageDialogPushedRef.current = false;
    }
  };

  async function handleAddImageToCart(img: string, idx: number) {
    try {
      setAddingIndex(idx);
      const auth = await checkAuth();
      if (!auth?.loggedIn) {
        navigate("/signup");
        return;
      }
      const meters = selectedLengths[idx] ?? 1;
      await addItemToCart({
        productId: fabric?.id,
        meters,
        pricePerMeter: (fabric as any)?.price,
        images: [img],
      } as any);
      toast.success("تمت الإضافة إلى السلة");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "فشل الإضافة للسلة");
    } finally {
      setAddingIndex(null);
    }
  }

  useEffect(() => {
    const fetchFabric = async () => {
      const fabricData = await getProductById(fabricId as string);
      const rawImages = fabricData?.Image || [];
      const rawSoldOutImages = fabricData?.soldOutImages || [];

      const processedImages =
        rawImages.map((img: string) => getImageUrl(img) || "") || [];
      const processedSoldOutImages =
        rawSoldOutImages.map((img: string) => getImageUrl(img) || "") || [];

      setFabric({
        id: fabricData._id,
        images: processedImages,
        name: fabricData.Name,
        price: fabricData.PricePerMeter,
        description: fabricData?.Description || "",
        mainCategory: fabricData.MainCategory,
        subCategory: fabricData.SubCategory,
        videoUrl: fabricData.VideoUrl || "",
        stock: Array.isArray(fabricData.stock) ? fabricData.stock : [],
        soldOutImages: processedSoldOutImages,
      });
    };
    if (fabricId) fetchFabric();
  }, [fabricId, getProductById]);

  // initialize per-image selected lengths when fabric changes
  useEffect(() => {
    if (fabric?.images && Array.isArray(fabric.images)) {
      setSelectedLengths(fabric.images.map(() => 3));
    } else {
      setSelectedLengths([]);
    }
  }, [fabric]);
  // Handle browser back button for image dialog
  useEffect(() => {
    const onPop = (ev: PopStateEvent) => {
      if (imageDialogPushedRef.current) {
        imageDialogPushedRef.current = false;
        if (isImageDialogOpen) setIsImageDialogOpen(false);
        return;
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [isImageDialogOpen]);
  const navigateToPreviousPage = () => {
    navigate(
      `/categories/${fabric?.mainCategory._id / fabric?.subCategory._id}`,
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
        <title>{fabric?.name} - النوام للأقمشة</title>
      </Helmet>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
        {/* Product Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-(--color-text-tertiary)">
            {fabric.name}
          </h1>

          <p className="mt-2 text-2xl font-semibold">
            {fabric.price}{" "}
            <span className="text-sm text-gray-500">جنيه / متر</span>
          </p>
          {/* Details Section */}

          <aside className="space-y-6">
            {fabric.description && (
              <section>
                <h2 className="text-xl font-semibold mb-2">الوصف</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {fabric.description}
                </p>
              </section>
            )}

            {fabric.stock?.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">
                  المخزون حسب اللون
                </h2>

                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full text-right">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 text-sm font-medium">اللون</th>
                        <th className="p-3 text-sm font-medium">
                          المتاح (متر)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {fabric.stock.map((s, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-3 font-medium">{s.color}</td>
                          <td className="p-3 font-semibold">{s.meters}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </aside>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Actions */}
          <section className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsShareOpen(true)}
              className="flex-1   h-20 cursor-pointer  text-2xl  flex items-center justify-center gap-2 border-yellow-300 bg-yellow-50 hover:bg-yellow-100 hover:text-black text-yellow-700"
            >
              <Share2 className="h-5 w-5" />
              مشاركة الصفحة
            </Button>
          </section>
          {/* Images Section */}
          <section className="space-y-4 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                الألوان والخامات المتاحة
              </h2>
              <p className="text-gray-600 text-base mb-4">
                استعرض الصور واختر اللون والطول المناسب،اضغط طلب الان للطلب
                السريع او اضف الي السلة لاكمال التسوق.
              </p>
              {fabric.images.map((img, idx) => (
                <article
                  key={idx}
                  className="group rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition"
                >
                  <div
                    className="cursor-zoom-in"
                    onClick={() => {
                      setSelectedImage(img);
                      setIsImageDialogOpen(true);
                      if (
                        !imageDialogPushedRef.current &&
                        typeof window !== "undefined"
                      ) {
                        try {
                          window.history.pushState({ imageDialog: true }, "");
                          imageDialogPushedRef.current = true;
                        } catch (e) {}
                      }
                    }}
                  >
                    <LazyImage
                      src={img}
                      alt={`${fabric.name} ${idx + 1}`}
                      className="w-full h-80 object-cover transition-transform duration-300 hover:scale-105 rounded-xl"
                    />
                  </div>
                  <div className="p-4 space-y-3 flex items-center justify-center flex-col">
                    <LengthPicker
                      value={selectedLengths[idx]}
                      onChange={(v) =>
                        setSelectedLengths((prev) => {
                          const copy = [...prev];
                          copy[idx] = v;
                          return copy;
                        })
                      }
                    />

                    <div className="flex gap-2  w-full">
                      {(() => {
                        const soldOutUrls = (fabric.soldOutImages || []).map(
                          (img) => getImageUrl(img),
                        );
                        const isDirectMatch = soldOutUrls.includes(img);
                        const isPartialMatch = soldOutUrls.some(
                          (url) => img.includes(url) || url.includes(img),
                        );
                        const isSoldOut = isDirectMatch || isPartialMatch;

                        console.log(`Image ${idx + 1} check:`, {
                          currentImage: img,
                          soldOutUrls,
                          isDirectMatch,
                          isPartialMatch,
                          isSoldOut,
                        });

                        return isSoldOut;
                      })() ? (
                        <div className="w-full py-4 text-center bg-orange-50 border border-orange-200 text-orange-700 font-bold rounded-lg text-xl">
                          نفذت الكمية
                        </div>
                      ) : (
                        <>
                          <Button
                            className="flex-1 text-lg"
                            onClick={() => {
                              setSelectedImage(img);
                              openOrderLocal();
                            }}
                          >
                            طلب الآن
                          </Button>

                          <Button
                            variant="outline"
                            disabled={addingIndex === idx}
                            onClick={() => handleAddImageToCart(img, idx)}
                            className="text-[#A8511A] text-lg"
                          >
                            {addingIndex === idx
                              ? "جاري الإضافة..."
                              : " أضف للسلة"}
                            <ShoppingCart className="w-4 h-4 ml-2" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Video */}
        {fabric.videoUrl && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">فيديو المنتج</h2>
            <VideoIframe videoUrl={getImageUrl(fabric.videoUrl)} />
          </section>
        )}

        {/* Dialogs  */}
        <Dialog open={isOrderOpen} onOpenChange={() => closeOrderLocal()}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <FabricOrderForm
              fabric={fabric}
              selectedImage={selectedImage || undefined}
              onClose={closeOrderLocal}
              selectedLength={
                selectedImage
                  ? selectedLengths[
                      fabric.images.indexOf(selectedImage)
                    ]?.toString()
                  : undefined
              }
            />
          </DialogContent>
        </Dialog>

        <ShareSheet
          open={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          name={fabric.name}
          url={window.location.href}
          description={fabric.description}
        />

        <Dialog
          open={isImageDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsImageDialogOpen(false);
              if (
                imageDialogPushedRef.current &&
                typeof window !== "undefined"
              ) {
                try {
                  window.history.back();
                } catch (e) {}
                imageDialogPushedRef.current = false;
              }
            }
          }}
        >
          <DialogContent
            className="max-w-4xl h-[90vh] p-0 flex items-center justify-center bg-black border-0"
            showCloseButton={false}
          >
            <button
              onClick={() => {
                setIsImageDialogOpen(false);
                if (
                  imageDialogPushedRef.current &&
                  typeof window !== "undefined"
                ) {
                  try {
                    window.history.back();
                  } catch (e) {}
                  imageDialogPushedRef.current = false;
                }
              }}
              className="absolute top-4 right-4 z-50 rounded-full bg-white/90 backdrop-blur-sm p-4 text-black hover:bg-white transition-colors shadow-lg"
            >
              <X className="h-8 w-8" />
            </button>
            {selectedImage && (
              <div className="w-full h-full flex items-center justify-center">
                <TransformWrapper
                  initialScale={1}
                  minScale={1}
                  maxScale={4}
                  centerOnInit
                >
                  <TransformComponent>
                    <img
                      src={selectedImage}
                      alt="صورة القماش"
                      style={{
                        maxHeight: "90vh",
                        maxWidth: "100%",
                        objectFit: "contain",
                        cursor: "zoom-in",
                      }}
                      className="rounded-xl"
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
