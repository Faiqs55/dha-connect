"use client";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import Spinner from "@/Components/Spinner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import useAuthStore, { useAuthIsLoading } from "@/store/auth.store";
import React, { useEffect, useState } from "react";

const HomeLayout = ({ children }) => {
  const { value: userToken, isLoaded } = useLocalStorage("userToken", null);
  const checkUserAuth = useAuthStore((state) => state.checkUserAuth);
  const setAuthLoading = useAuthStore(state => state.setAuthLoading);
  const isLoading = useAuthStore((state) => state.isLoading);

useEffect(() => {
    if (isLoaded) {
      if (userToken) {
        checkUserAuth(userToken);
      } else {
        setAuthLoading(false);
      }
    }
  }, [userToken, isLoaded]);
  

  if (isLoading) {
    return <Spinner/>;
  }

  return (
    <main>
      <Navbar/>
      {children}
      <Footer/>
    </main>
  );
};

export default HomeLayout;
