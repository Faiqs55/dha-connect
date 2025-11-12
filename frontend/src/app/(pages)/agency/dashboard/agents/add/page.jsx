"use client";
import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import axios from "axios";
import agentService from "@/services/agent.service";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import AgencyFormSection from "@/Components/AgencyFormSection";
import AgencyFormInput from "@/Components/AgencyFormInput";
import AlertResult from "@/Components/AlertResult";
import Link from "next/link";
import agencyService from "@/services/agency.service";
import Spinner from "@/Components/Spinner";

const cloudName = "dhdgrfseu";
const uploadPreset = "dha-agency-logo";

const emptyForm = {
  name: "",
  designation: "",
  phone: "",
  email: "",
  password: "",
  image: "", // Cloudinary URL
  classifiedAds: 0,
  videoAds: 0,
  featuredAds: 0,
};

export default function AddAgentPage() {
  const { value: token, isLoaded } = useLocalStorage("agencyToken", null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [agency, setAgency] = useState(null);

  useEffect(() => {
    if(token && isLoaded){
      agencyService.getMyAgency(token)
      .then(res => {
        if(res.success){
          setAgency(res.data);
        }
      })
      .catch(e => console.log(e))
    }
  }, [token, isLoaded]);

  /* ---------- Check if new ad value is valid ---------- */
  const isValidAdValue = (adType, newValue) => {
    if (!agency) return false;
    const agencyAvailable = agency[adType] || 0;
    return newValue >= 0 && newValue <= agencyAvailable;
  };

  /* ---------- generic field ---------- */
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = type === 'number' ? parseInt(value) || 0 : value;

    // Special validation for ad fields
    if (name === 'classifiedAds' || name === 'videoAds' || name === 'featuredAds') {
      if (!isValidAdValue(name, newValue)) {
        const agencyAvailable = agency ? agency[name] : 0;
        setToast({ 
          success: false, 
          message: `Cannot assign ${newValue} ${name.replace('Ads', ' ads')}. You only have ${agencyAvailable} available.` 
        });
        return; // Don't update the field if invalid
      }
    }

    setForm((f) => ({ 
      ...f, 
      [name]: newValue 
    }));
  };

  /* ---------- logo ---------- */
  const handleLogo = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024)
      return setToast({ success: false, message: "Image size too large. Please select an image under 5MB." });
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const removeLogo = () => {
    setFile(null);
    setPreview(null);
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!file) {
      return setToast({ success: false, message: "Please upload an agent profile image." });
    }

    if (!form.name || !form.designation || !form.email || !form.password || !form.phone) {
      return setToast({ success: false, message: "Please fill in all required agent information fields." });
    }

    // Final validation for ad quotas
    if (!isValidAdValue('classifiedAds', form.classifiedAds)) {
      return setToast({ 
        success: false, 
        message: `Invalid classified ads allocation. You only have ${agency.classifiedAds} available.` 
      });
    }
    if (!isValidAdValue('videoAds', form.videoAds)) {
      return setToast({ 
        success: false, 
        message: `Invalid video ads allocation. You only have ${agency.videoAds} available.` 
      });
    }
    if (!isValidAdValue('featuredAds', form.featuredAds)) {
      return setToast({ 
        success: false, 
        message: `Invalid featured ads allocation. You only have ${agency.featuredAds} available.` 
      });
    }

    // Check if at least one ad type is assigned (optional business rule)
    if (form.classifiedAds === 0 && form.videoAds === 0 && form.featuredAds === 0) {
      const proceed = confirm("You haven't assigned any ads to this agent. They won't be able to create promoted properties. Continue anyway?");
      if (!proceed) return;
    }

    setSubmitting(true);
    setToast(null);

    /* 1. upload image */
    let url;
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", uploadPreset);
      
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        fd
      );
      url = data.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      setToast({ 
        success: false, 
        message: "Failed to upload agent image. Please try again." 
      });
      setSubmitting(false);
      return;
    }

    /* 2. save agent */
    try {
      const payload = { 
        ...form, 
        image: url
        // Note: The backend expects the ad fields directly, not nested in adQuotas
      };

      const res = await agentService.addAgent(token, payload);

      setToast({
        success: res.success,
        message: res.success 
          ? "Agent added successfully! They can now log in and start adding properties." 
          : res.message || "Failed to add agent. Please try again.",
      });

      if (res.success) {
        setForm(emptyForm);
        setFile(null);
        setPreview(null);
        
        // Refresh agency data to get updated ad counts
        const agencyRes = await agencyService.getMyAgency(token);
        if (agencyRes.success) {
          setAgency(agencyRes.data);
        }
      }
    } catch (error) {
      console.error("Error adding agent:", error);
      setToast({
        success: false,
        message: "An unexpected error occurred while adding the agent. Please try again.",
      });
    }
    
    setSubmitting(false);
  };

  if(!agency){
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner/>
        <span className="ml-3 text-gray-600">Loading agency information...</span>
      </div>
    );
  }

  return (
    <div>
      <AlertResult data={toast} onClose={() => setToast(null)} />

      <div className="mb-10 flex gap-2.5">
        <Link
          className="text-gray-500 font-bold text-sm underline hover:text-gray-700 transition-colors"
          href={"/agency/dashboard"}
        >
          {"← Dashboard"}
        </Link>
        <Link
          className="text-gray-500 font-bold text-sm underline hover:text-gray-700 transition-colors"
          href={"/agency/dashboard/agents"}
        >
          {"← My Agents"}
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Agent</h1>
        <p className="text-gray-600">
          Create a new agent account and assign advertising quotas from your available pool.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-10 mt-5 space-y-8">
        {/* ------- image ------- */}
        <AgencyFormSection title="Agent Profile Image">
          <input 
            type="file" 
            hidden 
            onChange={handleLogo} 
            accept="image/*" 
            id="agent-image-input"
          />
          {!preview ? (
            <div
              onClick={() => document.getElementById('agent-image-input').click()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) handleLogo({ target: { files: [f] } });
              }}
              onDragOver={(e) => e.preventDefault()}
              className="bg-gray-50 border-2 border-dashed border-gray-300 py-8 rounded-lg text-center cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-colors"
            >
              <div className="text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">Upload Agent Photo</p>
                <p className="text-sm mt-1">Drag & drop or click to browse</p>
                <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP - Max 5MB</p>
              </div>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleLogo}
              />
            </div>
          ) : (
            <div className="relative bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center">
              <img src={preview} alt="Agent preview" className="max-h-48 rounded-lg shadow-sm" />
              <button
                type="button"
                onClick={removeLogo}
                className="mt-4 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
              >
                <FaRegTrashAlt className="text-sm" />
                Remove Photo
              </button>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Profile photo preview. You can change it by uploading a new image.
              </p>
            </div>
          )}
        </AgencyFormSection>

        {/* ------- fields ------- */}
        <AgencyFormSection
          title="Agent Information"
          innerStyle="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <AgencyFormInput
            label="Agent Name *"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />
          <AgencyFormInput
            label="Designation *"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            placeholder="e.g., Senior Agent, Sales Manager"
            required
          />
          <AgencyFormInput
            label="Email Address *"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="agent@example.com"
            required
          />
          <AgencyFormInput
            label="Password *"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Set login password"
            required
          />
          <AgencyFormInput
            label="Phone Number *"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+92 300 1234567"
            required
          />
        </AgencyFormSection>

        {/* ------- Ad Quotas Section ------- */}
        <AgencyFormSection
          title="Advertising Quotas"
          description="Assign advertising quotas from your available pool. Agents use these quotas to promote their properties."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Classified Ads */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <AgencyFormInput
                label={`Classified Ads`}
                name="classifiedAds"
                type="number"
                value={form.classifiedAds}
                onChange={handleChange}
                min="0"
                max={agency.classifiedAds}
                disabled={agency.classifiedAds === 0}
                required
              />
              <div className="mt-2">
                <p className="text-sm text-blue-700 font-medium">
                  Available: {agency.classifiedAds} ads
                </p>
                {agency.classifiedAds === 0 ? (
                  <p className="text-xs text-rose-600 mt-1">
                    No classified ads available. Contact admin to request more.
                  </p>
                ) : (
                  <p className="text-xs text-blue-600 mt-1">
                    Standard property listings. Assign 0 to {agency.classifiedAds} ads.
                  </p>
                )}
              </div>
            </div>

            {/* Video Ads */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <AgencyFormInput
                label={`Video Ads`}
                name="videoAds"
                type="number"
                value={form.videoAds}
                onChange={handleChange}
                min="0"
                max={agency.videoAds}
                disabled={agency.videoAds === 0}
                required
              />
              <div className="mt-2">
                <p className="text-sm text-purple-700 font-medium">
                  Available: {agency.videoAds} ads
                </p>
                {agency.videoAds === 0 ? (
                  <p className="text-xs text-rose-600 mt-1">
                    No video ads available. Contact admin to request more.
                  </p>
                ) : (
                  <p className="text-xs text-purple-600 mt-1">
                    Properties with video tours. Assign 0 to {agency.videoAds} ads.
                  </p>
                )}
              </div>
            </div>

            {/* Featured Ads */}
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <AgencyFormInput
                label={`Featured Ads`}
                name="featuredAds"
                type="number"
                value={form.featuredAds}
                onChange={handleChange}
                min="0"
                max={agency.featuredAds}
                disabled={agency.featuredAds === 0}
                required
              />
              <div className="mt-2">
                <p className="text-sm text-amber-700 font-medium">
                  Available: {agency.featuredAds} ads
                </p>
                {agency.featuredAds === 0 ? (
                  <p className="text-xs text-rose-600 mt-1">
                    No featured ads available. Contact admin to request more.
                  </p>
                ) : (
                  <p className="text-xs text-amber-600 mt-1">
                    Premium highlighted listings. Assign 0 to {agency.featuredAds} ads.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {(form.classifiedAds === 0 && form.videoAds === 0 && form.featuredAds === 0) && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <span className="font-semibold">Note:</span> This agent won't be able to create promoted properties until you assign them some advertising quotas.
              </p>
            </div>
          )}
        </AgencyFormSection>

        {/* ------- submit ------- */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Spinner size="small" />
                Creating Agent...
              </>
            ) : (
              "Create Agent Account"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}