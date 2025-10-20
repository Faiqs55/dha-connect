
import React, { useState } from "react";
import HeroFormSelect from "./HeroFormSelect";
import { FiSearch } from "react-icons/fi";

const cities = ["Lahore", "Islamabad", "Karachi", "Multan"];
const phases = ["Phase 1", "Phase 2", "Phase 3", "Phase 4", "Phase 5", "Phase 6", "Phase 7", "Phase 8"];

const residentialTypesBuy = ["Plots", "House", "File", "Apartments"];
const residentialTypesRent = ["Apartments", "Villa", "Apartments", "House"];
const commercialTypes = ["Office", "Shop", "Warehouse", "Building"];
const paymentPlans = ["Yearly", "Monthly", "Weekly", "Daily", "Other"];
const buySubTypes = ["All", "Ready", "Off-Plan"];

const HeroForm = () => {
  const [type, setType] = useState("Buy");
  const [formData, setFormData] = useState({
    city: "",
    phase: "",
    propertyType: "Residential",
    subType: "",
    minPrice: "",
    maxPrice: "",
    keyword: "",
    paymentPlan: "",
    buySubType: "All"
  });

  const [selectedResidentialTypes, setSelectedResidentialTypes] = useState([]);
  const [selectedCommercialTypes, setSelectedCommercialTypes] = useState([]);

  const typeChangeHandler = (e) => {
    const newType = e.target.innerText;
    setType(newType);
    
    // Reset property type selections when changing transaction type
    if (newType !== type) {
      setSelectedResidentialTypes([]);
      setSelectedCommercialTypes([]);
      setFormData(prev => ({
        ...prev,
        propertyType: "Residential",
        subType: "",
        paymentPlan: "",
        buySubType: "All"
      }));
    }
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

  const handlePropertyTypeChange = (propertyType) => {
    setFormData(prev => ({
      ...prev,
      propertyType,
      subType: "" // Reset subType when changing property type
    }));
  };

  const handleResidentialTypeToggle = (residentialType) => {
    setSelectedResidentialTypes(prev => {
      if (prev.includes(residentialType)) {
        return prev.filter(item => item !== residentialType);
      } else {
        return [...prev, residentialType];
      }
    });
  };

  const handleCommercialTypeToggle = (commercialType) => {
    setSelectedCommercialTypes(prev => {
      if (prev.includes(commercialType)) {
        return prev.filter(item => item !== commercialType);
      } else {
        return [...prev, commercialType];
      }
    });
  };

  const resetPropertyTypes = () => {
    setSelectedResidentialTypes([]);
    setSelectedCommercialTypes([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create query parameters object
    const queryParams = new URLSearchParams();
    
    // Add basic form data
    queryParams.append('transactionType', type);
    queryParams.append('city', formData.city);
    queryParams.append('phase', formData.phase);
    queryParams.append('minPrice', formData.minPrice);
    queryParams.append('maxPrice', formData.maxPrice);
    queryParams.append('keyword', formData.keyword);
    
    // Add type-specific parameters
    if (type === 'Buy') {
      queryParams.append('buySubType', formData.buySubType);
    } else if (type === 'Rent') {
      queryParams.append('paymentPlan', formData.paymentPlan);
    }
    
    // Add property type parameters
    queryParams.append('propertyType', formData.propertyType);
    
    // Add selected subtypes as arrays
    if (selectedResidentialTypes.length > 0) {
      selectedResidentialTypes.forEach(type => {
        queryParams.append('residentialTypes', type);
      });
    }
    
    if (selectedCommercialTypes.length > 0) {
      selectedCommercialTypes.forEach(type => {
        queryParams.append('commercialTypes', type);
      });
    }
    
    console.log("Form submitted with query parameters:", Object.fromEntries(queryParams));
    
    // You can now use queryParams.toString() for API calls or navigation
    // Example: `/properties?${queryParams.toString()}`
    
    // For now, we'll just log the URL
    const searchUrl = `/properties?${queryParams.toString()}`;
    console.log("Search URL:", searchUrl);
    
    // You can redirect to this URL or use it for API calls
    // window.location.href = searchUrl;
  };

  const handleBuySubTypeChange = (subType) => {
    setFormData(prev => ({
      ...prev,
      buySubType: subType
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full xl:w-[85%] mx-auto bg-white p-5 rounded-md flex flex-col gap-4">
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
          className="bg-[#114085] text-white font-semibold px-10 rounded-md cursor-pointer py-2"
        >
          Search
        </button>
      </div>
      
      <div className="lower grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Conditionally render filters based on transaction type */}
        {type === "Buy" && (
          <div className="border border-gray-300 flex rounded-md">
            {buySubTypes.map(subType => (
              <span
                key={subType}
                onClick={() => handleBuySubTypeChange(subType)}
                className={`px-3 text-xs sm:px-0 py-0 font-semibold cursor-pointer flex items-center flex-1 justify-center ${
                  formData.buySubType === subType ? "bg-blue-50 text-blue-500" : ""
                } m-1 rounded-md text-center`}
              >
                {subType}
              </span>
            ))}
          </div>
        )}
        
        {type === "Rent" && (
          <HeroFormSelect 
            name="paymentPlan"
            label="Select Payment Plan"
            value={formData.paymentPlan}
            options={paymentPlans}
            onChange={(value) => handleSelectChange('paymentPlan', value)}
          />
        )}
        
        <HeroFormSelect 
          name="phase"
          label="Select Phase"
          value={formData.phase}
          options={phases}
          onChange={(value) => handleSelectChange('phase', value)}
        />
        
        {/* Property Type Select with nested dropdown */}
        <HeroFormSelect 
          isPropertyType={true}
          name="propertyType"
          label="Select Type"
          propertyType={formData.propertyType}
          residentialTypes={type === "Buy" ? residentialTypesBuy : residentialTypesRent}
          commercialTypes={commercialTypes}
          selectedResidentialTypes={selectedResidentialTypes}
          selectedCommercialTypes={selectedCommercialTypes}
          onPropertyTypeChange={handlePropertyTypeChange}
          onResidentialTypeToggle={handleResidentialTypeToggle}
          onCommercialTypeToggle={handleCommercialTypeToggle}
          onReset={resetPropertyTypes}
        />
        
        {/* Price Section */}
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