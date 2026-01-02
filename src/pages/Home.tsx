import React, { useEffect, useState } from "react";
import usePublicApi from "@/hooks/usePublicApi";
import LandingPageCard from "@/components/LandingPageCard";
import HeroSlider from "@/components/HeroSlider";
import Fabrics from "@/components/Fabrics";
import FabricCard from "@/components/FabricCard";
import LazyImage from "@/components/LazyImage";
import { Star, Sparkles, Tag, Scissors } from "lucide-react";
// import { optimizeImage } from "@/utils/imageOptimizer"; // Removed unused import
import type { Category } from "@/types";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
        {/* Hero Slider */}
        <HeroSlider />
        {/* Main Categories */}
        <div className="text-center mb-12 relative">
          <div className="inline-block">
            <span className="absolute -top-6 right-1/2 transform translate-x-1/2 text-amber-300/40 dark:text-amber-600/20 text-9xl md:text-[12rem] font-arabic font-bold select-none">
              الأصناف
            </span>
            <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#A8511A] dark:text-amber-300 font-arabic tracking-tight">
              الأصناف الرئيسية
            </h2>
          </div>
          <div className="relative">
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-light mb-6 max-w-2xl mx-auto leading-relaxed">
              اكتشف مجموعتنا المتميزة من الأقمشة المصنفة بعناية لتلبية جميع
              أذواقك
            </p>
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-(--color-wood)" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-7xl mx-auto px-4 py-8">
          {categories?.map((category) => (
            <LandingPageCard
              key={category.id}
              category={category}
              onClick={() => {
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
        <section className="mt-16 ">
          <div className="max-w-7xl mx-auto ">
            <div className="bg-(--color-bg-dark)  p-0 py-2 md:p-10 shadow-lg lg:rounded-2xl lg:overflow-hidden">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3">
                  <Star className="w-8 h-8 text-amber-300" />
                  <h2 className="text-4xl md:text-5xl font-extrabold text-[#A8511A] dark:text-[#A8511A]">
                    الأكثر مبيعا
                  </h2>
                </div>
                <p className="mt-2 text-lg md:text-xl section-lead font-medium">
                  أفضل المنتجات مبيعاً من النوام
                </p>
                <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-amber-200" />
              </div>
              <div className="w-full dark:bg-black/40 p-0 md:p-6 lg:rounded-xl shadow-inner">
                <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-amber-500/20 hover:scrollbar-thumb-amber-500/30 pb-2">
                  <Fabrics showMostSold={true} />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* New Arrivals Section */}
        <section className="mt-8">
          <div className="max-w-7xl mx-auto ">
            <div className="bg-(--color-bg-dark)  p-0 py-2 md:p-10 shadow-lg lg:rounded-2xl lg:overflow-hidden">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3">
                  <Sparkles className="w-8 h-8 text-amber-300" />
                  <h2 className="text-4xl md:text-5xl font-extrabold text-[#A8511A] dark:text-[#A8511A]">
                    جديدنا
                  </h2>
                </div>
                <p className="mt-2 text-lg md:text-xl section-lead font-medium">
                  اكتشف أحدث الإضافات إلى تشكيلتنا
                </p>
                <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-amber-200" />
              </div>
              <div className="w-full  dark:bg-black/40 py-4 md:p-6 lg:rounded-xl shadow-inner">
                <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-amber-500/20 hover:scrollbar-thumb-amber-500/30 pb-2">
                  <Fabrics showNewArrival={true} />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Last Pieces Section */}
        <section className="mt-8">
          <div className="max-w-7xl mx-auto ">
            <div className="bg-(--color-bg-dark)  p-2  md:p-10 shadow-lg lg:rounded-2xl lg:overflow-hidden">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3">
                  <Scissors className="w-8 h-8 text-amber-300" />
                  <h2 className="text-4xl md:text-5xl font-extrabold text-[#A8511A] dark:text-[#A8511A]">
                    خصم اخر قطعة
                  </h2>
                </div>
                <p className="mt-2 text-lg md:text-xl section-lead font-medium">
                  قطع متبقية بعروض خاصة
                </p>
                <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-amber-200" />
              </div>
              <div className="w-full  dark:bg-black/40 py-4 md:p-6 lg:rounded-xl shadow-inner">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {lastPieces && lastPieces.length > 0 ? (
                    lastPieces.map((lp: any) => {
                      console.log(getImageUrl(lp.image));
                      const fabric = {
                        _id: lp._id,
                        id: lp._id,
                        name: lp.name,
                        image: getImageUrl(lp.image),
                        images: lp.Image ? [getImageUrl(lp.image)] : [],
                        price: lp.price,
                      };
                      const goTo = lp?.product?._id
                        ? `/fabric/${lp.product._id}`
                        : lp?.product
                        ? `/fabric/${lp.product}`
                        : `/lastpieces/${lp._id}`;
                      return (
                        <FabricCard
                          key={lp._id}
                          fabric={fabric}
                          buttonTitle="عرض"
                          buttonAction={() => navigate(goTo)}
                        />
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center text-gray-500 py-6">
                      لا توجد قطع أخيرة حالياً
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate("/lastpieces")}
                    className="px-4 py-2 bg-primary text-white rounded-md cursor-pointer  "
                  >
                    عرض كل القطع
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Discounts & Offers Section */}
        <section className="mt-8 mb-16">
          <div className="max-w-7xl mx-auto ">
            <div className="bg-(--color-bg-dark) p-0 py-2 md:p-10 shadow-lg lg:rounded-2xl lg:overflow-hidden">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3">
                  <Tag className="w-8 h-8 text-amber-300" />
                  <h2 className="text-4xl md:text-5xl font-extrabold text-[#A8511A] dark:text-[#A8511A]">
                    عروضنا
                  </h2>
                </div>
                <p className="mt-2 text-lg md:text-xl section-lead font-medium">
                  استفد من أحدث التخفيضات والعروض الخاصة
                </p>
                <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-amber-200" />
              </div>
              <div className="w-full  dark:bg-black/40 py-4 md:p-6 lg:rounded-xl shadow-inner">
                <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-amber-500/20 hover:scrollbar-thumb-amber-500/30 pb-2">
                  <Fabrics showDiscounts={true} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
