"use client";
import { useState, useEffect } from "react";
import agencyService from "@/services/agency.service";
import { useParams } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import AlertResult from "@/Components/AlertResult";
import Link from "next/link";
import { getLogoUrl } from "@/utils/getFileUrl";

const page = () => {
  const id = useParams().adminAgencyId;
  const { value: token } = useLocalStorage("authToken");
  const [agency, setAgency] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    featuredAds: "",
    videoAds: "",
    classifiedAds: "",
    status: "",
  });

  const getAgency = async () => {
    try {
      const res = await agencyService.getSingleAgency(id);
      if (!res.success) {
        alert(res.message);
        return;
      }

      setAgency(res.data.agency);
      setFormData({
        featuredAds: res.data.agency.featuredAds || 0, // Use res.data directly
        videoAds: res.data.agency.videoAds || 0,
        classifiedAds: res.data.agency.classifiedAds || 20,
        status: res.data.agency.status || "",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      featuredAds: parseInt(formData.featuredAds) || 0,
      videoAds: parseInt(formData.videoAds) || 0,
      classifiedAds: parseInt(formData.classifiedAds) || 0,
      status: formData.status,
    };

    try {
      const res = await agencyService.updateAgency(id, payload, token);
      if (!res.success) {
        setToast({ success: false, message: res.message || "Update failed" });
        return;
      }

      setToast({ success: true, message: "Agency updated successfully" });
      setTimeout(() => {
        window.location.href = "/dashboard/agencies"; // or any route you want
      }, 1500);
    } catch (err) {
      setToast({ success: false, message: err.message || "Server error" });
    }
  };

  useEffect(() => {
    getAgency();
  }, [id]); // Added id as dependency

  if (!agency) {
    return <div className="text-center text-4xl">Loading</div>;
  }

  return (
    <div>
      <AlertResult data={toast} onClose={() => setToast(null)} />
      <div className="mb-10 flex gap-3">
        <Link
          className="text-gray-500 font-bold text-sm underline"
          href={"/dashboard"}
        >
          {"<< Dashboard"}
        </Link>
        <Link
          className="text-gray-500 font-bold text-sm underline"
          href={"/dashboard/agencies"}
        >
          {"<< Agencies"}
        </Link>
      </div>

      <h1 className="text-3xl font-semibold mb-5">
        {agency.agencyName}: {agency.status}
      </h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-5 bg-gray-200 rounded-md sm:col-span-2 lg:col-span-3 flex justify-center">
          <img className="w-[100px]" src={getLogoUrl(agency.agencyLogo)} alt="" />
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
            <label
              htmlFor="confidentialAdsAllowed"
              className="text-sm font-semibold text-gray-500 mb-1.5"
            >
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
            <label
              htmlFor="videoAdsAllowed"
              className="text-sm font-semibold text-gray-500 mb-1.5"
            >
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
            <label
              htmlFor="featuredAdsAllowed"
              className="text-sm font-semibold text-gray-500 mb-1.5"
            >
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
            <label
              htmlFor="status"
              className="text-sm font-semibold text-gray-500 mb-1.5"
            >
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
    </div>
  );
};

export default page;
