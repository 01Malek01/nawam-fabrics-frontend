import { Helmet } from "react-helmet";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>سياسة الخصوصية - النوام للأقمشة</title>
        <meta
          name="description"
          content="اقرأ سياسة الخصوصية لموقع النوام للأقمشة. نحن نحترم خصوصيتك ونحمي بياناتك."
        />
      </Helmet>
      <section className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-right">سياسة الخصوصية</h1>

        <div className="bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right">
          <div className="space-y-8">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-semibold">
              🔐 سياسة الخصوصية – محلات النوام للأقمشة والأصواف
              <br />
              في **محلات النوام للأقمشة والأصواف الراقية**، نحترم خصوصية عملائنا
              ونلتزم بحماية جميع المعلومات الشخصية التي يتم جمعها من خلال موقعنا
              الإلكتروني. يُرجى قراءة هذه السياسة بعناية لمعرفة كيفية تعاملنا مع
              بياناتك عند استخدامك للموقع.
            </p>

            {/* 1. جمع المعلومات */}
            <div className="border-r-4 border-[#A8511A] pr-4">
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                🧾 1. جمع المعلومات
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                نقوم بجمع بعض البيانات عند قيام العميل بتقديم طلب أو ملء نموذج
                على الموقع، وتشمل هذه البيانات:
              </p>
              <ul className="list-none space-y-1 mt-2 text-gray-700 dark:text-gray-300">
                <li>الاسم الكامل</li>
                <li>رقم الهاتف</li>
                <li>العنوان الكامل للتوصيل</li>
                <li>ملاحظات الطلب (إن وُجدت)</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
                يتم جمع هذه المعلومات فقط لتسهيل عملية التواصل، تجهيز الطلب،
                وتأكيد الشحن.
              </p>
            </div>

            {/* 2. استخدام المعلومات */}
            <div className="border-r-4 border-[#A8511A] pr-4">
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                💬 2. استخدام المعلومات
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                نستخدم البيانات الشخصية المقدمة من العملاء للأغراض التالية فقط:
              </p>
              <ul className="list-none space-y-1 mt-2 text-gray-700 dark:text-gray-300">
                <li>تجهيز الطلبات وإتمام عملية البيع.</li>
                <li>التواصل مع العميل لتأكيد الطلب أو الرد على الاستفسارات.</li>
                <li>ترتيب عملية الشحن والتسليم.</li>
                <li>تحسين تجربة المستخدم وتطوير الخدمات.</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2 font-semibold">
                لن نقوم بأي حال من الأحوال ببيع أو مشاركة هذه البيانات مع أي طرف
                ثالث خارج المحل.
              </p>
            </div>

            {/* 3. حماية المعلومات */}
            <div className="border-r-4 border-[#A8511A] pr-4">
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                🔒 3. حماية المعلومات
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                نلتزم بحماية بيانات العملاء من أي وصول غير مصرح به أو تعديل أو
                إفشاء. تُرسل تفاصيل الطلبات إلى إدارة المحل عبر قناة خاصة
                ومؤمَّنة على تطبيق تليجرام لضمان سرية المعلومات. كما نُطبّق
                إجراءات أمنية تقنية وإدارية للحفاظ على سلامة المعلومات.
              </p>
            </div>

            {/* 4. التواصل مع العملاء */}
            <div className="border-r-4 border-[#A8511A] pr-4">
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                📬 4. التواصل مع العملاء
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                قد نتواصل مع العملاء عبر الهاتف أو تطبيق واتساب أو البريد
                الإلكتروني فقط لتأكيد الطلبات أو متابعة عمليات التوصيل.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2 font-semibold">
                📞 أرقام التواصل الرسمية:
                <br />
                واتساب الأساسي: **01148820088**
                <br />
                رقم إضافي للتواصل: **01008124051**
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
                لن نستخدم بياناتك لأي أغراض تسويقية دون موافقتك المسبقة.
              </p>
            </div>

            {/* 5. ملفات تعريف الارتباط (Cookies) */}
            <div className="border-r-4 border-[#A8511A] pr-4">
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                ⚙️ 5. ملفات تعريف الارتباط (Cookies)
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                قد يستخدم الموقع ملفات تعريف الارتباط لتحسين تجربة التصفح. يمكن
                للعميل رفض استخدام هذه الملفات من إعدادات المتصفح، لكن ذلك قد
                يؤثر على بعض خصائص الموقع.
              </p>
            </div>

            {/* 6. حقوق العميل */}
            <div className="border-r-4 border-[#A8511A] pr-4">
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                🧾 6. حقوق العميل
              </h2>
              <ul className="list-none space-y-1 mt-2 text-gray-700 dark:text-gray-300">
                <li>
                  للعميل الحق في طلب معرفة البيانات المسجّلة عنه أو تعديلها أو
                  حذفها.
                </li>
                <li>يمكن للعميل التواصل معنا عبر الأرقام أو زيارة مقرنا:</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-1">
                **📍 محافظة البحيرة – دمنهور – منطقة العَبّارة – برج اللواء –
                أمام مدرسة التعاون**
              </p>
            </div>

            {/* 7. تحديثات سياسة الخصوصية */}
            <div className="border-r-4 border-[#A8511A] pr-4">
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                🔁 7. تحديثات سياسة الخصوصية
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                قد نقوم بتحديث سياسة الخصوصية من وقت لآخر، وسيتم نشر أي تعديل
                جديد في هذه الصفحة مع تاريخ التحديث. استخدامك للموقع بعد نشر أي
                تعديلات يعني موافقتك على السياسة الجديدة.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
