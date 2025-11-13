import React from "react";
import { LuBuilding2 } from "react-icons/lu";
import { IoLogoWhatsapp } from "react-icons/io5";
import Link from "next/link";

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

const PropertyCarouselCard = ({ p }) => {
  const links = formatPhoneNumber(p?.agent?.phone);
  
  // Create WhatsApp message with property details
  const whatsappMessage = `I'm interested in this property: ${p.title}. Property Link: ${typeof window !== 'undefined' ? window.location.origin : ''}/properties/${p._id}. This offer is valid for 24 hours.`;

  return (
    <div
      key={p._id}
      className="w-full flex flex-col gap-3 justify-center p-6 rounded-md"
    >
      <img className="w-full rounded-md h-[200px] object-center object-cover" src={p.thumbnailImage} alt="" />

      <div className="flex flex-col">
        <h3 className="font-semibold text-base">
          <span className="text-xs">PKR</span> {p.price}
        </h3>
        <Link href={`/properties/${p._id}`} className="font-semibold text-lg hover:underline duration-200">
          {p.title}
        </Link>
        <span className="text-sm text-gray-500 my-2">
           DHA Phase 1, Block S, 20
        </span>
        <span className="flex items-center gap-2 text-sm mb-1">
          <LuBuilding2 className="text-xs text-gray-500" /> {p.category}
        </span>
        <span className="flex items-center gap-2 text-sm mb-1">
          <LuBuilding2 className="text-xs text-gray-500" /> {p.type}
        </span>
        <a 
          target="_blank" 
          rel="noopener noreferrer"
          href={links.whatsapp ? `${links.whatsapp}?text=${encodeURIComponent(whatsappMessage)}` : "#"} 
          className="flex items-center gap-3 text-green-700 justify-center py-2 rounded-md mt-2 bg-green-100 font-semibold disabled:opacity-50"
          aria-disabled={!links.whatsapp}
        >
          <IoLogoWhatsapp className="text-xl"/> 
          <span>WhatApp</span>
        </a>
      </div>
    </div>
  );
};

export default PropertyCarouselCard;