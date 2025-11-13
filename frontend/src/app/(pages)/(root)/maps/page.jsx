import ContainerCenter from '@/Components/ContainerCenter'
import Link from 'next/link'
import React from 'react'

const page = () => {

    const links = [
        {
            link: "/maps/download",
            label: "Download Maps",
        },
        {
            link: "/maps/google-maps",
            label: "Google Maps",
        },
        {
            link: "/maps/google-360",
            label: "Google 360 View",
        },
        {
            link: "/maps/air-view",
            label: "360 Air View",
        },
    ]

  return (
    <>
    <div className="mt-9 w-full flex justify-center items-center">
      <div className="flex justify-center items-center">
        <h1 className="text-center font-bold text-1xl sm:text-2xl md:text-2xl lg:text-3xl">
          MAPS IN DHA LAHORE
        </h1>
      </div>
    </div>

    <ContainerCenter className="mt-10">
        <div className='grid gap-5'>
        {links.map(l => (
            <Link href={l.link} key={l.label} className='p-4 shadow hover:text-blue-800'>
                <h4 className='text-center font-semibold underline text-lg'>{l.label}</h4>
            </Link>
        ))}
    </div>
    </ContainerCenter>
    </>
  )
}

export default page