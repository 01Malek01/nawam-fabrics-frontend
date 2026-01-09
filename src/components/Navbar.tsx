import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import useAuth from "@/hooks/useAuth";
import logo from "@/assets/logo-transparent.png";
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { checkAuth, logout } = useAuth();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

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
      navigate("/", { replace: true });
    }
  };
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-black/10 dark:border-white/10 ">
      {/* Mobile layout: menu left, logo center, search right */}
      <div className="w-full flex items-center justify-between px-3 md:px-0">
        <div className="md:hidden flex items-center">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center md:justify-start">
          <Link
            to="/"
            className="flex items-center gap-4 text-[#A8511A] dark:text-[#A8511A] logo-bg p-2"
          >
            <img
              className="h-64 md:h-64 w-auto object-cover "
              src={logo}
              alt="el Nawam fabrics image"
            />
          </Link>
        </div>

        <div className="md:hidden flex items-center">
          {/* Search icon (SearchBar handles its own open state) */}
          <div className="ml-2">
            <SearchBar />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-9">
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
