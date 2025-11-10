"use client";
import logo from "@/assets/dha-connect-logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Image from "next/image";

const IconDashboard = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2l-7 7-7-7m16 11V10a1 1 0 00-1-1h-3" />
  </svg>
);

const IconFileRates = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconPhaseNames = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c-4.418 0-8 1.79-8 4v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.21-3.582-4-8-4z" />
  </svg>
);

const IconContactQueries = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 15h6" />
  </svg>
);

const IconAgencies = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

export default function Sidebar({ open }) {
  const pathname = usePathname();
  const { removeValue: removeToken } = useLocalStorage("authToken", null);

  const baseLink = "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition";
  const inactiveLink = "text-slate-700 hover:bg-slate-200";
  const activeLink = "bg-indigo-50 text-indigo-700";

  /* ---------- exact match for Dashboard ---------- */
  const isActive = (href, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  const links = [
    { href: "/dashboard", label: "Dashboard", exact: true, icon: IconDashboard },
    { href: "/dashboard/agencies", label: "Agencies", icon: IconAgencies },
    { href: "/dashboard/file-rates", label: "File Rates", icon: IconFileRates },
    { href: "/dashboard/phase-names", label: "Phase Names", icon: IconPhaseNames },
    { href: "/dashboard/contact-queries", label: "Contact Queries", icon: IconContactQueries },
    // { href: "/dashboard/properties", label: "Properties" },
  ];

  const logoutHandler = () => {
    removeToken();
    window.location.href = "/login";
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-200 flex flex-col z-40 ${
        open ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 w-64 duration-300`}
    >
      <div className="flex items-center border-b border-slate-100 py-4 px-4">
        <Image src={logo} alt="DHA Connect" priority width={80} />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 text-slate-700">
        {links.map((l) => {
          const IconComponent = l.icon || IconDashboard;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`${baseLink} ${
                isActive(l.href, l.exact) ? activeLink : inactiveLink
              }`}
            >
              <IconComponent />
              <span>{l.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logoutHandler}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition text-sm font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}