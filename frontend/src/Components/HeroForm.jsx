"use client";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import HeroFormSelect from "./HeroFormSelect";

/* ---------- static options ---------- */
const cities = ["Lahore", "Islamabad", "Karachi", "Multan"];
const phases = Array.from({ length: 10 }, (_, i) => `Phase ${i + 1}`);
const residentialTypesBuy = ["Plots", "House", "File", "Apartments"];
const residentialTypesRent = ["House", "File", "Apartments"];
const commercialTypes = ["Office", "Shop", "Warehouse", "Building"];
const paymentPlans = ["Yearly", "Monthly", "Weekly", "Daily", "Other"];

const emptyForm = {
  city: "Select City",
  phase: "Select Phase", 
  propertyType: "Select Type",
  subType: "",
  minPrice: "",
  maxPrice: "",
  keyword: "",
  paymentPlan: "Payment Plan",
  selectedResidential: [],
  selectedCommercial: [],
};

export default function HeroForm() {
  const [type, setType] = useState("Buy");
  const [form, setForm] = useState(emptyForm);

  /* ---------- generic field ---------- */
  const handleChange = (name, value) =>
    setForm((f) => ({ ...f, [name]: value }));

  /* ---------- price ---------- */
  const handlePrice = (t, v) =>
    setForm((f) => ({ ...f, [t === "min" ? "minPrice" : "maxPrice"]: v }));

  /* ---------- property type toggles ---------- */
  const toggleRes = (t) =>
    setForm((f) => ({
      ...f,
      selectedResidential: f.selectedResidential.includes(t)
        ? f.selectedResidential.filter((i) => i !== t)
        : [...f.selectedResidential, t],
    }));
  const toggleCom = (t) =>
    setForm((f) => ({
      ...f,
      selectedCommercial: f.selectedCommercial.includes(t)
        ? f.selectedCommercial.filter((i) => i !== t)
        : [...f.selectedCommercial, t],
    }));

  /* ---------- submit ---------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    const q = new URLSearchParams();

    // Helper to check if value is different from default/placeholder
    const isTouched = (val, defaultValue) => 
      val && String(val).trim() !== "" && val !== defaultValue;

    // Add only touched fields
    if (isTouched(form.city, "Select City")) q.set("city", form.city);
    if (isTouched(form.phase, "Select Phase")) q.set("phase", form.phase);
    if (isTouched(form.propertyType, "Select Type")) q.set("propertyType", form.propertyType);
    if (type !== "Buy" && isTouched(form.paymentPlan, "Payment Plan")) q.set("paymentPlan", form.paymentPlan);
    
    if (form.keyword) q.set("keyword", form.keyword);
    if (form.minPrice) q.set("minPrice", form.minPrice);
    if (form.maxPrice) q.set("maxPrice", form.maxPrice);

    // Add sub-types only if any are selected
    if (form.selectedResidential.length > 0) {
      form.selectedResidential.forEach((t) => q.append("residentialTypes", t));
    }
    if (form.selectedCommercial.length > 0) {
      form.selectedCommercial.forEach((t) => q.append("commercialTypes", t));
    }

    // Build final URL
    const queryString = q.toString();
    window.location.href = `/search/${type.toLowerCase()}${queryString ? "?" + queryString : ""}`;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full xl:w-[85%] mx-auto bg-white p-5 rounded-md flex flex-col gap-4">
      {/* ---------- type switch ---------- */}
      <div className="upper flex gap-5 lg:flex-row flex-col">
        <div className="border border-gray-300 flex rounded-md">
          {["Buy", "Rent", "Project"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setType(t);
                setForm(emptyForm);
              }}
              className={`px-3 sm:px-6 py-2 font-semibold cursor-pointer m-1 rounded-md ${
                type === t ? "bg-blue-50 text-blue-500" : ""
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-1 border border-gray-300 px-5 py-2 rounded-md">
          <FiSearch className="text-xl text-blue-800" />
          <input
            type="text"
            value={form.keyword}
            onChange={(e) => handleChange("keyword", e.target.value)}
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
      <div className="lower grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <HeroFormSelect
          name="city"
          label="Select City"
          value={form.city}
          onChange={(v) => handleChange("city", v)}
          options={["Select City", ...cities]} 
        />

        <HeroFormSelect
          name="phase"
          label="Select Phase"
          value={form.phase}
          onChange={(v) => handleChange("phase", v)}
          options={["Select Phase", ...phases]}
        />

        {/* Payment plan only for Rent / Project */}
        {(type === "Rent") && (
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
          residentialTypes={type === "Buy" ? residentialTypesBuy : residentialTypesRent}
          commercialTypes={commercialTypes}
          selectedResidentialTypes={form.selectedResidential}
          selectedCommercialTypes={form.selectedCommercial}
          onPropertyTypeChange={(t) => handleChange("propertyType", t)}
          onResidentialTypeToggle={toggleRes}
          onCommercialTypeToggle={toggleCom}
          onReset={() =>
            setForm((f) => ({ ...f, selectedResidential: [], selectedCommercial: [] }))
          }
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