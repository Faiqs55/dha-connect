import React from 'react'
import { airViewMaps } from '@/static-data/mapsData'

const page = () => {
  return (
    <div className="max-w-6xl mx-auto mt-20">
             <h2 className="text-3xl font-semibold text-gray-800 mb-10 pl-2">
              Air View Maps DHA Lahore
            </h2>
    
            <div className="grid gap-10">
                {airViewMaps.map(m => (
                  <div key={m.id} className="grid border border-t-0 border-b-0 border-gray-300">
                        <h3 className='px-6 py-3 bg-blue-800 text-white text-xl font-bold'>DHA LAHORE {m.phase}</h3>
                        {m.block.map(b => (
                            <a key={b.id} href={b.link} className='px-6 py-3 border-b border-gray-300 underline'>DHA LAHORE, {m.phase}, {b.block}</a>
                        ))}
                  </div>
                ))}
            </div>
          </div>
  )
}

export default page