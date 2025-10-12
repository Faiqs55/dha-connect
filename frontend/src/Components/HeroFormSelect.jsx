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
    props.onChange(value);
    setIsOpen(false);
  };

  // For price select, handle min/max changes
  const handlePriceChange = (type, value) => {
    props.onPriceChange(type, value);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Hidden input fields */}
      {!props.isPrice ? (
        <input
          type="hidden"
          name={props.name}
          value={props.value || ""}
        />
      ) : (
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
        <span className="text-sm font-semibold text-gray-500">
          {props.isPrice 
            ? (props.minValue || props.maxValue 
                ? `${props.minValue || "Min"} - ${props.maxValue || "Max"}` 
                : props.label)
            : (props.value || props.label)
          }
        </span>
        {!isOpen && <FaCaretDown />}
        {isOpen && <FaCaretUp />}
      </div>
      
      {/* Dropdown options */}
      {isOpen && (
        <div className="bg-white p-4 absolute z-10 flex flex-col border top-[40px] border-gray-300 w-full rounded-md shadow-lg">
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
          ) : (
            // Regular options list
            props.options.map((option) => (
              <span
                key={option}
                onClick={() => handleOptionClick(option)}
                className="block text-center hover:bg-blue-50 hover:text-blue-500 cursor-pointer py-2 rounded-md text-sm text-gray-400 font-semibold"
              >
                {option}
              </span>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default HeroFormSelect;