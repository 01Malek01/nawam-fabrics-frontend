import Fabrics from "@/components/Fabrics";
import { useParams, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import usePublicApi from "@/hooks/usePublicApi";
import SeoHead from "@/components/SeoHead";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  productFromApiRecord,
  SITE_URL,
  type ProductApiRecord,
} from "@/lib/schema";
import {
  buildCategoryDescription,
  buildCategoryTitle,
} from "@/lib/seo";

interface CategoryOption {
  _id?: string;
  id?: string;
  Name?: string;
  name?: string;
}

export default function ProductsPage() {
  const { categoryId, subCategoryId } = useParams();
  const [searchParams] = useSearchParams();
  const { getCategories } = usePublicApi();
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [subCategoryName, setSubCategoryName] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductApiRecord[]>([]);
  const searchQuery = searchParams.get("search");

  const handleProductsLoaded = useCallback((records: unknown[]) => {
    setProducts(records as ProductApiRecord[]);
  }, []);

  const listUrl =
    typeof window !== "undefined"
      ? `${SITE_URL}${window.location.pathname}`
      : `${SITE_URL}/products`;
  const canonicalPath =
    typeof window !== "undefined" ? window.location.pathname : "/products";

  const breadcrumb = [
    { name: "الرئيسية", path: "/" },
    ...(categoryName && categoryId
      ? [{ name: categoryName, path: `/categories/${categoryId}` }]
      : []),
  ];

  const jsonLd: object[] = [];
  if (products.length > 0) {
    jsonLd.push(buildItemListSchema(products.map(productFromApiRecord), listUrl));
  }
  if (breadcrumb.length > 1) {
    jsonLd.push(buildBreadcrumbSchema(breadcrumb));
  }

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
        setSubCategoryName(null);
        return;
      }
      try {
        const cats = (await getCategories()) as
          | CategoryOption[]
          | null
          | undefined;
        if (!mounted) return;
        const found = (cats || []).find(
          (c) => c._id === categoryId || c.id === categoryId,
        );
        setCategoryName(found?.Name || found?.name || null);

        if (subCategoryId) {
          const sub = (cats || []).find(
            (c) => c._id === subCategoryId || c.id === subCategoryId,
          );
          setSubCategoryName(sub?.Name || sub?.name || null);
        } else {
          setSubCategoryName(null);
        }
      } catch (e) {
        console.warn("Failed to fetch categories for name", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [categoryId, subCategoryId, getCategories]);

  const seoTitle = buildCategoryTitle(
    categoryName || "المنتجات",
    subCategoryName,
  );
  const seoDescription = categoryName
    ? buildCategoryDescription(categoryName, subCategoryName)
    : "تصفح مجموعة واسعة من الأقمشة حسب الفئة أو البحث في النوام للأقمشة.";

  return (
    <>
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        path={canonicalPath}
        type="website"
        jsonLd={jsonLd.length > 0 ? jsonLd : undefined}
      />
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
        <header className="mb-6 text-right">
          <h1 className="text-3xl font-bold">{categoryName || "المنتجات"}</h1>
        </header>
        <Fabrics
          categoryId={categoryId as string}
          subCategoryId={subCategoryId as string}
          searchQuery={searchQuery || undefined}
          onProductsLoaded={handleProductsLoaded}
        />
      </div>
    </>
  );
}
