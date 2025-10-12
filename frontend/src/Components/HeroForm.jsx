import React, { useState } from "react";
import HeroFormSelect from "./HeroFormSelect";
import { FiSearch } from "react-icons/fi";

const cities = ["Lahore", "Islamabad", "Karachi", "Multan"];
const phases = ["Phase 1", "Phase 2", "Phase 3", "Phase 4"];
const categories = ["Apartments", "Houses", "Flats", "Offices"];

const HeroForm = () => {
  const [type, setType] = useState("Buy");
  const [formData, setFormData] = useState({
    city: "",
    phase: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    keyword: ""
  });

  const typeChangeHandler = (e) => {
    setType(e.target.innerText);
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      [type === 'min' ? 'minPrice' : 'maxPrice']: value
    }));
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      keyword: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData object to get all form values
    const formDataObj = new FormData(e.target);
    const data = Object.fromEntries(formDataObj.entries());
    
    // Combine with the type and log everything
    const allData = {
      type: type,
      ...data
    };
    
    console.log("Form submitted with data:", allData);
    
    // You can now use this data for API calls, etc.
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-[80%] mx-auto bg-white p-5 rounded-md flex flex-col gap-4">
      {/* Hidden input for transaction type */}
      <input type="hidden" name="transactionType" value={type} />
      
      <div className="upper flex gap-5 lg:flex-row flex-col">
        <div className="border border-gray-300 flex rounded-md">
          <span
            onClick={typeChangeHandler}
            className={`px-3 sm:px-6 py-2 font-semibold cursor-pointer block ${
              type === "Buy" ? "bg-blue-50 text-blue-500" : ""
            } m-1 rounded-md`}
          >
            Buy
          </span>
          <span
            onClick={typeChangeHandler}
            className={`px-3 sm:px-6 py-2 font-semibold cursor-pointer block ${
              type === "Rent" ? "bg-blue-50 text-blue-500" : ""
            } m-1 rounded-md`}
          >
            Rent
          </span>
          <span
            onClick={typeChangeHandler}
            className={`px-3 sm:px-6 py-2 font-semibold cursor-pointer block ${
              type === "Required" ? "bg-blue-50 text-blue-500" : ""
            } m-1 rounded-md`}
          >
            Required
          </span>
        </div>
        
        <div className="flex items-center gap-2 flex-1 border border-gray-300 px-5 py-2 rounded-md">
          <FiSearch className="text-xl text-blue-800" />
          <input
            type="text"
            name="keyword"
            value={formData.keyword}
            onChange={handleInputChange}
            className="w-full outline-none"
            placeholder="Search by Keyword"
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-10 rounded-md cursor-pointer py-2"
        >
          Search
        </button>
      </div>
      
      <div className="lower grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <HeroFormSelect 
          name="city"
          label="Select City"
          value={formData.city}
          options={cities}
          onChange={(value) => handleSelectChange('city', value)}
        />
        
        <HeroFormSelect 
          name="phase"
          label="Select Phase"
          value={formData.phase}
          options={phases}
          onChange={(value) => handleSelectChange('phase', value)}
        />
        
        <HeroFormSelect 
          name="category"
          label="Select Category"
          value={formData.category}
          options={categories}
          onChange={(value) => handleSelectChange('category', value)}
        />
        
        {/* Price select with min/max inputs */}
        <HeroFormSelect 
          isPrice={true}
          name="price"
          label="Select Price"
          minValue={formData.minPrice}
          maxValue={formData.maxPrice}
          onPriceChange={handlePriceChange}
        />
      </div>
    </form>
  );
};

export default HeroForm;