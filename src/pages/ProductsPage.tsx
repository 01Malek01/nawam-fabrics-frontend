import Fabrics from "@/components/Fabrics";
import { useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function ProductsPage() {
  const { categoryId, subCategoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

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
