import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Sidebar from "./Sidebar";
import { FaBarsStaggered } from "react-icons/fa6";




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
            <div className="bg-gray-100 px-10 py-5 flex justify-between items-center">
              <h3>Dashboard</h3>
              <FaBarsStaggered onClick={clickHandler} className="lg:hidden" />
            </div>
      </div>
    </div>
  );
};

export default Dashboard;
