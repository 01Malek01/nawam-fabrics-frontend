// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useEffect } from "react";
import useAdminApi from "../../hooks/useAdminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

type LastPiece = {
  _id?: string;
  name: string;
  length?: number;
  price?: number;
  product?: string;
  category?: string;
  Image?: string;
};

type Props = {
  lastPiece?: LastPiece | null;
  products?: any[];
  categories?: any[];
  onAfterSubmit?: (item: LastPiece, isUpdate: boolean) => void;
};

const LastPieceForm: React.FC<Props> = ({
  lastPiece,
  products = [],
  categories = [],
  onAfterSubmit,
}) => {
  const { createLastPiece, updateLastPiece, status } = useAdminApi();
  const [form, setForm] = React.useState<LastPiece>(
    lastPiece || { name: "", length: 0, price: 0 }
  );
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  useEffect(
    () => setForm(lastPiece || { name: "", length: 0, price: 0 }),
    [lastPiece]
  );

  const handleChange = (k: keyof LastPiece, v: any) =>
    setForm((s) => ({ ...s, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("جاري رفع الصورة أو حفظ القطعة...");
    const payload: any = { ...form };
    if (imageFile) payload._imageFile = imageFile;
    const action =
      lastPiece && lastPiece._id
        ? updateLastPiece(lastPiece._id, payload)
        : createLastPiece(payload);
    action
      .then((result: any) => {
        toast.success("تم الحفظ بنجاح", { id: toastId });
        if (!lastPiece || !lastPiece._id) {
          setForm({ name: "", length: 0, price: 0 });
          setImageFile(null);
        }
        if (typeof onAfterSubmit === "function")
          onAfterSubmit(result, !!lastPiece);
      })
      .catch(() => {
        toast.error("حدث خطأ أثناء الحفظ", { id: toastId });
      });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 overflow-auto max-h-screen md:max-h-[90vh]">
      <div className="flex items-center gap-2 mb-6">
        <ImageIcon className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {lastPiece ? "تعديل قطعة أخيرة" : "إضافة قطعة أخيرة جديدة"}
        </h3>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            الاسم
          </Label>
          <Input
            value={form.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="اسم القطعة"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              الطول (م)
            </Label>
            <Input
              type="number"
              value={String(form.length ?? 0)}
              onChange={(e) => handleChange("length", Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              السعر
            </Label>
            <Input
              type="number"
              value={String(form.price ?? 0)}
              onChange={(e) => handleChange("price", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              المنتج المرتبط (اختياري)
            </Label>
            <select
              value={form.product || ""}
              onChange={(e) =>
                handleChange("product", e.target.value || undefined)
              }
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">-- اختر منتج --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.Name}
                </option>
              ))}
            </select>
          </div> */}

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              الفئة (اجباري)
            </Label>
            <select
              value={form.category || ""}
              onChange={(e) =>
                handleChange("category", e.target.value || undefined)
              }
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">-- اختر فئة --</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.Name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <ImageIcon className="w-4 h-4" />
            صورة القطعة
          </Label>

          <input
            aria-label="upload-lastpiece-image"
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
            className="w-full sm:w-auto px-6"
            disabled={status === "loading"}
          >
            {status === "loading"
              ? "جاري الحفظ..."
              : lastPiece
              ? "تحديث"
              : "إضافة"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LastPieceForm;
