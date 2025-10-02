import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-black p-6 overflow-y-auto">
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
          className="text-2xl font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
          onClick={onClose}
        >
          جميع المنتجات
        </Link>
        <Link 
          to="/about" 
          className="text-2xl font-medium text-black dark:text-white"
          onClick={onClose}
        >
          من نحن؟
        </Link>
        <Link 
          to="/contact" 
          className="text-2xl font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
          onClick={onClose}
        >
          تواصل معنا
        </Link>
      </nav>
    </div>
  );
};

export default MobileMenu;
