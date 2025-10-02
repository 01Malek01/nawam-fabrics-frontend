import { Link, useLocation } from "react-router-dom";
import { Menu } from 'lucide-react';
import { useState } from 'react';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-black/10 dark:border-white/10 ">
      <div className="flex items-center gap-8 ">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 text-black dark:text-white">
          <img className="w-32 h-32 object-contain" src="logo.png" alt="el Nawam fabrics logo"  />
        </Link>

      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-9">
        <Link 
          to="/" 
          className={`text-base font-medium ${
            isActive('/') 
              ? 'font-bold text-black dark:text-white' 
              : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
          }`}
        >
          جميع المنتجات
        </Link>
        <Link 
          to="/about" 
          className={`text-base font-medium ${
            isActive('/about') 
              ? 'font-bold text-black dark:text-white' 
              : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
          }`}
        >
          من نحن؟
        </Link>
        <Link 
          to="/contact" 
          className={`text-base font-medium ${
            isActive('/contact') 
              ? 'font-bold text-black dark:text-white' 
              : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
          }`}
        >
          تواصل معنا
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
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
