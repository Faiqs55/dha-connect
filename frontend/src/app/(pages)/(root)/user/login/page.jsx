"use client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import authService from "@/services/auth.service";
import useAuthStore from "@/store/auth.store";

const page = () => {
  const userToken = useAuthStore((state) => state.token);
  const checkUserAuth = useAuthStore((state) => state.checkUserAuth);
  const [loading, setLoading] = useState(true);

  const { setValue: setToken } = useLocalStorage("userToken", null);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (userToken) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [userToken]);

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
    checkUserAuth(res.data.token);
    router.push("/");
  };

  if (loading) {
    return <div className="text-4xl text-center">Loading...</div>;
  }
  return (
    <div className="w-full bg-gray-100 flex items-center justify-center py-10">
      <div className="bg-white shadow rounded-md px-5 py-10 w-[90%] mx-auto md:mx-0 md:w-[500px] flex flex-col gap-5">
        <h1 className="text-2xl font-semibold text-gray-700">
          Login to DHA Connects
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

export default page;
