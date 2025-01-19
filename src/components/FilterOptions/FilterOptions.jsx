import React from 'react'

function FilterOptions() {
  return (
    <div className="flex flex-wrap gap-4 my-6">
      <select 
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">Alle categorieën</option>
        <option value="marketing">Marketing</option>
        <option value="education">Educatie</option>
        <option value="business">Zakelijk</option>
      </select>

      <select 
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">Alle tonen</option>
        <option value="formal">Formeel</option>
        <option value="casual">Informeel</option>
        <option value="friendly">Vriendelijk</option>
      </select>
    </div>
  )
}

export default FilterOptions 