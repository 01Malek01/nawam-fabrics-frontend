import Fabrics from "@/components/Fabrics";
import { useParams, useSearchParams } from "react-router-dom";

export default function ProductsPage() {
  const { categoryId, subCategoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  return (
    <div>
      <Fabrics
        categoryId={categoryId as string}
        subCategoryId={subCategoryId as string}
        searchQuery={searchQuery || undefined}
      />
    </div>
  );
}
