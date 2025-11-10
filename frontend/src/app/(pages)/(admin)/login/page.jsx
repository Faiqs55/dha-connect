"use client";
import React, { useState, useEffect } from "react";
import logo from "@/assets/dha-connect-logo.png";
import authService from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Image from "next/image";
import Spinner from "@/Components/Spinner";

const page = () => {
  const {
    value: token,
    setValue: setToken,
    removeValue: removeToken,
    isLoaded,
  } = useLocalStorage("authToken", null);
  const router = useRouter();

  const [submiting, setSubmiting] = useState(false);
  const [disable, setDisable] = useState(true);
  const [data, setData] = useState(null);
  const [loginData, setLoginData] = useState({
    email: null,
    password: null,
  });

  useEffect(() => {
    setDisable(true);
    if (loginData.email && loginData.password) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [loginData]);

  const validateToken = async (token) => {
    const res = await authService.checkUserLogin(token);
    if (!res.success) {
      removeToken();
      return;
    } else {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    if (isLoaded && token) {
      validateToken(token)
    }
  }, [isLoaded, token, router]);

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setData(null);
    setSubmiting(true);
    if (loginData.email == "" && loginData.password == "") {
      return alert("Please fill in all the fields");
    }
    const res = await authService.loginUser(
      loginData.email,
      loginData.password
    );
    
    if (!res.success) {
      setSubmiting(false)
      setData(res);
      return;
    }

    setData(res)

    setLoginData({
      email: null,
      password: null,
    });

    setToken(res.data.token);
    setSubmiting(false);
    router.push("/dashboard");
  };

  if (!isLoaded) {
    return <Spinner/>;
  }
  return (
    <div className="w-full h-[100vh] bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow rounded-md px-5 py-10 w-[90%] mx-auto md:mx-0 md:w-[500px] flex flex-col gap-5">
        <div className="w-full flex">
          <Image src={logo} width={100} height={"auto"} alt="company logo" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-700">
          Login to Dashboard
        </h1>
        {data && (
          <div className="my-5">
            <p className={`${data.success ? "text-green-700" : "text-red-700"}`}>{data.message}</p>
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
          <button
            disabled={disable || submiting}
            className="submit disabled:cursor-not-allowed disabled:text-gray-300 disabled:bg-gray-500 bg-[#114085] text-white py-2 rounded-md cursor-pointer"
          >
            {!submiting ? "Login" : "Logging In..."}
          </button>
          <a
            href="#"
            className="underline text-sm text-[#114085] font-semibold self-end"
          >
            Forget Password?
          </a>
        </form>
      </div>
    </div>
  );
};

export default page;
