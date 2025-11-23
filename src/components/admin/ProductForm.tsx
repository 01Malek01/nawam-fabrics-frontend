import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/components/admin/CategoryForm";

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

type Props = {
  product?: Product | null;
  onSubmit: (data: Product) => void | Promise<void>;
  categories: Category[];
};

const ProductForm: React.FC<Props> = ({ product, onSubmit, categories }) => {
  const [form, setForm] = React.useState<Product>(
    product || {
      Name: "",
      PricePerMeter: 0,
      Image: [],
      VideoUrl: "",
      MostSold: false,
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
      }
    );
  }, [product]);

  const handleChange = (key: keyof Product, value: any) => {
    setForm((s) => ({ ...s, [key]: value }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // pass files along in underscored fields so the API hook can detect them
    const payload: any = { ...form };
    if (imageFiles && imageFiles.length > 0) payload._imageFiles = imageFiles;
    if (videoFile) payload._videoFile = videoFile;
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <Label>اسم المنتج</Label>
        <Input
          value={form.Name}
          onChange={(e) => handleChange("Name", e.target.value)}
        />
      </div>

      <div>
        <Label>سعر المتر</Label>
        <Input
          type="number"
          value={String(form.PricePerMeter)}
          onChange={(e) =>
            handleChange("PricePerMeter", Number(e.target.value))
          }
        />
      </div>

      <div>
        <Label>الوصف</Label>
        <Textarea
          value={form.Description || ""}
          onChange={(e) => handleChange("Description", e.target.value)}
        />
      </div>

      <div>
        <Label>الفئة الفرعية</Label>
        <select
          value={form.SubCategory || ""}
          onChange={(e) => handleChange("SubCategory", e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">-- اختر --</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.Name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>صور المنتج (روابط)</Label>
        <div className="space-y-2">
          {(form.Image || []).map((img, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                aria-label={`image-${idx}`}
                value={img}
                onChange={(e) => {
                  const next = [...(form.Image || [])];
                  next[idx] = e.target.value;
                  handleChange("Image", next);
                }}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  const next = [...(form.Image || [])];
                  next.splice(idx, 1);
                  handleChange("Image", next);
                }}
              >
                حذف
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => handleChange("Image", [...(form.Image || []), ""])}
          >
            إضافة رابط صورة
          </Button>
        </div>

        <div className="mt-3">
          <Label>تحميل صور (ملفات)</Label>
          <input
            aria-label="upload-images"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setImageFiles(e.target.files ? Array.from(e.target.files) : null)
            }
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-3">
        <Label>تحميل فيديو (اختياري)</Label>
        <input
          aria-label="upload-video"
          type="file"
          accept="video/*"
          onChange={(e) =>
            setVideoFile(e.target.files ? e.target.files[0] : null)
          }
          className="w-full"
        />
        <div className="mt-2">
          <Label>أو رابط الفيديو</Label>
          <Input
            value={form.VideoUrl || ""}
            onChange={(e) => handleChange("VideoUrl", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          aria-label="Most sold"
          id="mostSold"
          type="checkbox"
          checked={!!form.MostSold}
          onChange={(e) => handleChange("MostSold", e.target.checked)}
        />
        <Label htmlFor="mostSold">الأكثر مبيعا</Label>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="submit">حفظ</Button>
      </div>
    </form>
  );
};

export default ProductForm;
