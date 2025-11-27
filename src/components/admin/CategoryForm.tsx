// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Folder, Image as ImageIcon, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import useAdminApi from "../../hooks/useAdminApi";

export type Category = {
  _id?: string;
  Name: string;
  ParentCategory?: Category | null;
  Image?: string;
  isSubCategory?: boolean;
};

type Props = {
  category?: Category | null;
  onSubmit: (data: Category) => void | Promise<void>;
  categories: Category[];
  onAfterSubmit?: (item: Category, isUpdate: boolean) => void;
};

const CategoryForm: React.FC<Props> = ({
  category,
  categories,
  onAfterSubmit,
}) => {
  const { createCategory, updateCategory } = useAdminApi();
  const [form, setForm] = React.useState<Category>(
    category || { Name: "", ParentCategory: null, Image: "" }
  );

  React.useEffect(
    () => setForm(category || { Name: "", ParentCategory: null }),
    [category]
  );

  const handleChange = (key: keyof Category, value: any) =>
    setForm((s) => ({ ...s, [key]: value }));

  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("جاري رفع الصورة أو حفظ الفئة...");
    setIsUploading(true);
    const payload: any = { ...form };
    if (imageFile) payload._imageFile = imageFile;
    if (payload?.ParentCategory) {
      payload.isSubCategory = true;
    }
    const action =
      category && category?._id
        ? updateCategory(category?._id, payload)
        : createCategory(payload);
    action
      ?.then((result) => {
        toast.success("تم حفظ الفئة بنجاح", { id: toastId });
        if (typeof onAfterSubmit === "function") {
          onAfterSubmit(result, !!category);
        }
      })
      ?.catch(() => {
        toast.error("حدث خطأ أثناء الحفظ", { id: toastId });
      })
      ?.finally(() => setIsUploading(false));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Folder className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {category ? "تعديل الفئة" : "إضافة فئة جديدة"}
        </h3>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Folder className="w-4 h-4" />
            اسم الفئة
          </Label>
          <Input
            value={form?.Name}
            onChange={(e) => handleChange("Name", e?.target?.value)}
            placeholder="أدخل اسم الفئة"
            className="border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <ChevronDown className="w-4 h-4" />
            الفئة الرئيسية
          </Label>
          <select
            aria-label="Parent category"
            value={form?.ParentCategory || ""}
            onChange={(e) =>
              handleChange("ParentCategory", e?.target?.value || null)
            }
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
          >
            <option value="">لا يوجد</option>
            {categories &&
              categories?.map((cat) => (
                <option key={cat?._id} value={cat?._id}>
                  {cat?.Name}
                </option>
              ))}
          </select>
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <ImageIcon className="w-4 h-4" />
            صورة الفئة
          </Label>

          <input
            aria-label="upload-category-image"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(e?.target?.files ? e?.target?.files[0] : null)
            }
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4 border-t">
          <Button
            type="submit"
            className="w-full sm:w-auto px-6 cursor-pointer"
            disabled={isUploading}
          >
            {isUploading ? "جاري الحفظ..." : category ? "تحديث" : "إضافة"} الفئة
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
