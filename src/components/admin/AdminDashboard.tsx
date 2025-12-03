// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useEffect, useState } from "react";
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
import useAdminApi from "@/hooks/useAdminApi";
import toast from "react-hot-toast";
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
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  const load = async () => {
    const [p, c] = await Promise.all([api.getProducts(), api.getCategories()]);
    setProducts(p || []);
    setCategories(c || []);
  };

  const openEditingProduct = (p: Product) => {
    setEditingProduct(p);
    try {
      history.pushState({ nawamDialog: true }, "");
    } catch (e) {
      void e;
    }
  };

  const openEditingCategory = (c: Category) => {
    setEditingCategory(c);
    try {
      history.pushState({ nawamDialog: true }, "");
    } catch (e) {
      void e;
    }
  };

  const [managingImagesProduct, setManagingImagesProduct] =
    useState<Product | null>(null);

  const openManageImages = (p: Product) => {
    setManagingImagesProduct(p);
    try {
      history.pushState({ nawamDialog: true }, "");
    } catch (e) {
      void e;
    }
  };

  const closeManageImages = () => setManagingImagesProduct(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close forms when the browser back button is pressed.
  useEffect(() => {
    const handlePop = () => {
      // Close any open dialog/form state. No-op if already closed.
      setIsCreatingCategory(false);
      setIsCreatingProduct(false);
      setEditingProduct(null);
      setEditingCategory(null);
    };

    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
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
      setCategories((prev) =>
        prev.map((c) => (c?._id === item?._id ? item : c))
      );
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
              setIsCreatingCategory(true);
              // push a dummy history state so back button closes the dialog
              try {
                history.pushState({ nawamDialog: true }, "");
              } catch (e) {
                void e;
              }
            }}
          >
            إضافة فئة جديدة
          </Button>

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
                            if (!confirm("هل تريد حذف هذا الفيديو؟")) return;
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
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => openEditingCategory(c)}
                    >
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      className="cursor-pointer"
                      variant="destructive"
                      onClick={() => c?._id && handleDeleteCategory(c?._id)}
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

            {managingImagesProduct?.Image &&
            managingImagesProduct.Image.length > 0 ? (
              <div className="max-h-[62vh] overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {managingImagesProduct.Image.map(
                    (img: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative rounded overflow-hidden bg-gray-100 h-24 sm:h-32"
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`image-${idx}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          aria-label={`حذف الصورة ${idx + 1}`}
                          className="absolute top-2 right-2 rounded-full bg-red-600 text-white p-1.5 sm:p-2 cursor-pointer text-xs sm:text-sm"
                          onClick={async () => {
                            if (!managingImagesProduct?._id) return;
                            try {
                              await api.deleteProductImage(
                                managingImagesProduct._id,
                                idx
                              );
                              // update local products state
                              setProducts((prev) =>
                                prev.map((prod) =>
                                  prod?._id === managingImagesProduct._id
                                    ? {
                                        ...prod,
                                        Image: (prod.Image || []).filter(
                                          (_: any, i: number) => i !== idx
                                        ),
                                      }
                                    : prod
                                )
                              );
                              // also update the managingImagesProduct state so UI updates
                              setManagingImagesProduct((cur) =>
                                cur
                                  ? {
                                      ...cur,
                                      Image: (cur.Image || []).filter(
                                        (_: any, i: number) => i !== idx
                                      ),
                                    }
                                  : cur
                              );
                              toast.success("تم حذف الصورة");
                            } catch (err) {
                              toast.error("فشل حذف الصورة");
                            }
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <p>لا توجد صور لهذا المنتج</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
