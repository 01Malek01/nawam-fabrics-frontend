import { Helmet } from "react-helmet";

const FabricTypes = () => {
  return (
    <>
      <Helmet>
        <title>أنواع الأقمشة - نوام للأقمشة</title>
        <meta
          name="description"
          content="استكشف مجموعة متنوعة من أنواع الأقمشة في نوام للأقمشة. من الصوف إلى الكشمير وغيرها."
        />
      </Helmet>
      <section className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-right">أنواع الاقمشة</h1>

        <div className="bg-white/60 dark:bg-white/5 border rounded-lg p-6 text-right">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            سيتم إضافة محتوى أنواع الأقمشة قريباً...
          </p>
        </div>
      </section>
    </>
  );
};

export default FabricTypes;
