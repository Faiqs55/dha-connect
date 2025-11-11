"use client";
import React from "react";

const HallyTower = () => {
  return (
    <div className="w-full text-gray-800">
      
      <div
        className="relative bg-cover bg-center h-[400px] flex flex-col justify-center items-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1005644/pexels-photo-1005644.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        }}
      >
        <div className="absolute inset-0 bg-white/40"></div>
        
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-3">
            <span className="text-blue-600 font-bold">HALLY</span> TOWER
          </h1>
          
          <div className="text-sm text-gray-700 bg-white/80 px-4 py-2 rounded inline-block">
            You are here: <span className="hover:text-blue-600 cursor-pointer">Home</span> » 
            <span className="text-gray-900 font-medium"> HALLY TOWER</span>
          </div>
        </div>
      </div>


      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-gray-700 leading-7">
          <p className="mb-6">
            Hally Tower is a gigantic project based on synergy which is situated at prime location of
            Lalak Jan Chowk, Sector-R, Phase-II. This elegant epitome is a gainful commercial building
            that includes Shopping Mall, Food Court, Play Area and Corporate Offices. Equipped with
            highly maintained common areas and central fire safety system, this complex can be called
            an appealing commercial and business centre.
          </p>
          
          <p className="mb-6">
            The tower has a total area of 100,000 sqft giving rise to 17 floors. The dedicated 
            8 floors encompass 119 offices. The ample car parking comprises of four basements. 
            The process of occupancy by the tenants of shops and offices is continued and the 
            project can be officially launched at any moment. The shopaholics will enjoy under 
            one roof shopping at the drop of the hat.
          </p>
        </div>

    
        <div className="mt-10 bg-gray-50 p-6 rounded border-l-4 border-blue-600">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            PROJECT DETAILS
          </h2>
          
          <div className="space-y-2">
            <div className="flex">
              <span className="font-medium text-gray-800 w-40">Covered Area:</span>
              <span>5,02,000 sft</span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-800 w-40">Progress:</span>
              <span className="text-green-600">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HallyTower;