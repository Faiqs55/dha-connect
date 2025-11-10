"use client";
import ContainerCenter from "@/Components/ContainerCenter";
import Sidebar from "@/Components/Sidebar";
import Spinner from "@/Components/Spinner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBarsStaggered } from "react-icons/fa6";

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { value: token, isLoaded } = useLocalStorage("authToken", null);

  useEffect(() => {
    if (isLoaded && !token) {
      router.push("/login");
    }
  }, [token, isLoaded, router]);

  const clickHandler = () => {
    setSidebarOpen((prev) => !prev);
  };

  /* close sidebar on route change or resize to desktop */
  useEffect(() => {
    const close = () => setSidebarOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  if (!isLoaded) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex">
      {/* ------------ Sidebar ------------ */}
      <Sidebar open={sidebarOpen} />

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
            Admin Dashboard
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
