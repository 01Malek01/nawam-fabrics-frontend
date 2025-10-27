import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
          className="fixed inset-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-sm p-6 overflow-y-auto"
        >
          <div className="flex justify-end mb-8">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col space-y-6 text-right">
            <Link
              to="/"
              className={`text-2xl font-medium ${
                isActive("/")
                  ? "text-black dark:text-white"
                  : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              }`}
              onClick={onClose}
            >
              جميع المنتجات
            </Link>
            <Link
              to="/about"
              className={`text-2xl font-medium ${
                isActive("/about")
                  ? "text-black dark:text-white"
                  : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              }`}
              onClick={onClose}
            >
              من نحن؟
            </Link>
            <Link
              to="/faq"
              className={`text-2xl font-medium ${
                isActive("/faq")
                  ? "text-black dark:text-white"
                  : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              }`}
              onClick={onClose}
            >
              الأسئلة الشائعة
            </Link>
            <Link
              to="/contact"
              className={`text-2xl font-medium ${
                isActive("/contact")
                  ? "text-black dark:text-white"
                  : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              }`}
              onClick={onClose}
            >
              تواصل معنا
            </Link>
            <Link
              to="/washing-instructions"
              className={`text-2xl font-medium ${
                isActive("/washing-instructions")
                  ? "text-black dark:text-white"
                  : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              }`}
              onClick={onClose}
            >
              إرشادات الغسيل
            </Link>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
