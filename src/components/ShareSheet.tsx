import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  name: string;
  url?: string;
  description?: string;
}

const ShareSheet: React.FC<Props> = ({
  open,
  onClose,
  name,
  url,
  description,
}) => {
  if (!open) return null;

  const pageUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const text = description || name || "";

  return (
    <div className="share-sheet fixed inset-x-4 bottom-4 z-50 md:hidden">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">مشاركة</div>
          <button
            className="text-sm text-gray-600 dark:text-gray-300"
            onClick={onClose}
          >
            إغلاق
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3 text-center">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              name + " - " + pageUrl
            )}`}
            target="_blank"
            rel="noreferrer"
            className="share-option p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100"
          >
            واتساب
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              pageUrl
            )}`}
            target="_blank"
            rel="noreferrer"
            className="share-option p-2 rounded-lg bg-blue-50 hover:bg-blue-100"
          >
            فيسبوك
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              name
            )}&url=${encodeURIComponent(pageUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="share-option p-2 rounded-lg bg-sky-50 hover:bg-sky-100"
          >
            تويتر
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(
              pageUrl
            )}&text=${encodeURIComponent(name)}`}
            target="_blank"
            rel="noreferrer"
            className="share-option p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100"
          >
            تليجرام
          </a>
        </div>
        <div className="mt-3">
          <button
            className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
            onClick={async () => {
              try {
                if (navigator && navigator.clipboard && pageUrl) {
                  await navigator.clipboard.writeText(pageUrl);
                  alert("تم نسخ رابط المنتج");
                } else {
                  // fallback copy
                  const ta = document.createElement("textarea");
                  ta.value = pageUrl;
                  document.body.appendChild(ta);
                  ta.select();
                  document.execCommand("copy");
                  document.body.removeChild(ta);
                  alert("تم نسخ رابط المنتج");
                }
              } catch (err) {
                alert("فشل نسخ الرابط");
              }
            }}
          >
            نسخ الرابط
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareSheet;
