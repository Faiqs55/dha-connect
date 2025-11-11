import ContainerCenter from "./ContainerCenter";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaHouseChimney } from "react-icons/fa6";
import Link from "next/link";

const TopBar = () => {
  return (
    <div className="bg-[#114085] text-white">
      <ContainerCenter className="sm:w-[90%] py-2 text-sm md:text-base md:py-0 md:h-[45px] sm:flex-row flex-col flex sm:items-center justify-between gap-2">
        <div className="flex gap-5 md:gap-5 flex-wrap">
          <span className="flex items-center gap-2">
            <FaPhoneAlt />
            <a target="_blank" href={`https://wa.me/923215678920`}>+92 321 5678920</a>
          </span>
          <span className="flex items-center gap-2">
            <IoMail />
            <a href="mailto:info@dhaconnects.com" target="_blank">info@dhaconnects.com</a>
          </span>
        </div>

        <div className="socials flex items-center gap-1.5">
          <Link
            href={"/submit-agency"}
            className="flex items-center gap-2 bg-red-600 px-4 py-1 rounded-sm font-semibold"
          >
            <FaHouseChimney />
            Submit Agency
          </Link>

          
          <div className={``}>
            <Link
              className="bg-white duration-200 text-blue-800 px-3 py-1 text-sm font-semibold hover:bg-gray-100 rounded-md"
              href={"/user-login"}
            >
              Login
            </Link>
          </div>
        </div>
      </ContainerCenter>
    </div>
  );
};

export default TopBar;
