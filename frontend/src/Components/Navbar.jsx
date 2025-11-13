"use client";
import TopBar from "./TopBar";
import ContainerCenter from "./ContainerCenter";
import logo from "@/assets/dha-connect-logo.png";
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
import { useState, useEffect, useRef, useCallback } from "react";
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
      { href: "/integrated-medical-complex", label: "Integrated Medical Complex" },
      { href: "/upcoming-jv-projects", label: "Upcoming JV Projects" },
    ]
  },
  { href: "/properties?category=Sell", label: "Buy" },
  { href: "/properties?category=Rent", label: "Rent" },
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
      { href: "/forms/ndc-forms", label: "NDC Forms" },
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
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef(null);
  const dropdownRefs = useRef({});
  const pathname = usePathname();
  const router = useRouter();
  const [navbarHeight, setNavbarHeight] = useState(0);

  // Toggle mobile menu
  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
    if (menuOpen) {
      setOpenDropdown(null);
    }
  }, [menuOpen]);

  // Toggle dropdown with better UX
  const toggleDropdown = useCallback((dropdownName) => {
    setOpenDropdown((prev) => {
      // Close if clicking the same dropdown, otherwise open new one
      if (prev === dropdownName) {
        return null;
      }
      return dropdownName;
    });
  }, []);

  // Close all dropdowns and menu
  const closeAll = useCallback(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, []);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside - improved version
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside all dropdowns
      const isOutsideDropdown = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target)
      );

      // Check if click is outside mobile menu
      const isOutsideMobileMenu = !event.target.closest('.mobile-menu-button');

      if (isOutsideDropdown && isOutsideMobileMenu) {
        setOpenDropdown(null);
      }

      // Close mobile menu when clicking on a link (for touch devices)
      if (event.target.closest('a') && menuOpen) {
        closeAll();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen, closeAll]);

  // Close dropdowns on route change
  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

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

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        closeAll();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [closeAll]);

  // Check if link is active with better matching
  const isActive = useCallback((href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href.split('?')[0]); // Ignore query params for active state
  }, [pathname]);

  // Check if dropdown should be considered active
  const isDropdownActive = useCallback((dropdownLinks) => {
    return dropdownLinks.some(link => isActive(link.href));
  }, [isActive]);

  // Render navigation items with improved UX
  const renderNavItem = (item, index) => {
    if (item.type === "dropdown") {
      const isOpen = openDropdown === item.label;
      const hasActiveChild = isDropdownActive(item.links);

      return (
        <div
          key={item.label}
          ref={(el) => (dropdownRefs.current[item.label] = el)}
          className="relative"
        >
          <button
            onClick={() => toggleDropdown(item.label)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown(item.label);
              }
            }}
            className={`px-3 lg:py-2 py-3 hover:bg-gray-700 lg:hover:bg-[#114085] text-sm duration-300 text-gray-200 lg:text-gray-700 lg:hover:text-white font-semibold border-b-[1px] lg:border-none flex items-center gap-1 border-gray-600 w-full lg:w-auto justify-between lg:justify-start whitespace-nowrap ${
              hasActiveChild ? "lg:text-[#114085] lg:font-bold" : ""
            } ${isOpen ? "lg:bg-[#114085] lg:text-white" : ""}`}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <span className="whitespace-nowrap">{item.label}</span>
            <FaChevronDown
              className={`text-xs transition-transform duration-200 flex-shrink-0 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 lg:shadow-xl">
              {item.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeAll}
                  className={`block px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap ${
                    isActive(link.href) 
                      ? "text-blue-600 bg-blue-50 font-semibold" 
                      : "text-gray-700 hover:text-blue-600"
                  }`}
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
        className={`px-3 lg:py-2 py-3 hover:bg-gray-700 lg:hover:bg-[#114085] text-sm duration-300 text-gray-200 lg:text-gray-700 lg:hover:text-white font-semibold border-b-[1px] lg:border-none block border-gray-600 whitespace-nowrap ${
          isActive(item.href) ? "lg:text-[#114085] lg:font-bold" : ""
        }`}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <header 
        ref={headerRef} 
        className={`fixed w-full bg-white z-50 shadow transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : 'shadow'
        }`}
      >
        <TopBar />
        <nav className="py-[5px]">
          <ContainerCenter className="sm:w-[90%] flex justify-between lg:justify-normal items-center lg:items-stretch xl:items-center xl:gap-8 lg:flex-col xl:flex-row">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="mobile-menu-button lg:hidden bg-gray-300 px-3 py-2 cursor-pointer rounded-sm hover:bg-gray-400 transition-colors duration-200 flex-shrink-0"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <RxCross1 className="text-xl" />
              ) : (
                <FaBarsStaggered className="text-xl" />
              )}
            </button>

            {/* Logo */}
            <div className="logo self-center lg:self-start flex-shrink-0">
              <Link href="/" onClick={closeAll}>
                <Image 
                  src={logo} 
                  width={100} 
                  height={50} 
                  alt="DHA Connect Logo"
                  className="hover:opacity-90 transition-opacity duration-200"
                  priority
                />
              </Link>
            </div>

            {/* Navigation Menu */}
            <div
              className={`${
                menuOpen ? "left-0 opacity-100" : "left-[-100%] opacity-0 lg:opacity-100"
              } lg:left-0 flex lg:items-center justify-between flex-wrap flex-1 lg:gap-1 lg:border-t-2 xl:border-none border-gray-300 lg:pt-3 pb-5 absolute lg:relative flex-col lg:flex-row bg-gray-800 lg:bg-transparent w-[85%] sm:w-[70%] lg:w-auto h-screen lg:h-auto top-0 transition-all duration-300 ease-in-out lg:transition-none z-40`}
            >
              {/* Mobile Menu Header */}
              <div className="menu-control lg:hidden px-4 py-4 border-b border-gray-600 flex items-center justify-between text-gray-200 bg-gray-900">
                <h4 className="font-semibold text-lg whitespace-nowrap">MENU</h4>
                <button 
                  onClick={closeAll}
                  className="cursor-pointer p-1 hover:bg-gray-700 rounded transition-colors duration-200 flex-shrink-0"
                  aria-label="Close menu"
                >
                  <RxCross1 className="text-xl" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 flex flex-col lg:flex-row lg:items-center overflow-y-auto lg:overflow-visible w-full">
                {navigationItems.map(renderNavItem)}
              </div>

              {/* Action Buttons */}
              <div className="justify-self-end gap-2.5 flex flex-col lg:flex-row px-4 lg:px-0 mt-4 lg:mt-0">
                <Link
                  href="/maps"
                  onClick={closeAll}
                  className="bg-[#114085] text-xs font-semibold text-white px-4 py-3 lg:py-2 rounded-sm text-center hover:bg-[#0d3368] transition-colors duration-200 whitespace-nowrap"
                >
                  Society Maps
                </Link>

                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#000] text-xs font-semibold text-white px-4 py-3 lg:py-2 rounded-sm text-center hover:bg-gray-800 transition-colors duration-200 mt-2 lg:mt-0 whitespace-nowrap"
                  href="https://classads.jang.com.pk/search_adds.asp"
                >
                  Jang Classified
                </a>
              </div>
            </div>

            {/* Mobile Menu Overlay */}
            {menuOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                onClick={closeAll}
                aria-hidden="true"
              />
            )}
          </ContainerCenter>
        </nav>
      </header>

      {/* Spacer for fixed navbar */}
      <div style={{ height: `${navbarHeight}px` }} />
    </>
  );
};

export default Navbar;