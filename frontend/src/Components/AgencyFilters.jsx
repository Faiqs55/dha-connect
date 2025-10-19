'use client'; // Add this since we're using client-side hooks

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Changed import
import HeroFormSelect from "./HeroFormSelect";

const AgencyFilters = () => {
  const searchParams = useSearchParams(); // No setSearchParams in Next.js
  const router = useRouter();
  
  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    phase: searchParams.get("phase") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    // Use router to update URL instead of setSearchParams
    const newUrl = `?${params.toString()}`;
    router.push(newUrl, { scroll: false }); // scroll: false prevents scrolling to top
  }, [filters, router]);

  const handleSelectChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type === "min" ? "minPrice" : "maxPrice"]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      city: "",
      phase: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
    // Use router to clear URL parameters
    router.push('?', { scroll: false });
  };

  // Filter options
  const cityOptions = [
    "Lahore",
    "Islamabad",
    "Karachi",
    "Multan",
    "Rawalpindi",
    "Faisalabad",
  ];
  const phaseOptions = [
    "Phase 1",
    "Phase 2",
    "Phase 3",
    "Phase 4",
    "Phase 5",
    "Phase 6",
  ];
  const categoryOptions = [
    "Apartments",
    "Houses",
    "Flats",
    "Offices",
    "Plots",
    "Commercial",
  ];

  return (
    <div className="bg-white">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City Filter */}
        <div>
          <HeroFormSelect
            name="city"
            label="Select City"
            value={filters.city}
            options={cityOptions}
            onChange={(value) => handleSelectChange("city", value)}
          />
        </div>

        {/* Phase Filter */}
        <div>
          <HeroFormSelect
            name="phase"
            label="Select Phase"
            value={filters.phase}
            options={phaseOptions}
            onChange={(value) => handleSelectChange("phase", value)}
          />
        </div>

        {/* Category Filter */}
        <div>
          <HeroFormSelect
            name="category"
            label="Select Category"
            value={filters.category}
            options={categoryOptions}
            onChange={(value) => handleSelectChange("category", value)}
          />
        </div>

        {/* Price Filter */}
        <div>
          <HeroFormSelect
            isPrice={true}
            name="price"
            label="Select Price"
            minValue={filters.minPrice}
            maxValue={filters.maxPrice}
            onPriceChange={handlePriceChange}
          />
        </div>
      </div>

      <div className="flex justify-between w-full mt-1.5">
        {/* Active Filters Display */}
        {(filters.city ||
          filters.phase ||
          filters.category ||
          filters.minPrice ||
          filters.maxPrice) && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.city && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                City: {filters.city}
                <button
                  onClick={() => handleSelectChange("city", "")}
                  className="ml-1 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.phase && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Phase: {filters.phase}
                <button
                  onClick={() => handleSelectChange("phase", "")}
                  className="ml-1 hover:text-green-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Category: {filters.category}
                <button
                  onClick={() => handleSelectChange("category", "")}
                  className="ml-1 hover:text-purple-600"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Price: {filters.minPrice || "Min"} - {filters.maxPrice || "Max"}
                <button
                  onClick={() => {
                    handlePriceChange("min", "");
                    handlePriceChange("max", "");
                  }}
                  className="ml-1 hover:text-orange-600"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
        {(filters.city ||
          filters.phase ||
          filters.category ||
          filters.minPrice ||
          filters.maxPrice) && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium justify-self-end"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default AgencyFilters;