const FAQ = () => {
  return (
    <section className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-right">الأسئلة الشائعة</h1>

      {/* Simple FAQ list using details/summary for zero-dependency */}
      <div className="space-y-4 text-right">
        <details className="border rounded-lg p-4 bg-white/60 dark:bg-white/5">
          <summary className="cursor-pointer text-lg font-semibold">
            كيف يمكنني حجز القماش؟
          </summary>
          <p className="mt-2 text-black/80 dark:text-white/80">
            يمكنك الضغط على المنتج ثم تعبئة نموذج الطلب وإرسال البيانات وسيتم
            التواصل معك.
          </p>
        </details>

        <details className="border rounded-lg p-4 bg-white/60 dark:bg-white/5">
          <summary className="cursor-pointer text-lg font-semibold">
            هل تتوفر خدمة التوصيل؟
          </summary>
          <p className="mt-2 text-black/80 dark:text-white/80"></p>
        </details>

        <details className="border rounded-lg p-4 bg-white/60 dark:bg-white/5">
          <summary className="cursor-pointer text-lg font-semibold">
            ما طرق الدفع المتاحة؟
          </summary>
          <p className="mt-2 text-black/80 dark:text-white/80">
            نقبل التحويل البنكي والدفع عند الاستلام في بعض المناطق.
          </p>
        </details>
      </div>
    </section>
  );
};

export default FAQ;
