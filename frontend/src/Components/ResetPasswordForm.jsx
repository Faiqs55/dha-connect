"use client";
import authService from "@/services/auth.service";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ResetPasswordForm = () => {
  const token = useSearchParams().get("token");
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [disable, setDisable] = useState(true);
  const [data, setData] = useState(null);
  const [submiting, setSubmiting] = useState(false);

  useEffect(() => {
    setDisable(true);
    if (password && confirmPassword) {
      setDisable(false);
    }
  }, [password, confirmPassword]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmiting(true);
    if (password !== confirmPassword) {
      setData({
        success: false,
        message: "Password and Confirm Password must be same.",
      });
      setSubmiting(false);
      return;
    }

    const res = await authService.resetPassword(token, password);

    setData(res);
    setSubmiting(false);
  };

  return (
    <div className="w-full h-[100vh] flex items-center justify-center bg-gray-100">
      <form
        onSubmit={(e) => {
          submitHandler(e);
        }}
        action=""
        className="bg-white shadow p-10 rounded-md flex flex-col mx-5 sm:mx-0 min-w-[500px]"
      >
        <h1 className="text-2xl font-semibold mb-2">Select a New Password.</h1>
        <p className="text-gray-500 mb-10">
          Please select a new Password. Dont Share this Link.
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
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          className="outline-none border border-gray-300 rounded-md p-2 mb-5"
          type="password"
          placeholder="Enter new Password"
        />
        <input
          onChange={(e) => setConfirmPassword(e.target.value)}
          name="confirmPassword"
          className="outline-none border border-gray-300 rounded-md p-2 mb-5"
          type="password"
          placeholder="Confirm Password"
        />
        <button
          disabled={disable || submiting}
          type="submit"
          className="text-white disabled:bg-gray-500 disabled:cursor-not-allowed disabled:text-gray-300 bg-[#114085] py-2 rounded-md font-semibold cursor-pointer"
        >
          {!submiting ? "Reset" : "Submitting..."}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
