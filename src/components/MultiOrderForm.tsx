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
import { useNavigate } from "react-router-dom";
import { useOrderDialog } from "@/context/OrderDialogContext";
import { useCreateCartReservation } from "@/hooks/api/useCreateReservation";

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
  const navigate = useNavigate();
  const { closeOrderDialog } = useOrderDialog();

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
      form.reset();
      // close after short delay
      setLoading(false);
      setTimeout(() => {
        navigate("/");
      }, 10000);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center fixed inset-0 m-auto h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300">جاري معالجة طلبك...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center fixed inset-0 m-auto h-48">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2 text-red-600 dark:text-red-400">
          حدث خطأ
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً.
        </p>
        <Button
          onClick={() => {
            setError(null);
            closeOrderDialog?.();
            navigate("/");
          }}
          className="mt-4"
        >
          المحاولة مرة أخرى
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center fixed inset-0 m-auto h-fit">
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
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md fixed inset-0 m-auto h-[80vh] overflow-y-auto">
      <button
        aria-label="Close"
        onClick={() => {
          closeOrderDialog?.();
        }}
        className="absolute top-3 left-3 text-gray-500 hover:text-gray-700 dark:text-gray-300"
      >
        ×
      </button>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        طلب متعدد
      </h2>
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

          <div className="flex justify-between gap-4 pt-4 lg:flex-row flex-col">
            <Button type="submit" className="w-full sm:w-auto cursor-pointer">
              تأكيد الطلب
            </Button>
            <Button
              variant={"outline"}
              onClick={() => {
                closeOrderDialog?.();
                navigate("/");
              }}
              className="w-full sm:w-auto"
            >
              إغلاق
            </Button>
          </div>
        </form>
      </Form>
      <div className="mt-3 text-xl text-gray-700 dark:text-gray-300 text-right">
        <p className="font-semibold">ملحوظة هامة:</p>
        <p>
          عند تأكيد الطلب أونلاين، يتم دفع عربون 10% من قيمة الطلب لضمان الجدية
          وتجهيز القماش. بعد إرسال الطلب، سيتم التواصل معكم من خلال واتساب المحل
          لاستكمال التفاصيل.
        </p>
      </div>
    </div>
  );
}
