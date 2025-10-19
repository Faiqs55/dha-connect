"use client";
import React, { useState, useEffect } from "react";
import logo from "@/assets/dha-connect-logo.png";
import authService from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Image from "next/image";


const adminLogin = () => {
  const {value: token, setValue: setToken, isLoaded} = useLocalStorage("authToken", null)
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isLoaded && token) {
      router.push("/dashboard");
    }
  }, [isLoaded, token, router]);

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (loginData.email == "" && loginData.password == "") {
      return alert("Please fill in all the fields");
    }
    const res = await authService.loginUser(
      loginData.email,
      loginData.password
    );
    if (!res.success) {
      console.log(res.message);
      return;
    }

    setToken(res.data.token);
    router.push("/dashboard");
  };

  if(!isLoaded){
    return <div className='text-center text-4xl'>Loading</div>
  }
  return (
    <div className="w-full h-[100vh] bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow rounded-md px-5 py-10 w-[90%] mx-auto md:mx-0 md:w-[500px] flex flex-col gap-5">
        <div className="w-full flex justify-center">
          <Image src={logo} width={100} height={"auto"} alt="company logo" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-700">
          Login to Dashboard
        </h1>
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
          <button className="submit bg-[#114085] text-white py-2 rounded-md cursor-pointer">
            Login
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

export default adminLogin;
