// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useState } from "react";
import FabricCard from "./FabricCard";
import LazyImage from "./LazyImage";
import { optimizeImage, optimizeImages } from "@/utils/imageOptimizer";
import type { Fabric } from "@/types";
import { useNavigate } from "react-router-dom";
import usePublicApi from "@/hooks/usePublicApi";

const Fabrics = ({
  categoryId,
  subCategoryId,
  searchQuery,
  showMostSold,
}: {
  categoryId?: string;
  subCategoryId?: string;
  searchQuery?: string;
  showMostSold?: boolean;
}) => {
  const navigate = useNavigate();
  const { getProducts } = usePublicApi();
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFabrics = async () => {
      try {
        setIsLoading(true);
        const params: Record<string, string | number | boolean> = {};
        if (categoryId && categoryId !== "all") params.category = categoryId;
        if (subCategoryId) params.subcategory = subCategoryId;

        const records = await getProducts(params);
        console.log(records);

        // Normalize API records to the Fabric shape our components expect
        let normalized = records.map((r: any) => {
          const imagesFromImageField = r.Image || [];

          // Optimize images using free API
          const optimizedMainImage =
            imagesFromImageField.length > 0
              ? optimizeImage(imagesFromImageField[0], {
                  width: 800,
                  quality: 80,
                })
              : "";
          const optimizedImages =
            imagesFromImageField.length > 0
              ? optimizeImages(imagesFromImageField, {
                  width: 1200,
                  quality: 85,
                })
              : [];

          return {
            id: r._id,
            name: r.Name || "",
            price: String(r.PricePerMeter || ""),
            image: optimizedMainImage,
            images: optimizedImages,
            description: r.Description || "",
            mainCategory: r.mainCategoryName || "",
            subCategory: r.subCategoryName || "",
            videoUrl: r.VideoUrl || "",
          } as Fabric;
        });

        // Apply search filter if searchQuery is provided (client-side since backend doesn't support)
        if (searchQuery) {
          const searchRegex = new RegExp(searchQuery, "i");
          normalized = normalized.filter(
            (fabric: any) =>
              searchRegex.test(fabric.name) ||
              searchRegex.test(fabric.description) ||
              searchRegex.test(fabric.mainCategory) ||
              searchRegex.test(fabric.subCategory)
          );
        }

        // Filter for most sold products if showMostSold is true
        if (showMostSold) {
          normalized = normalized.filter((fabric) => fabric.MostSold === true);
        }

        setFabrics(normalized);
      } catch (error) {
        console.error("Error fetching fabrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFabrics();
  }, [categoryId, subCategoryId, searchQuery, showMostSold, getProducts]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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

  if (fabrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <h2 className="text-2xl font-semibold mb-2">لا توجد منتجات</h2>
        {searchQuery && (
          <p className="text-gray-600">
            لم يتم العثور على منتجات تطابق بحثك: "{searchQuery}"
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={
        showMostSold
          ? "flex overflow-x-auto gap-4 pb-4 snap-x"
          : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
      }
    >
      {fabrics.map((fabric: Fabric) => (
        <div
          key={fabric.id}
          className={
            showMostSold ? "flex-none w-[280px] snap-start" : undefined
          }
        >
          <FabricCard
            fabric={fabric}
            href={`/fabric/${fabric.id}`}
            buttonTitle="اطلب"
            buttonAction={() => navigate(`/fabric/${fabric.id}`)}
            isLazyLoaded={false}
          />
        </div>
      ))}
    </div>
  );
};

export default Fabrics;
