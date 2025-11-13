import React from 'react'
import { streetViewMaps } from '@/static-data/mapsData'

const page = () => {
  return (
    <div className="max-w-6xl mx-auto mt-20">
             <h2 className="text-3xl font-semibold text-gray-800 mb-10 pl-2">
              MAPS STREET VIEW DHA Lahore
            </h2>
    
            <div className="grid gap-2.5">
                {streetViewMaps.map(m => (
                  <div key={m.id} className="p-4 shadow-md flex justify-between items-center">
                    <span className="font-semibold text-lg text-gray-600">{m.label}</span>
    
                    <a className='border border-blue-800 rounded-md px-3 py-1.5 text-blue-800 font-semibold hover:bg-blue-800 hover:border-transparent hover:text-white duration-200' target='_blank' href={`${m.link}`}>View</a>
                  </div>
                ))}
            </div>
          </div>
  )
}

export default page