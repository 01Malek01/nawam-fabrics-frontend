import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProductForm from "./ProductForm";
import CategoryForm from "./CategoryForm";
import LastPieceForm from "./LastPieceForm";
import { getImageUrl } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function AdminDialogs({
  api,
  products,
  setProducts,
  managingImagesProduct,
  closeManageImages,
  editingProduct,
  setEditingProduct,
  editingCategory,
  setEditingCategory,
  editingLastPiece,
  setEditingLastPiece,
  categories,
  updateProductState,
  updateCategoryState,
  updateLastPieceState,
  handleUpdateProduct,
  handleUpdateCategory,
  setManagingImagesProduct,
}) {
  return (
    <>
      {/* Edit product dialog */}
      {editingProduct && (
        <Dialog open onOpenChange={() => setEditingProduct(null)}>
          <DialogContent>
            <ProductForm
              product={editingProduct}
              onSubmit={() => {
                handleUpdateProduct();
              }}
              categories={categories}
              onAfterSubmit={updateProductState}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Manage Images dialog */}
      <Dialog
        open={!!managingImagesProduct}
        onOpenChange={(open) => {
          if (!open) closeManageImages();
        }}
      >
        <DialogContent className="w-full max-w-3xl sm:max-w-4xl max-h-[80vh] overflow-hidden">
          <div className="flex flex-col space-y-4 p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">صور المنتج</h3>
              <button
                onClick={() => closeManageImages()}
                className="text-sm text-gray-600 hover:text-gray-800"
                aria-label="إغلاق"
              >
                إغلاق
              </button>
            </div>

            {managingImagesProduct?.Image && managingImagesProduct.Image.length > 0 ? (
              <div className="max-h-[62vh] overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {managingImagesProduct.Image.map((img, idx) => (
                    <div key={idx} className="relative rounded overflow-hidden bg-gray-100 h-24 sm:h-32">
                      <img src={getImageUrl(img)} alt={`image-${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <button
                          aria-label={managingImagesProduct.soldOutImages && managingImagesProduct.soldOutImages.includes(img) ? "Mark as Available" : "Mark as Sold Out"}
                          className={`rounded-md p-1.5 sm:p-2 cursor-pointer text-xs sm:text-sm border ${managingImagesProduct.soldOutImages && managingImagesProduct.soldOutImages.includes(img)
                            ? "bg-orange-500 text-white border-orange-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            }`}
                          onClick={async () => {
                            if (!managingImagesProduct?._id) return;
                            const isSoldOut = managingImagesProduct.soldOutImages && managingImagesProduct.soldOutImages.includes(img);
                            let nextSoldOut = [...(managingImagesProduct.soldOutImages || [])];

                            if (isSoldOut) {
                              nextSoldOut = nextSoldOut.filter(url => url !== img);
                            } else {
                              nextSoldOut.push(img);
                            }

                            try {
                              const updated = await api.updateProduct(managingImagesProduct._id, {
                                soldOutImages: nextSoldOut
                              });
                              // update local products state
                              setProducts((prev) =>
                                prev.map((prod) =>
                                  prod?._id === managingImagesProduct._id ? updated : prod
                                )
                              );
                              // Update dialog state immediately
                              setManagingImagesProduct(updated);
                              toast.success(!isSoldOut ? "تم وضع علامة نفذ الكمية" : "تم وضع علامة متوفر");
                            } catch (err) {
                              toast.error("فشل تحديث الحالة");
                            }
                          }}
                        >
                          {managingImagesProduct.soldOutImages && managingImagesProduct.soldOutImages.includes(img) ? "نفذت" : "متوفر"}
                        </button>
                      </div>

                      <button
                        aria-label={`حذف الصورة ${idx + 1}`}
                        className="absolute top-2 right-2 rounded-full bg-red-600 text-white p-1.5 sm:p-2 cursor-pointer text-xs sm:text-sm"
                        onClick={async () => {
                          if (!managingImagesProduct?._id) return;
                          if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) return;
                          try {
                            await api.deleteProductImage(managingImagesProduct._id, idx);
                            // update local products state
                            setProducts((prev) =>
                              prev.map((prod) =>
                                prod?._id === managingImagesProduct._id
                                  ? {
                                    ...prod,
                                    Image: (prod.Image || []).filter((_, i) => i !== idx),
                                    soldOutImages: (prod.soldOutImages || []).filter((url) => url !== img),
                                  }
                                  : prod
                              )
                            );
                            toast.success("تم حذف الصورة");
                          } catch (err) {
                            toast.error("فشل حذف الصورة");
                          }
                        }}
                      >
                        ✕
                      </button>

                      {managingImagesProduct.soldOutImages && managingImagesProduct.soldOutImages.includes(img) && (
                        <div className="absolute inset-x-0 bottom-0 bg-orange-600/80 text-white text-[10px] text-center py-0.5">
                          نفذت الكمية
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>لا توجد صور لهذا المنتج</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit category dialog */}
      {editingCategory && (
        <Dialog open onOpenChange={() => setEditingCategory(null)}>
          <DialogContent>
            <CategoryForm
              category={editingCategory}
              onSubmit={() => {
                handleUpdateCategory();
              }}
              categories={categories}
              onAfterSubmit={updateCategoryState}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit last piece dialog */}
      {editingLastPiece && (
        <Dialog open onOpenChange={() => setEditingLastPiece(null)}>
          <DialogContent>
            <LastPieceForm
              lastPiece={editingLastPiece}
              products={products}
              categories={categories}
              onAfterSubmit={updateLastPieceState}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
