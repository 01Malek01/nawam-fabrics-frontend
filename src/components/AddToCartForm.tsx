import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import LazyImage from "./LazyImage";
import useCartApi from "@/hooks/useCartApi";
import toast from "react-hot-toast";
import type { Fabric } from "@/types";
import { getImageUrl } from "@/lib/utils";

const schema = z.object({
  quantityMeters: z.string().min(1, "الكمية مطلوبة"),
  Images: z.array(z.string()).min(1, "يجب اختيار صورة واحدة على الأقل"),
});

type FormValues = z.infer<typeof schema>;

export default function AddToCartForm({
  fabric,
  onClose,
}: {
  fabric: Fabric;
  onClose: () => void;
}) {
  const { addItemToCart } = useCartApi();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { quantityMeters: "1", Images: [] },
  });

  const images = fabric.images.map((i) => getImageUrl(i)) || [];

  const selectedImages: string[] = watch("Images") || [];

  const onSubmit = async (values: FormValues) => {
    try {
      await addItemToCart({
        productId: fabric.id,
        meters: parseFloat(values.quantityMeters as any) || 1,
        pricePerMeter: (fabric as any).price,
        // include images array
        images: values.Images,
      } as any);
      toast.success("تمت الإضافة إلى السلة");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.dismiss();
      toast.error(err?.message || "فشل الإضافة للسلة");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-right">
        أضف {fabric.name} إلى السلة
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-right mb-1">الكمية (متر)</label>
          <Input {...register("quantityMeters")} className="w-full" />
          {errors.quantityMeters && (
            <div className="text-red-600 text-sm">
              {errors.quantityMeters.message}
            </div>
          )}
        </div>

        <div>
          <label className="block text-right mb-2">اختر الصور</label>
          <div className="grid grid-cols-2 gap-3">
            {images.map((imageUrl: string, idx: number) => (
              <div key={idx} className="relative">
                <input
                  type="checkbox"
                  id={`add-image-${idx}`}
                  checked={selectedImages.includes(imageUrl)}
                  onChange={(e) => {
                    const current = selectedImages || [];
                    const updated = e.target.checked
                      ? [...current, imageUrl]
                      : current.filter((u) => u !== imageUrl);
                    setValue("Images", updated, { shouldValidate: true });
                  }}
                  className="sr-only peer"
                />
                <label
                  htmlFor={`add-image-${idx}`}
                  className="block cursor-pointer rounded overflow-hidden border-2 peer-checked:border-primary"
                >
                  <LazyImage
                    src={imageUrl}
                    alt={`صورة ${idx + 1}`}
                    className="w-full h-28 object-cover"
                  />
                </label>
              </div>
            ))}
          </div>
          {errors.Images && (
            <div className="text-red-600 text-sm">{errors.Images.message}</div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            إلغاء
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جاري الإضافة..." : "أضف إلى السلة"}
          </Button>
        </div>
      </form>
    </div>
  );
}
