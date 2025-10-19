"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import agencyService from "@/services/agency.service";

const adminAgencies = () => {
  const [agencies, setAgencies] = useState(null);

  const getAllAgencies = async () => {
    try {
      const res = await agencyService.getAllAgencies();

      if (!res.success) {
        alert(res.message);
      }
      setAgencies(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllAgencies();
  }, []);
  return (
    <>
      <h1 className="text-3xl font-semibold mb-5">Current Agencies</h1>
      {agencies && agencies.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-4">
          {agencies.map((a) => (
            <div
              className="border border-gray-300 rounded-md flex flex-col sm:flex-row sm:items-center sm:gap-5"
              key={a._id}
            >
              <div className="border-b sm:border-r sm:border-b-0 border-gray-300 p-5 ">
                <img className="w-[100px]" src={a.agencyLogo} alt="" />
              </div>

              <div className="flex flex-col flex-1 sm:px-5 p-5">
                <h3 className="text-lg font-semibold text-gray-600 mb-2.5">
                  {a.agencyName}
                </h3>
                <p className="font-semibold text-gray-500 mb-5">
                  Status:{" "}
                  <span
                    className={`text-white 
                          ${a.status === "Pending" && "bg-gray-400"}
                          ${a.status === "Approved" && "bg-[#114085]"} 
                          ${a.status === "Rejected" && "bg-red-600"} 
                          ${a.status === "Blocked" && "bg-orange-600"} 
                        text-xs px-3 py-1 rounded-2xl`}
                  >
                    {a.status}
                  </span>
                </p>

                <Link
                  className="bg-gray-200 border self-end border-gray-400 px-3.5 py-1.5 rounded-md"
                  href={`/dashboard/agencies/${a._id}`}
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No Agencies Available.</p>
      )}
    </>
  );
};

export default adminAgencies;
