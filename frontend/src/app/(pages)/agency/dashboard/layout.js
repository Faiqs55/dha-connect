"use client";
import AgencySidebar from "@/Components/AgencySidebar";
import ContainerCenter from "@/Components/ContainerCenter";
import { useState, useEffect, useRef } from "react";
import { FaBarsStaggered } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Spinner from "@/Components/Spinner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import authService from "@/services/auth.service";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {value: agencyToken, isLoaded} = useLocalStorage("agencyToken");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const hasValidated = useRef(false);

  /* close sidebar on route change or resize to desktop */
  useEffect(() => {
    const close = () => setSidebarOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  const validateToken = async (token) => {
    if (hasValidated.current) {
      setLoading(false);
      return;
    }
    
    const res = await authService.checkUserLogin(token, null);
    if(!res.success){
      router.push("/user-login");
    }else{
      hasValidated.current = true;
      setLoading(false);
      return;
    }
  }

  useEffect(() => {
    if (!isLoaded) return;
    
    if (agencyToken) {
      validateToken(agencyToken);
    } else {
      router.push("/user-login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyToken, isLoaded]);

  

  if (loading || !isLoaded) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex">
      {/* ------------ Sidebar ------------ */}
      <AgencySidebar open={sidebarOpen} />

      {/* ------------ Backdrop (mobile only) ------------ */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* ------------ Main content ------------ */}
      <main
        className={`flex-1 transition-[margin] duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        } lg:ml-64`}
      >
        {/* ------------ Header ------------ */}
        <header className="bg-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800">
            Agency Dashboard
          </h3>
          <FaBarsStaggered
            onClick={() => setSidebarOpen((s) => !s)}
            className="lg:hidden text-slate-600 cursor-pointer text-xl"
          />
        </header>

        {/* ------------ Page content ------------ */}
        <div className="p-6">
          <ContainerCenter>{children}</ContainerCenter>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
