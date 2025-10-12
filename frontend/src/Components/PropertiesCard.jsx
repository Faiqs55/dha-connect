import React from "react";
import { IoLocationSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io5";

const PropertiesCard = ({ data }) => {
  return (
    <div className="flex flex-col md:flex-row border border-gray-300 rounded-md overflow-hidden">
      {/* CARD IMG  */}
      <div className="w-full md:w-[40%]">
        <img
          className="object-cover object-center md:h-full w-full"
          src={data.img}
          alt=""
        />
      </div>

      {/* CARD CONTENT  */}
      <div className="p-10 flex flex-col justify-between">
        <h3 className="text-2xl mb-2 font-semibold">
          <span className="text-sm">PKR </span>
          {data.price}
        </h3>
        <p className="font-semibold mb-2">{data.category}</p>
        <p className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <IoLocationSharp /> {data.city}, {data.location}
        </p>
        <p className="text-sm font-semibold text-gray-500">
          Area: {data.minArea} - {data.maxArea}sqft
        </p>

        <div className="btns flex gap-2.5 mt-3">
          <a
            className="flex text-sm sm:text-base items-center gap-2 px-2 sm:px-5 py-1 sm:py-2 bg-blue-100 text-blue-700 font-semibold rounded-md"
            href="#"
          >
            <MdEmail className="text-lg"/>
            Email
          </a>
          <a
            className="flex text-sm sm:text-base items-center gap-2 px-2 sm:px-5 py-1 sm:py-2 bg-blue-100 text-blue-700 font-semibold rounded-md"
            href="#"
          >
            <IoMdCall className="text-lg"/>
            Call
          </a>
          <a
            className="flex text-sm sm:text-base items-center gap-2 px-2 sm:px-5 py-1 sm:py-2 bg-blue-100 text-blue-700 font-semibold rounded-md"
            href="#"
          ><IoLogoWhatsapp className="text-lg"/></a>
        </div>
      </div>
    </div>
  );
};

export default PropertiesCard;
