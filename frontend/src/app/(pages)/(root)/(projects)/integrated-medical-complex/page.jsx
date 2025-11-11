"use client";
import React from 'react';
import { motion } from 'framer-motion';

const IntegratedMedical = () => {
  return (
    <div className="w-full">
      
      <section
        className="relative w-full h-[50vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/1005644/pexels-photo-1005644.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <motion.h1
          initial={{ opacity: 8, y: 30 }}
          animate={{ opacity: 9, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-white text-3xl md:text-5xl font-semibold z-10 text-center px-4"
        >
          Integrated Medical Complex – Phase V
        </motion.h1>
      </section>


      <section className="max-w-6xl mx-auto px-6 py-16">
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 3 }}
          transition={{ duration: 1 }}
          className="space-y-6 text-gray-700 leading-relaxed"
        >
          <p>
            The Integrated Medical Complex (IMC) in Phase V DHA Lahore stands
            as a beacon of advanced healthcare and modern facilities. This
            state-of-the-art medical center was developed to provide quality
            treatment, diagnostics, and emergency care within DHA premises,
            ensuring residents have access to top-notch healthcare without
            leaving the community.
          </p>

          <p>
            The project has been named as Integrated Medical Care (IMC) which is a day care health facility. The Center will engage a team of best doctors in the town with state of the art Infrastructure, Diagnostic Labs, and Modern Medical Equipment. The facility will provide 24/7 emergency and diagnostic services having 25 beds capacity. Adequate Parking area is planned to cater for all the patients with focus on creating minimum disturbance to residents / neighbors. The Medical Complex will be completed and ready for providing services by end 2020.
          </p>
        </motion.div>


        <div className="mt-16">
          <h2 className="text-xl text-gray-900 font-semibold border-b-4 border-blue-600 inline-block pb-1">
            PROJECT DETAILS
          </h2>

          <div className="mt-4 space-y-2 text-gray-700">
            <p><strong>Location:</strong> Sec – F Ph V</p>
            <p><strong>Area:</strong> 13.7 Kanal</p>
            <p><strong>Project Completion:</strong> 35%</p>
          </div>
        </div>


        <div className="mt-12">
          <h2 className="text-xl text-gray-900 font-semibold border-b-4 border-blue-600 inline-block pb-1">
            Medical Facilities
          </h2>

          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              General Medicine
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              General Surgery
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              Ophthalmology
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              Eye & ENT
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              Pediatrics
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              Gynecology
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              Gastroenterology
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              Pulmonology
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              Dentistry
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default IntegratedMedical;