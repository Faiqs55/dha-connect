import React from "react";
import { IoLocationSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";

const PropertiesCard = ({ data }) => {
  return (
    <div className="flex flex-col md:flex-row border border-gray-300 rounded-md overflow-hidden">
      {/* CARD IMG  */}
      <div className="relative w-full h-[200px] md:w-[300px] md:h-[auto]">
        {data.adType === "classifiedAds" && <span className="absolute z-10 left-3 top-3 capitalize bg-slate-500 text-slate-200 text-sm px-2 py-1 rounded-md font-semibold">Classified Ad</span>}
        {data.adType === "videoAds" && <span className="absolute z-10 left-3 top-3 capitalize bg-amber-600 text-white text-sm px-2 py-1 rounded-md font-semibold">Video Ad</span>}
        {data.adType === "featuredAds" && <span className="absolute z-10 left-3 top-3 capitalize bg-blue-700 text-white text-sm px-2 py-1 rounded-md font-semibold">Featured Ad</span>}
        <Image
        fill
          className="object-cover object-center md:h-full w-full"
          src={data.thumbnailImage}
          alt=""
        />
      </div>

      {/* CARD CONTENT  */}
      <div className="p-4 md:p-10 flex flex-col justify-between">
        <h3 className="text-2xl mb-2 font-semibold">
          <span className="text-sm">PKR </span>
          {data.price}
        </h3>
        <Link
          href={`/properties/${data._id}`}
          className="text-lg hover:underline duration-100 font-semibold text-gray-600 mb-2"
        >
          {data.title}
        </Link>
        <p className="font-semibold mb-2 text-gray-600">{data.category}</p>
        <p className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <IoLocationSharp /> DHA Lahore, {data.phase}, {data.address}
        </p>
        <p className="text-sm font-semibold text-gray-500">
          Area: {data.area} {data.areaUnit}
        </p>

        <p className="text-sm font-semibold text-gray-500 mt-2 capitalize">
          Type: {data.type}-{data.subType}
        </p>

        <div className="btns flex gap-2.5 mt-3">
          <a
            className="flex text-sm sm:text-base items-center gap-2 px-2 sm:px-5 py-1 sm:py-2 bg-blue-100 text-blue-700 font-semibold rounded-md"
            href="#"
          >
            <MdEmail className="text-lg" />
            Email
          </a>
          <a
            className="flex text-sm sm:text-base items-center gap-2 px-2 sm:px-5 py-1 sm:py-2 bg-blue-100 text-blue-700 font-semibold rounded-md"
            href="#"
          >
            <IoMdCall className="text-lg" />
            Call
          </a>
          <a
            className="flex text-sm sm:text-base items-center gap-2 px-2 sm:px-5 py-1 sm:py-2 bg-blue-100 text-blue-700 font-semibold rounded-md"
            href="#"
          >
            <IoLogoWhatsapp className="text-lg" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertiesCard;
