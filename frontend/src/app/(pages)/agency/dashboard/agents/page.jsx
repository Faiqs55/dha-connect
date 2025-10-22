"use client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import agentService from "@/services/agent.service";
import React, { useEffect, useState } from "react";

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
    if(isLoaded){
      getAgents();
    }
  }, [userToken]);

  console.log("Agents: ", agents);
  

  return <div></div>;
};

export default page;
