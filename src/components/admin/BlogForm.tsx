// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useAdminApi from "@/hooks/useAdminApi";
import toast from "react-hot-toast";
import TiptapEditor from "./TiptapEditor";
import { getImageUrl } from "@/lib/utils";
import { X } from "lucide-react";

export interface PostFormValues {
  _id?: string;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  images?: string[];
  tags?: string[];
  status?: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
}

interface BlogFormProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostFormValues | null;
  onSave: (post: PostFormValues, isUpdate: boolean) => void;
}

const emptyPost: PostFormValues = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  coverImage: "",
  images: [],
  tags: [],
  status: "draft",
  seoTitle: "",
  seoDescription: "",
};

/** Mirrors the backend slugify so generated slugs match server behaviour. */
function slugify(text: string): string {
  return (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const BlogForm: React.FC<BlogFormProps> = ({
  isOpen,
  onClose,
  post,
  onSave,
}) => {
  const api = useAdminApi();
  const [formData, setFormData] = useState<PostFormValues>(emptyPost);
  const [tagsInput, setTagsInput] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);

  // Object URLs are tracked in a ref and revoked only on unmount, so that
  // previews stay valid while the list of picked files changes.
  useEffect(() => {
    const urls = objectUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.length = 0;
    };
  }, []);

  useEffect(() => {
    const next = post
      ? {
          title: post.title || "",
          slug: post.slug || "",
          content: post.content || "",
          excerpt: post.excerpt || "",
          coverImage: post.coverImage || "",
          images: post.images || [],
          tags: post.tags || [],
          status: post.status || "draft",
          seoTitle: post.seoTitle || "",
          seoDescription: post.seoDescription || "",
        }
      : { ...emptyPost, tags: [], images: [] };

    setFormData(next);
    setTagsInput((next.tags || []).join("، "));
    setImageFiles([]);
    setPreviewUrls([]);
  }, [post]);

  const updateField = <K extends keyof PostFormValues>(
    key: K,
    value: PostFormValues[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => {
      const next = { ...prev, title: value };
      // Auto-fill the slug only while it is untouched, or was auto-generated.
      if (!prev.slug || prev.slug === slugify(prev.title || "")) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleTagsInput = (value: string) => {
    setTagsInput(value);
    updateField(
      "tags",
      value
        .split(/[،,]/)
        .map((t) => t.trim())
        .filter(Boolean)
    );
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const urls = files.map((f) => URL.createObjectURL(f));
    objectUrlsRef.current.push(...urls);
    setImageFiles((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...urls]);
    e.target.value = "";
  };

  const removeNewImage = (index: number) => {
    const url = previewUrls[index];
    if (url) {
      URL.revokeObjectURL(url);
      objectUrlsRef.current = objectUrlsRef.current.filter((u) => u !== url);
    }
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (index: number) => {
    if (post?._id) {
      try {
        const updated = await api.deletePostImage(post._id, index);
        setFormData((prev) => ({
          ...prev,
          images: updated.images || [],
          coverImage: updated.coverImage || "",
        }));
        toast.success("تم حذف الصورة");
      } catch (err: any) {
        toast.error(err?.message || "فشل في حذف الصورة");
      }
    } else {
      setFormData((prev) => {
        const images = [...(prev.images || [])];
        const [removed] = images.splice(index, 1);
        return {
          ...prev,
          images,
          coverImage: prev.coverImage === removed ? images[0] || "" : prev.coverImage,
        };
      });
    }
  };

  const setCoverImage = (path: string) => {
    setFormData((prev) => ({ ...prev, coverImage: path }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      toast.error("يرجى إدخال عنوان المقال");
      return;
    }
    if (!formData.content?.trim() || formData.content === "<p></p>") {
      toast.error("يرجى كتابة محتوى المقال");
      return;
    }

    setSaving(true);
    try {
      const payload = { ...formData, _imageFiles: imageFiles };

      if (post?._id) {
        const updated = await api.updatePost(post._id, payload);
        onSave(updated, true);
        toast.success("تم تحديث المقال بنجاح");
      } else {
        const created = await api.createPost(payload);
        onSave(created, false);
        toast.success("تم إنشاء المقال بنجاح");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right">
            {post?._id ? "تعديل المقال" : "إضافة مقال جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title + slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="post-title">عنوان المقال</Label>
              <Input
                id="post-title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="عنوان المقال"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-slug">الرابط (Slug)</Label>
              <div className="flex gap-2">
                <Input
                  id="post-slug"
                  value={formData.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="article-slug"
                  dir="ltr"
                  className="text-left"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => updateField("slug", slugify(formData.title))}
                >
                  توليد
                </Button>
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="post-excerpt">مقتطف المقال</Label>
            <Textarea
              id="post-excerpt"
              value={formData.excerpt}
              onChange={(e) => updateField("excerpt", e.target.value)}
              placeholder="وصف مختصر يظهر في قائمة المقالات..."
              rows={3}
            />
          </div>

          {/* Rich text editor */}
          <div className="space-y-2">
            <Label>محتوى المقال</Label>
            <TiptapEditor
              content={formData.content || ""}
              onChange={(html) => updateField("content", html)}
            />
            <p className="text-xs text-gray-500">
              استخدم أيقونة الصورة في شريط الأدوات لرفع صور داخل المحتوى مباشرة.
            </p>
          </div>

          {/* Tags + status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="post-tags">الوسوم</Label>
              <Input
                id="post-tags"
                value={tagsInput}
                onChange={(e) => handleTagsInput(e.target.value)}
                placeholder="أقمشة، نصائح، تطريز"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-status">حالة النشر</Label>
              <select
                id="post-status"
                value={formData.status}
                onChange={(e) =>
                  updateField("status", e.target.value as "draft" | "published")
                }
                className="w-full border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 rounded-md px-3 py-2"
              >
                <option value="draft">مسودة</option>
                <option value="published">منشور</option>
              </select>
            </div>
          </div>

          {/* Cover image + gallery */}
          <div className="space-y-3">
            <Label>صورة الغلاف والمعرض</Label>
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFilesSelected}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                اختيار صور
              </Button>
              <span className="text-sm text-gray-500 self-center">
                أول صورة تُستخدم كصورة الغلاف تلقائياً.
              </span>
            </div>

            {formData.images && formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {formData.images.map((img, idx) => (
                  <div key={`${img}-${idx}`} className="relative group">
                    <img
                      src={getImageUrl(img)}
                      alt={`صورة ${idx + 1}`}
                      className={`w-full h-28 object-cover rounded-md border-2 ${
                        formData.coverImage === img
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage(img)}
                      className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      غلاف
                    </button>
                    <button
                      type="button"
                      aria-label="حذف الصورة"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {previewUrls.length > 0 && (
              <div>
                <p className="text-sm mb-2 text-gray-500">صور جديدة ستُرفع عند الحفظ:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {previewUrls.map((url, idx) => (
                    <div key={url} className="relative">
                      <img
                        src={url}
                        alt={`معاينة ${idx + 1}`}
                        className="w-full h-28 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        aria-label="إزالة الصورة"
                        onClick={() => removeNewImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="post-seo-title">عنوان SEO</Label>
              <Input
                id="post-seo-title"
                value={formData.seoTitle}
                onChange={(e) => updateField("seoTitle", e.target.value)}
                placeholder="عنوان يظهر في نتائج البحث"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-seo-desc">وصف SEO</Label>
              <Input
                id="post-seo-desc"
                value={formData.seoDescription}
                onChange={(e) => updateField("seoDescription", e.target.value)}
                placeholder="وصف مختصر يظهر في نتائج البحث"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "جارٍ الحفظ..." : "حفظ المقال"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogForm;