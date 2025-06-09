import React from 'react'

const StateCard = ({ title, value, icon }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 flex items-center gap-4">
      <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</span>
        <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{value}</span>
      </div>
    </div>
  )
}

export default StateCard
