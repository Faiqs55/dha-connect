import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ContainerCenter from "../../Components/ContainerCenter";
import { FaBarsStaggered } from "react-icons/fa6";
import agencyService from "../../services/agency.service";
import { Link, useNavigate, useParams } from "react-router"; // Fixed import

const AdminAgency = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [agency, setAgency] = useState(null);
  const [formData, setFormData] = useState({
    featuredAds: "",
    videoAds: "",
    classifiedAds: "",
    status: "",
  });
  const id = useParams().id;

  const navigate = useNavigate();
  
  const clickHandler = () => {
    setSidebarOpen((prev) => !prev);
  };

  const getAgency = async () => {
    try {
      const res = await agencyService.getSingleAgency(id);
      if (!res.success) {
        alert(res.message);
        return;
      }

      setAgency(res.data);
      setFormData({
        featuredAds: res.data.featuredAds || "", // Use res.data directly
        videoAds: res.data.videoAds || "",
        classifiedAds: res.data.classifiedAds || "",
        status: res.data.status || "",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAgency();
  }, [id]); // Added id as dependency
  

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare the data to be submitted
    const submitData = {
      featuredAds: parseInt(formData.featuredAds) || 0,
      videoAds: parseInt(formData.videoAds) || 0,
      classifiedAds: parseInt(formData.classifiedAds) || 0,
      status: formData.status,
    };

    const token = localStorage.getItem("authToken");

    try {
      const res = await agencyService.updateAgency(id, submitData, token);
      if(!res.success){
        alert(res.message);
      }      
      window.location.reload();
    } catch (error) {
      console.log(error);
      
    }
    
  };



  return (
    <div className="flex relative">
      <Sidebar open={sidebarOpen} />

      {/* MAIN CONTENT  */}
      <div className="flex-1">
        {/* HEADER  */}
        <div className="bg-gray-100 px-10 py-5 flex justify-between items-center mb-10">
          <h3 className="text-xl font-semibold">Dashboard</h3>
          <FaBarsStaggered onClick={clickHandler} className="lg:hidden text-2xl" />
        </div>

        {/* CONTENT  */}
        {agency && (
          <ContainerCenter className="">
            <h1 className="text-3xl font-semibold mb-5">
              {agency.agencyName}: {agency.status}
            </h1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="p-5 bg-gray-200 rounded-md sm:col-span-2 lg:col-span-3 flex justify-center">
                <img className="w-[100px]" src={agency.agencyLogo} alt="" />
              </div>
              <div className="p-5 bg-gray-200 rounded-md">
                <p>
                  CEO's Name: <span>{agency.ceoName}</span>
                </p>
              </div>
              <div className="p-5 bg-gray-200 rounded-md">
                <p>
                  CEO's Phone: <span>{agency.ceoPhone}</span>
                </p>
              </div>
              <div className="p-5 bg-gray-200 rounded-md">
                <p>
                  Agency Email: <span>{agency.agencyEmail}</span>
                </p>
              </div>
              <div className="p-5 bg-gray-200 rounded-md">
                <p>
                  Agency City: <span>{agency.city}</span>
                </p>
              </div>
              <div className="p-5 bg-gray-200 rounded-md">
                <p>
                  Agency Phase: <span>{agency.phase}</span>
                </p>
              </div>
              <div className="p-5 bg-gray-200 rounded-md">
                <p>
                  Agency Address: <span>{agency.address}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5">
              <div className="grid  sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="flex flex-col">
                  <label htmlFor="confidentialAdsAllowed" className="text-sm font-semibold text-gray-500 mb-1.5">
                    Classified Ads Allowed:
                  </label>
                  <input
                    value={formData.classifiedAds}
                    type="number"
                    className="border border-gray-300 outline-none px-4 py-1.5 rounded-md"
                    placeholder="Enter Value"
                    name="classifiedAds"
                    onChange={inputChangeHandler}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="videoAdsAllowed" className="text-sm font-semibold text-gray-500 mb-1.5">
                    Video Ads Allowed:
                  </label>
                  <input
                    value={formData.videoAds}
                    type="number"
                    className="border border-gray-300 outline-none px-4 py-1.5 rounded-md"
                    placeholder="Enter Value"
                    name="videoAds"
                    onChange={inputChangeHandler}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="featuredAdsAllowed" className="text-sm font-semibold text-gray-500 mb-1.5">
                    Feature Ads Allowed:
                  </label>
                  <input
                    value={formData.featuredAds}
                    type="number"
                    className="border border-gray-300 outline-none px-4 py-1.5 rounded-md"
                    placeholder="Enter Value"
                    name="featuredAds"
                    onChange={inputChangeHandler}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="status" className="text-sm font-semibold text-gray-500 mb-1.5">
                    Select Action:
                  </label>
                  <select 
                    name="status" 
                    value={formData.status}
                    onChange={inputChangeHandler}
                    className="outline-none border border-gray-300 px-4 py-1.5 rounded-md"
                  >
                    <option value="Approved">Approve</option>
                    <option value="Rejected">Reject</option>
                    <option value="Blocked">Block</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="actions mt-5">
                <div className="flex gap-5 justify-end">
                  {/* Submit button for form data */}
                  <button 
                    type="submit" 
                    className="px-4 py-1.5 rounded-md bg-blue-600 text-white cursor-pointer"
                  >
                    Update Agency
                  </button>

                </div>
              </div>
            </form>
          </ContainerCenter>
        )}
      </div>
    </div>
  );
};

export default AdminAgency;