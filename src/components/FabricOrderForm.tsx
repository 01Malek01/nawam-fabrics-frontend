// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import type { Fabric } from "@/types";
import useCreateReservation from "@/hooks/api/useCreateReservation";
import { useNavigate } from "react-router-dom";
import { useOrderDialog } from "@/context/OrderDialogContext";
import LazyImage from "./LazyImage";
// Form validation schema
const formSchema = z
  .object({
    customerName: z.string().min(2, {
      message: "الاسم يجب أن يكون على الأقل حرفين",
    }),
    customerPhone: z.string().regex(/^01\d{9}$/, {
      message: "رقم الهاتف يجب أن يكون 11 رقمًا يبدأ بـ 01",
    }),
    confirmPhone: z.string().min(1, {
      message: "يرجى إعادة إدخال رقم الهاتف",
    }),
    quantityMeters: z.string().min(1, {
      message: "الكمية مطلوبة، ولا يمكن أن تكون فارغة",
    }),
    customerAddress: z.string().min(5, {
      message: "العنوان يجب أن يكون على الأقل 5 أحرف",
    }),
    productRecordId: z.string().min(1, {
      message: "المنتج يجب أن يكون على الأقل 1 حرف",
    }),
    Image: z.string().min(1, {
      message: "يجب اختيار صورة واحدة",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.customerPhone !== data.confirmPhone) {
      ctx.addIssue({
        path: ["confirmPhone"],
        code: z.ZodIssueCode.custom,
        message: "أرقام الهاتف غير متطابقة",
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

interface FabricOrderFormProps {
  fabric: Fabric;
}

export function FabricOrderForm({
  fabric,
  onClose,
  onSubmitted,
  selectedImage,
  selectedLength,
}: FabricOrderFormProps & {
  onClose?: () => void;
  onSubmitted?: () => void;
  selectedImage?: string;
  selectedLength?: string;
}) {
  const { createReservation, isLoading, isSuccess, error } =
    useCreateReservation();
  const orderCtx = useOrderDialog();
  const closeFn = onClose || orderCtx.closeOrderDialog;
  const submittedFn = onSubmitted || orderCtx.setHasSubmitted;

  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      confirmPhone: "",
      customerAddress: "",
      productRecordId: fabric.id,
      Image: selectedImage || "",
      quantityMeters: selectedLength || "",
    },
  });

  // keep Image value in sync if a selectedImage prop is passed/changed
  useEffect(() => {
    if (selectedImage) {
      form.setValue("Image", selectedImage);
    }
  }, [selectedImage]);

  async function onSubmit(values: FormValues) {
    try {
      // Backend expects an array of images; send single selected image as single-element array
      const payload = {
        ...values,
        Images: [values.Image],
        quantityMeters: String(values.quantityMeters || 0),
      } as any;
      await createReservation(payload);
      form.reset();
      if (submittedFn) submittedFn(true);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300">جاري معالجة طلبك...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2 text-red-600 dark:text-red-400">
          حدث خطأ
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً.
        </p>
        <Button
          onClick={() => {
            if (closeFn) closeFn();
            navigate("/");
          }}
          className="mt-4"
        >
          المحاولة مرة أخرى
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <div className="text-green-500 text-4xl mb-4">✓</div>
        <h2 className="text-xl font-bold mb-2 text-green-600 dark:text-green-400">
          تم إرسال طلبك بنجاح!
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          سنتواصل معك قريباً لتأكيد الطلب وتفاصيل الدفع.
        </p>
        <p>
          ملحوظة هامة: عند تأكيد الطلب أونلاين، يتم دفع عربون 10% من قيمة الطلب
          لضمان الجدية وتجهيز القماش. بعد إرسال الطلب، سيتم التواصل معكم من خلال
          واتساب المحل لاستكمال التفاصيل.
        </p>
        <p>سيتم الغلق هذه النافذة تلقائياً خلال 10 ثواني</p>
        <Button
          onClick={() => {
            if (closeFn) closeFn();
            navigate("/");
          }}
          className="mt-4"
        >
          العودة للصفحة الرئيسية
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        طلب {fabric?.name}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم الكامل</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل اسمك الكامل" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="أدخل رقم هاتفك" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>أعد إدخال رقم الهاتف</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="أعد إدخال رقم هاتفك"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantityMeters"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الكمية (متر)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="أدخل الكمية المطلوبة"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العنوان</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="أدخل عنوانك بالتفصيل"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Image"
            render={({ field }) => (
              <FormItem>
                {selectedImage ? (
                  <>
                    <FormLabel>الصورة المحددة</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <LazyImage
                          src={selectedImage}
                          alt={`الصورة المحددة`}
                          className="w-full h-40 object-cover rounded-md"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </>
                ) : (
                  <>
                    <FormLabel>اختر الصورة المطلوبة</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-4">
                        {fabric.images?.map((imageUrl, index) => (
                          <div key={index} className="relative">
                            <input
                              type="radio"
                              id={`image-${index}`}
                              name="selected-image"
                              checked={field.value === imageUrl}
                              onChange={() => field.onChange(imageUrl)}
                              className="sr-only peer"
                            />
                            <label
                              htmlFor={`image-${index}`}
                              className="block relative cursor-pointer rounded-lg overflow-hidden border-5 border-transparent peer-checked:border-blue-500 transition-colors"
                            >
                              <LazyImage
                                src={imageUrl}
                                alt={`صورة ${index + 1} للمنتج`}
                                className="w-full h-32 object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 peer-checked:bg-black/20 transition-colors flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full border-2 border-white bg-primary opacity-0 peer-checked:opacity-100 transition-opacity flex items-center justify-center">
                                  <svg
                                    className="w-4 h-4 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </>
                )}
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 flex-col pt-4">
            <Button type="submit" className="w-full sm:w-auto cursor-pointer">
              تأكيد الطلب
            </Button>
            <Button
              onClick={() => {
                if (closeFn) closeFn();
              }}
              className="w-full sm:w-auto cursor-pointer"
            >
              اغلاق
            </Button>
          </div>
          <div className="mt-3 text-xl text-gray-700 dark:text-gray-300 text-right">
            <p className="font-semibold">ملحوظة هامة:</p>
            <p>
              عند تأكيد الطلب أونلاين، يتم دفع عربون 10% من قيمة الطلب لضمان
              الجدية وتجهيز القماش. بعد إرسال الطلب، سيتم التواصل معكم من خلال
              واتساب المحل لاستكمال التفاصيل.
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
