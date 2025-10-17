import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ContainerCenter from "../../Components/ContainerCenter";
import { FaBarsStaggered } from "react-icons/fa6";
import agencyService from "../../services/agency.service";
import { Link, useParams } from "react-router"; // Fixed import

const AdminAgency = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [agency, setAgency] = useState(null);
  const [formData, setFormData] = useState({
    featuredAdsAllowed: "",
    videoAdsAllowed: "",
    confidentialAdsAllowed: "",
    status: "",
  });
  const id = useParams().id;
  
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
        featuredAdsAllowed: res.data.FeaturedAdsAllowed || "", // Use res.data directly
        videoAdsAllowed: res.data.VideoAdsAllowed || "",
        confidentialAdsAllowed: res.data.confidentialAdsAllowed || "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare the data to be submitted
    const submitData = {
      id: agency._id, // Include agency ID
      featuredAdsAllowed: parseInt(formData.featuredAdsAllowed) || 0,
      videoAdsAllowed: parseInt(formData.videoAdsAllowed) || 0,
      confidentialAdsAllowed: parseInt(formData.confidentialAdsAllowed) || 0,
      status: formData.status,
      // You can include other fields that might be updated
    };

    // Log the data as requested
    console.log("Form Data to be submitted:", submitData);
    
    // Here you would typically make an API call to update the agency
    // For example:
    // agencyService.updateAgency(id, submitData)
    //   .then(response => {
    //     console.log("Update successful:", response);
    //     alert("Agency updated successfully!");
    //   })
    //   .catch(error => {
    //     console.error("Update failed:", error);
    //     alert("Failed to update agency");
    //   });
  };



  return (
    <div className="flex relative">
      <Sidebar open={sidebarOpen} />

      {/* MAIN CONTENT  */}
      <div className="flex-1">
        {/* HEADER  */}
        <div className="bg-gray-100 px-10 py-5 flex justify-between items-center mb-10">
          <h3 className="text-xl font-semibold">Dashboard</h3>
          <FaBarsStaggered onClick={clickHandler} className="lg:hidden" />
        </div>

        {/* CONTENT  */}
        {agency && (
          <ContainerCenter className="">
            <h1 className="text-3xl font-semibold mb-5">
              {agency.agencyName}: {agency.status}
            </h1>
            <div className="grid grid-cols-3 gap-5">
              <div className="p-5 bg-gray-200 rounded-md col-span-3 flex justify-center">
                <img className="w-[100px]" src={agency.agencyLogo} alt="" />
              </div>
              <div className="p-5 bg-gray-200 rounded-md">
                <p>
                  CEO's Name: <span>{agency.ceoName}</span>
                </p>
              </div>
              <div className="p-5 bg-gray-200 rounded-md">
                <p>
                  CEO's Phone: <span>{agency.ceoPhone1}</span>
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
                  Agency Address: <span>{agency.streetAddress}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5">
              <div className="grid grid-cols-4 gap-5">
                <div className="flex flex-col">
                  <label htmlFor="confidentialAdsAllowed" className="text-sm font-semibold text-gray-500 mb-1.5">
                    Confidential Ads Allowed:
                  </label>
                  <input
                    value={formData.confidentialAdsAllowed}
                    type="number"
                    className="border border-gray-300 outline-none px-4 py-1.5 rounded-md"
                    placeholder="Enter Value"
                    name="confidentialAdsAllowed"
                    onChange={inputChangeHandler}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="videoAdsAllowed" className="text-sm font-semibold text-gray-500 mb-1.5">
                    Video Ads Allowed:
                  </label>
                  <input
                    value={formData.videoAdsAllowed}
                    type="number"
                    className="border border-gray-300 outline-none px-4 py-1.5 rounded-md"
                    placeholder="Enter Value"
                    name="videoAdsAllowed"
                    onChange={inputChangeHandler}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="featuredAdsAllowed" className="text-sm font-semibold text-gray-500 mb-1.5">
                    Feature Ads Allowed:
                  </label>
                  <input
                    value={formData.featuredAdsAllowed}
                    type="number"
                    className="border border-gray-300 outline-none px-4 py-1.5 rounded-md"
                    placeholder="Enter Value"
                    name="featuredAdsAllowed"
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