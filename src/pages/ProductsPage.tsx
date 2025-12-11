import Fabrics from "@/components/Fabrics";
import { useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useEffect, useLayoutEffect } from "react";

export default function ProductsPage() {
  const { categoryId, subCategoryId } = useParams();
  const [searchParams] = useSearchParams();
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
  return (
    <>
      <Helmet>
        <title>المنتجات - النوام للأقمشة</title>
        <meta
          name="description"
          content="تصفح مجموعة واسعة من الأقمشة حسب الفئة أو البحث في النوام للأقمشة."
        />
      </Helmet>
      <div>
        <Fabrics
          categoryId={categoryId as string}
          subCategoryId={subCategoryId as string}
          searchQuery={searchQuery || undefined}
        />
      </div>
    </>
  );
}
