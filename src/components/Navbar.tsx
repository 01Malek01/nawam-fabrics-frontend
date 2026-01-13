import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, ShoppingCart, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import useAuth from "@/hooks/useAuth";
import logo from "@/assets/نوام_لوجو__فاينل__-removebg-preview.png";
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const { checkAuth, logout } = useAuth();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!showUserMenu) return;
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showUserMenu]);

  // check auth on mount + listen for auth changes (login/logout)
  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const res = await checkAuth();
        if (mounted) setLoggedIn(!!res?.loggedIn);
      } catch (e) {
        if (mounted) setLoggedIn(false);
      }
    };
    check();

    const handler = () => {
      // when notified, re-check auth
      check();
    };

    const storageHandler = (e: StorageEvent) => {
      if (e.key === "nawam:auth") handler();
    };

    window.addEventListener("nawam:auth-changed", handler);
    window.addEventListener("storage", storageHandler);

    return () => {
      mounted = false;
      window.removeEventListener("nawam:auth-changed", handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, [checkAuth]);

  // Function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("logout failed", e);
    } finally {
      try {
        localStorage.setItem("nawam:auth", String(Date.now()));
      } catch (e) {}
      try {
        window.dispatchEvent(new Event("nawam:auth-changed"));
      } catch (e) {}
      setLoggedIn(false);
      setShowUserMenu(false);
      navigate("/", { replace: true });
    }
  };
  return (
    <header
      dir="ltr"
      className="flex items-center justify-between whitespace-nowrap border-b border-black/10 dark:border-white/10 "
    >
      {/* Mobile layout: logo left, icons right */}
      <div className="w-full flex items-center justify-between px-3 md:px-0">
        <div className="flex-1 flex items-center justify-start md:justify-start">
          <Link
            to="/"
            className="flex items-center gap-4 text-[#A8511A] dark:text-[#A8511A] logo-bg p-2 mr-11 "
          >
            <img
              className="h-20 md:h-32 w-auto object-cover"
              src={logo}
              alt="el Nawam fabrics image"
            />
          </Link>
        </div>

        <div className="md:hidden flex items-center">
          {/* Search icon (SearchBar handles its own open state) */}
          <div className="ml-2 flex items-center gap-2 relative">
            <SearchBar />
            {loggedIn && (
              <>
                <Link
                  to="/cart"
                  className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                  aria-label="Open cart"
                >
                  <ShoppingCart className="h-6 w-6" />
                </Link>

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu((s) => !s)}
                    className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                    aria-label="Open account menu"
                  >
                    <User className="h-6 w-6" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute z-50 right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 rounded shadow-md text-right">
                      <button
                        onClick={handleLogout}
                        className="w-full text-right px-4 py-2 text-sm text-black/80 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        تسجيل الخروج
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button on right */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav dir="rtl" className="hidden md:flex items-center gap-9">
          <Link
            to="/"
            className={`text-2xl font-medium ${
              isActive("/")
                ? "font-bold text-[#A8511A] dark:text-[#A8511A]"
                : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
            }`}
          >
            جميع المنتجات
          </Link>
          <Link
            to="/about"
            className={`text-2xl font-medium ${
              isActive("/about")
                ? "font-bold text-black dark:text-white"
                : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
            }`}
          >
            من نحن؟
          </Link>
          <Link
            to="/faq"
            className={`text-2xl font-medium ${
              isActive("/faq")
                ? "font-bold text-black dark:text-white"
                : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
            }`}
          >
            الأسئلة الشائعة
          </Link>
          <Link
            to="/contact"
            className={`text-2xl font-medium ${
              isActive("/contact")
                ? "font-bold text-black dark:text-white"
                : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
            }`}
          >
            تواصل معنا
          </Link>

          {loggedIn ? (
            <div className="flex items-center gap-4">
              <Link
                to="/cart"
                className={`text-2xl font-medium flex items-center gap-2 ${
                  isActive("/cart")
                    ? "font-bold text-black dark:text-white"
                    : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                }`}
              >
                <ShoppingCart className="h-6 w-6" /> سلة التسوق
              </Link>
              <button
                onClick={handleLogout}
                className="text-2xl font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              >
                تسجيل الخروج
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`text-2xl font-medium ${
                isActive("/login")
                  ? "font-bold text-black dark:text-white"
                  : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              }`}
            >
              تسجيل الدخول
            </Link>
          )}

          <SearchBar />
        </nav>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Navbar;
