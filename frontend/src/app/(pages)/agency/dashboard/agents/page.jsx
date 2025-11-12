"use client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import agentService from "@/services/agent.service";
import React, { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io5";
import Link from "next/link";

const page = () => {
  const [agents, setAgents] = useState([]);
  const [querySearch, setQuerySearch] = useState({
    name: "",
  });
  const { value: userToken, isLoaded } = useLocalStorage("agencyToken", null);

  const getAgents = async (q = {}) => {
    const res = await agentService.getMyAgents(userToken, q);
    if (res.success) {
      setAgents(res.data);
    }
  };

  useEffect(() => {
    if (isLoaded && userToken) {
      getAgents();
    }
  }, [isLoaded, userToken]);

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setQuerySearch((prev) => ({ ...prev, [name]: value }));
  };

  const submitHanlder = (e) => {
    e.preventDefault();
    if (!(querySearch.name === "")) {
      getAgents(querySearch);
    }
  };

  return (
    <>
      <div className="mb-10">
        <Link
          className="text-gray-500 font-bold text-sm underline"
          href={"/agency/dashboard"}
        >
          {"<< Dashboard"}
        </Link>
      </div>
      <h1 className="text-4xl font-semibold underline mb-12">My Agents</h1>

      <Link
        className="px-4 py-2 bg-blue-900 text-white rounded-md font-semibold my-5"
        href={"/agency/dashboard/agents/add"}
      >
        Add New
      </Link>

      <form className="flex gap-5 my-5" onSubmit={(e) => submitHanlder(e)}>
        <input
          value={querySearch.name}
          onChange={(e) => {
            inputChangeHandler(e);
          }}
          className="outline-none flex-1 border border-gray-300 rounded-md px-4 py-2"
          type="text"
          name="name"
          placeholder="Search By Name"
        />
        <button className="px-4 py-2 bg-blue-900 text-white rounded-md font-semibold cursor-pointer">
          Search
        </button>
      </form>
      {agents.length > 0 && (
        <div className="mb-10 mt-6 grid gap-5">
          {agents.map((agent) => (
            <div
              key={agent._id}
              className="relative flex flex-col w-fit sm:w-full sm:flex-row border border-gray-400 rounded-md overflow-hidden"
            >
              <div className="w-[200px] h-[250px] overflow-hidden sm:border-r border-gray-400 mx-auto sm:mx-0">
                <img
                  className="w-full h-full object-center object-cover"
                  src={agent.image}
                  alt=""
                />
              </div>
              <div className="p-4 flex flex-col justify-between sm:gap-0">
                <h3 className="text-xl font-semibold">{agent.name}</h3>
                <p className="text-sm font-semibold text-gray-500">
                  Designation:{" "}
                  <span className="font-medium">{agent.designation}</span>
                </p>

                <div className="btns flex gap-2.5 mt-3 flex-col">
                  <a
                    className="flex text-sm sm:text-base items-center gap-2 px-2 sm:px-5 py-1 sm:py-2 bg-blue-100 text-blue-700 font-semibold rounded-md"
                    href="#"
                  >
                    Email: {agent.email}
                  </a>
                  <a
                    className="flex text-sm sm:text-base items-center gap-2 px-2 sm:px-5 py-1 sm:py-2 bg-blue-100 text-blue-700 font-semibold rounded-md"
                    href="#"
                  >
                    Call: {agent.phone}
                  </a>
                  <a
                    className="flex text-sm sm:text-base items-center gap-2 px-2 sm:px-5 py-1 sm:py-2 bg-blue-100 text-blue-700 font-semibold rounded-md"
                    href="#"
                  >
                   Whatsapp : {agent.phone}
                  </a>
                </div>

                <div className="absolute right-5 top-5">
                  <Link className="text-sm bg-green-700 rounded-md text-white px-2 py-0.5" href={`/agency/dashboard/agents/${agent._id}`}>Update</Link>
                  <Link className="text-sm bg-red-700 rounded-md text-white px-2 py-0.5" href={`/agency/dashboard/agents/${agent._id}`}>Delete</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default page;
