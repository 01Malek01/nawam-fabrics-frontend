import React from 'react'
import { Button } from "@/components/ui/button";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,

 TableHeader,
 TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProductForm from "@/components/admin/ProductForm";
import { getImageUrl } from "@/lib/utils";
import { toast } from 'react-hot-toast';
import useAdminApi from "@/hooks/useAdminApi";

export default function ProductsTab({
 products,
 categories,
 isCreatingProduct,
 setIsCreatingProduct,
 load,
 handleCreateProduct,
 updateProductState,
 openEditingProduct,
 openManageImages,
 handleDeleteProduct,
 setProducts,
}
) {
 const api = useAdminApi();

 return (
  <>
   <div className="flex justify-between items-center mb-4">
    <div />
    <div className="flex flex-wrap gap-2">
     <Button className="cursor-pointer" onClick={() => load()}>
      تحديث البيانات
     </Button>
     <Dialog
      open={isCreatingProduct}
      onOpenChange={(open) => setIsCreatingProduct(open)}
     >
      <DialogContent>
       <ProductForm
        onSubmit={handleCreateProduct}
        categories={categories}
        onAfterSubmit={updateProductState}
       />
      </DialogContent>
     </Dialog>
     <Button
      className="cursor-pointer"
      onClick={() => {
       setIsCreatingProduct(true);
       try {
        history.pushState({ nawamDialog: true }, "");
       } catch (e) {
        void e;
       }
      }}
     >
      إضافة منتج جديد
     </Button>
    </div>
   </div>
   {/* Products Table (same as before) */}
   <section className="bg-white/60 dark:bg-white/5 p-4 rounded-lg">
    <h2 className="text-lg font-semibold text-right mb-3">المنتجات</h2>
    <Table>
     <TableHeader>
      <TableRow>
       <TableHead className="text-right">الصورة</TableHead>
       <TableHead className="text-right">الاسم</TableHead>
       <TableHead className="text-right">الوصف</TableHead>
       <TableHead className="text-right">السعر</TableHead>
       <TableHead className="text-right">الخصم</TableHead>
       <TableHead className="text-right">نص الخصم</TableHead>
       <TableHead className="text-right">جديد</TableHead>
       <TableHead className="text-right">الاكثر مبيعا</TableHead>
       <TableHead className="text-right">الفيديو</TableHead>
       <TableHead className="text-right">الإجراءات</TableHead>
      </TableRow>
     </TableHeader>
     <TableBody>
      {products.map((p) => (
       <TableRow key={p?._id}>
        <TableCell className="text-center">
         {Array.isArray(p?.Image) ? p?.Image.length : 0} صورة
        </TableCell>
        <TableCell className="font-medium">{p?.Name}</TableCell>
        <TableCell className="max-w-xs truncate">
         {p?.Description}
        </TableCell>
        <TableCell>{p?.PricePerMeter} ج.م</TableCell>
        <TableCell>
         {typeof p?.discount === "number" && p.discount > 0
          ? `${p.discount}%`
          : "-"}
        </TableCell>
        <TableCell className="max-w-xs truncate">
         {p?.discountText || "-"}
        </TableCell>
        <TableCell>
         {p?.isNewArrival === true ? (
          <span>✅</span>
         ) : (
          <span>❌</span>
         )}
        </TableCell>
        <TableCell>
         {p?.MostSold === true ? <span>✅</span> : <span>❌</span>}
        </TableCell>
        <TableCell>
         <div className="flex items-center gap-2">
          {p?.VideoUrl ? (
           <>
            <a
             href={getImageUrl(p?.VideoUrl)}
             target="_blank"
             rel="noreferrer"
             className="text-blue-600 hover:underline"
            >
             مشاهدة
            </a>
            <Button
             size="sm"
             variant="destructive"
             className="cursor-pointer"
             onClick={async () => {
              if (!p?._id) return;
              if (!confirm("هل تريد حذف هذا الفيديو؟"))
               return;
              try {
               await api.deleteProductVideo(p._id);
               // update local state to remove video url
               setProducts((prev) =>
                prev.map((prod) =>
                 prod?._id === p._id
                  ? { ...prod, VideoUrl: undefined }
                  : prod
                )
               );
               toast.success("تم حذف الفيديو");
              } catch (err) {
               toast.error("فشل حذف الفيديو");
              }
             }}
            >
             حذف
            </Button>
           </>
          ) : (
           <span className="text-gray-500">لا يوجد</span>
          )}
         </div>
        </TableCell>
        <TableCell>
         <div className="flex gap-2">
          <Button
           size="sm"
           className="cursor-pointer"
           onClick={() => openEditingProduct(p)}
          >
           تعديل
          </Button>
          <Button
           size="sm"
           className="cursor-pointer"
           onClick={() => openManageImages(p)}
          >
           تعديل الصور
          </Button>
          <Button
           size="sm"
           className="cursor-pointer"
           variant="destructive"
           onClick={() => p?._id && handleDeleteProduct(p?._id)}
          >
           حذف
          </Button>
         </div>
        </TableCell>
       </TableRow>
      ))}
     </TableBody>
    </Table>
   </section>
  </>
 )
}
