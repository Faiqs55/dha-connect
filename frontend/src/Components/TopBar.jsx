import ContainerCenter from "./ContainerCenter";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaHouseChimney } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import Link from "next/link";

const Topbar = () => {
  return (
    <div className="bg-[#114085] text-white">
      <ContainerCenter className="py-2 text-sm md:text-base md:py-0 md:h-[45px] flex items-center justify-between">
        <div className="flex gap-1.5 md:gap-5 flex-wrap">
          <span className="flex items-center gap-2">
            <FaPhoneAlt />
            <a href="#">+92 0323-xxxxxxx</a>
          </span>
          <span className="flex items-center gap-2">
            <IoMail />
            <a href="#">info@dha-clone.com</a>
          </span>
          <Link
            href={"/submit-agency"}
            className="flex items-center gap-2 bg-red-600 px-4 py-1 rounded-sm font-semibold"
          >
            <FaHouseChimney />
            Submit Agency
          </Link>
        </div>

        <div className="socials hidden lg:block">
          <a href="#" className="block hover:bg-white hover:text-[#274abb] p-3 duration-300">
            <FaFacebookF />
          </a>
        </div>
      </ContainerCenter>
    </div>
  );
};

export default Topbar;
