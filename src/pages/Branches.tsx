import SeoHead from "@/components/SeoHead";

const Branches = () => {
  return (
    <>
      <SeoHead
        title="الفروع - نوام للأقمشة"
        description="اكتشف فروع نوام للأقمشة في مختلف المحافظات. زورنا للحصول على أفضل الأقمشة."
        path="/branches"
      />
      <section className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-right">فروعنا</h1>

        <div className="bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            سيتم إضافة محتوى فروع النوام للاقمشة قريباً...
          </p>
        </div>
      </section>
    </>
  );
};

export default Branches;
