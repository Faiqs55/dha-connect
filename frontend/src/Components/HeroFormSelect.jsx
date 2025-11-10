"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";

const HeroFormSelect = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleList = () => {
    setIsOpen(prev => !prev);
  };

  const handleOptionClick = (value) => {
    // Don't set if it's a placeholder option
    if (value.startsWith("Select ") || value === props.label) {
      props.onChange("");
    } else {
      props.onChange(value);
    }
    setIsOpen(false);
  };

  // For price select, handle min/max changes
  const handlePriceChange = (type, value) => {
    props.onPriceChange(type, value);
  };

  // For property type, handle property type change
  const handlePropertyTypeSelect = (type) => {
    props.onPropertyTypeChange(type);
  };

  // Handle type toggles
  const handleHousesToggle = (type) => {
    props.onHousesTypeToggle(type);
  };

  const handlePlotsToggle = (type) => {
    props.onPlotsTypeToggle(type);
  };

  const handleFilesToggle = (type) => {
    props.onFilesTypeToggle(type);
  };

  const handleCommercialToggle = (type) => {
    props.onCommercialTypeToggle(type);
  };

  // Handle reset
  const handleReset = () => {
    props.onReset();
  };

  const getDisplayText = () => {
    if (props.isPrice) {
      return (props.minValue || props.maxValue 
        ? `${props.minValue || "Min"} - ${props.maxValue || "Max"}` 
        : props.label
      );
    } else if (props.isPropertyType) {
      const housesCount = props.selectedHousesTypes.length;
      const plotsCount = props.selectedPlotsTypes.length;
      const filesCount = props.selectedFilesTypes.length;
      const commercialCount = props.selectedCommercialTypes.length;
      
      const totalCount = housesCount + plotsCount + filesCount + commercialCount;
      
      if (totalCount > 0) {
        return `${props.propertyType} (${totalCount} selected)`;
      }
      return props.label;
    } else {
      // Show the actual value (which could be placeholder like "Select Phase")
      return props.value || props.label;
    }
  };

  const isSelected = props.value && !props.value.startsWith("Select ") && props.value !== props.label;

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      {/* Hidden input fields */}
      {!props.isPrice && !props.isPropertyType && (
        <input
          type="hidden"
          name={props.name}
          value={props.value || ""}
        />
      )}
      {props.isPrice && (
        <>
          <input type="hidden" name={`min-${props.name}`} value={props.minValue || ""} />
          <input type="hidden" name={`max-${props.name}`} value={props.maxValue || ""} />
        </>
      )}
      
      {/* Custom select box */}
      <div
        onClick={toggleList}
        className="px-4 py-2 border-gray-300 border rounded-md flex items-center justify-between cursor-pointer"
      >
        <span className={`text-sm font-semibold ${
          // Make placeholder text gray and selected values blue
          (props.isPrice && (props.minValue || props.maxValue)) ||
          (props.isPropertyType && (
            props.selectedHousesTypes.length > 0 || 
            props.selectedPlotsTypes.length > 0 || 
            props.selectedFilesTypes.length > 0 || 
            props.selectedCommercialTypes.length > 0
          )) ||
          (!props.isPrice && !props.isPropertyType && isSelected)
            ? "text-blue-500" 
            : "text-gray-500"
        }`}>
          {getDisplayText()}
        </span>
        {!isOpen && <FaCaretDown className="text-gray-500" />}
        {isOpen && <FaCaretUp className="text-gray-500" />}
      </div>
      
      {/* Dropdown options */}
      {isOpen && (
        <div className="bg-white p-4 absolute z-10 flex flex-col border top-[40px] border-gray-300 w-fit min-w-full rounded-md shadow-lg max-h-96 overflow-y-auto">
          {props.isPrice ? (
            // Price input fields
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500 font-medium">Min Price</label>
                <input
                  type="number"
                  placeholder="Enter min price"
                  value={props.minValue || ""}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500 font-medium">Max Price</label>
                <input
                  type="number"
                  placeholder="Enter max price"
                  value={props.maxValue || ""}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
            </div>
          ) : props.isPropertyType ? (
            // Property type with nested options - UPDATED STRUCTURE
            <div className="space-y-4">
              {/* Property Type Selection */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <button
                  type="button"
                  onClick={() => handlePropertyTypeSelect("Houses")}
                  className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md ${
                    props.propertyType === "Houses" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Houses
                </button>
                {props.category === "Sell" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handlePropertyTypeSelect("Plots")}
                      className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md ${
                        props.propertyType === "Plots" 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Plots
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePropertyTypeSelect("Files")}
                      className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md ${
                        props.propertyType === "Files" 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Files
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handlePropertyTypeSelect("Commercial")}
                  className={`flex-1 py-2 px-2 text-sm font-semibold rounded-md ${
                    props.propertyType === "Commercial" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Commercial
                </button>
              </div>

              {/* Houses Options */}
              {props.propertyType === "Houses" && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">Houses Types</h4>
                  {props.housesTypes.map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={props.selectedHousesTypes.includes(type)}
                        onChange={() => handleHousesToggle(type)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Plots Options */}
              {props.propertyType === "Plots" && props.category === "Sell" && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">Plots Types</h4>
                  {props.plotsTypes.map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={props.selectedPlotsTypes.includes(type)}
                        onChange={() => handlePlotsToggle(type)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Files Options */}
              {props.propertyType === "Files" && props.category === "Sell" && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">Files Types</h4>
                  {props.filesTypes.map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={props.selectedFilesTypes.includes(type)}
                        onChange={() => handleFilesToggle(type)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Commercial Options */}
              {props.propertyType === "Commercial" && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">Commercial Types</h4>
                  {props.commercialTypes.map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={props.selectedCommercialTypes.includes(type)}
                        onChange={() => handleCommercialToggle(type)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md text-sm font-semibold hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          ) : (
            // Regular options list
            <div className="space-y-1">
              {props.options.map((option) => (
                <div
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={`block text-center cursor-pointer py-2 rounded-md text-sm font-semibold ${
                    props.value === option || (!props.value && option === props.label)
                      ? "bg-blue-50 text-blue-500" 
                      : "hover:bg-blue-50 hover:text-blue-500 text-gray-400"
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeroFormSelect;