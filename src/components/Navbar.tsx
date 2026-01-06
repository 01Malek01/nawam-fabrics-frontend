import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import logo from "@/assets/logo-transparent.png";
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
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
          {/*
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
          */}
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
