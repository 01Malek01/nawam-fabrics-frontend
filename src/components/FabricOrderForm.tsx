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
// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "الاسم يجب أن يكون على الأقل حرفين",
  }),
  phone: z.string().regex(/^\+?[0-9\s-]{10,}$/, {
    message: "رقم الهاتف غير صالح",
  }),
  meters: z.coerce.number().min(0.1, {
    message: "الكمية يجب أن تكون أكبر من 0",
  }),
  address: z.string().min(5, {
    message: "العنوان يجب أن يكون على الأقل 5 أحرف",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface FabricOrderFormProps {
  fabric: Fabric;
  onSuccess?: () => void;
  onCancel?: () => void;
  onSubmit?: (values: FormValues) => void;
}

export function FabricOrderForm({ fabric, onSuccess, onCancel }: FabricOrderFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      meters: 1,
      address: "",
    },
  });

  function onSubmit(values: FormValues) {
    if (onSubmit) {
      onSubmit(values);
    } else {
      // Default submit handler
      console.log("No submit handler provided. Form values:", {
        fabric: fabric?.name,
        ...values,
      });
    }
    
    if (onSuccess) onSuccess();
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
            name="name"
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
            name="phone"
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
            name="meters"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الكمية (متر)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1"
                    min="0.1"
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
            name="address"
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
            {onCancel && (
              <Button 
                type="button" 
                variant="outline"
                onClick={onCancel}
                className="w-full sm:w-auto cursor-pointer"
              >
                إلغاء
              </Button>
            )}
            <Button type="submit" className="w-full sm:w-auto cursor-pointer">
              تأكيد الطلب
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
