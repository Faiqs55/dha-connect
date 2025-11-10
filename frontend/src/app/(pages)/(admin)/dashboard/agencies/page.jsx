"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import agencyService from "@/services/agency.service";

const page = () => {
  const [agencies, setAgencies] = useState(null);
  const [searchQuery, setSearchQuery] = useState({
    status: "all",
    agencyName: "",
  });

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  const getAllAgencies = async (q) => {
    try {
      const res = await agencyService.getAllAgencies(q);

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

  const submitHanlder = (e) => {
    e.preventDefault();
    if (searchQuery.status !== "all" || searchQuery.agencyName !== "") {
      getAllAgencies(searchQuery);
    }
  };

  return (
    <>
      <div className="mb-10">
        <Link
          className="text-gray-500 font-bold text-sm underline"
          href={"/dashboard"}
        >
          {"<< Dashboard"}
        </Link>
      </div>

      <h1 className="text-3xl font-semibold mb-5">
        DHA Connects Agencies ({agencies && agencies.length})
      </h1>

      <form
        action=""
        onSubmit={(e) => submitHanlder(e)}
        className="flex gap-4 my-12"
      >
        <select
          onChange={(e) => inputChangeHandler(e)}
          className="outline-none border border-gray-300 rounded-md px-4 py-2"
          defaultValue={"all"}
          name="status"
        >
          <option value="all" disabled>
            Filter by Status
          </option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
          <option value="Blocked">Blocked</option>
        </select>

        <input
          onChange={(e) => inputChangeHandler(e)}
          className="flex-1 outline-none border border-gray-300 rounded-md px-4 py-2"
          type="text"
          placeholder="Filter By Name"
          name="agencyName"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-md cursor-pointer"
        >
          Search
        </button>
      </form>

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

export default page;
