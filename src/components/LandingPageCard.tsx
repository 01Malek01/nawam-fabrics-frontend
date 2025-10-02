import { XIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  subCategories?: Array<{
    id: string;
    name: string;
  }>;
}

interface LandingPageCardProps {
  category: Category;
  onClick: (categoryId: string, subCategoryId?: string) => void;
  className?: string;
}

export default function LandingPageCard({ 
  category,
  onClick,
  className = '' 
}: LandingPageCardProps) {
  const [showSubcategories, setShowSubcategories] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (category.subCategories && category.subCategories.length > 0) {
      setShowSubcategories(true);
    } else {
      onClick(category.id); 
    }
  };

  const handleSubcategoryClick = (e: React.MouseEvent, subCategoryId: string) => {
    e.stopPropagation();
    navigate(`/categories/${category.id}/${subCategoryId}`);
    setShowSubcategories(false);
  };

  const handleCloseOverlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSubcategories(false);
  };

  return (
    <div 
      className={`relative w-full h-96 sm:h-[500px] rounded-xl overflow-hidden cursor-pointer group ${className}`}
      onClick={handleCardClick}
    >
      <img
        src={category.imageUrl}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white">
        <h2 className="text-3xl sm:text-5xl font-bold mb-3 drop-shadow-lg">
          {category.name}
        </h2>
        <div className="w-16 h-1 bg-white mb-4 rounded-full" />
      </div>

      {/* Subcategories Overlay */}
      {showSubcategories && (
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col justify-center items-center p-4 sm:p-6"
          onClick={handleCloseOverlay}
        >
          <div 
            className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-right w-full">
                اختر من {category.name}
              </h3>
              <button 
                title='Close'
                onClick={handleCloseOverlay}
                className="flex-shrink-0 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors ml-4"
              >
                <XIcon size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8" fill='black' />
              </button>
            </div>
            
            {/* Subcategories Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {category.subCategories?.map((subCategory) => (
                <Button 
                  variant={"outline"}
                  key={subCategory.id}
                  onClick={(e) => handleSubcategoryClick(e, subCategory.id)}
                  className="cursor-pointer w-full min-h-[80px] sm:min-h-[100px] p-3 sm:p-4 text-center rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md flex items-center justify-center"
                >
                  <span className="text-base sm:text-lg md:text-xl font-medium text-gray-900 dark:text-white whitespace-normal break-words leading-tight px-2">
                    {subCategory.name}
                  </span>
                </Button>
              ))}
            </div>

            {/* Close Button for Mobile */}
            <div className="flex justify-center mt-6 sm:hidden">
              <Button 
                variant="outline"
                onClick={handleCloseOverlay}
                className="cursor-pointer px-8 py-3 text-base font-medium border-2"
              >
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}