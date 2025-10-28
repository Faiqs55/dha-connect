"use client";
import logo from "@/assets/dha-connect-logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import useAuthStore from "@/store/auth.store";

const IconDashboard = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2l-7 7-7-7m16 11V10a1 1 0 00-1-1h-3" />
  </svg>
);

export default function AgentSidebar({ open }) {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logoutUserAuth);

  const baseLink = "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition";
  const inactiveLink = "text-slate-700 hover:bg-slate-200";
  const activeLink = "bg-indigo-50 text-indigo-700";

  /* ---------- exact match or deeper segment ---------- */
  const links = [
    { href: "/agent/dashboard", label: "Dashboard", exact: true },
    { href: "/agent/dashboard/properties", label: "My Properties" },
  ];

  const isActive = (href, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

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
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`${baseLink} ${
              isActive(l.href, l.exact) ? activeLink : inactiveLink
            }`}
          >
            <IconDashboard />
            <span>{l.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
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