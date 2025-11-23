import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type Category = {
  _id?: string;
  Name: string;
  ParentCategory?: string | null;
  Image?: string;
  isSubCategory?: boolean;
};

type Props = {
  category?: Category | null;
  onSubmit: (data: Category) => void | Promise<void>;
  categories: Category[];
};

const CategoryForm: React.FC<Props> = ({ category, onSubmit, categories }) => {
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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { ...form };
    if (imageFile) payload._imageFile = imageFile;
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <Label>اسم الفئة</Label>
        <Input
          value={form.Name}
          onChange={(e) => handleChange("Name", e.target.value)}
        />
      </div>

      <div>
        <Label>حالة فرعية</Label>
        <select
          aria-label="Parent category"
          value={form.ParentCategory || ""}
          onChange={(e) =>
            handleChange("ParentCategory", e.target.value || null)
          }
          className="w-full border rounded p-2"
        >
          <option value="">لا يوجد</option>
          {categories &&
            categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.Name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <Label>رابط صورة الفئة (اختياري)</Label>
        <Input
          value={form.Image || ""}
          onChange={(e) => handleChange("Image", e.target.value)}
        />
      </div>

      <div>
        <Label>تحميل صورة الفئة</Label>
        <input
          aria-label="upload-category-image"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImageFile(e.target.files ? e.target.files[0] : null)
          }
          className="w-full"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="submit">حفظ</Button>
      </div>
    </form>
  );
};

export default CategoryForm;
