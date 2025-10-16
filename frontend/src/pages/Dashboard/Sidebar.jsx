import logo from "../../../public/dha-connect-logo.png"
import { NavLink, useNavigate } from 'react-router';
import { useState, useEffect } from "react";
const Sidebar = ({open}) => {

  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  }

  return (
    <div className={`bg-gray-100 flex flex-col h-[100vh] fixed top-0 ${open ? "left-0" : "left-[-500px] "} lg:static px-5 py-2.5 w-[250px] md:w-[300px] border-r border-gray-300 duration-500`}>
      <div className='flex justify-end border-b border-gray-300'>
        <img className='w-[100px]' src={logo} alt="" />
      </div>
      <div className='flex flex-col gap-2.5 mt-5 h-full'>
      <NavLink className={`bg-gray-200 py-2 px-2 rounded-md`} to={"/"}>Dashboard</NavLink>
      <NavLink className={`bg-gray-200 py-2 px-2 rounded-md`} to={"/"}>Agencies</NavLink>
      <button onClick={logoutHandler} className="mt-auto bg-[#114085] text-white py-2 rounded-md cursor-pointer">Logout</button>
      </div>
    </div>
  )
}

export default Sidebar