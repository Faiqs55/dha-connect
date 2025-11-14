import ContainerCenter from '@/Components/ContainerCenter'
const dhaMap = "/QuickLinks/DHA MAP.jpg";
const fileRate = "/QuickLinks/File Rate.jpg";
import Link from 'next/link'
import React from 'react'


const ProjectCard = ({ name, img, link }) => {
  const [first, ...rest] = name.split(" ");
  const second = rest.join(" ");

  return (
    <Link
      href={link}
      rel="noopener noreferrer"
      className="
        relative 
        w-[95%] sm:w-[230px] h-[155px] 
        overflow-hidden group cursor-pointer
        bg-white 
        transition-all duration-500 ease-in-out
        rounded-md
        shadow-md hover:shadow-lg
      "
    >
      
      {/* Background Image */}
      <img
        src={img}
        alt={name}
        className="
          absolute inset-0 
          w-full h-full object-cover transition-all duration-700 ease-in-out  
          group-hover:w-[95%] group-hover:h-[65%]
          sm:group-hover:w-[90%] sm:group-hover:h-[65%]
          md:group-hover:w-[99%] md:group-hover:h-[65%]
          lg:group-hover:w-[90%] lg:group-hover:h-[65%]
          xl:group-hover:w-[90%] xl:group-hover:h-[65%]
          group-hover:mt-3 ml-3 mr-2.5 mb-0
        "
      />

      {/* Gradient Overlay for better text visibility */}
      <div
        className="
          absolute inset-0 
          bg-gradient-to-t from-black/70 via-black/30 to-transparent
          opacity-80
          transition-opacity duration-700 ease-in-out
          group-hover:opacity-60
        "
      ></div>

      {/* Dark overlay on hover */}
      <div
        className="
          absolute inset-0 
          bg-sky-900 opacity-0
          transition-opacity duration-700 ease-in-out
          group-hover:opacity-80
        "
      ></div>

      
      {/* Text Content */}
      <div
        className="
          absolute bottom-2 left-1/2 transform -translate-x-1/2
          text-white text-[1.7rem] font-semibold text-center
          z-40 tracking-tight
          w-full whitespace-nowrap overflow-hidden text-ellipsis
          px-2
        "
      >
        <span className="font-light drop-shadow-lg">{first} </span>
        <span className="font-bold drop-shadow-lg">{second}</span>
      </div>
    </Link>
  );
};


const page = () => {

    const links = [
        {
            link: "/maps/download",
            name: "Download Maps",
            img: dhaMap
        },
        {
            link: "/maps/google-maps",
            name: "Google Maps",
            img:  fileRate
        },
        // {
        //     link: "/maps/google-360",
        //     label: "Google 360 View",
        // },
        // {
        //     link: "/maps/air-view",
        //     label: "360 Air View",
        // },
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
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {links.map(l => (
            <ProjectCard key={l.name} img={l.img} link={l.link} name={l.name} />
        ))}
    </div>
    </ContainerCenter>
    </>
  )
}

export default page