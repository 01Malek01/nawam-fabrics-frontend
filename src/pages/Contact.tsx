import { Helmet } from "react-helmet";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>اتصل بنا - النوام للأقمشة</title>
        <meta
          name="description"
          content="تواصل معنا في نوام للأقمشة. نحن هنا لمساعدتك في اختيار الأقمشة المناسبة."
        />
      </Helmet>
      <section className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-right">
          ❓ الأسئلة الشائعة
        </h1>

        <div className="bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right">
          <div className="space-y-8">
            {/* Question 1 */}
            <div className="border-r-4 border-[#A8511A] pr-4">
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                🧵 1. هل الأقمشة أصلية وجودتها مضمونة؟
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                نعم، جميع الأقمشة لدينا أصلية ومختارة بعناية من أفضل المصانع
                المحلية والمستوردة لضمان أعلى جودة وأفضل خامة.
              </p>
            </div>

            {/* Question 2 */}
            <div className="border-r-4 border-[#A8511A] pr-4">
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                📦 2. هل توفرون الشحن لجميع المحافظات؟
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                نعم، يتوفر شحن لجميع محافظات مصر من خلال شركات شحن موثوقة لضمان
                سرعة التوصيل وسلامة المنتج.
              </p>
            </div>

            {/* Question 3 */}
            <div className="border-r-4 border-[#A8511A] pr-4">
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                💰 3. ما هي طريقة الدفع؟
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                يتم دفع عربون 10٪ من قيمة الطلب عن طريق فودافون كاش أو إنستا
                باي، والباقي يُسدّد عند استلام الطلب من المندوب.
              </p>
            </div>

            {/* Question 4 */}
            <div className="border-r-4 border-[#A8511A] pr-4">
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                ⏱️ 4. كم تستغرق مدة التوصيل؟
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                عادة يتم التوصيل خلال من 2 إلى 5 أيام عمل حسب المحافظة ومكان
                العميل.
              </p>
            </div>

            {/* Question 5 */}
            <div className="border-r-4 border-[#A8511A] pr-4">
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                🔄 5. هل يمكن استبدال أو إرجاع المنتج؟
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                نعم، يمكنك الاستبدال أو الإرجاع خلال 14 يومًا من الاستلام بشرط
                أن يكون القماش بحالته الأصلية ولم يُستخدم أو يُقصّ.
              </p>
            </div>

            {/* Question 6 */}
            <div className="border-r-4 border-[#A8511A] pr-4">
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                🧽 6. كيف أعتني بالقماش بعد الشراء؟
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                ننصح دائمًا بـ الغسيل الجاف للأصواف والصوف الكشمير، وتجنب
                استخدام الماء الساخن أو العصر القوي للحفاظ على نعومة القماش
                وجودته.
              </p>
            </div>

            {/* Question 7 */}
            <div className="border-r-4 border-[#A8511A] pr-4">
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                📞 7. كيف يمكنني التواصل معكم؟
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                يمكنك التواصل معنا مباشرة عبر:
              </p>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p className="flex items-center justify-end gap-2">
                  <span>
                    📲 واتساب: 01148820088 / 01270027350 / 01008124051
                  </span>
                </p>
                <p className="flex items-center justify-end gap-2">
                  <span>
                    📍 أو زيارة الفرع: البحيرة – دمنهور – منطقة العبّارة – برج
                    اللواء – أمام مدرسة التعاون
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
