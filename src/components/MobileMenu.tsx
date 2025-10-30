import { Link, useLocation, useNavigate } from "react-router-dom";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { airtableService } from "../services/airtable";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  const [categories, setCategories] = useState<
    Array<{
      id: string;
      name: string;
      subCategories: Array<{ id: string; name: string }>;
    }>
  >([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      try {
        const all = await airtableService.getAllRecords("Categories");
        const main = all.filter((c: any) => !c?.ParentCategory);
        const subs = all.filter((c: any) => c?.ParentCategory?.length > 0);

        const mapped = main.map((m: any) => {
          const children = subs
            .filter((s: any) => s.ParentCategory?.includes(m.id))
            .map((s: any) => ({ id: s.id, name: s.Name || s.name || "" }));
          return {
            id: m.id,
            name: m.Name || m.name || "",
            subCategories: children,
          };
        });

        if (mounted) setCategories(mapped);
      } catch (e) {
        console.error("Failed to load categories for mobile menu", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => {
      mounted = false;
    };
  }, [isOpen]);

  const toggle = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  const goToCategory = (id: string) => {
    onClose();
    navigate(`/categories/${encodeURIComponent(id)}`);
  };

  const goToSubCategory = (mainId: string, subId: string) => {
    onClose();
    navigate(
      `/categories/${encodeURIComponent(mainId)}/${encodeURIComponent(subId)}`
    );
  };

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

            {loading ? (
              <div className="text-center">جاري التحميل...</div>
            ) : (
              <div className="space-y-2">
                {categories.map((c) => (
                  <div key={c.id} className="border-t pt-2">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => goToCategory(c.id)}
                        className="text-lg font-medium text-right p-2 flex-1"
                      >
                        {c.name}
                      </button>
                      {c.subCategories.length > 0 && (
                        <button
                          onClick={() => toggle(c.id)}
                          className="p-2"
                          aria-label="Toggle subcategories"
                        >
                          {expanded[c.id] ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      )}
                    </div>

                    {expanded[c.id] && (
                      <div className="pr-4 mt-2 space-y-1 flex flex-col items-end">
                        {c.subCategories.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => goToSubCategory(c.id, s.id)}
                            className="w-full text-right px-3 py-2 text-base hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            {s.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Other static links */}
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
