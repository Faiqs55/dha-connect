"use client";
import React, { useState, useEffect, useMemo } from "react";
import ContainerCenter from "@/Components/ContainerCenter";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { MdEmail } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { MdIosShare } from "react-icons/md";
import { IoLogoWhatsapp } from "react-icons/io5";
import { hotProperties } from "@/static-data/propertiesData";
import PropertiesCard from "@/Components/PropertiesCard";
import AgencyFilters from "@/Components/AgencyFilters";
import agencyService from "@/services/agency.service";
import Spinner from "@/Components/Spinner";


const page = () => {
  const searchParams = useSearchParams();
  const id = useParams().agencyId;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "listings"
  );
  const [agency, setAgency] = useState(null);

  const getAgencyData = async () => {
    const res = await agencyService.getSingleAgency(id);
    if(!res.success){
      alert("agency not found");
    }else{
      setAgency(res.data);
    }
  }

  useEffect(() => {
    getAgencyData();
  }, []);

   const videoId = useMemo(() => {
    if (!agency) return null;
    if (!agency.agency.agencyVideo) return null;
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^&\n?#]+)/,
    ];

    for (const p of patterns) {
      const match = agency.agency.agencyVideo.match(p);
      if (match) return match[1];
    }
    return null; // invalid
  }, [agency]);


  console.log(videoId);
  

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (activeTab === "listings") {
      params.delete("tab");
    } else {
      params.set("tab", activeTab);
    }
    
    // Use router.push instead of setSearchParams
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.push(newUrl, { scroll: false });
  }, [activeTab, router, searchParams]);


  if(!agency){
    return <Spinner/>
  }  

  return (
    <>
      {/* PAGE HEADER  */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-200 py-10">
        <ContainerCenter className="flex md:items-center gap-10 flex-col md:flex-row">
          <div className="bg-blue-100 p-7 rounded-md">
            <img
              className="w-[150px]"
              src={agency.agency.agencyLogo}
              alt=""
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <h1 className="text-2xl font-semibold text-white bg-blue-900 px-8 py-2.5 rounded-md">
              {agency.agency.agencyName}
            </h1>
            <p className="w-fit font-semibold text-white bg-blue-900 px-6 py-2 rounded-md">
              Properties - (55)
            </p>
          </div>
        </ContainerCenter>
      </div>

      {/* Page Controls  */}
      <div className="pt-5 lg:pt-0 lg:h-[50px] border-b border-gray-300">
        <ContainerCenter className="flex flex-col-reverse lg:flex-row justify-between h-full">
          <div className="flex gap-3.5 h-full">
            <span
              onClick={() => {
                setActiveTab("listings");
              }}
              className={`border-b-2 ${
                activeTab == "listings"
                  ? "border-b-blue-700 text-blue-700"
                  : "border-b-transparent text-gray-500"
              } cursor-pointer h-full flex items-center text-sm sm:text-xl px-2 font-semibold`}
            >
              Active Listings
            </span>
            <span
              onClick={() => {
                setActiveTab("agents");
              }}
              className={`border-b-2 ${
                activeTab == "agents"
                  ? "border-b-blue-700 text-blue-700"
                  : "border-b-transparent text-gray-500"
              } cursor-pointer h-full flex items-center text-sm sm:text-xl px-2 font-semibold`}
            >
              Agents
            </span>
            <span
              onClick={() => {
                setActiveTab("video");
              }}
              className={`border-b-2 ${
                activeTab == "video"
                  ? "border-b-blue-700 text-blue-700"
                  : "border-b-transparent text-gray-500"
              } cursor-pointer h-full flex items-center text-sm sm:text-xl px-2 font-semibold`}
            >
              Agency Video
            </span>
          </div>
          <div className="flex items-center gap-5 mb-5 lg:mb-0">
            <a
              className="bg-blue-50 text-blue-800 font-semibold px-2.5 md:px-5 py-1.5 rounded-md flex items-center gap-1 md:gap-2 text-xs md:text-base"
              href={`mailto:${agency.agency.agencyEmail}`}
            >
              <MdEmail />
              Email
            </a>
            <a
              className="bg-blue-50 text-blue-800 font-semibold px-2.5 md:px-5 py-1.5 rounded-md flex items-center gap-1 md:gap-2 text-xs md:text-base"
              href={`https://wa.me/92${agency.agency.ceoPhone.replaceAll(" ", "").slice(1)}?text=Hello%2C%20I%20need%20more%20information.`}
            >
              <IoLogoWhatsapp/>
              WhatsApp
            </a>
            <a
              className="bg-blue-50 text-blue-800 font-semibold px-2.5 md:px-5 py-1.5 rounded-md flex items-center gap-1 md:gap-2 text-xs md:text-base"
              href={`tel:+92${agency.agency.ceoPhone.replaceAll(" ", "").slice(1)}`}
            >
              <IoMdCall />
              Call
            </a>
            <a
              className="bg-blue-50 text-blue-800 font-semibold px-2.5 md:px-5 py-1.5 rounded-md flex items-center gap-1 md:gap-2 text-xs md:text-base"
              href="#"
            >
              <MdIosShare />
              Share Profile
            </a>
          </div>
        </ContainerCenter>
      </div>

      {/* PAGE CONTENT  */}
      <div className="mt-5">
        <ContainerCenter>
          <div className="flex flex-col-reverse lg:flex-row gap-8 mt-6">
            {/* LEFT - Main Content (3 columns) */}
            <div className="w-full lg:w-[75%] xl:w-[65%]">
              {activeTab === "listings" && <AgencyFilters />}
              {/* LISTING CONTENT */}
              {activeTab === "listings" && (
                <div className="mt-5">
                  <h2 className="text-xl font-semibold mb-4">
                    Properties List
                  </h2>
                  <div className="flex flex-col gap-4">
                    {hotProperties.map((p) => (
                      <PropertiesCard key={p.id} data={p} />
                    ))}
                  </div>
                </div>
              )}

              {/* AGENTS CONTENT */}
              {activeTab === "agents" && (
                <div className="">
                  <h2 className="text-xl font-semibold mb-4">Our Agents</h2>
                  {/* Your agent listing components */}
                  <div className="flex flex-col items-center gap-5">
                    {agency.agents && agency.agents.length > 0 && agency.agents.map((agent) => {
                      return (
                        <div
                          key={agent._id}
                          className="flex flex-col w-fit sm:w-full sm:flex-row border border-gray-400 rounded-md overflow-hidden"
                        >
                          <div className="w-[200px] h-[200px] sm:border-r border-gray-400 mx-auto sm:mx-0">
                            <img
                              className="w-full h-full object-center object-cover"
                              src={agent.image}
                              alt="Agents Image"
                            />
                          </div>
                          <div className="p-4 flex flex-col justify-between gap-2 sm:gap-0">
                            <h3 className="text-xl font-semibold">
                              {agent.name}
                            </h3>
                            <p className="text-sm font-semibold text-gray-500">
                              Designation:{" "}
                              <span className="font-medium">
                                {agent.designation}
                              </span>
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="rounded-md overflow-hidden w-fit flex items-center gap-2.5">
                                <img
                                  className="w-[40px]"
                                  src={agency.agency.agencyLogo}
                                  alt=""
                                />
                              </div>
                              <span className="font-semibold text-xs text-gray-500">
                                {agency.agency.agencyName}
                              </span>
                            </div>

                            <div className="btns flex gap-2.5 mt-3">
                              <a
                                className="flex text-sm sm:text-base items-center gap-2 px-2 sm:px-5 py-1 sm:py-2 bg-blue-100 text-blue-700 font-semibold rounded-md"
                                href={`mailto:${agent.email}`}
                              >
                                <MdEmail className="text-lg"/>
                                Email
                              </a>
                              <a
                                className="flex text-sm sm:text-base items-center gap-2 px-2 sm:px-5 py-1 sm:py-2 bg-blue-100 text-blue-700 font-semibold rounded-md"
                                href={`tel:+92${agent.phone.replaceAll(" ", "").slice(1)}`}
                              >
                                <IoMdCall className="text-lg"/>
                                Call
                              </a>
                              <a
                                className="flex text-sm sm:text-base items-center gap-2 px-2 sm:px-5 py-1 sm:py-2 bg-blue-100 text-blue-700 font-semibold rounded-md"
                                href={`https://wa.me/92${agent.phone.replaceAll(" ", "").slice(1)}`}
                              >
                                <IoLogoWhatsapp className="text-lg"/>
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "video" && (
                <div className="mt-5">
                  <h2 className="text-xl font-semibold mb-4">
                    Agency Introduction
                  </h2>
                  {agency.agency.agencyVideo ? (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                      <video
                        controls
                        className="w-full h-auto max-h-[500px]"
                        poster={agency.agency.agencyLogo}
                      >
                        <source src={agency.agency.agencyVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-8 text-center border border-gray-300">
                      <div className="text-gray-500 text-6xl mb-4">🎥</div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No Video Available
                      </h3>
                      <p className="text-gray-600">
                        This agency hasn't uploaded an introduction video yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT - Sidebar (1 column) */}
            <div className="w-full lg:w-[25%] xl:w-[35%]">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Sidebar Content</h3>
                <p>Additional information or ads can go here</p>
              </div>
            </div>
          </div>
        </ContainerCenter>
      </div>
    </>
  );
};

export default page;