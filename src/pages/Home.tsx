// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useEffect, useState } from "react";
import { airtableService } from "../services/airtable";
import LandingPageCard from "@/components/LandingPageCard";
import HeroSlider from "@/components/HeroSlider";
import Fabrics from "@/components/Fabrics";
import LazyImage from "@/components/LazyImage";
import type { Category } from "@/types";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const allCategories = await airtableService.getAllRecords("Categories");

        // Separate main categories (no parent) from subcategories
        const mainCategories = allCategories.filter(
          (category) => !category?.ParentCategory
        );
        const subCategories = allCategories.filter(
          (category) => category?.ParentCategory?.length > 0
        );
        // Map through main categories and attach their subcategories
        const categoriesWithSubs = mainCategories.map((category) => {
          const imageUrl =
            category.Image?.[0]?.url ||
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAgEn5bBp8A3v5TMgmG_Xy30ZssTkQ8uJQAkn9gjKJvFTKqVKFHIOVfsEWTffLVupooswoJqnDc2pwIS3RFtU8Y2nx3tuFu2A6cdTRVdJ-0zdiZBOmRiFOvmKQGlFK8ViKl_t7BjzhTIi-k9S3DqfghfDdi6L_x8J5uT-4nKcla4hFpaPprg2XU4LthpdL30Fbu88v8p-bqOjfnmxRs-Jhvu-JZQsTMUBEb-j5TB5P-GDg1712IqY5Fe-4yfiTk5UreQ_nUBDL02pY";

          // Find subcategories for this main category
          const categorySubs = subCategories
            .filter((sub) => sub.ParentCategory.includes(category.id))
            .map((sub) => ({
              id: sub.id,
              name: sub.Name,
              description: sub.Description,
              imageUrl: sub.Image?.[0]?.url || imageUrl,
              productsCount: sub.ProductsCount || 0,
            }));

          return {
            id: category.id,
            name: category.Name,
            description: category.Description,
            imageUrl,
            subCategories: categorySubs,
            productsCount: category.ProductsCount || 0,
          };
        });

        setCategories(categoriesWithSubs);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="animate-pulse">
          <LazyImage
            src="/logo.png"
            alt="Loading..."
            className="h-32 w-32 md:h-48 md:w-48"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
      {/* Hero Slider */}
      <HeroSlider />
      {/* Logo Section
      <div className="flex justify-center items-center py-12 px-4 bg-white/50 dark:bg-black/50">
        <div className="relative">
          <img
            src="/نوام لوجو_.png"
            alt="El Nawam Fabrics Logo"
            className="h-48 md:h-64 w-auto object-contain hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 dark:to-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div> */}
      {/* Main Categories */}
      <h2 className="text-3xl font-bold mb-6  text-[#A8511A] dark:text-[#A8511A] text-center">
        الأصناف الرئيسية
      </h2>{" "}
      <div className="grid grid-cols-2 gap-4 max-w-7xl mx-auto px-4 py-8">
        {categories?.map((category) => (
          <LandingPageCard
            key={category.id}
            category={category}
            onClick={() => {
              console.log("Selected:", category);
              // Handle navigation or state update
              if (category?.subCategories?.length === 0) {
                navigate(`/categories/${category.id}`);
              }
            }}
            className=""
          />
        ))}
      </div>
      {/* Most Sold Products Section */}
      <div className="bg-gradient-to-b from-amber-50 to-white dark:from-amber-900/10 dark:to-gray-900/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12 rounded-lg">
          <div className="relative">
            <h2 className="text-3xl font-bold mb-8 text-[#A8511A] dark:text-[#A8511A] text-center">
              الأكثر مبيعا
            </h2>
          </div>
          <div className="w-full backdrop-blur-sm bg-white/30 dark:bg-black/30 p-6 rounded-xl shadow-xl overflow-hidden">
            {/* Custom scrollbar track */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-amber-500/20 hover:scrollbar-thumb-amber-500/30 pb-2">
              <Fabrics showMostSold={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
