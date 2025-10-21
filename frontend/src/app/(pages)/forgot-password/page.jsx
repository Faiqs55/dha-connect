"use client";
import authService from "@/services/auth.service";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const page = () => {
  const [email, setEmail] = useState();
  const [disable, setDisable] = useState(true);
  const [data, setData] = useState(null);
  const [submiting, setSubmiting] = useState(false);

  useEffect(() => {
    setDisable(true);
    if (email) {
      setDisable(false);
    }
  }, [email]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmiting(true);
    const res = await authService.forgotPassword(email);
    setData(res);
    setSubmiting(false)
  };

  return (
    <div className="w-full h-[100vh] flex items-center justify-center bg-gray-100">
      <form
        onSubmit={(e) => {
          submitHandler(e);
        }}
        action=""
        className="bg-white shadow p-10 rounded-md flex flex-col mx-5 sm:mx-0"
      >
        <h1 className="text-2xl font-semibold mb-2">Enter Your Email.</h1>
        <p className="text-gray-500 mb-10">
          We will send you a link to reset your password on your email.
        </p>
        {data && (
          <div className="mb-5">
            <p
              className={`${
                data.success ? "text-green-600" : "text-red-600"
              } font-semibold mb-2`}
            >
              {data.message}
            </p>
            {data.success && (
              <Link href={"/user/login"} className="text-blue-800 underline">
                Go to Login
              </Link>
            )}
          </div>
        )}
        <input
          onChange={(e) => setEmail(e.target.value)}
          className="outline-none border border-gray-300 rounded-md p-2 mb-5"
          type="email"
          placeholder="Enter your email"
        />
        <button
          disabled={disable}
          type="submit"
          className="text-white disabled:bg-gray-500 disabled:cursor-not-allowed disabled:text-gray-300 bg-[#114085] py-2 rounded-md font-semibold cursor-pointer"
        >
          {!submiting ? "Send Email" : "Sending..."}
        </button>
      </form>
    </div>
  );
};

export default page;
