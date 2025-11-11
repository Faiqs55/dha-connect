import React from "react";
import { IoLocationSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";

const PropertyPageCard = ({ data }) => {
  return (
    <div className="w-full bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* IMAGE SECTION */}
      <div className="relative w-full h-48 sm:h-56">
        {/* Ad Type Badge */}
        {data.adType === "classifiedAds" && (
          <span className="absolute z-10 left-3 top-3 bg-slate-600 text-white text-xs px-3 py-1 rounded-md font-semibold">
            Classified Ad
          </span>
        )}
        {data.adType === "videoAds" && (
          <span className="absolute z-10 left-3 top-3 bg-amber-600 text-white text-xs px-3 py-1 rounded-md font-semibold">
            Video Ad
          </span>
        )}
        {data.adType === "featuredAds" && (
          <span className="absolute z-10 left-3 top-3 bg-blue-700 text-white text-xs px-3 py-1 rounded-md font-semibold">
            Featured Ad
          </span>
        )}
        
        <Image
          fill
          className="object-cover"
          src={data.thumbnailImage}
          alt={data.title || "Property image"}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </div>

      {/* CONTENT SECTION */}
      <div className="p-4 sm:p-5">
        {/* Price */}
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          <span className="text-sm font-medium text-gray-600">PKR </span>
          {data.price}
        </h3>
        
        {/* Title */}
        <Link
          href={`/properties/${data._id}`}
          className="text-lg font-semibold text-gray-800 hover:text-blue-600 line-clamp-2 mb-3 block leading-tight"
        >
          {data.title}
        </Link>

        {/* Category & Type */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium capitalize">
            {data.category}
          </span>
          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium capitalize">
            {data.type}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <IoLocationSharp className="text-red-500 flex-shrink-0" />
          <span className="text-sm">DHA Lahore, {data.phase}</span>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
          <div>
            <span className="font-medium">Area:</span> {data.area} {data.areaUnit}
          </div>
          <div className="capitalize">
            <span className="font-medium">Type:</span> {data.subType}
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors duration-200 text-sm min-h-[44px]"
            href={`mailto:${data?.agent?.email}`}
          >
            <MdEmail className="text-lg" />
            <span className="hidden xs:inline">Email</span>
          </a>
          
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-lg transition-colors duration-200 text-sm min-h-[44px]"
            href={`tel:+92${data?.agent?.phone}`}
          >
            <IoMdCall className="text-lg" />
            <span className="hidden xs:inline">Call</span>
          </a>
          
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium rounded-lg transition-colors duration-200 text-sm min-w-[44px] min-h-[44px]"
            href={`https://wa.me/92${data?.agent?.phone}`}
          >
            <IoLogoWhatsapp className="text-xl" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyPageCard;