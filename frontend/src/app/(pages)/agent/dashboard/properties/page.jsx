"use client";
import Spinner from "@/Components/Spinner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import propertyService from "@/services/property.service";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const page = () => {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [titleFilter, setTitleFilter] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const { value: agentToken, isLoaded } = useLocalStorage("agentToken", null);

  const getProperties = async (query = null) => {
    const res = await propertyService.getAgentProperties(agentToken, query);
    if (res.success) {
      setProperties(res.data);
    }
  };

  useEffect(() => {
    if (agentToken && isLoaded) {
      getProperties();
    }
    setLoading(false);
  }, [agentToken, isLoaded]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    getProperties({ title: titleFilter, category: categoryFilter });
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-10 flex gap-2.5">
        <Link
          className="text-gray-500 font-bold text-sm underline"
          href={"/agent/dashboard"}
        >
          {"<< Dashboard"}
        </Link>
      </div>

      <div className="flex md:flex-row flex-col gap-5 md:gap-0 mb-10 justify-between items-center">
        <h1 className="text-3xl text-center md:text-left font-semibold text-gray-700 ">
          My Properties Listing
        </h1>
        <Link
          className="bg-blue-900 text-white px-4 py-1 rounded-md cursor-pointer"
          href={"/agent/dashboard/properties/add"}
        >
          Add Property
        </Link>
      </div>
      {/* FILTERS  */}
      <form onSubmit={submitHandler}>
        <div className="flex md:flex-row flex-col gap-5 mb-5">
          <input
            onChange={(e) => setTitleFilter(e.target.value)}
            value={titleFilter}
            className="border border-gray-300 rounded-md px-3 py-2 flex-1"
            type="text"
            name="title"
            placeholder="Filter by Property Title"
          />
          <div className="border border-gray-300 rounded-md overflow-hidden flex">
            {["All", "Sell", "Rent", "Project"].map((p) => (
              <span
                onClick={() => setCategoryFilter(p)}
                key={p}
                className={`cursor-pointer text-sm px-4 py-2 font-semibold ${
                  categoryFilter === p ? "bg-blue-100 text-blue-600" : ""
                }`}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-900 text-white px-4 py-1 rounded-md cursor-pointer"
        >
          Filter
        </button>
      </form>

      {!loading ? (
        <div className="mt-5">
          {properties.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {properties.map((p) => (
                <div className="shadow rounded-md p-5" key={p._id}>
                  <div className="h-[200px] w-full relative mb-2">
                    <Image
                      className="object-cover object-center rounded-md"
                      src={p.thumbnailImage}
                      fill
                      alt={p.title}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-600">{p.title}</h3>
                  <p className="text-sm font-semibold mb-2">
                    <span className=" text-gray-500">Category: </span>{" "}
                    <span>{p.category}</span>
                  </p>
                  <p className="text-sm font-semibold">
                    <span className="text-gray-500">Ad Type: </span>{" "}
                    <span>{p.adType}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-2 justify-end">
                    <Link
                      href={`/agent/dashboard/properties/update/${p._id}`}
                      className=" text-white px-3 py-1.5 text-xs rounded-md bg-green-700"
                    >
                      View & Update
                    </Link>
                    <Link
                      href={`/agent/dashboard/properties/`}
                      className=" text-white px-3 py-1.5 text-xs rounded-md bg-red-700"
                    >
                      Delete
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-2xl text-center mt-16">No Properties Found</p>
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default page;
