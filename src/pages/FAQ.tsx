const FAQ = () => {
  return (
    <section className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-right">الأسئلة الشائعة</h1>

      <div className="space-y-6 text-right">
        {/* الشحن والتوصيل */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary-600">🚚 أسئلة عن الشحن والتوصيل</h2>
          
          <details className="border rounded-lg p-4 bg-white/60 dark:bg-white/5">
            <summary className="cursor-pointer text-lg font-semibold">
              هل لديكم شحن لجميع المحافظات؟
            </summary>
            <p className="mt-2 text-black/80 dark:text-white/80">
              نعم، نوفر الشحن إلى جميع محافظات مصر حتى باب البيت بفضل الله. متوسط وقت التوصيل يومان لمعظم المحافظات.
            </p>
          </details>

          <details className="border rounded-lg p-4 bg-white/60 dark:bg-white/5">
            <summary className="cursor-pointer text-lg font-semibold">
              هل يمكنني معاينة المنتج قبل الاستلام؟
            </summary>
            <p className="mt-2 text-black/80 dark:text-white/80">
              للأسف لا يمكن المعاينة قبل الاستلام وذلك لحماية المنتج من التلف أو السرقة، حيث أن شركات الشحن تلغي مسؤوليتها في حالة الموافقة على المعاينة. لكن لا تقلق، نوفر لك ضمان الاستبدال أو الاسترجاع بعد استلام المنتج إذا لم يكن مطابقاً للتوقعات.
            </p>
          </details>
        </div>

        {/* طرق الدفع */}
        <div className="space-y-4 pt-6">
          <h2 className="text-2xl font-semibold text-primary-600">💳 أسئلة عن الدفع</h2>
          
          <details className="border rounded-lg p-4 bg-white/60 dark:bg-white/5">
            <summary className="cursor-pointer text-lg font-semibold">
              ما هي طرق الدفع المتاحة؟
            </summary>
            <div className="mt-2 text-black/80 dark:text-white/80 space-y-2">
              <p>نوفر عدة خيارات سهلة وآمنة للدفع:</p>
              <ul className="list-disc pr-5 space-y-1">
                <li>💳 الدفع عند الاستلام (مع رسوم عربون ١٠٪)</li>
                <li>📱 فودافون كاش</li>
                <li>📲 انستا باي</li>
              </ul>
            </div>
          </details>

          <details className="border rounded-lg p-4 bg-white/60 dark:bg-white/5">
            <summary className="cursor-pointer text-lg font-semibold">
              كيف يعمل نظام الدفع عند الاستلام؟
            </summary>
            <p className="mt-2 text-black/80 dark:text-white/80">
              عند اختيار "الدفع عند الاستلام"، نحجز عربون ١٠٪ من إجمالي قيمة الطلبية قبل الشحن، ثم تقوم بدفع المبلغ المتبقي عند استلام الطلبية.
            </p>
          </details>
        </div>

        {/* الإرجاع والاستبدال */}
        <div className="space-y-4 pt-6">
          <h2 className="text-2xl font-semibold text-primary-600">🔄 أسئلة عن الإرجاع والاستبدال</h2>
          
          <details className="border rounded-lg p-4 bg-white/60 dark:bg-white/5">
            <summary className="cursor-pointer text-lg font-semibold">
              هل يوجد سياسة استبدال أو استرجاع؟
            </summary>
            <p className="mt-2 text-black/80 dark:text-white/80">
              نعم، نوفر خدمة الاستبدال والاسترجاع مع ضمان جودة المنتج لضمان رضاك التام عن شرائك.
            </p>
          </details>
        </div>

        {/* التواصل */}
        <div className="space-y-4 pt-6">
          <h2 className="text-2xl font-semibold text-primary-600">📞 أسئلة عن التواصل</h2>
          
          <details className="border rounded-lg p-4 bg-white/60 dark:bg-white/5">
            <summary className="cursor-pointer text-lg font-semibold">
              هل يوجد رقم واتساب للتواصل؟
            </summary>
            <div className="mt-2 text-black/80 dark:text-white/80">
              <p>نعم، يمكنك التواصل معنا مباشرة على:</p>
              <p className="font-semibold mt-1">01148820088</p>
              <p className="mt-2">فريق خدمة العملاء متاح لمساعدتك في أي استفسار.</p>
            </div>
          </details>

          <details className="border rounded-lg p-4 bg-white/60 dark:bg-white/5">
            <summary className="cursor-pointer text-lg font-semibold">
              كيف أطمئن على طلبي بعد التوصيل؟
            </summary>
            <p className="mt-2 text-black/80 dark:text-white/80">
              جميع طلباتنا مغلقة بشكل آمن ومحكم. في حال وجود أي استفسار عن المنتج بعد الاستلام، يمكنك التواصل معنا على الواتساب وسنقوم بمساعدتك على الفور.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
