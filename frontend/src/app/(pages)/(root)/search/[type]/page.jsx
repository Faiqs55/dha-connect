"use client";
import React from "react";
import ContainerCenter from "@/Components/ContainerCenter";
import WidgetSearchFrom from "@/Components/WidgetSearchFrom";
import { FaRegEnvelope } from "react-icons/fa6";
import { hotProperties } from "@/static-data/propertiesData";
import PropertiesCard from "@/Components/PropertiesCard";
import { useParams } from "next/navigation";


const page = () => {

  const searchType = useParams().type;
  console.log(searchType);
  

  return (
    <>

    {/* HERO  */}
      <div className="p-5">
        <div className="w-full hero rounded-xl py-16 md:py-24 lg:py-28">
          <ContainerCenter className={`flex flex-col`}>
            <h1 className="text-white text-4xl font-semibold text-shadow capitalize">
              {searchType} Properties in DHA - Lahore
            </h1>
          </ContainerCenter>
        </div>
      </div>


      {/* MAIN SECTION  */}
      <div className="main mt-10">
        <ContainerCenter className={`flex flex-col xl:flex-row gap-10`}>
          {/* LEFT  */}
          <div className="recent-properties w-full xl:w-[70%]">
            <h2 className="text-3xl capitalize">{searchType} Properties</h2>

            <div className="flex flex-col gap-10 mt-10">
              {hotProperties.map((data, index) => (
                <PropertiesCard key={data.id} data={data} />
              ))}
            </div>
          </div>

          {/* RIGHT  */}

          <div className="right-widget w-full xl:w-[30%]">
            <div className="search-agencies w-full mb-10">
              <h3 className="text-2xl mb-10">Search Agencies</h3>
              <WidgetSearchFrom />
            </div>

            {/* GOT ANY QUESTIONS  */}
            <div className="contact-cta w-full">
              <h3 className="text-2xl mb-5">Got Any Questions?</h3>
              <div className="bg-[#f9fafd] px-[30px] py-[25px] rounded-sm border-t-2 border-t-[#274abb]">
                <p className="mb-5 text-[#2828cf]">
                  If you are having any questions, please feel free to ask.
                </p>
                <a
                  href="/contact"
                  className="bg-[#274abb] text-white px-[20px] py-[10px] rounded-sm flex items-center justify-center gap-3"
                >
                  <FaRegEnvelope /> Drop us a line
                </a>
              </div>
            </div>
          </div>
        </ContainerCenter>
      </div>
    </>
  )
}

export default page