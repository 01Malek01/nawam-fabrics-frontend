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
import CategoryForm from "./CategoryForm";
import { getImageUrl } from "@/lib/utils";

export default function CategoriesTab({
 categories,
 load,
 isCreatingCategory,
 setIsCreatingCategory,
 handleCreateCategory,
 updateCategoryState,
 openEditingCategory,
 handleDeleteCategory,
}) {
 return (
  <>
   <div className="flex justify-between items-center mb-4">
    <div />
    <div className="flex flex-wrap gap-2">
     <Button className="cursor-pointer" onClick={() => load()}>
      تحديث البيانات
     </Button>
     <Dialog
      open={isCreatingCategory}
      onOpenChange={(open) => setIsCreatingCategory(open)}
     >
      <DialogContent>
       <CategoryForm
        onSubmit={handleCreateCategory}
        categories={categories}
        onAfterSubmit={updateCategoryState}
       />
      </DialogContent>
     </Dialog>
     <Button
      className="cursor-pointer"
      onClick={() => {
       setIsCreatingCategory(true);
       try {
        history.pushState({ nawamDialog: true }, "");
       } catch (e) {
        void e;
       }
      }}
     >
      إضافة فئة جديدة
     </Button>
    </div>
   </div>

   <section className="bg-white/60 dark:bg-white/5 p-4 rounded-lg">
    <h2 className="text-lg font-semibold text-right mb-3">الفئات</h2>
    <Table>
     <TableHeader>
      <TableRow>
       <TableHead className="text-right">الصورة</TableHead>
       <TableHead className="text-right">الاسم</TableHead>
       <TableHead className="text-right">النوع</TableHead>
       <TableHead className="text-right">الفئة الرئيسية</TableHead>
       <TableHead className="text-right">الأولوية</TableHead>
       <TableHead className="text-right">الإجراءات</TableHead>
      </TableRow>
     </TableHeader>
     <TableBody>
      {categories.map((c) => (
       <TableRow key={c?._id}>
        <TableCell>
         {c?.Image && (
          <img
           src={getImageUrl(c?.Image)}
           alt={c?.Name}
           className="w-12 h-10 object-cover rounded"
          />
         )}
        </TableCell>
        <TableCell className="font-medium">{c?.Name}</TableCell>
        <TableCell>{c?.isSubCategory ? "فرعية" : "رئيسية"}</TableCell>
        <TableCell>{c?.ParentCategory?.Name}</TableCell>
        <TableCell>
         {typeof c?.priority === "number" ? c.priority : "-"}
        </TableCell>
        <TableCell>
         <div className="flex gap-2">
          <Button size="sm" className="cursor-pointer" onClick={() => openEditingCategory(c)}>
           تعديل
          </Button>
          <Button size="sm" className="cursor-pointer" variant="destructive" onClick={() => c?._id && handleDeleteCategory(c?._id)}>
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
