"use client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import authService from "@/services/auth.service";
import Spinner from "@/Components/Spinner";
import Link from "next/link";

const page = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [submiting, setSubmiting] = useState(false);
  const [disable, setDisable] = useState(true);

  const {
    value: agencyToken,
    setValue: setAgencyToken,
    removeValue: removeAgencyToken,
    isLoaded: isAgencyTokenLoaded,
  } = useLocalStorage("agencyToken", null);
  const {
    value: agentToken,
    setValue: setAgentToken,
    removeValue: removeAgentToken,
    isLoaded: isAgentTokenLoaded,
  } = useLocalStorage("agentToken", null);

  const [loginData, setLoginData] = useState({
    email: null,
    password: null,
    role: null,
  });
  const router = useRouter();

  useEffect(() => {
    setDisable(true);
    if (loginData.email && loginData.password && loginData.role) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [loginData]);

  const validateToken = async (token, role) => {
    const res = await authService.checkUserLogin(token, role);
    if (!res.success) {
      if (res.role === "agent") {        
        removeAgentToken();
      } else {
        removeAgencyToken();
      }
      return;
    } else {      
      if (res.data.role === "agent") {        
        removeAgencyToken();
        router.push("/agent/dashboard");
      } else {
        removeAgentToken();
        router.push("/agency/dashboard");
      }
    }
  };

  useEffect(() => {
    if (agencyToken && isAgencyTokenLoaded) {
      validateToken(agencyToken, null);
    } else {
      setLoading(false);
    }
  }, [agencyToken, isAgencyTokenLoaded]);

  useEffect(() => {
    if (agentToken && isAgentTokenLoaded) {
      validateToken(agentToken, "agent");
    } else {
      setLoading(false);
    }
  }, [agentToken, isAgentTokenLoaded]);

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setData(null);
    setSubmiting(true);
    const res = await authService.loginUser(
      loginData.email,
      loginData.password,
      loginData.role
    );

    if (!res.success) {
      setData(res);
      setSubmiting(false);
      return;
    }
    setData(res);

    if (res.data?.role === "agent") {
      setAgentToken(res.data.token);
      router.push("/agent/dashboard");
    } else {
      setAgencyToken(res.data.token);
      router.push("/agency/dashboard");
    }
    setSubmiting(false);
  };

  if (loading && !isAgencyTokenLoaded && !isAgentTokenLoaded) {
    return <Spinner />;
  }
  return (
    <div className="w-full h-[100vh] bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow rounded-md px-5 py-10 w-[90%] mx-auto md:mx-0 md:w-[500px] flex flex-col gap-5">
        <h1 className="text-2xl font-semibold text-gray-700">
          Login to DHA Connects
        </h1>

        {data && (
          <div className="my-5">
            <p
              className={`${data.success ? "text-green-700" : "text-red-700"}`}
            >
              {data.message}
            </p>
          </div>
        )}
        <form
          action=""
          onSubmit={(e) => {
            submitHandler(e);
          }}
          className="flex flex-col gap-5"
        >
          <input
            className="border border-gray-300 outline-none px-3 py-1.5 rounded-md"
            type="email"
            placeholder="Enter Email"
            onChange={(e) => {
              inputChangeHandler(e);
            }}
            name="email"
          />
          <input
            className="border border-gray-300 outline-none px-3 py-1.5 rounded-md"
            type="password"
            placeholder="Enter Password"
            onChange={(e) => {
              inputChangeHandler(e);
            }}
            name="password"
          />

          <p>Select Your Role: </p>
          <div className="flex justify-center gap-5">
            <div className="flex items-center gap-2">
              <input
                onChange={(e) =>
                  setLoginData((prev) => ({ ...prev, role: e.target.value }))
                }
                type="radio"
                id="agency"
                name="role"
                value={"Agency"}
                placeholder="Agency"
              />
              <label htmlFor="agency">Agency</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={(e) =>
                  setLoginData((prev) => ({ ...prev, role: e.target.value }))
                }
                type="radio"
                id="agent"
                name="role"
                value={"Agent"}
                placeholder="Agent"
              />
              <label htmlFor="agent">Agent</label>
            </div>
          </div>
          <button
            disabled={disable || submiting}
            className="submit disabled:cursor-not-allowed disabled:text-gray-300 disabled:bg-gray-500 bg-[#114085] text-white py-2 rounded-md cursor-pointer"
          >
            {!submiting ? "Login" : "Logging In..."}
          </button>
          <Link
            href="/forgot-password"
            className="underline text-sm text-[#114085] font-semibold self-end"
          >
            Forget Password?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default page;
