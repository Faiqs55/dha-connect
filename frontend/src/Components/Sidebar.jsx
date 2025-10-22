import React from "react";
import logo from "@/assets/dha-connect-logo.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Image from "next/image";

const Sidebar = ({ open }) => {
  const { removeValue: removeToken } = useLocalStorage("authToken", null);
  const router = useRouter();
  const logoutHandler = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <div
      className={`bg-gray-100 flex flex-col h-[100vh] fixed top-0 ${
        open ? "left-0" : "left-[-500px] "
      } lg:static px-5 py-2.5 w-[280px] sm:w-[250px] md:w-[300px] border-r border-gray-300 duration-500`}
    >
      <div className="flex border-b border-gray-300">
        <Image src={logo} alt="company Logo" width={100}/>
      </div>
      <div className="flex flex-col gap-2.5 mt-5 h-full">
        <Link className={`bg-gray-200 py-2 px-2 rounded-md`} href={"/dashboard"}>
          Dashboard
        </Link>
        <Link className={`bg-gray-200 py-2 px-2 rounded-md`} href={"/dashboard/agencies"}>
          Agencies
        </Link>
        <button
          onClick={logoutHandler}
          className="mt-auto bg-[#114085] text-white py-2 rounded-md cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
