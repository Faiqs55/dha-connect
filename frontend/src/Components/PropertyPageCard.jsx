import React from "react";
import { IoLocationSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";

// Phone number formatting function
const formatPhoneNumber = (value) => {
  if (!value) return { tel: null, whatsapp: null };
  
  // Remove all spaces and special characters
  const cleaned = value.toString().replace(/[^0-9+]/g, "");
  if (!cleaned) return { tel: null, whatsapp: null };

  let telNumber, whatsappNumber;

  // Format for tel link
  if (cleaned.startsWith("0")) {
    // Remove leading 0 and add +92
    telNumber = `+92${cleaned.substring(1)}`;
  } else if (cleaned.startsWith("92")) {
    // Add + if it starts with 92
    telNumber = `+${cleaned}`;
  } else if (cleaned.startsWith("+92")) {
    // Already in correct format
    telNumber = cleaned;
  } else {
    // Assume it's a local number without 0, add +92
    telNumber = `+92${cleaned}`;
  }

  // Format for WhatsApp link
  if (cleaned.startsWith("0")) {
    // Remove leading 0 and use 92
    whatsappNumber = `92${cleaned.substring(1)}`;
  } else if (cleaned.startsWith("+92")) {
    // Remove the + prefix
    whatsappNumber = cleaned.substring(1);
  } else if (cleaned.startsWith("92")) {
    // Already in correct format for WhatsApp
    whatsappNumber = cleaned;
  } else {
    // Assume it's a local number without 0, use 92
    whatsappNumber = `92${cleaned}`;
  }

  return {
    tel: telNumber,
    whatsapp: `https://wa.me/${whatsappNumber}`
  };
};

const PropertyPageCard = ({ data }) => {
  const links = formatPhoneNumber(data?.agent?.phone);
  
  // Create WhatsApp message with property details
  const whatsappMessage = `I'm interested in this property: ${data.title}. Property Link: ${typeof window !== 'undefined' ? window.location.origin : ''}/properties/${data._id}. This offer is valid for 24 hours.`;

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
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-lg transition-colors duration-200 text-sm min-h-[44px] disabled:opacity-50"
            href={links.tel ? `tel:${links.tel}` : "#"}
            aria-disabled={!links.tel}
          >
            <IoMdCall className="text-lg" />
            <span className="hidden xs:inline">Call</span>
          </a>
          
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium rounded-lg transition-colors duration-200 text-sm min-w-[44px] min-h-[44px] disabled:opacity-50"
            href={links.whatsapp ? `${links.whatsapp}?text=${encodeURIComponent(whatsappMessage)}` : "#"}
            aria-disabled={!links.whatsapp}
          >
            <IoLogoWhatsapp className="text-xl" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyPageCard;