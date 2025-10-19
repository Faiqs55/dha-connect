"use client";
import TopBar from "./TopBar";
import ContainerCenter from "./ContainerCenter";
import logo from "@/assets/dha-connect-logo.png";
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
import { useState, useEffect, useRef } from "react";
import { FaBarsStaggered } from "react-icons/fa6";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties/sale", label: "Sale" },
  { href: "/properties/rent", label: "Rent" },
  { href: "/properties/required", label: "Required" },
  { href: "/agencies", label: "Agencies" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const pathname = usePathname();
  const [navbarHeight, setNavbarHeight] = useState(0);
  const MenuHandler = () => {
    setMenuOpen((prev) => !prev);
  };

  // Calculate navbar height after component mounts
  useEffect(() => {
    if (headerRef.current) {
      setNavbarHeight(headerRef.current.offsetHeight);
    }

    // Update height on window resize
    const handleResize = () => {
      if (headerRef.current) {
        setNavbarHeight(headerRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header ref={headerRef} className="fixed w-full bg-[#fff] z-50 shadow">
        <TopBar />
        <nav className="py-[5px]">
          <ContainerCenter className="flex justify-between lg:justify-normal items-center lg:items-stretch xl:items-center xl:gap-10 lg:flex-col xl:flex-row">
            <div
              onClick={MenuHandler}
              className="menu-open-btn bg-gray-300 lg:hidden px-3 py-2 cursor-pointer rounded-sm"
            >
              <FaBarsStaggered className="text-2xl" />
            </div>
            <div className="logo self-end lg:self-start">
              <Image src={logo} width={100} height={50} alt="Company Logo" />
            </div>
            <ul
              className={`${
                !menuOpen ? "left-[-800px]" : "left-0"
              } lg:left-0 flex lg:items-center lg:gap-5 lg:border-t-2 xl:border-none border-gray-300 lg:pt-3 pb-5 absolute lg:relative flex-col lg:flex-row bg-gray-800 lg:bg-transparent w-[80%] md:w-[50%] lg:w-auto h-[100vh] lg:h-auto top-0 duration-300`}
            >
              <div className="menu-control lg:hidden px-4 py-3 border-b-[1px] border-gray-400 flex items-center justify-between text-gray-200">
                <h4 className="">MENU</h4>
                <RxCross1 onClick={MenuHandler} className="cursor-pointer" />
              </div>
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                  key={link.href}
                    href={link.href}
                    className={`px-4 ${
                      active && "active"
                    } lg:py-2 py-3 hover:bg-gray-700 lg:hover:bg-transparent duration-300 text-gray-200 lg:text-gray-700 font-semibold border-b-[1px] lg:border-none block border-gray-600`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href={"/maps"}
                className="bg-[#114085] text-white px-4 py-3 lg:py-2 lg:rounded-sm lg:self-start"
              >
                Society Maps
              </Link>
              <div className="border-[#114085] border-2 rounded-md px-3.5 py-1.5 text-[#114085] font-semibold hover:text-white hover:border-transparent hover:bg-[#114085] duration-300">
                <Link href={"/login"}>Login</Link>
              </div>
            </ul>
          </ContainerCenter>
        </nav>
      </header>
      <div style={{ height: `${navbarHeight}px` }}></div>
    </>
  );
};

export default Navbar;
