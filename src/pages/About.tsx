import { FaWhatsapp } from "react-icons/fa";
import { MapPin, Truck } from "lucide-react";
import { Helmet } from "react-helmet";

const About = () => {
  return (
    <>
      <Helmet>
        <title>من نحن - النوام للأقمشة</title>
        <meta
          name="description"
          content="تعرف على تاريخ وخبرة محلات النوام للأقمشة منذ عام 1972. نقدم أقمشة عالية الجودة وخدمة متميزة."
        />
      </Helmet>
      <section className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#A8511A] mb-2">
              ✨ محلات النوام للأقمشة والأصواف ✨
            </h1>
            <div className="w-24 h-1 bg-[#A8511A] mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6">
            {/* Company Description */}
            <div className="border-r-4 border-[#A8511A] pr-4">
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                منذ عام <strong className="text-[#A8511A]">1972</strong> ونحن
                نمنحك الأناقة بخامات راقية واختيارات فريدة من أقمشة الصوف،
                الكشمير، الجلابيات، والبدل الرجالية.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mt-3">
                نختار لك الأفضل لتصميم إطلالة تليق بذوقك الراقي.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4 text-right">
              <h2 className="text-2xl font-semibold text-[#A8511A] mb-4">
                معلومات التواصل
              </h2>

              {/* Address */}
              <div className="flex items-center justify-start gap-3 p-3 rounded hover:bg-white dark:hover:bg-gray-700 transition-colors">
                <div className="text-right">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    البحيرة – دمنهور – منطقة العبّارة – برج اللواء – أمام مدرسة
                    التعاون
                  </p>
                </div>
                <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0" />
              </div>

              {/* WhatsApp */}
              <div className="p-3 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-right">
                <div className="flex items-center justify-start gap-3 mb-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    واتساب:
                  </span>
                  <FaWhatsapp className="h-5 w-5 text-green-600 flex-shrink-0" />
                </div>
                <div className="flex flex-col gap-2 mr-8">
                  <a
                    href="https://wa.me/201148820088"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm flex items-center justify-start gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 p-1 rounded"
                  >
                    <FaWhatsapp className="w-3 h-3 text-green-600 flex-shrink-0" />
                    <span>01148820088</span>
                  </a>
                  <a
                    href="https://wa.me/201008124051"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm flex items-center justify-start gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 p-1 rounded"
                  >
                    <FaWhatsapp className="w-3 h-3 text-green-600 flex-shrink-0" />
                    <span>01008124051</span>
                  </a>
                </div>
              </div>

              {/* Shipping */}
              <div className="flex items-center justify-start gap-3 p-3 rounded hover:bg-white dark:hover:bg-gray-700 transition-colors">
                <div className="text-right">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    شحن لجميع المحافظات
                  </p>
                </div>
                <Truck className="h-5 w-5 text-gray-500 flex-shrink-0" />
              </div>
            </div>

            {/* Company Values */}
            <div className="border-r-4 border-[#A8511A] pr-4">
              <h2 className="text-2xl font-semibold text-[#A8511A] mb-3">
                قيمنا
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-[#A8511A] mb-2">
                    الجودة العالية
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    نختار أفضل الخامات من مصادر موثوقة لضمان رضا عملائنا
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-[#A8511A] mb-2">
                    الخدمة المتميزة
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    فريق عمل متخصص لمساعدتك في اختيار الأنسب لك
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-[#A8511A] mb-2">
                    الأسعار التنافسية
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    نقدم أفضل الأسعار مع ضمان الجودة العالية
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-[#A8511A] mb-2">
                    الشحن السريع
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    توصيل آمن وسريع لجميع أنحاء الجمهورية
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
