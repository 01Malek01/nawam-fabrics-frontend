import React from 'react'
import LandingPageCard from '../LandingPageCard'
import { useNavigate } from 'react-router-dom'
export default function MainCategories({ categories }) {
 const navigate = useNavigate();
 return (
  <>
   <div className="text-center mb-12 relative">
    <div className="inline-block">
     <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#A8511A] dark:text-amber-300 font-arabic tracking-tight">
      الأصناف الرئيسية
     </h2>
    </div>
    <div className="relative">
     <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-light mb-6 max-w-2xl mx-auto leading-relaxed">
      اكتشف مجموعتنا المتميزة من الأقمشة المصنفة بعناية لتلبية جميع
      أذواقك
     </p>
     <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-(--color-wood)" />
    </div>
   </div>

   <div className="grid grid-cols-2 gap-4 max-w-7xl mx-auto px-4 py-8">
    {categories?.map((category) => (
     <LandingPageCard
      key={category.id}
      category={category}
      onClick={() => {
       // Handle navigation or state update
       if (category?.subCategories?.length === 0) {
        navigate(`/categories/${category.id}`);
       }
      }}
      className=""
     />
    ))}
   </div>
  </>

 )
}
