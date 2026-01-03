import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";
import LastPieceForm from "./LastPieceForm";
import { getImageUrl } from "@/lib/utils";

export default function LastPiecesTab({
 lastPieces,
 products,
 categories,
 load,
 isCreatingLastPiece,
 setIsCreatingLastPiece,
 updateLastPieceState,
 openEditingLastPiece,
 handleDeleteLastPiece,
}) {
 return (
  <>
   <div className="flex justify-between items-center mb-4">
    <div />
    <div className="flex flex-wrap gap-2">
     <Button className="cursor-pointer" onClick={() => load()}>
      تحديث البيانات
     </Button>
     <Dialog open={isCreatingLastPiece} onOpenChange={(open) => setIsCreatingLastPiece(open)}>
      <DialogContent>
       <LastPieceForm products={products} categories={categories} onAfterSubmit={updateLastPieceState} />
      </DialogContent>
     </Dialog>
     <Button
      className="cursor-pointer"
      onClick={() => {
       setIsCreatingLastPiece(true);
       try {
        history.pushState({ nawamDialog: true }, "");
       } catch (e) {
        void e;
       }
      }}
     >
      إضافة قطعة أخيرة
     </Button>
    </div>
   </div>

   <section className="bg-white/60 dark:bg-white/5 p-4 rounded-lg">
    <h2 className="text-lg font-semibold text-right mb-3">قطع أخيرة</h2>
    <Table>
     <TableHeader>
      <TableRow>
       <TableHead className="text-right">الصورة</TableHead>
       <TableHead className="text-right">الاسم</TableHead>
       <TableHead className="text-right">الطول</TableHead>
       <TableHead className="text-right">السعر</TableHead>
       <TableHead className="text-right">المنتج</TableHead>
       <TableHead className="text-right">الفئة</TableHead>
       <TableHead className="text-right">الإجراءات</TableHead>
      </TableRow>
     </TableHeader>
     <TableBody>
      {lastPieces.map((lp) => (
       <TableRow key={lp?._id}>
        <TableCell>
         {lp?.Image ? (
          <img src={getImageUrl(lp.Image)} alt={lp?.name} className="w-20 h-12 object-cover rounded" />
         ) : (
          <span className="text-gray-500">لا يوجد</span>
         )}
        </TableCell>
        <TableCell className="font-medium">{lp?.name}</TableCell>
        <TableCell>{lp?.length ?? "-"}</TableCell>
        <TableCell>{lp?.price ?? "-"}</TableCell>
        <TableCell>{lp?.product?.Name || lp?.product || "-"}</TableCell>
        <TableCell>{lp?.category?.Name || lp?.category || "-"}</TableCell>
        <TableCell>
         <div className="flex gap-2">
          <Button size="sm" className="cursor-pointer" onClick={() => openEditingLastPiece(lp)}>
           تعديل
          </Button>
          <Button size="sm" className="cursor-pointer" variant="destructive" onClick={() => lp?._id && handleDeleteLastPiece(lp._id)}>
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
 );
}
