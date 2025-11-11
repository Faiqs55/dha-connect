import React from "react";
const dhaMap = "/QuickLinks/DHA MAP.jpg";
const videoGallery = "/QuickLinks/Video Gallery.jpg";
const fileRate = "/QuickLinks/File Rate.jpg";
const transferExpert = "/QuickLinks/Transfer Expert.jpg";
const affilatAgency = "/QuickLinks/Affilat Agency.jpg";
const form = "/QuickLinks/Form.jpg";
const forRent = "/QuickLinks/For Rent.jpg";
const forSale = "/QuickLinks/For Sale.jpg";

const ProjectCard = ({ name, img, link }) => {
  const [first, ...rest] = name.split(" ");
  const second = rest.join(" ");

  return (
    <a
      href={link}
      target="_blank"
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
    </a>
  );
};

const QuickLinkHome = () => {
  const projects = [
    { name: "DHA MAP", img: dhaMap, link: "/maps" },
    { name: "Agencies", img: videoGallery, link: "/agencies" },
    { name: "File Rate", img: fileRate, link: "/file-rates" },
    { name: "Transfer Expense", img: transferExpert, link: "/transfer-expense" },
    { name: "Affilat Agency", img: affilatAgency, link: "/affiliates" },
    { name: "Form", img: form, link: "/forms" },
    { name: "For Rent", img: forRent, link: "/properties?category=Rent" },
    { name: "For Sale", img: forSale, link: "/properties?category=Buy" },
  ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-10 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-28 bg-white">
      <div className="w-full mb-8 text-left">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-800 tracking-tight pl-3">
          Quick Links
        </h2>
      </div>

      <div
        className="
          grid 
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
          gap-6 sm:gap-8 lg:gap-10 
          w-full
          max-w-[1300px] 
          justify-items-center
        "
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            name={project.name}
            img={project.img}
            link={project.link}
          />
        ))}
      </div>
    </section>
  );
};

export default QuickLinkHome;