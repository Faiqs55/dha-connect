"use client";
import logo from "@/assets/dha-connect-logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import useAuthStore from "@/store/auth.store";
import { 
  HiOutlineHome,
  HiOutlineBuildingOffice2,
  HiOutlineUserGroup,
  HiOutlineDocumentText
} from "react-icons/hi2";

export default function AgencySidebar({ open }) {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logoutUserAuth);
  const user = useAuthStore((s) => s.user);

  const links = [
    { 
      href: "/agency/dashboard", 
      label: "Dashboard", 
      exact: true,
      icon: HiOutlineHome
    },
    { 
      href: "/agency/dashboard/update-agency", 
      label: "View & Update My Agency",
      icon: HiOutlineBuildingOffice2
    },
    { 
      href: "/agency/dashboard/agents", 
      label: "My Agents",
      icon: HiOutlineUserGroup
    },
    { 
      href: "/agency/dashboard/properties", 
      label: "Properties",
      icon: HiOutlineDocumentText
    },
  ];

  const isActive = (href, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  const baseLink = "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition";
  const inactiveLink = "text-slate-700 hover:bg-slate-200";
  const activeLink = "bg-indigo-50 text-indigo-700";

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-200 flex flex-col z-40 ${
        open ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 w-64 duration-300`}
    >
      {/* Logo Section */}
      <div className="flex items-center border-b border-slate-100 py-4 px-4">
        <Image src={logo} alt="DHA Connect" priority width={80} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 text-slate-700">
        {links.map((link) => {
          const IconComponent = link.icon;
          const active = isActive(link.href, link.exact);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${baseLink} ${
                active ? activeLink : inactiveLink
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section & Logout */}
      <div className="p-4 border-t border-slate-100">
        {user && (
          <div className="mb-3 px-3 py-2 bg-slate-50 rounded-md border border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white font-semibold text-xs">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-slate-500 truncate capitalize">
                  {user.role || "Agency"}
                </p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => {
            logout();
            window.location.href = "/user-login";
          }}
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