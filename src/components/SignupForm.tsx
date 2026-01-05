import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  onSubmit?: (data: { username: string; password: string }) => void;
};

const schema = z
  .object({
    username: z.string().min(1, "الاسم او رقم الهاتف مطلوب"),
    password: z.string().min(3, "كلمة المرور تحتاج 3 أحرف على الأقل"),
    confirmPassword: z.string().min(3, "كرر كلمة المرور"),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "كلمتا المرور غير متطابقتين",
        path: ["confirmPassword"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

export const SignupForm: React.FC<Props> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const submit = async (data: FormValues) => {
    if (onSubmit) await onSubmit({ username: data.username, password: data.password });
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded shadow p-6">
      <h2 className="text-3xl md:text-4xl font-semibold text-right mb-4">
        إنشاء حساب
      </h2>
      <form onSubmit={handleSubmit(submit)} className="space-y-6">
        <div>
          <label className="block text-lg md:text-xl text-right">
            {" "}
            الاسم أو رقم الهاتف
          </label>
          <input
            {...register("username")}
            placeholder="الاسم أو رقم الهاتف"
            className="w-full mt-2 p-3 text-lg md:text-xl border rounded"
          />
          {errors.username && (
            <div className="text-red-600 text-base">
              {errors.username.message}
            </div>
          )}
        </div>

        {/* email removed — no longer required for signup */}

        <div>
          <label className="block text-lg md:text-xl text-right">
            كلمة المرور
          </label>
          <input
            {...register("password")}
            type="password"
            placeholder="كلمة مرور علي الاقل ثلاثة احرف"
            className="w-full mt-2 p-3 text-lg md:text-xl border rounded"
          />
          {errors.password && (
            <div className="text-red-600 text-base">
              {errors.password.message}
            </div>
          )}
        </div>

        <div>
          <label className="block text-lg md:text-xl text-right">
            أعد كتابة كلمة المرور
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="أعد كتابة كلمة المرور"
            className="w-full mt-2 p-3 text-lg md:text-xl border rounded"
          />
          {errors.confirmPassword && (
            <div className="text-red-600 text-base">
              {errors.confirmPassword.message}
            </div>
          )}
        </div>

        <div className="text-lg md:text-xl text-right">
          هل لديك حساب؟{" "}
          <Link to="/login" className="text-primary">
            تسجيل الدخول
          </Link>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-white px-6 py-3 rounded text-lg md:text-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري الإنشاء..." : "إنشاء"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
