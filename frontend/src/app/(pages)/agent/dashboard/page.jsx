import Link from 'next/link'
import React from 'react'

const page = () => {

  const links = [
    {
      label: "My Agency",
      link: "/agent/dashboard/agency"
    },
    {
      label: "Properties",
      link: "/agent/dashboard/properties"
    },
    {
      label: "Add Properties",
      link: "/agent/dashboard/properties/add"
    },
    
    
  ]

  return (
    <>
      <h1 className='text-2xl font-semibold'>Quick Links</h1>

      <div className='grid md:grid-cols-2 xl:grid-cols-3 mt-10 gap-5'>
        {links.map(link => (
          <div key={link.label} className='bg-[#0e3268] shadow text-white p-5 rounded-md flex flex-col'>
            <h3 className='font-semibold text-lg mb-4'>{link.label}</h3>
            <Link className='bg-white self-end text-black font-semibold rounded-md px-3 py-1' href={link.link}>Let's Go</Link>
        </div>
        ))}
      </div>
    </>
  )
}

export default page