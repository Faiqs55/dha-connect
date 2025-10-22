"use client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import agentService from "@/services/agent.service";
import React, { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io5";

const page = () => {
  const [agents, setAgents] = useState([]);
  const { value: userToken, isLoaded } = useLocalStorage("userToken", null);

  const getAgents = async () => {
    const res = await agentService.getMyAgents(userToken);
    if (res.success) {
      setAgents(res.data);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      getAgents();
    }
  }, [userToken]);

  console.log("Agents: ", agents);

  return (
    <>
    <h1 className="text-4xl font-semibold underline mb-6">My Agents</h1>
      {agents.length > 0 && <div className="mb-10 mt-6 grid gap-5">
          {agents.map((agent) => (
            <div
              key={agent._id}
              className="flex flex-col w-fit sm:w-full sm:flex-row border border-gray-400 rounded-md overflow-hidden"
            >
              <div className="w-[200px] h-[200px] sm:border-r border-gray-400 mx-auto sm:mx-0">
                <img
                  className="w-full h-full object-center object-cover"
                  src={agent.image}
                  alt=""
                />
              </div>
              <div className="p-4 flex flex-col justify-between gap-2 sm:gap-0">
                <h3 className="text-xl font-semibold">{agent.name}</h3>
                <p className="text-sm font-semibold text-gray-500">
                  Designation:{" "}
                  <span className="font-medium">{agent.designation}</span>
                </p>

                <div className="btns flex gap-2.5 mt-3">
                  <a
                    className="flex text-sm sm:text-base items-center gap-2 px-2 sm:px-5 py-1 sm:py-2 bg-blue-100 text-blue-700 font-semibold rounded-md"
                    href="#"
                  >
                    <MdEmail className="text-lg" />
                    Email
                  </a>
                  <a
                    className="flex text-sm sm:text-base items-center gap-2 px-2 sm:px-5 py-1 sm:py-2 bg-blue-100 text-blue-700 font-semibold rounded-md"
                    href="#"
                  >
                    <IoMdCall className="text-lg" />
                    Call
                  </a>
                  <a
                    className="flex text-sm sm:text-base items-center gap-2 px-2 sm:px-5 py-1 sm:py-2 bg-blue-100 text-blue-700 font-semibold rounded-md"
                    href="#"
                  >
                    <IoLogoWhatsapp className="text-lg" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>}
    </>
  );
};

export default page;
