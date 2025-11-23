import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import useAdminApi from "@/hooks/useAdminApi";
import CategoryForm from "./CategoryForm";
import ProductForm from "./ProductForm";

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
  ParentCategory?: string | null;
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

  const handleCreateProduct = async (data: Product) => {
    await api.createProduct(data);
    await load();
  };

  const handleUpdateProduct = async (id: string, data: Product) => {
    await api.updateProduct(id, data);
    setEditingProduct(null);
    await load();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟")) return;
    await api.deleteProduct(id);
    await load();
  };

  const handleCreateCategory = async (data: Category) => {
    await api.createCategory(data);
    await load();
  };

  const handleUpdateCategory = async (id: string, data: Category) => {
    await api.updateCategory(id, data);
    setEditingCategory(null);
    await load();
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
          <Dialog>
            <DialogTrigger asChild>
              <Button>إضافة فئة جديدة</Button>
            </DialogTrigger>
            <DialogContent>
              <CategoryForm
                onSubmit={handleCreateCategory}
                categories={categories}
              />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>إضافة منتج جديد</Button>
            </DialogTrigger>
            <DialogContent>
              <ProductForm
                onSubmit={handleCreateProduct}
                categories={categories}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <section className="bg-white/60 dark:bg-white/5 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-right mb-3">المنتجات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {products.map((p) => (
            <div
              key={p._id}
              className="border rounded p-3 flex justify-between items-start"
            >
              <div className="text-right">
                {p.Image && p.Image.length > 0 && (
                  <img
                    src={p.Image[0]}
                    alt={p.Name}
                    className="w-28 h-20 object-cover rounded mb-2 mr-2 inline-block"
                  />
                )}
                <div className="font-bold">{p.Name}</div>
                <div className="text-sm text-gray-600">{p.Description}</div>
                <div className="text-sm mt-1">سعر المتر: {p.PricePerMeter}</div>
                {p.VideoUrl && (
                  <div className="mt-2">
                    <a
                      href={p.VideoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600"
                    >
                      مشاهدة الفيديو
                    </a>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm" onClick={() => setEditingProduct(p)}>
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => p._id && handleDeleteProduct(p._id)}
                >
                  حذف
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white/60 dark:bg-white/5 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-right mb-3">الفئات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((c) => (
            <div
              key={c._id}
              className="border rounded p-3 flex justify-between items-start"
            >
              <div className="text-right">
                {c.Image && (
                  <img
                    src={c.Image}
                    alt={c.Name}
                    className="w-20 h-16 object-cover rounded mb-2 mr-2 inline-block"
                  />
                )}
                <div className="font-bold">{c.Name}</div>
                <div className="text-sm text-gray-600">
                  {c.isSubCategory ? "فرعية" : "رئيسية"}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm" onClick={() => setEditingCategory(c)}>
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => c._id && handleDeleteCategory(c._id)}
                >
                  حذف
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Edit dialogs */}
      {editingProduct && (
        <Dialog open onOpenChange={() => setEditingProduct(null)}>
          <DialogContent>
            <ProductForm
              product={editingProduct}
              onSubmit={(data) =>
                editingProduct._id &&
                handleUpdateProduct(editingProduct._id, data)
              }
              categories={categories}
            />
          </DialogContent>
        </Dialog>
      )}

      {editingCategory && (
        <Dialog open onOpenChange={() => setEditingCategory(null)}>
          <DialogContent>
            <CategoryForm
              category={editingCategory}
              onSubmit={(data) =>
                editingCategory._id &&
                handleUpdateCategory(editingCategory._id, data)
              }
              categories={categories}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminDashboard;
