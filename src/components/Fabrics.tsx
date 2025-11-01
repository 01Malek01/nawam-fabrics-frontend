// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useState } from "react";
import FabricCard from "./FabricCard";
import { airtableService } from "../services/airtable";
import type { Fabric } from "@/types";
import { useNavigate } from "react-router-dom";

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
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFabrics = async () => {
      try {
        setIsLoading(true);
        const records = await airtableService.getAllRecords("Products");
        console.log(records);

        // Normalize Airtable records to the Fabric shape our components expect
        const normalized = records.map((r: any) => {
          const imagesFromImageField = Array.isArray(r.Image)
            ? r.Image.map((a: any) => a.url).filter(Boolean)
            : Array.isArray(r.Images)
            ? r.Images.map((a: any) => (a?.url ? a.url : a)).filter(Boolean)
            : [];

          const imageUrl =
            imagesFromImageField[0] ||
            r.image ||
            (r.Image && r.Image[0]?.url) ||
            (r.Images && r.Images[0]?.url) ||
            "";

          return {
            id: r.id,
            name: r.Name || r.name || "",
            price: String(r.PricePerMeter || r.PricePerMeter || ""),
            image: imageUrl,
            images: imagesFromImageField,
            description: r.Description || r.description || "",
            mainCategory: Array.isArray(r.MainCategory)
              ? r.MainCategory
              : r.MainCategory || r.mainCategory || [],
            subCategory: Array.isArray(r.SubCategory)
              ? r.SubCategory
              : r.SubCategory || r.subCategory || [],
            _raw: r,
          } as any;
        });

        let filteredFabrics: any[] = normalized;

        // Apply search filter if searchQuery is provided
        if (searchQuery) {
          const searchRegex = new RegExp(searchQuery, "i");
          filteredFabrics = filteredFabrics.filter(
            (fabric: any) =>
              searchRegex.test(fabric.name) ||
              searchRegex.test(fabric.description) ||
              (Array.isArray(fabric.mainCategory) &&
                fabric.mainCategory.join(" ") &&
                searchRegex.test(fabric.mainCategory.join(" "))) ||
              (Array.isArray(fabric.subCategory) &&
                fabric.subCategory.join(" ") &&
                searchRegex.test(fabric.subCategory.join(" "))) ||
              (Array.isArray(fabric._raw?.MainCategory) &&
                searchRegex.test(fabric._raw.MainCategory.join(" "))) ||
              (Array.isArray(fabric._raw?.SubCategory) &&
                searchRegex.test(fabric._raw.SubCategory.join(" ")))
          );
        }

        // Apply category filters if provided and not 'all'
        if (categoryId && categoryId !== "all") {
          filteredFabrics = filteredFabrics.filter((fabric: any) => {
            const hasMainCategory =
              (Array.isArray(fabric.mainCategory) &&
                fabric.mainCategory.includes(categoryId)) ||
              String(fabric.mainCategory) === String(categoryId);
            const matchesSubCategory = subCategoryId
              ? (Array.isArray(fabric.subCategory) &&
                  fabric.subCategory.includes(subCategoryId)) ||
                String(fabric.subCategory) === String(subCategoryId)
              : true;
            return hasMainCategory && matchesSubCategory;
          });
        }

        // Filter for most sold products if showMostSold is true
        if (showMostSold) {
          filteredFabrics = filteredFabrics.filter(
            (fabric) => fabric._raw?.MostSold === true
          );
        }

        setFabrics(filteredFabrics as Fabric[]);
      } catch (error) {
        console.error("Error fetching fabrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFabrics();
  }, [categoryId, subCategoryId, searchQuery, showMostSold]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {fabrics.map((fabric: Fabric) => (
        <FabricCard
          key={fabric.id}
          fabric={fabric}
          href={`/fabric/${fabric.id}`}
          buttonTitle="اطلب"
          buttonAction={() => navigate(`/fabric/${fabric.id}`)}
        />
      ))}
    </div>
  );
};

export default Fabrics;
