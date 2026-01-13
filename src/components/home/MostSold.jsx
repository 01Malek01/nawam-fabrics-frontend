import Fabrics from "@/components/Fabrics";
import { Star } from "lucide-react";
export default function MostSold() {
 return (
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
      <p className="mt-2 text-lg md:text-xl section-lead font-medium text-gray-900 dark:text-gray-200">
       أفضل المنتجات مبيعاً من النوام
      </p>
      <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-amber-200" />
     </div>
     <div className="w-full dark:bg-black/40 p-0 md:p-6 lg:rounded-xl shadow-inner">
      <div className="pb-2">
       <Fabrics showMostSold={true} disableCarousel={true} mobileTwoCols={true} />
      </div>
     </div>
    </div>
   </div>
  </section>
 )
}
