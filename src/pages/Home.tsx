// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useEffect, useState } from "react";
import NewArrivals from "@/components/home/NewArrivals";
import LastPieces from "@/components/home/LastPieces";
import Offers from "@/components/home/Offers";
import usePublicApi from "@/hooks/usePublicApi";
import MainCategories from "@/components/home/MainCategories";
import HeroSlider from "@/components/HeroSlider";
import LazyImage from "@/components/LazyImage";
import type { Category } from "@/types";
import MostSold from "@/components/home/MostSold";
import { Helmet } from "react-helmet";
import { getImageUrl } from "@/lib/utils";

type ApiCategory = {
  _id: string;
  Name: string;
  Description?: string;
  Image?: string;
  ParentCategory?: string | null;
  isSubCategory?: boolean;
  productsCount?: number;
  subCategories?: ApiCategory[];
};

const Home = () => {
  const { getCategories } = usePublicApi();
  const { getLastPieces } = usePublicApi();
  const [categories, setCategories] = useState<Category[]>([]);
  const [lastPieces, setLastPieces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const allCategories = await getCategories();

        const mainCategories = allCategories.filter(
          (category: ApiCategory) => category?.isSubCategory === false
        );
        const categoriesWithSubs = mainCategories.map(
          (category: ApiCategory) => {
            const imageUrl =
              getImageUrl(category?.Image || "") ||
              "https://lh3.googleusercontent.com/aida-public/AB6AXuAgEn5bBp8A3v5TMgmG_Xy30ZssTkQ8uJQAkn9gjKJvFTKqVKFHIOVfsEWTffLVupooswoJqnDc2pwIS3RFtU8Y2nx3tuFu2A6cdTRVdJ-0zdiZBOmRiFOvmKQGlFK8ViKl_t7BjzhTIi-k9S3DqfghfDdi6L_x8J5uT-4nKcla4hFpaPprg2XU4LthpdL30Fbu88v8p-bqOjfnmxRs-Jhvu-JZQsTMUBEb-j5TB5P-GDg1712IqY5Fe-4yfiTk5UreQ_nUBDL02pY";
            // Use subCategories array directly from API
            const categorySubs = Array.isArray(category.subCategories)
              ? category.subCategories.map((sub: ApiCategory) => ({
                  id: sub._id,
                  name: sub.Name,
                  description: sub.Description,
                  imageUrl: getImageUrl(sub.Image || "") || imageUrl,
                  productsCount: sub.productsCount || 0,
                }))
              : [];
            return {
              id: category._id,
              name: category.Name,
              description: category.Description,
              imageUrl: imageUrl,
              subCategories: categorySubs,
              productsCount: category.productsCount || 0,
            };
          }
        );
        setCategories(categoriesWithSubs);
        try {
          const lps = await getLastPieces();
          setLastPieces(Array.isArray(lps) ? lps.slice(0, 6) : []);
        } catch (e) {
          console.warn("Failed to load last pieces", e);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [getCategories]);

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
    <>
      <Helmet>
        <title>الرئيسية - النوام للأقمشة</title>
        <meta
          name="description"
          content="اكتشف مجموعة واسعة من الأقمشة عالية الجودة في النوام للأقمشة. تصفح الفئات والمنتجات الأكثر مبيعاً."
        />
        <meta
          name="keywords"
          content="أقمشة, قماش, ملابس, نوام, fabrics, textile"
        />
      </Helmet>
      <div className="bg-background-light dark:bg-background-dark  font-display text-gray-800 dark:text-gray-200 min-h-screen border-(--color-border-accent)">
        <HeroSlider />
        <MainCategories categories={categories} />
        <NewArrivals />
        <LastPieces lastPieces={lastPieces} />
        <Offers />
      </div>
    </>
  );
};

export default Home;
