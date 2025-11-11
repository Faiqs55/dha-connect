"use client";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import HeroFormSelect from "./HeroFormSelect";

/* ---------- static options ---------- */
const phases = Array.from({ length: 10 }, (_, i) => `Phase ${i + 1}`);
const paymentPlans = ["Yearly", "Monthly", "Weekly", "Daily", "Other"];

// All types and subtypes according to your property model and add property form
const housesTypesSell = ["Home", "Flat", "Farm House", "Pent House"];
const housesTypesRent = ["Home", "Flat", "Upper Portion", "Lower Portion", "Farm House", "Room", "PentHouse"];
const housesTypesProject = ["Home", "Flat", "Farm House", "PentHouse"];
const plotsTypes = ["Residential Plot", "Commercial Plot"];
const filesTypes = ["Affidavit", "Allocation"];
const commercialTypes = ["Office", "Shop", "Building", "Other"];

// Map UI types to database types and sub-types
const typeMapping = {
  // Houses types for Buy (Sell in database)
  "Home": { type: "Houses", subType: "Home" },
  "Flat": { type: "Houses", subType: "Flat" },
  "Farm House": { type: "Houses", subType: "Farm House" },
  "Pent House": { type: "Houses", subType: "Pent House" },
  
  // Houses types for Rent
  "Upper Portion": { type: "Houses", subType: "Upper Portion" },
  "Lower Portion": { type: "Houses", subType: "Lower Portion" },
  "Room": { type: "Houses", subType: "Room" },
  "PentHouse": { type: "Houses", subType: "PentHouse" },
  
  // Plots types for Buy (Sell in database)
  "Residential Plot": { type: "Plots", subType: "Residential Plot" },
  "Commercial Plot": { type: "Plots", subType: "Commercial Plot" },
  
  // Files types for Buy (Sell in database)
  "Affidavit": { type: "Files", subType: "Affidavit" },
  "Allocation": { type: "Files", subType: "Allocation" },
  
  // Commercial types for all categories
  "Office": { type: "Commercial", subType: "Office" },
  "Shop": { type: "Commercial", subType: "Shop" },
  "Building": { type: "Commercial", subType: "Building" },
  "Other": { type: "Commercial", subType: "Other" }
};

const emptyForm = {
  category: "",
  title: "",
  phase: "",
  propertyType: "Select Type",
  subType: "",
  minPrice: "",
  maxPrice: "",
  paymentPlan: "Payment Plan",
  selectedHouses: [],
  selectedPlots: [],
  selectedFiles: [],
  selectedCommercial: [],
};

