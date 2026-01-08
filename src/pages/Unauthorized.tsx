import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">
          غير مسموح لك بدخول هذه الصفحة
        </h2>
        <p className="mb-6">ليس لديك صلاحية للوصول إلى لوحة التحكم.</p>
        <div className="flex justify-center">
          <Link to="/" className="px-4 py-2 bg-primary text-white rounded-md">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
