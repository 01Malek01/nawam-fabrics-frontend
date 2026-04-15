import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const phoneNumber = "0453316154";
  const whatsappNumbers = ["01008124051", "01148820088", "01270027350"];
  const email = "Info@elnawamfabrics.com";

  const footerLinks = [
    { name: "من نحن؟", path: "/about" },
    { name: "الأسئلة الشائعة", path: "/faq" },
    { name: "الشروط و الاحكام", path: "/terms" },
    { name: "سياسة الاسترجاع و الاستبدال", path: "/return-policy" },
    { name: "سياسة الخصوصية", path: "/privacy-policy" },
    { name: "الشحن و التوصيل", path: "/shipping" },
    { name: "الشكاوي و المقترحات", path: "/complaints" },
    { name: "إرشادات الغسيل", path: "/washing-instructions" },
    { name: "أنواع الاقمشة", path: "/fabric-types" },
    { name: "فروعنا", path: "/branches" },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Links Section */}
          <div className="text-center sm:text-right">
            <h3 className="text-base sm:text-lg font-semibold text-[#A8511A] mb-3 sm:mb-4">
              روابط مهمة
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-600 dark:text-gray-300 hover:text-[#A8511A] dark:hover:text-[#A8511A] transition-colors text-sm sm:text-base py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="text-center sm:text-right">
            <h3 className="text-base sm:text-lg font-semibold text-[#A8511A] mb-3 sm:mb-4">
              تواصل معنا
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {/* Phone */}
              <div className="flex items-center justify-center sm:justify-start gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <a
                  href={`tel:${phoneNumber}`}
                  className="text-gray-600 dark:text-gray-300 hover:text-[#A8511A] dark:hover:text-[#A8511A] transition-colors text-sm sm:text-base break-all"
                >
                  {phoneNumber}
                </a>
              </div>

              {/* WhatsApp Numbers */}
              <div className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <FaWhatsapp className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base font-medium">
                    واتساب:
                  </span>
                </div>
                <div className="flex flex-col gap-2 sm:gap-3 sm:mr-6">
                  {whatsappNumbers.map((number, index) => (
                    <a
                      key={index}
                      href={`https://wa.me/2${number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 break-all"
                    >
                      <FaWhatsapp className="w-3 h-3 text-green-600 flex-shrink-0" />
                      <span>{number}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center justify-center sm:justify-start gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-gray-600 dark:text-gray-300 hover:text-[#A8511A] dark:hover:text-[#A8511A] transition-colors text-sm sm:text-base break-all"
                >
                  {email}
                </a>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="text-center sm:text-right">
            <h3 className="text-base sm:text-lg font-semibold text-[#A8511A] mb-3 sm:mb-4">
              النوام للاقمشة
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed px-4 sm:px-0">
              نقدم أفضل أنواع الأقمشة بجودة عالية وأسعار تنافسية. نحن ملتزمون
              بتقديم أفضل خدمة لعملائنا.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6 mt-6 sm:mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            © {new Date().getFullYear()} النوام للاقمشة. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
