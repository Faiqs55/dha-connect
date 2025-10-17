import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Sidebar from "./Sidebar";
import { FaBarsStaggered } from "react-icons/fa6";
import ContainerCenter from "../../Components/ContainerCenter"



const Dashboard = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");  

  const clickHandler = () => {
    setSidebarOpen(prev => !prev)
  }

  useEffect(() => {
      if(!token){
        navigate("/login");
      }
  }, []);

  return (
    <div className="flex">
      <Sidebar open={sidebarOpen}/>

      {/* MAIN CONTENT  */}
      <div className="flex-1">
        {/* HEADER  */}
            <div className="bg-gray-100 px-10 py-5 flex justify-between items-center mb-10">
              <h3 className="text-xl font-semibold">Dashboard</h3>
              <FaBarsStaggered onClick={clickHandler} className="lg:hidden" />
            </div>

            <ContainerCenter>
              <h1 className="text-3xl font-semibold mb-5">Quick Links</h1>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              <div className="bg-slate-700 p-4 flex flex-col justify-between rounded-md">
                <span className="text-sm mb-3 text-gray-400">Agencies</span>
                <h3 className="text-white text-lg font-semibold mb-3">View All Agencies</h3>
                <Link to={"./agencies"} className="bg-gray-800 text-white px-4 py-2 font-semibold self-end rounded-md text-sm">Let's Go</Link>
              </div>
              <div className="bg-slate-700 p-4 flex flex-col justify-between rounded-md">
                <span className="text-sm mb-3 text-gray-400">Properties</span>
                <h3 className="text-white text-lg font-semibold mb-3">View All Properties</h3>
                <Link to={"/"} className="bg-gray-800 text-white px-4 py-2 font-semibold self-end rounded-md text-sm">Let's Go</Link>
              </div>
              <div className="bg-slate-700 p-4 flex flex-col justify-between rounded-md">
                <span className="text-sm mb-3 text-gray-400">Agencies</span>
                <h3 className="text-white text-lg font-semibold mb-3">Review Agency Requests</h3>
                <Link to={"/"} className="bg-gray-800 text-white px-4 py-2 font-semibold self-end rounded-md text-sm">Let's Go</Link>
              </div>
              
            </div>
            </ContainerCenter>
      </div>
    </div>
  );
};

export default Dashboard;
