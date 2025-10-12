import React from "react";
import { LuBuilding2 } from "react-icons/lu";
import { IoLogoWhatsapp } from "react-icons/io5";


const PropertyCarouselCard = ({ p }) => {
  return (
    <div
      key={p.id}
      className="w-full flex flex-col gap-3 justify-center p-6 rounded-md"
    >
      <img className="w-full rounded-md" src={p.img} alt="" />

      <div className="flex flex-col">
        <h3 className="font-semibold text-base">
          <span className="text-xs">PKR</span> {p.price}
        </h3>
        <h3 className="font-semibold text-lg">
          {p.name}, {p.city}
        </h3>
        <span className="text-sm text-gray-500 my-2">
          {p.city}, {p.location}
        </span>
        <span className="flex items-center gap-2 text-sm mb-1">
          <LuBuilding2 className="text-xs text-gray-500" /> {p.category}
        </span>
        {/* <span className="flex items-center gap-2 text-sm">
          <LuGitCompareArrows className="text-xs text-gray-500" /> {p.minArea}{" "}
          sqft to {p.maxArea} sqft
        </span> */}
        <a href="#" target="_blank" className="flex items-center gap-3 text-green-700 justify-center py-2 rounded-md mt-2 bg-green-100 font-semibold"><IoLogoWhatsapp className="text-xl"/> <span>WhatApp</span></a>

      </div>
    </div>
  );
};

export default PropertyCarouselCard;
