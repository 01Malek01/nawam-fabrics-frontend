const WashingInstructions = () => {
  return (
    <section className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-right">إرشادات الغسيل</h1>

      <div className="bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right">
        <h2 className="text-2xl font-semibold mb-4 text-[#A8511A]">الغسيل اليدوي</h2>
        <div className="space-y-6 mb-8">
          <div className="border-r-4 border-[#A8511A] pr-4">
            <p className="font-semibold text-gray-800 dark:text-gray-200">يفضل غسل الصوف يدويًا للحفاظ على نعومته وشكله:</p>
            <ul className="list-none space-y-2 mt-2 text-gray-700 dark:text-gray-300">
              <li>**الماء:** استخدم ماءً بارداً أو فاتراً (حوالي 30 درجة مئوية)، وتجنب استخدام الماء الساخن الذي يؤدي إلى انكماش الألياف.</li>
              <li>**المنظف:** استخدم منظفاً خاصاً بالصوف أو منظفاً معتدلاً ولطيفاً، وتجنب المنظفات القوية أو التي تحتوي على مواد مبيضة.</li>
              <li>**طريقة الغسيل:** املأ وعاءً بالماء والمنظف، ثم ضع قطعة الصوف واضغط عليها بلطف، وتجنب الفرك أو العصر القوي.</li>
              <li>**الشطف:** اشطف الصوف بالماء البارد عدة مرات حتى تتأكد من إزالة كل المنظف.</li>
              <li>**العصر:** اعصر قطعة الصوف بلطف شديد للتخلص من الماء الزائد، وتجنب عصرها بقوة.</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-[#A8511A]">الغسيل في الغسالة</h2>
        <div className="space-y-6 mb-8">
          <div className="border-r-4 border-[#A8511A] pr-4">
            <p className="font-semibold text-gray-800 dark:text-gray-200">إذا كنت ستستخدم الغسالة، اتبع الخطوات التالية:</p>
            <ul className="list-none space-y-2 mt-2 text-gray-700 dark:text-gray-300">
              <li>**البرنامج:** استخدم دورة غسيل مخصصة للصوف أو دورة الغسيل اليدوي (Hand Wash)، أو دورة الملابس الرقيقة.</li>
              <li>**الماء:** اضبط درجة حرارة الماء على "بارد".</li>
              <li>**المنظف:** استخدم منظفاً خاصاً بالصوف.</li>
              <li>**التجفيف:** استخدم دورة التجفيف اللطيفة أو الخفيفة، أو تجنب استخدام المجفف تماماً.</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-[#A8511A]">التجفيف</h2>
        <div className="space-y-6 mb-8">
          <div className="border-r-4 border-[#A8511A] pr-4">
            <p className="font-semibold text-gray-800 dark:text-gray-200">تُعد طريقة التجفيف جزءاً حاسماً للحفاظ على جودة الصوف:</p>
            <ul className="list-none space-y-2 mt-2 text-gray-700 dark:text-gray-300">
              <li>**التجفيف الطبيعي:** بعد عصر قطعة الصوف بلطف، افردها على سطح مستوٍ وفوق منشفة جافة.</li>
              <li>**تجنب أشعة الشمس:** لا تعرض الصوف لأشعة الشمس المباشرة أو للحرارة العالية، واتركه يجف في مكان جاف ومعتدل.</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-[#A8511A]">نصائح إضافية</h2>
        <div className="space-y-6">
          <div className="border-r-4 border-[#A8511A] pr-4">
            <ul className="list-none space-y-2 text-gray-700 dark:text-gray-300">
              <li>**معالجة البقع:** عالج البقع قبل الغسيل باستخدام منظف لطيف، وتجنب فرك البقعة بقوة.</li>
              <li>**تجديد الصوف:** للتخلص من التجاعيد، يمكنك تعليق قطعة الصوف في مكان رطب كالحمام بعد الاستحمام، حيث يعمل البخار على تنعيم الألياف.</li>
              <li>**إزالة الوبر:** يمكن استخدام ماكينة حلاقة الأقمشة أو منديل تجفيف الملابس للتخلص من الوبر المتراكم.</li>
              <li>**التخزين:** عند التخزين، احرص على وضع الصوف في مكان بارد وجاف بعيداً عن الرطوبة، واستخدم أكياس السيليكا أو الفحم النشط للمساعدة في امتصاص الرطوبة.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WashingInstructions;