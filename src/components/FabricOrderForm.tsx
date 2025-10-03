// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

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
import { Textarea } from "./ui/textarea";
import type { Fabric } from "@/types";
import useCreateReservation from "@/hooks/api/useCreateReservation";
import { useNavigate } from "react-router-dom";
// Form validation schema
const formSchema = z.object({
    customerName: z.string().min(2, {
    message: "الاسم يجب أن يكون على الأقل حرفين",
  }),
  customerPhone: z.string().regex(/^\+?[0-9\s-]{10,}$/, {
    message: "رقم الهاتف غير صالح",
  }),
  quantityMeters: z.coerce.number().min(0.1, {
    message: "الكمية يجب أن تكون أكبر من 0",
  }),
  customerAddress: z.string().min(5, {
    message: "العنوان يجب أن يكون على الأقل 5 أحرف",
  }),
  productRecordId: z.string().min(1, {
    message: "المنتج يجب أن يكون على الأقل 1 حرف",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface FabricOrderFormProps {
  fabric: Fabric;
}


export function FabricOrderForm({ fabric }: FabricOrderFormProps) {
  const { createReservation, isLoading, isSuccess, error } = useCreateReservation()
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      quantityMeters: 1,
      customerAddress: "",
      productRecordId: fabric.id

    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await createReservation(values);
      // Reset form only on successful submission
      form.reset();
    } catch (err) {
      // Error is already handled by the useCreateReservation hook
      console.error('Error submitting form:', err);
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
        <h2 className="text-xl font-bold mb-2 text-red-600 dark:text-red-400">حدث خطأ</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً.
        </p>
        <Button 
          onClick={() => navigate('/')} 
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
        <h2 className="text-xl font-bold mb-2 text-green-600 dark:text-green-400">تم إرسال طلبك بنجاح!</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          سنتواصل معك قريباً لتأكيد الطلب وتفاصيل الدفع.
        </p>
        <Button 
          onClick={() => navigate('/')}
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
          
          <div className="flex justify-end gap-4 pt-4">
            
            <Button type="submit" className="w-full sm:w-auto cursor-pointer">
              تأكيد الطلب
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
