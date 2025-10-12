import React from "react";
import { IoLocationSharp } from "react-icons/io5";

const AgencyCarouselCard = ({ a }) => {
  return (
    <div
      key={a.id}
      className="w-full gap-2 flex items-center p-3 cursor-pointer rounded-md duration-200 hover:bg-gray-50"
    >
      <img
        className="w-[70px] p-3 border-[1px] rounded-md border-gray-300"
        src={a.agencyLogo}
        alt=""
      />
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold">{a.agencyName}</h3>
        <p className="text-xs text-gray-500 flex items-center gap-2">
          <IoLocationSharp className="text-[#274abb]" /> <span>{a.city}</span>
        </p>
      </div>
    </div>
  );
};

export default AgencyCarouselCard;
