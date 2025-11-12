"use client";
import React, { useEffect, useState } from "react";
import ContainerCenter from "@/Components/ContainerCenter";
import WidgetSearchFrom from "@/Components/WidgetSearchFrom";
import { FaRegEnvelope, FaFilter } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import PropertiesCard from "@/Components/PropertiesCard";
import { useSearchParams, useRouter } from "next/navigation";
import Spinner from "@/Components/Spinner";
import propertyService from "@/services/property.service";
import PropertyPageCard from "@/Components/PropertyPageCard";

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filters, setFilters] = useState(null);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    phase: "",
    type: "",
    subType: "",
    paymentPlan: "",
    minPrice: "",
    maxPrice: ""
  });

  // Get navbar height for proper sticky positioning
  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.querySelector('header');
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }
    };

    // Initial calculation
    updateNavbarHeight();

    // Recalculate on resize
    window.addEventListener('resize', updateNavbarHeight);
    
    // Recalculate when DOM is fully loaded
    const timer = setTimeout(updateNavbarHeight, 100);
    
    return () => {
      window.removeEventListener('resize', updateNavbarHeight);
      clearTimeout(timer);
    };
  }, []);

  // Initialize form from URL params
  useEffect(() => {
    const initialFilters = {};
    const initialFormData = {
      category: "",
      title: "",
      phase: "",
      type: "",
      subType: "",
      paymentPlan: "",
      minPrice: "",
      maxPrice: ""
    };

    for (let [key, value] of searchParams.entries()) {
      initialFilters[key] = value;
      if (key in initialFormData) {
        initialFormData[key] = value;
      }
    }
    
    setFilters(initialFilters);
    setFormData(initialFormData);
  }, [searchParams]);

  // Fetch properties when filters change - ALWAYS include status=available
  useEffect(() => {
    if (filters) {
      setLoading(true);
      
      // Create enhanced filters that always include status=available
      const enhancedFilters = {
        ...filters,
        status: "available" // Always add status filter internally
      };
      
      propertyService
        .getAllProperties(enhancedFilters)
        .then((res) => {
          if (res.success) setAllProperties(res.data);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }
  }, [filters]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset subType when type changes
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        subType: ""
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build query string from form data (EXCLUDING status)
    const queryParams = new URLSearchParams();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value && value !== "") {
        // Convert "Buy" to "Sell" for backend
        if (key === 'category' && value === 'Buy') {
          queryParams.append('category', 'Sell');
        } else {
          queryParams.append(key, value);
        }
      }
    });

    // Update URL with new filters (without status)
    const queryString = queryParams.toString();
    router.push(`/properties${queryString ? `?${queryString}` : ''}`);
    
    // Close mobile filters on submit
    setShowMobileFilters(false);
  };

  // Reset all filters
  const handleReset = () => {
    setFormData({
      category: "",
      title: "",
      phase: "",
      type: "",
      subType: "",
      paymentPlan: "",
      minPrice: "",
      maxPrice: ""
    });
    router.push('/properties');
    setShowMobileFilters(false);
  };

  // Get available subtypes based on type and category
  const getSubTypes = () => {
    const { type, category } = formData;
    
    if (type === "Houses") {
      if (category === "Buy" || category === "Sell") {
        return ["Home", "Flat", "Farm House", "Pent House"];
      } else if (category === "Rent") {
        return ["Home", "Flat", "Upper Portion", "Lower Portion", "Farm House", "Room", "PentHouse"];
      } else { // Project
        return ["Home", "Flat", "Farm House", "PentHouse"];
      }
    } else if (type === "Plots") {
      return ["Residential Plot", "Commercial Plot"];
    } else if (type === "Files") {
      return ["Affidavit", "Allocation"];
    } else if (type === "Commercial") {
      return ["Office", "Shop", "Building", "Other"];
    }
    return [];
  };

  // Generate phase options
  const phaseOptions = Array.from({ length: 10 }, (_, i) => `Phase ${i + 1}`);

  // Count active filters
  const activeFiltersCount = Object.values(formData).filter(value => value !== "").length;

  return (
    <>
      {filters ? (
        <>
          {/* HERO - Improved responsive padding */}
          <div className="px-4 sm:px-5 py-4 sm:py-5">
            <div className="w-full hero rounded-xl py-12 sm:py-16 md:py-20 lg:py-24">
              <ContainerCenter className={`flex flex-col`}>
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold text-shadow capitalize text-center px-4">
                  {formData.category
                    ? formData.category === "Buy"
                      ? "Buy"
                      : formData.category
                    : "All"}{" "}
                  Properties in DHA Lahore
                </h1>
                <p className="text-white text-base sm:text-lg mt-3 sm:mt-4 text-center opacity-90 max-w-2xl mx-auto px-4">
                  Find your perfect property with advanced search filters
                </p>
              </ContainerCenter>
            </div>
          </div>

          {/* MAIN SECTION - Improved responsive spacing */}
          <div className="main mt-6 sm:mt-8 lg:mt-10">
            <ContainerCenter className={`flex flex-col xl:flex-row gap-4 sm:gap-5 lg:gap-6`}>
              {/* LEFT - SEARCH FORM */}
              <div className="w-full xl:w-80 flex-shrink-0">
                {/* Mobile Filter Toggle - Improved styling */}
                <div className="xl:hidden mb-4">
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg px-4 py-3 flex items-center justify-center gap-3 transition-all duration-200 shadow-lg active:scale-95"
                  >
                    <FaFilter className="text-sm" />
                    {showMobileFilters ? "Hide Filters" : "Show Filters"}
                    {activeFiltersCount > 0 && (
                      <span className="bg-white text-blue-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold min-w-6">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Mobile Filter Overlay - Improved UX */}
                {showMobileFilters && (
                  <div className="xl:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300">
                    <div 
                      className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white overflow-y-auto transform transition-transform duration-300 ${
                        showMobileFilters ? 'translate-x-0' : 'translate-x-full'
                      }`}
                    >
                      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm z-10">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Search Filters</h3>
                          {activeFiltersCount > 0 && (
                            <p className="text-gray-600 text-sm mt-1">
                              {activeFiltersCount} active filter{activeFiltersCount !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => setShowMobileFilters(false)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:bg-gray-200"
                          aria-label="Close filters"
                        >
                          <FaTimes className="text-gray-600 text-lg" />
                        </button>
                      </div>
                      <div className="p-4 pb-6">
                        <SearchFormContent 
                          formData={formData}
                          handleInputChange={handleInputChange}
                          handleSubmit={handleSubmit}
                          handleReset={handleReset}
                          getSubTypes={getSubTypes}
                          phaseOptions={phaseOptions}
                          isMobile={true}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Desktop Search Form - Improved sticky with navbar consideration */}
                <div 
                  className="hidden xl:block sticky"
                  style={{ top: `${navbarHeight + 20}px` }}
                >
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="p-4">
                      <SearchFormContent 
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        handleReset={handleReset}
                        getSubTypes={getSubTypes}
                        phaseOptions={phaseOptions}
                        isMobile={false}
                      />
                    </div>
                  </div>

                  {/* Additional Widgets */}
                  <div className="mt-6 space-y-6">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                      <WidgetSearchFrom />
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-100 p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Need Help?</h3>
                      <p className="text-gray-600 mb-4">
                        Our team is here to help you find your perfect property.
                      </p>
                      <a
                        href="/contact"
                        className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg px-4 py-3 flex items-center justify-center gap-3 transition-all duration-200 active:scale-95"
                      >
                        <FaRegEnvelope />
                        Contact Us
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT - PROPERTIES LIST - Improved responsive grid */}
              <div className="flex-1 min-w-0">
                {/* Results Header - Improved responsive layout */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 capitalize truncate">
                        {formData.category
                          ? formData.category === "Buy"
                            ? "Buy"
                            : formData.category
                          : "All"}{" "}
                        Properties
                      </h2>
                      <p className="text-gray-600 mt-1 text-sm sm:text-base">
                        {allProperties.length} available property{allProperties.length !== 1 ? 'ies' : ''} found
                        {activeFiltersCount > 0 && " with current filters"}
                      </p>
                    </div>
                    
                    {/* Quick Actions - Improved responsive buttons */}
                    <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                      <button
                        onClick={() => setShowMobileFilters(true)}
                        className="xl:hidden bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg px-3 sm:px-4 py-2 flex items-center gap-2 transition-colors active:bg-gray-300 text-sm sm:text-base"
                      >
                        <FaFilter className="text-xs sm:text-sm" />
                        <span className="hidden sm:inline">Filters</span>
                      </button>
                      {activeFiltersCount > 0 && (
                        <button
                          onClick={handleReset}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg px-3 sm:px-4 py-2 transition-colors active:bg-gray-300 text-sm sm:text-base whitespace-nowrap"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="flex justify-center items-center py-12 sm:py-16">
                    <div className="text-center">
                      <Spinner />
                      <p className="text-gray-600 mt-4 text-sm sm:text-base">Searching available properties...</p>
                    </div>
                  </div>
                )}

                {/* Properties List - Improved responsive grid */}
                {!loading && allProperties && allProperties.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                    {allProperties.map((data) => (
                      <PropertyPageCard key={data._id} data={data} />
                    ))}
                  </div>
                ) : (
                  !loading && (
                    <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                      <div className="max-w-md mx-auto px-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                          <FaSearch className="text-gray-400 text-xl sm:text-2xl" />
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">No Available Properties Found</h3>
                        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                          {activeFiltersCount > 0 
                            ? "Try adjusting your search criteria to find more available properties."
                            : "There are currently no available properties. Please check back later."
                          }
                        </p>
                        {activeFiltersCount > 0 && (
                          <button
                            onClick={handleReset}
                            className="bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg px-6 py-3 transition-all duration-200 active:scale-95 text-sm sm:text-base"
                          >
                            Browse All Available Properties
                          </button>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </ContainerCenter>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner />
        </div>
      )}
    </>
  );
};

// Improved SearchFormContent with better responsive design
const SearchFormContent = ({ 
  formData, 
  handleInputChange, 
  handleSubmit, 
  handleReset, 
  getSubTypes, 
  phaseOptions,
  isMobile 
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm sm:text-base"
        >
          <option value="">All Categories</option>
          <option value="Buy">Buy</option>
          <option value="Rent">Rent</option>
          <option value="Project">Project</option>
        </select>
      </div>

      {/* Keyword Search */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Keyword Search</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter property title or keywords"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm sm:text-base"
        />
      </div>

      {/* Phase */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Phase</label>
        <select
          name="phase"
          value={formData.phase}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm sm:text-base"
        >
          <option value="">All Phases</option>
          {phaseOptions.map(phase => (
            <option key={phase} value={phase}>{phase}</option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm sm:text-base"
        >
          <option value="">All Types</option>
          <option value="Houses">Houses</option>
          <option value="Plots">Plots</option>
          <option value="Files">Files</option>
          <option value="Commercial">Commercial</option>
        </select>
      </div>

      {/* Sub Type */}
      {formData.type && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sub Type</label>
          <select
            name="subType"
            value={formData.subType}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm sm:text-base"
          >
            <option value="">All Sub Types</option>
            {getSubTypes().map(subType => (
              <option key={subType} value={subType}>{subType}</option>
            ))}
          </select>
        </div>
      )}

      {/* Payment Plan (Only for Rent) */}
      {formData.category === "Rent" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Plan</label>
          <select
            name="paymentPlan"
            value={formData.paymentPlan}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm sm:text-base"
          >
            <option value="">Any Payment Plan</option>
            <option value="Yearly">Yearly</option>
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
            <option value="Daily">Daily</option>
            <option value="Other">Other</option>
          </select>
        </div>
      )}

      {/* Price Range - Improved Responsive Layout */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Price Range (PKR)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <input
              type="number"
              name="minPrice"
              value={formData.minPrice}
              onChange={handleInputChange}
              placeholder="Min Price"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm sm:text-base"
            />
          </div>
          <div>
            <input
              type="number"
              name="maxPrice"
              value={formData.maxPrice}
              onChange={handleInputChange}
              placeholder="Max Price"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Form Buttons - Improved mobile layout */}
      <div className={`flex gap-3 pt-4 ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'}`}>
        <button
          type="submit"
          className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 text-sm sm:text-base"
        >
          Filter
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 text-sm sm:text-base"
        >
          Reset Filters
        </button>
      </div>
    </form>
  );
};

export default Page;