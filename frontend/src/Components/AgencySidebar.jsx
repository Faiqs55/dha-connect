import React, { useState } from "react";
import logo from "@/assets/dha-connect-logo.png";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import useAuthStore from "@/store/auth.store";

/* ---------- SVG icons (inline) ---------- */
const IconDashboard = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2l-7 7-7-7m16 11V10a1 1 0 00-1-1h-3" />
  </svg>
);

const IconChevron = ({ open }) => (
  <svg
    className={`w-4 h-4 ml-auto transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const AgencySidebar = ({ open }) => {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useAuthStore(state => state.logoutUserAuth);

  /* ---------- dropdown toggles ---------- */
  const [agencyOpen, setAgencyOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [agentsOpen, setAgentsOpen] = useState(false);

  const logoutHandler = () => {
    logout();
    router.push("/agency/login");
  };

  /* ---------- reusable classes ---------- */
  const baseLink =
    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition";
  const inactiveLink = "text-slate-700 hover:bg-slate-200";
  const activeLink = "bg-indigo-50 text-indigo-700";

  const isActive = (route) => pathname.startsWith(route);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-200 flex flex-col z-40
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 w-64 duration-300`}
    >
      {/* ---------- Logo ---------- */}
      <div className="flex items-center border-b border-slate-100 py-4 px-4">
        <Image src={logo} alt="DHA Connect" priority width={80} />
      </div>

      {/* ---------- Navigation ---------- */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 text-slate-700">
        {/* Dashboard */}
        <Link
          href="/agency/dashboard"
          className={`${baseLink} ${isActive("/agency/dashboard") ? activeLink : inactiveLink}`}
        >
          <IconDashboard />
          <span>Dashboard</span>
        </Link>

        {/* My Agency */}
        <div>
          <button
            onClick={() => setAgencyOpen((s) => !s)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
              ${agencyOpen ? "bg-slate-100" : "hover:bg-slate-100"}`}
          >
            <span>My Agency</span>
            <IconChevron open={agencyOpen} />
          </button>

          {agencyOpen && (
            <div className="pl-6 mt-1 space-y-1">
              {/* View & Update */}
              <Link
                href="/agency/dashboard/update-agency"
                className={`${baseLink} ${isActive("/agency/dashboard/update-agency") ? activeLink : inactiveLink}`}
              >
                View & Update my agency
              </Link>

              {/* Properties sub-dropdown */}
              <div>
                <button
                  onClick={() => setPropertiesOpen((s) => !s)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-100"
                >
                  <span>My Properties</span>
                  <IconChevron open={propertiesOpen} />
                </button>

                {propertiesOpen && (
                  <div className="pl-6 mt-1 space-y-1">
                    <Link
                      href="/agency/dashboard/properties"
                      className={`${baseLink} ${isActive("/agency/dashboard/properties") ? activeLink : inactiveLink}`}
                    >
                      View My Properties
                    </Link>
                    <Link
                      href="/agency/dashboard/properties/add"
                      className={`${baseLink} ${isActive("/agency/dashboard/properties/add") ? activeLink : inactiveLink}`}
                    >
                      Add New Property
                    </Link>
                  </div>
                )}
              </div>

              {/* Agents sub-dropdown */}
              <div>
                <button
                  onClick={() => setAgentsOpen((s) => !s)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-100"
                >
                  <span>My Agents</span>
                  <IconChevron open={agentsOpen} />
                </button>

                {agentsOpen && (
                  <div className="pl-6 mt-1 space-y-1">
                    <Link
                      href="/agency/dashboard/agents"
                      className={`${baseLink} ${isActive("/agency/dashboard/agents") ? activeLink : inactiveLink}`}
                    >
                      View my agents
                    </Link>
                    <Link
                      href="/agency/dashboard/agents/add"
                      className={`${baseLink} ${isActive("/agency/dashboard/agents/add") ? activeLink : inactiveLink}`}
                    >
                      Add new Agent
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ---------- Logout ---------- */}
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
};

export default AgencySidebar;