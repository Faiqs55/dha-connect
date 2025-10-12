import TopBar from "./TopBar";
import logo from "../../public/c-logo.png";
import ContainerCenter from "./ContainerCenter";
import { RxCross1 } from "react-icons/rx";
import { useState, useEffect, useRef } from "react";
import { FaBarsStaggered } from "react-icons/fa6";
import { Link, NavLink } from "react-router";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
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
      <header ref={headerRef} className="fixed w-full bg-[#fff] z-50 shadow-lg">
        <TopBar />
        <nav className="py-[25px]">
          <ContainerCenter className="flex justify-between lg:justify-normal items-center lg:items-stretch xl:items-center xl:gap-10 lg:flex-col xl:flex-row">
            <div
              onClick={MenuHandler}
              className="menu-open-btn bg-gray-300 lg:hidden px-3 py-2 cursor-pointer rounded-sm"
            >
              <FaBarsStaggered className="text-2xl" />
            </div>
            <div className="logo pb-5 self-end lg:self-start">
              <img className="w-[150px] md:w-[200px]" src={logo} alt="" />
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
              <li>
                <NavLink
                  className="px-4 lg:py-2 py-3 hover:bg-gray-700 lg:hover:bg-transparent duration-300 text-gray-200 lg:text-gray-700 font-semibold border-b-[1px] lg:border-none block border-gray-600"
                  to={"/"}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="px-4 lg:py-2 py-3 hover:bg-gray-700 lg:hover:bg-transparent duration-300 text-gray-200 lg:text-gray-700 font-semibold border-b-[1px] lg:border-none block border-gray-600"
                  to={"/sale"}
                >
                  Sale
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="px-4 lg:py-2 py-3 hover:bg-gray-700 lg:hover:bg-transparent duration-300 text-gray-200 lg:text-gray-700 font-semibold border-b-[1px] lg:border-none block border-gray-600"
                  to={"/rent"}
                >
                  Rent
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="px-4 lg:py-2 py-3 hover:bg-gray-700 lg:hover:bg-transparent duration-300 text-gray-200 lg:text-gray-700 font-semibold border-b-[1px] lg:border-none block border-gray-600"
                  
                  to={"/required"}
                >
                  Required
                </NavLink>
              </li>
              <li>
                <NavLink
                to={"/agencies"}
                  className="px-4 lg:py-2 py-3 hover:bg-gray-700 lg:hover:bg-transparent duration-300 text-gray-200 lg:text-gray-700 font-semibold border-b-[1px] lg:border-none block border-gray-600"
                >
                  Agencies
                </NavLink>
              </li>
              <Link
              to={"/maps"}
                className="bg-[#274abb] text-white px-4 py-3 lg:py-2 lg:rounded-sm lg:self-start"
              >
                Society Maps
              </Link>
            </ul>
          </ContainerCenter>
        </nav>
      </header>
      <div style={{ height: `${navbarHeight}px` }}></div>
    </>
  );
};

export default Navbar;
