"use client";
import TopBar from "./TopBar";
import ContainerCenter from "./ContainerCenter";
import logo from "@/assets/dha-connect-logo.png";
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
import { useState, useEffect, useRef } from "react";
import { FaBarsStaggered, FaChevronDown } from "react-icons/fa6";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore, { useUserIsLoggedIn } from "@/store/auth.store";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/search/sale", label: "Sale" },
  { href: "/search/rent", label: "Rent" },
  { href: "/search/required", label: "Required" },
  { href: "/agencies", label: "Agencies" },
  { href: "/transfer-expense", label: "Transfer Expense" },
  { href: "/elected-bodies", label: "Elected Bodies" },
];

// Forms dropdown data
const formsLinks = [
  {
    href: "/forms?form=building-control-forms",
    label: "building control forms",
  },
  { href: "/forms?form=finance-forms",
     label: "Finance Forms"
     },
  { href: "/forms?form=transfer-forms",
     label: "Transfer Forms"
     },
  { href: "/forms?form=land-forms",
     label: "Land Forms"
     },
  { href: "/forms?form=maintenance-forms",
     label: "Maintenance Forms"
     },
  { href: "/forms?form=miscellaneous-forms",
     label: "Miscellaneous Forms"
     },
  { href: "/forms?form=security-forms",
     label: "Security Forms"
     },
  { href: "/forms?form=sports-forms",
     label: "Sports Forms"
     },
];

const Navbar = () => {
  const isLoggedIn = useUserIsLoggedIn();
  const logout = useAuthStore((state) => state.logoutUserAuth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [bodyDropdownOpen, setBodyDropdownOpen] = useState(false);
  const [formsDropdownOpen, setFormsDropdownOpen] = useState(false);
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);
  const bodyDropdownRef = useRef(null);
  const formsDropdownRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const [navbarHeight, setNavbarHeight] = useState(0);

  const MenuHandler = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  const toggleBodyDropdown = () => {
    setBodyDropdownOpen((prev) => !prev);
  };

  const toggleFormsDropdown = () => {
    setFormsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setBodyDropdownOpen(false);
    setFormsDropdownOpen(false);
    setMenuOpen(false);
    router.push("/");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (
        bodyDropdownRef.current &&
        !bodyDropdownRef.current.contains(event.target)
      ) {
        setBodyDropdownOpen(false);
      }
      if (
        formsDropdownRef.current &&
        !formsDropdownRef.current.contains(event.target)
      ) {
        setFormsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calculate navbar height after component mounts
  useEffect(() => {
    if (headerRef.current) {
      setNavbarHeight(headerRef.current.offsetHeight);
    }

    const handleResize = () => {
      if (headerRef.current) {
        setNavbarHeight(headerRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if dropdowns should be active
  const isBodyActive = pathname.startsWith("/body");
  const isFormsActive = pathname.startsWith("/forms");

  return (
    <>
      <header ref={headerRef} className="fixed w-full bg-[#fff] z-50 shadow">
        <TopBar isLoggedIn={isLoggedIn} />
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
              } lg:left-0 flex lg:items-center flex-wrap lg:gap-3 lg:border-t-2 xl:border-none border-gray-300 lg:pt-3 pb-5 absolute lg:relative flex-col lg:flex-row bg-gray-800 lg:bg-transparent w-[80%] md:w-[50%] lg:w-auto h-[100vh] lg:h-auto top-0 duration-300`}
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
                    onClick={() => setMenuOpen(false)}
                    className={`px-4 ${
                      active && "active"
                    } lg:py-2 py-3 hover:bg-gray-700 lg:hover:bg-[#114085] duration-300 text-gray-200 lg:text-gray-700 lg:hover:text-white font-semibold border-b-[1px] lg:border-none block border-gray-600`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              

              {/* Profile Dropdown */}
              <div
                ref={dropdownRef}
                className={`${!isLoggedIn && "hidden"} relative`}
              >
                <button
                  onClick={toggleProfileDropdown}
                  className="px-4 cursor-pointer flex items-center gap-1.5 lg:py-2 py-3 hover:bg-gray-700 lg:hover:bg-[#114085] duration-300 text-gray-200 lg:text-gray-700 lg:hover:text-white font-semibold "
                >
                  <span>Profile</span>
                  <FaChevronDown
                    className={`text-xs text-gray-500 transition-transform duration-200 ${
                      profileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute left-4 lg:left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      href="/user/profile/update-agency"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 duration-200"
                    >
                      Update Agency
                    </Link>
                    <Link
                      href="/user/profile/agents/add"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 duration-200"
                    >
                      My Agents
                    </Link>
                    <Link
                      href="/properties/my-properties"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 duration-200"
                    >
                      My Properties
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <Link
                href={"/maps"}
                onClick={() => setMenuOpen(false)}
                className="bg-[#114085] text-white px-4 py-3 lg:py-2 lg:rounded-sm lg:self-start"
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
