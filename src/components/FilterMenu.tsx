import { Button } from "./ui/button";

const FilterMenu = () => {
  return (
    <aside className="col-span-3 space-y-8 w-full px-2">
      {/* Search Bar */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-black/40 dark:text-white/40">
          <svg 
            fill="currentColor" 
            height="20px" 
            viewBox="0 0 256 256" 
            width="20px" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
          </svg>
        </div>
        <input 
          className="w-full rounded-lg border-none bg-black/5 dark:bg-white/5 pr-10 pl-4 py-3 text-base font-normal placeholder:text-black/40 dark:placeholder:text-white/40 focus:ring-2 focus:ring-primary" 
          placeholder="ابحث عن قماش..." 
          value=""
          onChange={() => {}}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">اختر نوع القماش</h2>
      </div>
      
      <div className="space-y-6">
        {/* Fabric Type Filter */}
        <div className="space-y-4">
          {/* <h3 className="text-xl font-bold">اختر نوع القماش</h3> */}
          <div className="space-y-4">
            {['اقمشة القميص','اقمشة الملايات','اقمشة البدلة', 'اقمشة قطنية خفيفة', ' اقمشة قطنية', 'اقمشة صوف'].map((fabric) => (
              <label key={fabric} className="flex items-center gap-4 text-lg">
                <input 
                  className="h-6 w-6 rounded border-2 border-black/20 dark:border-white/20 bg-transparent text-primary checked:bg-primary focus:ring-primary" 
                  type="checkbox"
                />
                <span>{fabric}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Apply Filters Button */}
        {/* <Button variant="default" className="cursor-pointer w-full rounded-lg  py-3 text-lg font-bold ">
          تطبيق الفلاتر
        </Button> */}
      </div>
    </aside>
  );
};

export default FilterMenu;
