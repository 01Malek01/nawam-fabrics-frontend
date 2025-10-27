const TermsAndConditions = () => {
  return (
    <section className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-right">الشروط والأحكام</h1>

      <div className="bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right">
        <div className="space-y-8">

          {/* 1. التعريف بالموقع */}
          <div className="border-r-4 border-[#A8511A] pr-4">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">🏪 1. التعريف بالموقع</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              يُدار هذا الموقع من قبل **محلات النوام للأقمشة والأصواف الراقية**، ويقع مقرنا في:
              <br />
              **📍 محافظة البحيرة – دمنهور – منطقة العَبّارة – برج اللواء – أمام مدرسة التعاون**
              <br />
              **📞 01148820088 | 📞 01008124051**
              <br />
              يُقدّم الموقع عرضًا لمجموعة مختارة من الأقمشة الرجالية عالية الجودة مع إمكانية الطلب والتوصيل لجميع المحافظات داخل مصر.
            </p>
          </div>

          {/* 2. الطلب والدفع */}
          <div className="border-r-4 border-[#A8511A] pr-4">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">💳 2. الطلب والدفع</h2>
            <ul className="list-none space-y-2 text-gray-700 dark:text-gray-300">
              <li>**عند اختيار أي منتج** من السلة، يقوم العميل بإدخال بياناته الصحيحة (الاسم – رقم الهاتف – العنوان).</li>
              <li>**بعد تأكيد الطلب، يتم دفع عربون بنسبة 10%** من قيمة المنتج عن طريق فودافون كاش أو إنستا باي.</li>
              <li>**يتم سداد باقي المبلغ** عند استلام الطلب من المندوب.</li>
              <li>**في حال عدم دفع العربون خلال 24 ساعة،** يحق للمحل إلغاء الطلب تلقائيًا.</li>
            </ul>
          </div>

          {/* 3. الشحن والتوصيل */}
          <div className="border-r-4 border-[#A8511A] pr-4">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">🚚 3. الشحن والتوصيل</h2>
            <ul className="list-none space-y-2 text-gray-700 dark:text-gray-300">
              <li>**يتم الشحن إلى جميع محافظات** جمهورية مصر العربية عن طريق شركات شحن معتمدة.</li>
              <li>**يتم التواصل مع العميل** لتأكيد العنوان وموعد التسليم قبل الشحن.</li>
              <li>**مدة التوصيل تختلف حسب المحافظة،** عادة من ٢ إلى ٥ أيام عمل.</li>
              <li>**في حال تعذر التواصل مع العميل لأكثر من مرتين،** يتم إلغاء الطلب تلقائيًا.</li>
            </ul>
          </div>

          {/* 4. سياسة الاستبدال والاسترجاع */}
          <div className="border-r-4 border-[#A8511A] pr-4">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">🔄 4. سياسة الاستبدال والاسترجاع</h2>
            <ul className="list-none space-y-2 text-gray-700 dark:text-gray-300">
              <li>**يحق للعميل استبدال أو استرجاع المنتج خلال 14 يومًا** من تاريخ الاستلام في حال وجود عيب مصنعي أو اختلاف في المواصفات المتفق عليها.</li>
              <li>**يجب أن يكون المنتج بحالته الأصلية** دون استخدام أو تفصيل.</li>
              <li>**يتحمل العميل تكلفة الشحن** في حال الرغبة في التبديل بدون وجود عيب في المنتج.</li>
            </ul>
          </div>

          {/* 5. الملكية الفكرية */}
          <div className="border-r-4 border-[#A8511A] pr-4">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">🔖 5. الملكية الفكرية</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              جميع الصور، التصاميم، والشعارات المعروضة على الموقع هي **ملك حصري لـ محلات النوام للأقمشة والأصواف**، ولا يجوز استخدامها أو نسخها دون إذن خطي مسبق من إدارة المحل.
            </p>
          </div>

          {/* 6. سياسة الخصوصية */}
          <div className="border-r-4 border-[#A8511A] pr-4">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">🔐 6. سياسة الخصوصية</h2>
            <ul className="list-none space-y-2 text-gray-700 dark:text-gray-300">
              <li>**نحن نحترم خصوصية عملائنا،** وجميع البيانات التي يتم جمعها من خلال الموقع (الاسم – الهاتف – العنوان) تُستخدم فقط لغرض التواصل وتوصيل الطلب.</li>
              <li>**يتم إرسال تفاصيل الطلب** لإدارة المحل عبر قناة خاصة ومؤمَّنة على تليجرام، ولا يتم مشاركة هذه البيانات مع أي طرف ثالث.</li>
              <li>**نحن ملتزمون بالحفاظ على سرية البيانات** وعدم استخدامها لأي أغراض تسويقية دون موافقة العميل.</li>
            </ul>
          </div>

          {/* 7. التعديلات */}
          <div className="border-r-4 border-[#A8511A] pr-4">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">⚙️ 7. التعديلات</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              يحتفظ **محل النوام للأقمشة والأصواف** بالحق في تعديل هذه الشروط والأحكام في أي وقت، ويتم نشر التحديثات على هذه الصفحة فورًا.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsAndConditions;