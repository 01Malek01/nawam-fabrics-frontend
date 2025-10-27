const ReturnPolicy = () => {
  return (
    <section className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-right">سياسة الاسترجاع و الاستبدال</h1>

      <div className="bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right">
        <div className="space-y-6">
          <div className="border-r-4 border-[#A8511A] pr-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              يحق للعميل إرجاع القماش في حد أقصاه 14 يوم من تاريخ فاتورة الشراء ( من تاريخ استلام المنتج ).
            </p>
          </div>

          <div className="border-r-4 border-[#A8511A] pr-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              يحق للعميل إرجاع البضاعة المباعة له بعد فحصها, وقد يستغرق مدة فحصة 4 أيام عمل كحد أقصى من تاريخ إرجاعه.
            </p>
          </div>

          <div className="border-r-4 border-[#A8511A] pr-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              يجب التأكد من عدم وجود أي خلل مصنعي قبل تفصيل القماش, والشركة لا تتحمل أي تبعات أخرى تمت على المنتج بعد تفصيل القماش.
            </p>
          </div>

          <div className="border-r-4 border-[#A8511A] pr-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              يجب أن تكون البضاعة المسترجعة على نفس حالتها الأصلية, ولم تتعرض لأي تلف أو تغير من قص أو غسيل أو تعرض القماش لمؤثرات خارجية.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReturnPolicy;
