import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const PropertyDetail = () => {
  const [mainImage, setMainImage] = useState(
    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const images = [
    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
    "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* LEFT SIDE */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          2 Kanal Residential Plot for Sale in Sector D - Phase 9 Prism, Lahore (DP-40057)
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center text-sm text-gray-500 mt-3 gap-x-3">
          <span className="font-medium text-gray-700">Rana Ahtesham</span>
          <span>•</span>
          <span>October 13, 2025</span>
          <span>•</span>
          <span>Phase 9 Prism, Lahore</span>
        </div>

        {/* IMAGE GALLERY */}
        <div className="mt-6">
          <motion.div
            className="overflow-hidden rounded-2xl shadow-md relative"
            whileHover={{ scale: 1.01 }}
          >
            <img
              src={mainImage}
              alt="Main Property"
              className="w-full h-[450px] object-cover rounded-2xl transition-all duration-500"
            />
          </motion.div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4">
            {images.map((img, index) => (
              <motion.img
                whileHover={{ scale: 1.05 }}
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setMainImage(img)}
                className={`w-24 h-24 object-cover rounded-xl cursor-pointer border-2 transition ${
                  mainImage === img
                    ? "border-blue-600"
                    : "border-transparent hover:border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 🗺 Property Location (Map Section) */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Explore Location 📍
          </h2>
          <div className="w-full h-[350px] rounded-2xl overflow-hidden shadow-md">
            <iframe
              title="Property Location Map"
              src="https://www.google.com/maps?q=DHA%20Phase%209%20Prism%20Lahore&output=embed"
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              className="w-full h-full border-0 rounded-2xl"
            ></iframe>
          </div>
        </div>

        {/* Property Info */}
        <div className="mt-10 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Property Overview
          </h2>
          <p className="text-gray-600 leading-relaxed">
            This is a premium 2 Kanal residential plot in DHA Phase 9 Prism, Sector D.
            Possession-ready, ideal for investment or residential construction.
            Surrounded by well-developed infrastructure and community facilities.
          </p>

          {/* Key Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Plot Size", value: "2 Kanal" },
              { title: "Location", value: "Phase 9 Prism, Lahore" },
              { title: "Status", value: "Available" },
              { title: "Price", value: "PKR 5 Crore" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gradient-to-r from-blue-50 to-white border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
              >
                <p className="text-gray-800 font-semibold">{item.title}</p>
                <p className="text-gray-600 text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Video Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Property Video Tour 🎥
          </h2>

          <div className="relative w-full h-[350px] rounded-2xl overflow-hidden shadow-md group">
            {!isPlaying && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition cursor-pointer"
                onClick={() => setIsPlaying(true)}
              >
                <img
                  src="https://img.youtube.com/vi/eVVLhThhYVo/maxresdefault.jpg"
                  alt="Property Video Thumbnail"
                  className="w-full h-full object-cover"
                />
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Play className="w-20 h-20 text-white opacity-90 hover:scale-110 transition-transform" />
                </motion.div>
              </div>
            )}

            {isPlaying && (
              <iframe
                className="w-full h-full rounded-2xl"
                src="https://www.youtube.com/embed/eVVLhThhYVo?autoplay=1&mute=0"
                title="Architectural Documentary | The Light House"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>

        {/* Property Features */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Features & Amenities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Gated Community",
              "24/7 Security",
              "Nearby Schools",
              "Parks & Green Belts",
              "Carpeted Roads",
              "Commercial Area Access",
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition"
              >
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <p className="text-gray-700 text-sm font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="space-y-8">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <img
            src="https://i.pravatar.cc/120?img=68"
            alt="Agent"
            className="w-24 h-24 rounded-full mx-auto border-4 border-blue-100 shadow"
          />
          <h3 className="mt-3 text-lg font-semibold text-gray-800">
            Rana Ahtesham
          </h3>
          <p className="text-sm text-gray-500">CEO, DHA Plus</p>
          <div className="flex justify-center gap-3 mt-5">
            <button className="px-4 py-2 border rounded-full hover:bg-blue-600 hover:text-white transition">
              Call Now
            </button>
            <button className="px-4 py-2 border border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition">
              WhatsApp
            </button>
          </div>
        </div>

        {/* Related Properties */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Related Hot Properties
          </h3>
          {[...images.slice(1, 3)].map((img, i) => (
            <div
              key={i}
              className="flex gap-3 mb-4 items-center hover:bg-gray-50 p-2 rounded-lg transition"
            >
              <img
                src={img}
                alt="Property"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h4 className="text-sm font-semibold text-gray-800 leading-snug">
                  1 Kanal Plot for Sale in Phase 9 Prism, Lahore
                </h4>
                <p className="text-xs text-gray-500 mt-1">by Rana Ahtesham</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;