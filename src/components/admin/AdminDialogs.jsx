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
           <button
            aria-label={`حذف الصورة ${idx + 1}`}
            className="absolute top-2 right-2 rounded-full bg-red-600 text-white p-1.5 sm:p-2 cursor-pointer text-xs sm:text-sm"
            onClick={async () => {
             if (!managingImagesProduct?._id) return;
             try {
              await api.deleteProductImage(managingImagesProduct._id, idx);
              // update local products state
              setProducts((prev) =>
               prev.map((prod) =>
                prod?._id === managingImagesProduct._id
                 ? {
                  ...prod,
                  Image: (prod.Image || []).filter((_, i) => i !== idx),
                 }
                 : prod
               )
              );
              // also update the managingImagesProduct state so UI updates
              // this is handled in parent by closing or reloading; if parent keeps the managingImagesProduct object reference,
              // caller can refresh setManagingImagesProduct. Here we just toast success.
              toast.success("تم حذف الصورة");
             } catch (err) {
              toast.error("فشل حذف الصورة");
             }
            }}
           >
            ✕
           </button>
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
