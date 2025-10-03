import { useState, useEffect } from 'react';
import Fabrics from '@/components/Fabrics';
import { useParams } from 'react-router-dom';

export default function ProductsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { categoryId, subCategoryId } = useParams();
  
  // Simulate loading delay for the splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Show loading for at least 1 second
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="animate-pulse">
          <img 
            src="/logo.png" 
            alt="Loading..." 
            className="h-32 w-32 md:h-48 md:w-48"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Fabrics 
        categoryId={categoryId as string} 
        subCategoryId={subCategoryId as string} 
      />
    </div>
  );
}
