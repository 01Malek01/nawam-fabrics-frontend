import React from 'react'

export default function AdminTab({ tab, activeTab, setActiveTab }) {
 return (
  <button
   key={tab.key}
   className={`px-4 py-2 rounded-t-md font-semibold focus:outline-none transition-colors duration-150 ${activeTab === tab.key
    ? "bg-primary text-white"
    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
    }`}
   onClick={() => setActiveTab(tab.key)}
  >
   {tab.label}
  </button>
 )
}
