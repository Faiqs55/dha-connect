"use client"
import Carousel from "@/Components/Carousel/Carousel";
import ContainerCenter from "@/Components/ContainerCenter";
import { body } from "@/static-data/electedBody";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/dha-connect-logo.png";
import { useSearchParams } from "next/navigation";
import { BsWhatsapp } from "react-icons/bs";

const page = () => {
  const timeline = useSearchParams().get("timeline");
  const [bodyData, setBodyData] = useState(null);
    
    useEffect(() => {
      if(!timeline){
        const currBody = body.find(b => b.timeline === "current");
        setBodyData(currBody);
      }else{

        const currBody = body.find(b => b.timeline === timeline);
        setBodyData(currBody);
      }
    }, [timeline])
  return (
    <>
      <ContainerCenter>
        {/* PAGE HEADER  */}
        <div className="py-12">
          <h1 className="text-center text-4xl font-semibold">Elected Body</h1>
        </div>

        {/* CURRENT BODY  */}
        <div className="">
           <h2 className="font-semibold text-xl capitalize">{timeline} Elected Body</h2>
           {bodyData && <Carousel
           autoPlay={true}
        //    bg={"bg-gradient-to-t from-[#fff] to-blue-100 rounded-lg"}
           autoPlayInterval={3000}
           sidePadding={0}
           gap={20}
           navButtonOffset={0}
           >
               {bodyData.people.map(p => (
                <div key={p.id} className=" p-5 shadow bg-gradient-to-t from-blue-50 to-[#114085] rounded-lg">
                    <div className="shadow overflow-hidden rounded-md w-full h-[250px] sm:h-[350px] md:h-[200px]">
                        <img className="object-center object-cover w-full" src={p.img} alt={p.name} />
                    </div>
                    <div className="mt-5">
                        <h3 className="text-lg font-semibold">{p.designation}</h3>
                        <p className="text-sm text-gray-600">{p.name}</p>
                        <a className="text-white bg-blue-900 font-semibold text-center mt-3 rounded-md block px-2 py-1 text-sm" href={`tel:+92${p.phone.replaceAll(" ", "").slice(1)}`}>Call</a>
                         <a className="text-white justify-center flex items-center gap-3 bg-green-700 font-semibold text-center mt-3 rounded-md px-2 py-1 text-sm" href={`tel:+92${p.phone.replaceAll(" ", "").slice(1)}`}><BsWhatsapp/> WhatsApp</a>
                    </div>
                </div>
               ))}
           </Carousel>}
        </div>

        {/* PREVIOUS  */}
        <div className="mt-10">
            {body.map(b => (
                <div key={b.timeline} className="flex items-center justify-between py-10 border-b border-gray-500">
                    <Link className="font-semibold text-2xl underline" href={`/elected-bodies?timeline=${b.timeline}`}>{b.timeline}</Link>
                    <Image src={logo} alt="company logo" width={100} height={100}  />
                </div>
            ))}
        </div>
      </ContainerCenter>
    </>
  );
};

export default page;
