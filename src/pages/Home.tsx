import React, { useEffect, useState } from 'react';
import { airtableService } from '../services/airtable';
import LandingPageCard from '@/components/LandingPageCard';
import type { Category } from '@/types';
const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
 
  useEffect(() => {
    airtableService.getAllRecords().then((result) => {
      console.log(result);
    });
    airtableService.getAllRecords("Categories").then((result) => {
      // In your map function:
setCategories(
  result.map((category) => {
    // Handle missing or empty image array

    
     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error

    const imageUrl = category.Image?.[0]?.url || 
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgEn5bBp8A3v5TMgmG_Xy30ZssTkQ8uJQAkn9gjKJvFTKqVKFHIOVfsEWTffLVupooswoJqnDc2pwIS3RFtU8Y2nx3tuFu2A6cdTRVdJ-0zdiZBOmRiFOvmKQGlFK8ViKl_t7BjzhTIi-k9S3DqfghfDdi6L_x8J5uT-4nKcla4hFpaPprg2XU4LthpdL30Fbu88v8p-bqOjfnmxRs-Jhvu-JZQsTMUBEb-j5TB5P-GDg1712IqY5Fe-4yfiTk5UreQ_nUBDL02pY"; // your fallback URL
    
    return {
      id: category.id,
     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            name: category.Name,
      imageUrl,
     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error

      subCategories: category.SubCategories || [
        {
id:1,
name:"sub category 1"
        },
        {
id:2,
name:"sub category 2"
        },
        {
id:3,
name:"sub category 3"
        }
       
      ],    
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error

        Products: category.Products      
    };
  })
);
      console.log('categories',result);
    });
  }, []);



  
  
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen space-y-2 ">
   {
    categories?.map((category) => (
      <LandingPageCard
        key={category.id}
        category={category}
        onClick={() => {
          console.log('Selected:', category);
          // Handle navigation or state update
        }}
        className="mb-4"
      />
    ))
   }
    </div>
  );
};

export default Home;
