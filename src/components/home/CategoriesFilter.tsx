import React from "react";

interface Props {
  categories: any[];
  value: string | null;
  onChange: (val: string | null) => void;
  className?: string;
}

const CategoriesFilter: React.FC<Props> = ({
  categories,
  value,
  onChange,
  className,
}) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className={className}>
      <div className="text-2xl text-gray-500 mb-2">الفئة:</div>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
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
  );
};

export default CategoriesFilter;
