// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useEffect, useState } from "react";
import usePublicApi from "@/hooks/usePublicApi";
import { Helmet } from "react-helmet";
import { getImageUrl } from "@/lib/utils";
import FabricCard from "@/components/FabricCard";
import { useNavigate } from "react-router-dom";

const LastPieces: React.FC = () => {
  const { getLastPieces, getCategories } = usePublicApi();
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedLength, setSelectedLength] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [res, cats] = await Promise.all([
          getLastPieces(),
          getCategories(),
        ]);
        setItems(Array.isArray(res) ? res : []);
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (e) {
        console.error(e);
        setItems([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [getLastPieces, getCategories]);

  const filteredItems = items.filter((it) => {
    if (
      selectedLength != null &&
      Number(it?.length) !== Number(selectedLength)
    ) {
      return false;
    }
    if (selectedCategory != null) {
      const catId = it?.category?._id || it?.category;
      if (String(catId) !== String(selectedCategory)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Helmet>
        <title>قطع أخيرة - النوام للأقمشة</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-right mb-6">قطع أخيرة</h1>

        {loading ? (
          <div className="text-center py-16">تحميل...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">لا توجد قطع أخيرة حالياً</div>
        ) : (
          <>
            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row gap-4 items-center lg:justify-end mb-8">
              <div className="flex flex-wrap gap-4">
                {/* Length Filter */}
                <div>
                  <div className="text-2xl text-gray-500 mb-2">الطول:</div>
                  <div className="flex flex-wrap gap-2 ">
                    {[3, 3.25, 3.5, 4].map((len) => (
                      <button
                        key={String(len)}
                        onClick={() =>
                          setSelectedLength((s) => (s === len ? null : len))
                        }
                        className={`px-3 py-1.5 rounded-md text-2xl transition-colors ${
                          selectedLength === len
                            ? "bg-primary text-white"
                            : "bg-secondary text-gray-900 dark:text-white"
                        }`}
                      >
                        {String(len)} متر
                      </button>
                    ))}
                    <button
                      onClick={() => setSelectedLength(null)}
                      className="px-3 py-1.5 rounded-md text-2xl bg-secondary text-gray-700 dark:text-white"
                    >
                      الكل
                    </button>
                  </div>
                </div>

                {/* Category Filter */}
                {categories.length > 0 && (
                  <div>
                    <div className="text-2xl text-gray-500 mb-2">الفئة:</div>
                    <select
                      value={selectedCategory || ""}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value || null);
                        console.log(e.target.value);
                      }}
                      className="rounded-md p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white min-w-[150px]"
                    >
                      <option value="">كل الفئات</option>
                      {categories.map((c: any) => (
                        <option key={c._id} value={c._id}>
                          {c.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Results Count */}
            <div className="text-right mb-6 text-gray-600 dark:text-gray-400">
              عرض {filteredItems.length} من {items.length} نتيجة
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((it) => {
                const fabric = {
                  _id: it._id,
                  id: it._id,
                  name: it.name,
                  image: getImageUrl(it.image),
                  images: it.image ? [getImageUrl(it.image)] : [],
                  price: it.price,
                };

                const goTo = it?.product?._id
                  ? `/fabric/${it.product._id}`
                  : it?.product
                  ? `/fabric/${it.product}`
                  : `/lastpieces/${it._id}`;

                return (
                  <FabricCard
                    key={it._id}
                    fabric={fabric}
                    buttonTitle="عرض"
                    buttonAction={() => navigate(goTo)}
                  />
                );
              })}
            </div>

            {/* No Results Message */}
            {filteredItems.length === 0 && items.length > 0 && (
              <div className="text-center py-12 text-gray-500">
                لا توجد قطع تطابق معايير التصفية
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LastPieces;
