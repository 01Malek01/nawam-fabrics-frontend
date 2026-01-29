import Fabrics from "@/components/Fabrics";
import { Scissors } from "lucide-react";
import { getImageUrl } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import FabricCard from '@/components/FabricCard';
export default function LastPieces({ lastPieces }) {
  const navigate = useNavigate();
  return (
    <section className="mt-8">
      <div className="max-w-7xl mx-auto ">
        <div className="bg-(--color-bg-dark)  p-2  md:px-10 shadow-lg lg:rounded-2xl lg:overflow-hidden">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3">
              <Scissors className="w-8 h-8 text-amber-300" />
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#A8511A] dark:text-[#A8511A]">
                خصم اخر قطعة
              </h2>
            </div>
            <p className="mt-2 text-lg md:text-xl section-lead font-medium text-gray-900 dark:text-gray-200">
              قطع متبقية بعروض خاصة
            </p>
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-amber-200" />
          </div>
          <div className="w-full  dark:bg-black/40 py-4  md:p-6 lg:rounded-xl shadow-inner">
            <div className="grid grid-cols-2 lg:grid-cols-4  gap-4">
              {lastPieces && lastPieces.length > 0 ? (
                lastPieces.map((lp) => {
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
                      buttonTitle="عرض القطعة"
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
  )
}
