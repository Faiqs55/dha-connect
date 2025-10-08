import React from "react";
import { FaUser } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";

const PropertiesCard = ({ data }) => {
  return (
    <div className="flex flex-col md:flex-row shadow-md">
      {/* CARD IMG  */}
      <div>
        <img className="object-cover object-center md:h-full w-full" src={data.img} alt="" />
      </div>

      {/* CARD CONTENT  */}
      <div className="p-10 flex flex-col justify-between">
        <h3 className="text-[20px] mb-4">{data.name}</h3>
        <p className="text-[16px] text-[#888] mb-6">{data.description}</p>
        <div className="flex justify-between">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <FaUser />
            <span>{data.author}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <SlCalender />
            <span>{data.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesCard;
