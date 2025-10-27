const Shipping = () => {
  return (
    <section className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-right">الشحن و التوصيل</h1>

      <div className="bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right">
        <div className="space-y-6">
          <div className="border-r-4 border-[#A8511A] pr-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              نقدم خدمة الشحن والتوصيل لجميع مدن ومحافظات
            </p>
          </div>

          <div className="border-r-4 border-[#A8511A] pr-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              يتم تجهيز الطلبات يومياً ورفعها للتسليم لشركة الشحن (عدا يوم الجمعة)
            </p>
          </div>

          <div className="border-r-4 border-[#A8511A] pr-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              تتراوح مدة توصيل شركة الشحن بعد استلام الطلبات حسب المنطقة والمدينة:
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium mt-2">
              من 1 : 3 ايام عمل
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shipping;
