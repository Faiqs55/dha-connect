"use client";
import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <>
      <h1 className="text-3xl font-semibold mb-5">Quick Links</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <div className="bg-slate-700 p-4 flex flex-col justify-between rounded-md">
          <span className="text-sm mb-3 text-gray-400">Agencies</span>
          <h3 className="text-white text-lg font-semibold mb-3">
            View All Agencies
          </h3>
          <Link
            href={"/dashboard/agencies"}
            className="bg-gray-800 text-white px-4 py-2 font-semibold self-end rounded-md text-sm"
          >
            Let's Go
          </Link>
        </div>
        <div className="bg-slate-700 p-4 flex flex-col justify-between rounded-md">
          <span className="text-sm mb-3 text-gray-400">Properties</span>
          <h3 className="text-white text-lg font-semibold mb-3">
            View All Properties
          </h3>
          <Link
            href={"/"}
            className="bg-gray-800 text-white px-4 py-2 font-semibold self-end rounded-md text-sm"
          >
            Let's Go
          </Link>
        </div>
        <div className="bg-slate-700 p-4 flex flex-col justify-between rounded-md">
          <span className="text-sm mb-3 text-gray-400">Agencies</span>
          <h3 className="text-white text-lg font-semibold mb-3">
            Review Agency Requests
          </h3>
          <Link
            href={"/"}
            className="bg-gray-800 text-white px-4 py-2 font-semibold self-end rounded-md text-sm"
          >
            Let's Go
          </Link>
        </div>
      </div>
    </>
  );
};

export default page;
