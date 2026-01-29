import Fabrics from "@/components/Fabrics";
import { useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useEffect, useLayoutEffect, useState } from "react";
import usePublicApi from "@/hooks/usePublicApi";

export default function ProductsPage() {
  const { categoryId, subCategoryId } = useParams();
  const [searchParams] = useSearchParams();
  const { getCategories } = usePublicApi();
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const searchQuery = searchParams.get("search");
  useLayoutEffect(() => {
    // Force scroll to top immediately before paint when route/params change.
    if (typeof window !== "undefined") {
      try {
        window.scrollTo({ top: 0, left: 0 });
        // Also reset document scroll in case some browsers rely on it
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      } catch (e) {
        window.scrollTo(0, 0);
      }
    }
  }, [categoryId, subCategoryId, searchQuery]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!categoryId) {
        setCategoryName(null);
        return;
      }
      try {
        const cats = await getCategories();
        if (!mounted) return;
        const found = (cats || []).find(
          (c: any) => c._id === categoryId || c.id === categoryId,
        );
        setCategoryName(found?.Name || found?.name || null);
      } catch (e) {
        console.warn("Failed to fetch categories for name", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [categoryId, getCategories]);
  return (
    <>
      <Helmet>
        <title>المنتجات - النوام للأقمشة</title>
        <meta
          name="description"
          content="تصفح مجموعة واسعة من الأقمشة حسب الفئة أو البحث في النوام للأقمشة."
        />
      </Helmet>
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
        <header className="mb-6 text-right">
          <h1 className="text-3xl font-bold">{categoryName || "المنتجات"}</h1>
        </header>
        <Fabrics
          categoryId={categoryId as string}
          subCategoryId={subCategoryId as string}
          searchQuery={searchQuery || undefined}
        />
      </div>
    </>
  );
}
