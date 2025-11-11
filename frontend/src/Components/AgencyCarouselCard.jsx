import { IoLocationSharp } from "react-icons/io5";
import Link from "next/link";

const AgencyCarouselCard = ({ a }) => {
  return (
    <Link
      href={`/agencies/${a._id}`}
      key={a.id}
      className="group w-full gap-2 flex items-center p-3 cursor-pointer rounded-md duration-200 border-transparent border hover:border-blue-500"
    >
      <img
        className="w-[70px] p-3 border-[1px] rounded-md border-gray-300"
        src={a.agencyLogo}
        alt={a.agencyName}
      />
      <div className="flex flex-col gap-1 flex-1">
        <h3 className="font-semibold">{a.agencyName}</h3>
        
        {/* Location section - hidden on hover */}
        <p className="text-xs text-gray-500 flex items-center gap-2 group-hover:hidden">
          <IoLocationSharp className="text-[#274abb]" /> 
          <span>{a.city}</span>
        </p>
        
        {/* View Agency text - shown on hover */}
        <p className="text-xs text-blue-500 font-semibold hidden group-hover:block">
          View Agency →
        </p>
      </div>
    </Link>
  );
};

export default AgencyCarouselCard;