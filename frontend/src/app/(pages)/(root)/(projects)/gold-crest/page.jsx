"use client"
import React from 'react'

function Goldcrest() {
  return (
    <div className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          
          {/* Text Content */}
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-[#d7903b]">About </span>
              <span className="text-[#0a4a75]">Goldcrest Mall</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-7">
              Goldcrest Mall, located in the heart of DHA Lahore, is a premier
              destination for luxury shopping, dining, and entertainment. With a
              curated selection of top international and local brands, gourmet
              restaurants, it offers a sophisticated and modern experience for all
              visitors. Designed with elegance and convenience in mind, Goldcrest
              Mall is the ultimate hub for leisure and lifestyle in Lahore.
            </p>
          </div>

          {/* Video */}
          <div className="md:w-1/2 w-full">
            <div className="rounded-lg overflow-hidden bg-gray-200">
              <iframe
                src="https://www.youtube.com/embed/YL3XgNbYb6U"
                title="Goldcrest Mall Video Tour"
                className="w-full h-64 md:h-80 lg:h-96"
                allowFullScreen
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Goldcrest