export default function HeroForm() {
  const [category, setCategory] = useState("Buy");
  const [form, setForm] = useState(emptyForm);

  /* ---------- generic field ---------- */
  const handleChange = (name, value) =>
    setForm((f) => ({ ...f, [name]: value }));

  /* ---------- price ---------- */
  const handlePrice = (t, v) =>
    setForm((f) => ({ ...f, [t === "min" ? "minPrice" : "maxPrice"]: v }));

  /* ---------- property type toggles ---------- */
  const toggleHouses = (t) =>
    setForm((f) => ({
      ...f,
      selectedHouses: f.selectedHouses.includes(t)
        ? f.selectedHouses.filter((i) => i !== t)
        : [...f.selectedHouses, t],
    }));
  
  const togglePlots = (t) =>
    setForm((f) => ({
      ...f,
      selectedPlots: f.selectedPlots.includes(t)
        ? f.selectedPlots.filter((i) => i !== t)
        : [...f.selectedPlots, t],
    }));

  const toggleFiles = (t) =>
    setForm((f) => ({
      ...f,
      selectedFiles: f.selectedFiles.includes(t)
        ? f.selectedFiles.filter((i) => i !== t)
        : [...f.selectedFiles, t],
    }));
  
  const toggleCommercial = (t) =>
    setForm((f) => ({
      ...f,
      selectedCommercial: f.selectedCommercial.includes(t)
        ? f.selectedCommercial.filter((i) => i !== t)
        : [...f.selectedCommercial, t],
    }));

  /* ---------- category change ---------- */
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    // Convert "Buy" to "Sell" for form state to match database
    setForm({ 
      ...emptyForm, 
      category: newCategory === "Buy" ? "Sell" : newCategory 
    });
  };

  /* ---------- submit ---------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    const q = new URLSearchParams();

    // Helper to check if value is different from default/placeholder
    const isTouched = (val, defaultValue) => 
      val && String(val).trim() !== "" && val !== defaultValue;

    // Add category (already converted to "Sell" for "Buy")
    if (form.category) {
      q.set("category", form.category);
    }

    // Add other filters only if they have values
    if (isTouched(form.phase, "Select Phase")) q.set("phase", form.phase);
    if (form.title) q.set("title", form.title);
    if (form.minPrice) q.set("minPrice", form.minPrice);
    if (form.maxPrice) q.set("maxPrice", form.maxPrice);

    // Handle property types and sub-types
    // Houses
    if (form.selectedHouses.length > 0) {
      form.selectedHouses.forEach((uiType) => {
        const mapping = typeMapping[uiType];
        if (mapping) {
          q.append("type", mapping.type);
          q.append("subType", mapping.subType);
        }
      });
    }

    // Plots (only for Sell/Buy)
    if (form.category === "Sell" && form.selectedPlots.length > 0) {
      form.selectedPlots.forEach((uiType) => {
        const mapping = typeMapping[uiType];
        if (mapping) {
          q.append("type", mapping.type);
          q.append("subType", mapping.subType);
        }
      });
    }

    // Files (only for Sell/Buy)
    if (form.category === "Sell" && form.selectedFiles.length > 0) {
      form.selectedFiles.forEach((uiType) => {
        const mapping = typeMapping[uiType];
        if (mapping) {
          q.append("type", mapping.type);
          q.append("subType", mapping.subType);
        }
      });
    }

    // Commercial
    if (form.selectedCommercial.length > 0) {
      form.selectedCommercial.forEach((uiType) => {
        const mapping = typeMapping[uiType];
        if (mapping) {
          q.append("type", mapping.type);
          q.append("subType", mapping.subType);
        }
      });
    }

    // Payment plan for Rent
    if (form.category === "Rent" && isTouched(form.paymentPlan, "Payment Plan")) {
      q.set("paymentPlan", form.paymentPlan);
    }

    // Build final URL
    const queryString = q.toString();
    window.location.href = `/properties${queryString ? "?" + queryString : ""}`;
  };

  // Get houses types based on category
  const getHousesTypes = () => {
    switch (category) {
      case "Buy":
        return housesTypesSell;
      case "Rent":
        return housesTypesRent;
      case "Project":
        return housesTypesProject;
      default:
        return housesTypesSell;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full xl:w-[85%] mx-auto bg-white p-5 rounded-md flex flex-col gap-4">
      {/* ---------- category switch ---------- */}
      <div className="upper flex gap-5 lg:flex-row flex-col">
        <div className="border border-gray-300 flex rounded-md">
          {["Buy", "Rent", "Project"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 sm:px-6 py-2 font-semibold cursor-pointer m-1 rounded-md ${
                category === cat ? "bg-blue-50 text-blue-500" : ""
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-1 border border-gray-300 px-5 py-2 rounded-md">
          <FiSearch className="text-xl text-blue-800" />
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full outline-none"
            placeholder="Search by Keyword"
          />
        </div>

        <button
          type="submit"
          className="bg-[#114085] text-white font-semibold px-10 rounded-md py-2"
        >
          Search
        </button>
      </div>

      {/* ---------- filters ---------- */}
      <div className="lower flex gap-5 lg:flex-row flex-col">
        <HeroFormSelect
          name="phase"
          label="Select Phase"
          value={form.phase}
          onChange={(v) => handleChange("phase", v)}
          options={["Select Phase", ...phases]}
        />

        {/* Payment plan only for Rent */}
        {(form.category === "Rent") && (
          <HeroFormSelect
            name="paymentPlan"
            label="Payment Plan"
            value={form.paymentPlan}
            onChange={(v) => handleChange("paymentPlan", v)}
            options={["Payment Plan", ...paymentPlans]}
          />
        )}

        {/* Property type selector */}
        <HeroFormSelect
          isPropertyType
          name="propertyType"
          label="Select Type"
          propertyType={form.propertyType}
          housesTypes={getHousesTypes()}
          plotsTypes={plotsTypes}
          filesTypes={filesTypes}
          commercialTypes={commercialTypes}
          selectedHousesTypes={form.selectedHouses}
          selectedPlotsTypes={form.selectedPlots}
          selectedFilesTypes={form.selectedFiles}
          selectedCommercialTypes={form.selectedCommercial}
          onPropertyTypeChange={(t) => handleChange("propertyType", t)}
          onHousesTypeToggle={toggleHouses}
          onPlotsTypeToggle={togglePlots}
          onFilesTypeToggle={toggleFiles}
          onCommercialTypeToggle={toggleCommercial}
          onReset={() =>
            setForm((f) => ({ 
              ...f, 
              selectedHouses: [], 
              selectedPlots: [], 
              selectedFiles: [], 
              selectedCommercial: [] 
            }))
          }
          category={form.category}
        />

        {/* Price range */}
        <HeroFormSelect
          isPrice
          name="price"
          label="Price Range"
          minValue={form.minPrice}
          maxValue={form.maxPrice}
          onPriceChange={handlePrice}
        />
      </div>
    </form>
  );
}