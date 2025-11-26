// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAdminApi from "@/hooks/useAdminApi";
import CategoryForm from "./CategoryForm";
import ProductForm from "./ProductForm";
import { getImageUrl } from "@/lib/utils";

type Product = {
  _id?: string;
  Name: string;
  PricePerMeter: number;
  Description?: string;
  Image?: string[];
  SubCategory?: string;
  MainCategory?: string;
  VideoUrl?: string;
  MostSold?: boolean;
};

type Category = {
  _id?: string;
  Name: string;
  ParentCategory?: Category | null;
  Image?: string;
  isSubCategory?: boolean;
};

const AdminDashboard: React.FC = () => {
  const api = useAdminApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const load = async () => {
    const [p, c] = await Promise.all([api.getProducts(), api.getCategories()]);
    setProducts(p || []);
    setCategories(c || []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateProductState = (item: Product, isUpdate: boolean) => {
    if (isUpdate) {
      setProducts((prev) => prev.map((p) => (p._id === item._id ? item : p)));
    } else {
      setProducts((prev) => [...prev, item]);
    }
  };

  const updateCategoryState = (item: Category, isUpdate: boolean) => {
    if (isUpdate) {
      setCategories((prev) => prev.map((c) => (c._id === item._id ? item : c)));
    } else {
      setCategories((prev) => [...prev, item]);
    }
  };

  const handleCreateProduct = async () => {
    // API call handled in ProductForm
  };

  const handleUpdateProduct = async () => {
    // API call handled in ProductForm
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟")) return;
    await api.deleteProduct(id);
    await load();
  };

  const handleCreateCategory = async () => {
    // API call handled in CategoryForm
  };

  const handleUpdateCategory = async () => {
    // API call handled in CategoryForm
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذه الفئة؟")) return;
    await api.deleteCategory(id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div />
        <div className="flex gap-2">
          <Button className="cursor-pointer" onClick={() => load()}>
            تحديث البيانات
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">إضافة فئة جديدة</Button>
            </DialogTrigger>
            <DialogContent>
              <CategoryForm
                onSubmit={handleCreateCategory}
                categories={categories}
                onAfterSubmit={updateCategoryState}
              />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">إضافة منتج جديد</Button>
            </DialogTrigger>
            <DialogContent>
              <ProductForm
                onSubmit={handleCreateProduct}
                categories={categories}
                onAfterSubmit={updateProductState}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <section className="bg-white/60 dark:bg-white/5 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-right mb-3">المنتجات</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الصورة</TableHead>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">الوصف</TableHead>
              <TableHead className="text-right">السعر</TableHead>
              <TableHead className="text-right">الاكثر مبيعا</TableHead>
              <TableHead className="text-right">الفيديو</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}>
                <TableCell className="text-center">
                  {Array.isArray(p.Image) ? p.Image.length : 0} صورة
                </TableCell>
                <TableCell className="font-medium">{p.Name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {p.Description}
                </TableCell>
                <TableCell>{p.PricePerMeter} ج.م</TableCell>
                <TableCell>
                  {p.MostSold === true ? <span>✅</span> : <span>❌</span>}
                </TableCell>
                <TableCell>
                  {p.VideoUrl && (
                    <a
                      href={getImageUrl(p.VideoUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      مشاهدة
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => setEditingProduct(p)}
                    >
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      className="cursor-pointer"
                      variant="destructive"
                      onClick={() => p._id && handleDeleteProduct(p._id)}
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

      <section className="bg-white/60 dark:bg-white/5 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-right mb-3">الفئات</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الصورة</TableHead>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">الفئة الرئيسية</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c._id}>
                <TableCell>
                  {c.Image && (
                    <img
                      src={getImageUrl(c.Image)}
                      alt={c.Name}
                      className="w-12 h-10 object-cover rounded"
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium">{c.Name}</TableCell>
                <TableCell>{c.isSubCategory ? "فرعية" : "رئيسية"}</TableCell>
                <TableCell>{c?.ParentCategory?.Name}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => setEditingCategory(c)}
                    >
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      className="cursor-pointer"
                      variant="destructive"
                      onClick={() => c._id && handleDeleteCategory(c._id)}
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

      {/* Edit dialogs */}
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
    </div>
  );
};

export default AdminDashboard;
