// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useEffect } from "react";
import useAdminApi from "../../hooks/useAdminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Package,
  DollarSign,
  FileText,
  Tag,
  Image as ImageIcon,
  Video,
  Star,
} from "lucide-react";
import { Plus, Trash2 } from "lucide-react";
import type { Category } from "@/components/admin/CategoryForm";
import toast from "react-hot-toast";

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
  discount?: number;
  discountText?: string;
  isNewArrival?: boolean;
  stock?: Array<{ color: string; meters: number }>;
};

type Props = {
  product?: Product | null;
  categories: Category[];
  onAfterSubmit?: () => void;
};

const ProductForm: React.FC<Props> = ({ product, categories }) => {
  const { createProduct, updateProduct, status } = useAdminApi();
  const [form, setForm] = React.useState<Product>(
    product || {
      Name: "",
      PricePerMeter: 0,
      Image: [],
      VideoUrl: "",
      MostSold: false,
      discount: 0,
      discountText: "",
      isNewArrival: false,
      stock: [],
    }
  );
  const [imageFiles, setImageFiles] = React.useState<File[] | null>(null);
  const [videoFile, setVideoFile] = React.useState<File | null>(null);

  useEffect(() => {
    setForm(
      product || {
        Name: "",
        PricePerMeter: 0,
        Image: [],
        VideoUrl: "",
        MostSold: false,
        discount: 0,
        discountText: "",
        isNewArrival: false,
        stock: null,
      }
    );
  }, [product]);

  const handleChange = (key: keyof Product, value: any) => {
    setForm((s: Product) => ({ ...s, [key]: value }));
  };

  const addStockEntry = () => {
    setForm((s) => ({
      ...(s as Product),
      stock: [...(s.stock || []), { color: "", meters: 0 }],
    }));
  };

  const updateStockEntry = (
    index: number,
    field: "color" | "meters",
    value: any
  ) => {
    setForm((s) => {
      const next = { ...(s as Product) };
      next.stock = [...(next.stock || [])];
      next.stock[index] = {
        ...next.stock[index],
        [field]: field === "meters" ? Number(value) : value,
      };
      return next;
    });
  };

  const removeStockEntry = (index: number) => {
    setForm((s) => {
      const next = { ...(s as Product) };
      next.stock = [...(next.stock || [])];
      next.stock.splice(index, 1);
      return next;
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("جاري رفع الصور أو حفظ المنتج...");
    const payload: Product & { _imageFiles?: File[]; _videoFile?: File } = {
      ...form,
    };
    if (imageFiles && imageFiles.length > 0) payload._imageFiles = imageFiles;
    if (videoFile) payload._videoFile = videoFile;
    const action =
      product && product._id
        ? updateProduct(product._id, payload)
        : createProduct(payload);
    action
      .then((result) => {
        toast.success("تم حفظ المنتج بنجاح", { id: toastId });
        if (!product || !product._id) {
          setForm({
            Name: "",
            PricePerMeter: 0,
            Image: [],
            VideoUrl: "",
            MostSold: false,
            discount: 0,
            discountText: "",
            isNewArrival: false,
            stock: null,
          });
          setImageFiles(null);
          setVideoFile(null);
        }
        if (typeof onAfterSubmit === "function") {
          onAfterSubmit(result, !!product);
        }
      })
      .catch(() => {
        toast.error("حدث خطأ أثناء الحفظ", { id: toastId });
      });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 overflow-auto max-h-screen md:max-h-[90vh]">
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {product ? "تعديل المنتج" : "إضافة منتج جديد"}
        </h3>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Package className="w-4 h-4" />
              اسم المنتج
            </Label>
            <Input
              value={form.Name}
              onChange={(e) => handleChange("Name", e.target.value)}
              placeholder="أدخل اسم المنتج"
              className="border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4" />
              سعر المتر
            </Label>
            <Input
              type="number"
              value={String(form.PricePerMeter)}
              onChange={(e) =>
                handleChange("PricePerMeter", Number(e.target.value))
              }
              placeholder="0"
              className="border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FileText className="w-4 h-4" />
            الوصف
          </Label>
          <Textarea
            value={form.Description || ""}
            onChange={(e) => handleChange("Description", e.target.value)}
            placeholder="وصف المنتج..."
            rows={3}
            className="border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Tag className="w-4 h-4" />
              الفئة الرئيسية
            </Label>
            <select
              value={form.MainCategory || ""}
              onChange={(e) => {
                handleChange("MainCategory", e.target.value || undefined);
                // Reset SubCategory if it's not under the new MainCategory
                if (form.SubCategory) {
                  const validSubs = categories.filter(
                    (c) =>
                      c.isSubCategory && c.ParentCategory === e.target.value
                  );
                  if (!validSubs.find((c) => c._id === form.SubCategory)) {
                    handleChange("SubCategory", undefined);
                  }
                }
              }}
              aria-label="الفئة الرئيسية"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
            >
              <option value="">-- اختر الفئة الرئيسية --</option>
              {categories
                .filter((c) => !c.isSubCategory)
                .map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.Name}
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Tag className="w-4 h-4" />
              الفئة الفرعية (اختياري)
            </Label>
            <select
              value={form.SubCategory || ""}
              onChange={(e) =>
                handleChange("SubCategory", e.target.value || undefined)
              }
              disabled={!form.MainCategory}
              aria-label="الفئة الفرعية"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary disabled:opacity-50"
            >
              <option value="">-- اختر الفئة الفرعية --</option>
              {categories
                .filter(
                  (c) =>
                    c.isSubCategory &&
                    c.ParentCategory?._id === form.MainCategory
                )
                .map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.Name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4" />
              الخصم بالجنيه
            </Label>
            <Input
              type="number"
              value={String(form.discount || 0)}
              onChange={(e) => handleChange("discount", Number(e.target.value))}
              placeholder="مثال: 10"
              className="border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Tag className="w-4 h-4" />
              نص الخصم
            </Label>
            <Input
              value={form.discountText || ""}
              onChange={(e) => handleChange("discountText", e.target.value)}
              placeholder="مثال: خصم رأس السنة"
              className="border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
          <input
            aria-label="is new arrival"
            id="isNewArrival"
            type="checkbox"
            checked={!!form.isNewArrival}
            onChange={(e) => handleChange("isNewArrival", e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <Label
            htmlFor="isNewArrival"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <Star className="w-4 h-4" />
            منتج جديد
          </Label>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FileText className="w-4 h-4" />
            المخزون (المتر) حسب اللون
          </Label>

          <div className="space-y-2">
            {(form.stock || []).map((s, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  placeholder="اللون"
                  value={s.color || ""}
                  onChange={(e) =>
                    updateStockEntry(idx, "color", e.target.value)
                  }
                  className="flex-1 border-gray-300 dark:border-gray-600"
                />

                <Input
                  placeholder="المخزون بالمتر"
                  type="number"
                  value={String(s.meters ?? 0)}
                  onChange={(e) =>
                    updateStockEntry(idx, "meters", e.target.value)
                  }
                  className="w-44 border-gray-300 dark:border-gray-600"
                />

                <button
                  type="button"
                  onClick={() => removeStockEntry(idx)}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Remove color"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            ))}

            <div>
              <button
                type="button"
                onClick={addStockEntry}
                className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-md"
              >
                <Plus className="w-4 h-4" /> إضافة لون
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <ImageIcon className="w-4 h-4" />
            صور المنتج
          </Label>

          <input
            aria-label="upload-images"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setImageFiles(e.target.files ? Array.from(e.target.files) : null)
            }
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
          />
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Video className="w-4 h-4" />
            فيديو المنتج (اختياري)
          </Label>

          <input
            aria-label="upload-video"
            type="file"
            accept="video/*"
            onChange={(e) =>
              setVideoFile(e.target.files ? e.target.files[0] : null)
            }
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
          <input
            aria-label="Most sold"
            id="mostSold"
            type="checkbox"
            checked={!!form.MostSold}
            onChange={(e) => handleChange("MostSold", e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <Label
            htmlFor="mostSold"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <Star className="w-4 h-4" />
            الأكثر مبيعا
          </Label>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4 border-t">
          <Button
            type="submit"
            className="w-full sm:w-auto px-6 cursor-pointer"
            disabled={status === "loading"}
          >
            {status === "loading"
              ? "جاري الحفظ..."
              : product
              ? "تحديث"
              : "إضافة"}{" "}
            المنتج
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
