"use client";
import { useState, useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import axios from "axios";
import ContainerCenter from "@/Components/ContainerCenter";
import AgencyFormSection from "@/Components/AgencyFormSection";
import AgencyFormInput from "@/Components/AgencyFormInput";
import AgencyFormSelect from "@/Components/AgencyFormSelect";
import AlertResult from "@/Components/AlertResult";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import propertyService from "@/services/property.service";

/* ---------------- static select data ---------------- */
const categoryOpts = [
  { val: "buy", label: "Buy" },
  { val: "rent", label: "Rent" },
  { val: "project", label: "Project" },
];
const typeOpts = [
  { val: "residential", label: "Residential" },
  { val: "commercial", label: "Commercial" },
];
const statusOpts = [
  { val: "available", label: "Available" },
  { val: "sold", label: "Sold" },
];
const adTypeOpts = [
  { val: "none", label: "None" },
  { val: "classifiedAds", label: "Classified Ads" },
  { val: "videoAds", label: "Video Ads" },
  { val: "featuredAds", label: "Featured Ads" },
];
const paymentPlanOpts = [
  { val: "yearly", label: "Yearly" },
  { val: "monthly", label: "Monthly" },
  { val: "weekly", label: "Weekly" },
  { val: "daily", label: "Daily" },
  { val: "other", label: "Other" },
];
const phaseOpts = [
  { val: "phase1", label: "Phase 1" },
  { val: "phase2", label: "Phase 2" },
  { val: "phase3", label: "Phase 3" },
];

/* ---------------- empty form ---------------- */
const emptyForm = {
  name: "",
  agent: "",
  agency: "",
  images: [],
  video: "",
  phase: phaseOpts[0].val,
  address: "",
  description: "",
  category: categoryOpts[0].val,
  type: typeOpts[0].val,
  size: "",
  status: statusOpts[0].val,
  features: "",
  adType: adTypeOpts[0].val,
  price: "",
  paymentPlan: "",
  residentialTypes: "",
  commercialTypes: "",
};

export default function CreatePropertyPage() {
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { value: token, isLoaded } = useLocalStorage("agentToken", null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const oversized = files.some((f) => f.size > 5 * 1024 * 1024);
    if (oversized)
      return setToast({ success: false, message: "Max 5 MB per image" });
    setImageFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeImage = (idx) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  /* ---------- radios & clear opposite type ---------- */
  const radioSet = (() => {
    if (form.type === "residential") {
      if (form.category === "buy")
        return {
          group: "residential",
          opts: ["Plots", "House", "File", "Apartments"],
        };
      if (form.category === "rent" || form.category === "project")
        return { group: "residential", opts: ["House", "File", "Apartments"] };
    }
    if (form.type === "commercial") {
      if (form.category === "buy")
        return {
          group: "commercial",
          opts: ["Office", "Shop", "Warehouse", "Building"],
        };
      if (form.category === "rent" || form.category === "project")
        return {
          group: "commercial",
          opts: ["Office", "Shop", "Warehouse", "Building"],
        };
    }
    return null;
  })();

  useEffect(() => {
    if (form.type === "residential")
      setForm((f) => ({ ...f, commercialTypes: "" }));
    if (form.type === "commercial")
      setForm((f) => ({ ...f, residentialTypes: "" }));
  }, [form.type]);

  /* ---------- remove paymentPlan when category !== rent ---------- */
  useEffect(() => {
    if (form.category !== "rent") {
      setForm((f) => {
        const { paymentPlan, ...rest } = f;
        return rest;
      });
    }
  }, [form.category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFiles.length)
      return setToast({
        success: false,
        message: "At least one image is required",
      });

    setSubmitting(true);
    setToast(null);

    const uploadPromises = imageFiles.map((file) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "dha-agency-logo");
      return axios.post(
        `https://api.cloudinary.com/v1_1/dhdgrfseu/image/upload`,
        fd
      );
    });

    let imageUrls;
    try {
      const resps = await Promise.all(uploadPromises);
      imageUrls = resps.map((r) => r.data.secure_url);
    } catch {
      setToast({ success: false, message: "Image upload failed" });
      setSubmitting(false);
      return;
    }

    /* build payload without paymentPlan unless category === rent */
    const { paymentPlan, ...restForm } = form;
    const payload = {
      ...(form.category === "rent" ? { paymentPlan } : {}),
      ...restForm,
      images: imageUrls,
      features: form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    };

    if (isLoaded) {      
      const res = await propertyService.addProperty(payload, token);
      setToast(res);
      if (res.success) {
        setForm(emptyForm);
        setImageFiles([]);
        setPreviews([]);
      }
      setSubmitting(false);
    }

  };

  return (
    <>
      <AlertResult data={toast} onClose={() => setToast(null)} />

      <div className="page-head bg-gray-100">
        <ContainerCenter className="py-15">
          <h1 className="text-4xl">Property Creation Form</h1>
        </ContainerCenter>
      </div>

      <form onSubmit={handleSubmit} className="py-10">
        <ContainerCenter className="space-y-10">
          {/* ------- images ------- */}
          <AgencyFormSection title="Property Images">
            <input
              type="file"
              multiple
              hidden
              onChange={handleImages}
              accept="image/*"
            />
            {previews.length === 0 ? (
              <div
                onClick={(e) => e.currentTarget.querySelector("input")?.click()}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files);
                  if (files.length) handleImages({ target: { files } });
                }}
                onDragOver={(e) => e.preventDefault()}
                className="bg-gray-200 py-6 rounded text-center cursor-pointer hover:bg-gray-300"
              >
                Drag & Drop or <span className="underline">Browse</span>
                <input
                  type="file"
                  multiple
                  hidden
                  accept="image/*"
                  onChange={handleImages}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={src}
                      alt={`preview-${idx}`}
                      className="h-32 w-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded"
                    >
                      <FaRegTrashAlt />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </AgencyFormSection>

          {/* ------- basic info ------- */}
          <AgencyFormSection
            title="Basic Information"
            innerStyle="grid md:grid-cols-2 gap-4"
          >
            <AgencyFormInput
              label="Property Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <AgencyFormInput
              label="YouTube Video URL (Optional)"
              name="video"
              value={form.video}
              onChange={handleChange}
            />
            <AgencyFormSelect
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              options={categoryOpts}
            />
            <AgencyFormSelect
              label="Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              options={typeOpts}
            />
            <AgencyFormInput
              label="Size (sqft etc.)"
              name="size"
              value={form.size}
              onChange={handleChange}
              required
            />
            <AgencyFormInput
              label="Price"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
            <AgencyFormSelect
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={statusOpts}
            />
            <AgencyFormSelect
              label="Advertisement Type"
              name="adType"
              value={form.adType}
              onChange={handleChange}
              options={adTypeOpts}
            />
          </AgencyFormSection>

          {/* ------- sub-type radios (buy / rent / project) ------- */}
          {radioSet && (
            <AgencyFormSection
              title={`${
                form.type === "residential" ? "Residential" : "Commercial"
              } sub types`}
            >
              <RadioGroup
                name={
                  radioSet.group === "residential"
                    ? "residentialTypes"
                    : "commercialTypes"
                }
                value={
                  radioSet.group === "residential"
                    ? form.residentialTypes
                    : form.commercialTypes
                }
                onChange={handleChange}
                options={radioSet.opts}
              />
            </AgencyFormSection>
          )}

          {/* ------- payment plan: only rent ------- */}
          {form.category === "rent" && (
            <AgencyFormSection title="Payment Plan">
              <AgencyFormSelect
                label="Payment Plan"
                name="paymentPlan"
                value={form.paymentPlan}
                onChange={handleChange}
                options={paymentPlanOpts}
              />
            </AgencyFormSection>
          )}

          {/* ------- location ------- */}
          <AgencyFormSection
            title="Location"
            innerStyle="grid md:grid-cols-2 gap-4"
          >
            <AgencyFormSelect
              label="Phase"
              name="phase"
              value={form.phase}
              onChange={handleChange}
              options={phaseOpts}
            />
            <AgencyFormInput
              label="Street Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </AgencyFormSection>

          {/* ------- description & features ------- */}
          <AgencyFormSection title="Description & Features">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description (optional)"
              className="w-full border rounded p-2"
              rows={3}
            />
            <AgencyFormInput
              label="Features (comma separated, optional)"
              name="features"
              value={form.features}
              onChange={handleChange}
            />
          </AgencyFormSection>

          {/* ------- submit ------- */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? "Creating..." : "Create Property"}
          </button>
        </ContainerCenter>
      </form>
    </>
  );
}

function RadioGroup({ name, value, onChange, options }) {
  return (
    <div className="flex gap-4 flex-wrap">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={onChange}
            className="accent-blue-600"
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}
