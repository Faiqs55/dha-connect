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

// Consolidated navigation data
const navigationItems = [
  { href: "/", label: "Home" },
  {
    type: "dropdown",
    label: "Projects",
    links: [
      { href: "/properties?category=Project", label: "Properties" },
      { href: "/gold-crest", label: "Gold Crest" },
      { href: "/hally-tower", label: "Hally Tower" },
      { href: "/integrated-medical-complex", label: "Inetegrated Medical Complex" },
      { href: "/upcoming-jv-projects", label: "Upcoming JV Projects" },
    ]
  },
  { href: "/properties?category=Sell", label: "Buy" },
  { href: "/properties?category=Rent", label: "Rent" },
  { href: "/properties?category=Project", label: "Project" },
  { href: "/file-rates", label: "File Rates" },
  {
    type: "dropdown",
    label: "Forms",
    links: [
      {
        href: "/forms/building-control-forms",
        label: "Building Control Forms",
      },
      { href: "/forms/finance-forms", label: "Finance Forms" },
      { href: "/forms/transfer-forms", label: "Transfer Forms" },
      { href: "/forms/land-forms", label: "Land Forms" },
      { href: "/forms/maintenance-forms", label: "Maintenance Forms" },
      { href: "/forms/miscellaneous-forms", label: "Miscellaneous Forms" },
      { href: "/forms/security-forms", label: "Security Forms" },
      { href: "/forms/sports-forms", label: "Sports Forms" },
    ],
  },
  {
    type: "dropdown",
    label: "Agencies",
    links: [
      { href: "/agencies", label: "All Agencies" },
      { href: "/affiliates", label: "Affiliates" },
    ],
  },
  { href: "/transfer-expense", label: "Transfer Expense" },
  { href: "/elected-bodies", label: "Elected Bodies" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const headerRef = useRef(null);
  const dropdownRefs = useRef({});
  const pathname = usePathname();
  const router = useRouter();
  const [navbarHeight, setNavbarHeight] = useState(0);

  // Toggle mobile menu
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Toggle dropdown
  const toggleDropdown = (dropdownName) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  // Close all dropdowns
  const closeAll = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutside = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target)
      );
      if (isOutside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate navbar height
  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setNavbarHeight(headerRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Check if link is active
  const isActive = (href) => pathname === href;

  // Render navigation items
  const renderNavItem = (item, index) => {
    if (item.type === "dropdown") {
      const isOpen = openDropdown === item.label;
      const isActive = pathname.startsWith(`/${item.label.toLowerCase()}`);

      return (
        <div
          key={item.label}
          ref={(el) => (dropdownRefs.current[item.label] = el)}
          className="relative"
        >
          <button
            onClick={() => toggleDropdown(item.label)}
            className={`px-3 lg:py-2 py-3 hover:bg-gray-700 lg:hover:bg-[#114085] text-sm duration-300 text-gray-200 lg:text-gray-700 lg:hover:text-white font-semibold border-b-[1px] lg:border-none flex items-center gap-1 border-gray-600 w-full lg:w-auto ${
              isActive && "active"
            }`}
          >
            {item.label}
            <FaChevronDown
              className={`text-xs transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              {item.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeAll}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Regular link
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={closeAll}
        className={`px-3 lg:py-2 py-3 hover:bg-gray-700 lg:hover:bg-[#114085] text-sm duration-300 text-gray-200 lg:text-gray-700 lg:hover:text-white font-semibold border-b-[1px] lg:border-none block border-gray-600 ${
          isActive(item.href) && "active"
        }`}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <header ref={headerRef} className="fixed w-full bg-white z-50 shadow">
        <TopBar />
        <nav className="py-[5px]">
          <ContainerCenter className="sm:w-[90%] flex justify-between lg:justify-normal items-center lg:items-stretch xl:items-center xl:gap-10 lg:flex-col xl:flex-row">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden bg-gray-300 px-3 py-2 cursor-pointer rounded-sm"
            >
              <FaBarsStaggered className="text-2xl" />
            </button>

            {/* Logo */}
            <div className="logo self-end lg:self-start">
              <Image src={logo} width={100} height={50} alt="Company Logo" />
            </div>

            {/* Navigation Menu */}
            <ul
              className={`${
                menuOpen ? "left-0" : "left-[-800px]"
              } lg:left-0 flex lg:items-center justify-between flex-wrap flex-1 lg:gap-2 lg:border-t-2 xl:border-none border-gray-300 lg:pt-3 pb-5 absolute lg:relative flex-col lg:flex-row bg-gray-800 lg:bg-transparent w-[80%] md:w-[50%] lg:w-auto h-[100vh] lg:h-auto top-0 duration-300`}
            >
              {/* Mobile Menu Header */}
              <div className="menu-control lg:hidden px-4 py-3 border-b border-gray-400 flex items-center justify-between text-gray-200">
                <h4>MENU</h4>
                <RxCross1 onClick={closeAll} className="cursor-pointer" />
              </div>

              {/* Navigation Items */}
              {navigationItems.map(renderNavItem)}

              {/* Society Maps Button */}

              <div className="justify-self-end gap-2.5 flex">
                <Link
                  href="/maps"
                  onClick={closeAll}
                  className="bg-[#114085] text-xs font-semibold text-white px-3 py-3 lg:py-2 lg:rounded-sm lg:self-start mt-2 lg:mt-0"
                >
                  Society Maps
                </Link>

                <a
                  target="_blank"
                  className="bg-[#000] text-xs font-semibold text-white px-3 py-3 lg:py-2 lg:rounded-sm lg:self-start mt-2 lg:mt-0"
                  href="https://classads.jang.com.pk/search_adds.asp"
                >
                  Jang Classified
                </a>
              </div>
            </ul>
          </ContainerCenter>
        </nav>
      </header>

      {/* Spacer for fixed navbar */}
      <div style={{ height: `${navbarHeight}px` }} />
    </>
  );
};

export default Navbar;
