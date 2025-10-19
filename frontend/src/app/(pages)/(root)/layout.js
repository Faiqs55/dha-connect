"use client";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import React from "react";

const HomeLayout = ({ children }) => {
  return (
    <main>
      <Navbar />
      {children}
      <Footer />
    </main>
  );
};

export default HomeLayout;
