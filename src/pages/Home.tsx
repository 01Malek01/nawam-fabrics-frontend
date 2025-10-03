// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useEffect, useState } from "react";
import { airtableService } from "../services/airtable";
import LandingPageCard from "@/components/LandingPageCard";
import type { Category } from "@/types";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    console.log( airtableService.getAllRecords().then((result) => console.log(result)))
    const fetchCategories = async () => {
      try {
        const allCategories = await airtableService.getAllRecords("Categories");
        
        // Separate main categories (no parent) from subcategories
        const mainCategories = allCategories.filter(category => !category?.ParentCategory);
        const subCategories = allCategories.filter(category => category?.ParentCategory?.length > 0);
        // Map through main categories and attach their subcategories
        const categoriesWithSubs = mainCategories.map(category => {
          const imageUrl = category.Image?.[0]?.url || 
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAgEn5bBp8A3v5TMgmG_Xy30ZssTkQ8uJQAkn9gjKJvFTKqVKFHIOVfsEWTffLVupooswoJqnDc2pwIS3RFtU8Y2nx3tuFu2A6cdTRVdJ-0zdiZBOmRiFOvmKQGlFK8ViKl_t7BjzhTIi-k9S3DqfghfDdi6L_x8J5uT-4nKcla4hFpaPprg2XU4LthpdL30Fbu88v8p-bqOjfnmxRs-Jhvu-JZQsTMUBEb-j5TB5P-GDg1712IqY5Fe-4yfiTk5UreQ_nUBDL02pY";
          
          // Find subcategories for this main category
          const categorySubs = subCategories
            .filter(sub => sub.ParentCategory.includes(category.id))
            .map(sub => ({
              id: sub.id,
              name: sub.Name,
              description: sub.Description,
              imageUrl: sub.Image?.[0]?.url || imageUrl,
              productsCount: sub.ProductsCount || 0
            }));

          return {
            id: category.id,
            name: category.Name,
            description: category.Description,
            imageUrl,
            subCategories: categorySubs,
            productsCount: category.ProductsCount || 0
          };
        });

        setCategories(categoriesWithSubs);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen space-y-2 ">
      {categories?.map((category) => (
        <LandingPageCard
          key={category.id}
          category={category}
          onClick={() => {
            console.log("Selected:", category);
            // Handle navigation or state update
            if( category?.subCategories?.length === 0){
              navigate(`/categories/${category.id}`);   
            }
          }}
          className="mb-4"
        />
      ))}
    </div>
  );
};

export default Home;
