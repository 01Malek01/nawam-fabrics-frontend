// @ts-nocheck
import React from "react";
import { useForm } from "react-hook-form";
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
import { useCreateCartReservation } from "@/hooks/useCartApi";
import { useNavigate } from "react-router-dom";
import { useOrderDialog } from "@/context/OrderDialogContext";

// fabrics prop expected shape: Array of items with product id and meters, example:
// { product: { _id, Name, Image }, meters: number, images: string[] }

const schema = z.object({
  customerName: z
    .string()
    .min(2, { message: "الاسم يجب أن يكون على الأقل حرفين" }),
  customerPhone: z.string().regex(/^01\d{9}$/, {
    message: "رقم الهاتف يجب أن يكون 11 رقمًا يبدأ بـ 01",
  }),
  customerAddress: z
    .string()
    .min(5, { message: "العنوان يجب أن يكون على الأقل 5 أحرف" }),
});

type FormValues = z.infer<typeof schema>;

export default function MultiOrderForm() {
  const { createCartReservation } = useCreateCartReservation();
  const { closeOrderDialog, setHasSubmitted } = useOrderDialog();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { customerName: "", customerPhone: "", customerAddress: "" },
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  async function onSubmit(values: FormValues) {
    setError(null);
    setLoading(true);
    try {
      await createCartReservation({
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        customerAddress: values.customerAddress,
      });

      setSuccess(true);
      setHasSubmitted?.(true);
      form.reset();
      // close after short delay
      setTimeout(() => {
        setLoading(false);
        closeOrderDialog?.();
        navigate("/");
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  }

  if (loading) {
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
        <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
        <Button
          onClick={() => {
            setError(null);
          }}
          className="mt-4"
        >
          إغلاق
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <div className="text-green-500 text-4xl mb-4">✓</div>
        <h2 className="text-xl font-bold mb-2 text-green-600 dark:text-green-400">
          تم إرسال الطلب بنجاح!
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          سنقوم بالتواصل معكم قريباً لتأكيد الطلب.
        </p>
        <Button
          onClick={() => {
            closeOrderDialog?.();
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
      <h2 className="text-2xl font-bold mb-4 text-center">طلب متعدد</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            name="customerAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العنوان</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل عنوانك" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button type="submit">تأكيد الطلب</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
