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
import { useParams } from "next/navigation";

const cloudName = "dhdgrfseu";
const uploadPreset = "dha-agency-logo";

const emptyForm = {
  name: "",
  designation: "",
  phone: "",
  email: "",
  image: "", // Cloudinary URL
  classifiedAds: 0,
  videoAds: 0,
  featuredAds: 0,
};

export default function UpdateAgentPage() {
  const { value: token, isLoaded } = useLocalStorage("agencyToken", null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [agency, setAgency] = useState(null);
  const [agent, setAgent] = useState(null);
  const [originalAgent, setOriginalAgent] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const agentId = useParams().agentId;

  useEffect(() => {
    if (!token || !isLoaded || !agentId) return;

    // Fetch both agency and agent data in parallel for faster loading
    Promise.all([
      agencyService.getMyAgency(token).catch(e => {
        console.log(e);
        return { success: false };
      }),
      agentService.getAgentById(agentId).catch(e => {
        console.log(e);
        return { success: false };
      })
    ]).then(([agencyRes, agentRes]) => {
      if (agencyRes.success) {
        setAgency(agencyRes.data);
      }
      
      if (agentRes.success) {
        const agentData = agentRes.data;
        setAgent(agentData);
        setOriginalAgent(agentData);
        setOriginalImage(agentData.image);
        
        // Auto-fill the form with agent data
        setForm({
          name: agentData.name || "",
          designation: agentData.designation || "",
          phone: agentData.phone || "",
          email: agentData.email || "",
          image: agentData.image || "",
          classifiedAds: agentData.classifiedAds || 0,
          videoAds: agentData.videoAds || 0,
          featuredAds: agentData.featuredAds || 0,
        });
        
        // Set preview for existing image
        if (agentData.image) {
          setPreview(agentData.image);
        }
      }
    });
  }, [token, isLoaded, agentId]);

  /* ---------- Calculate maximum allowed ads based on current allocation ---------- */
  const calculateMaxAds = (adType) => {
    if (!agency || !originalAgent) return 0;
    
    const agencyAvailable = agency[adType] || 0;
    const agentCurrent = originalAgent[adType] || 0;
    
    // Maximum = what agency has available + what agent currently has
    return agencyAvailable + agentCurrent;
  };

  /* ---------- Check if new ad value is valid ---------- */
  const isValidAdValue = (adType, newValue) => {
    const maxAllowed = calculateMaxAds(adType);
    return newValue >= 0 && newValue <= maxAllowed;
  };

  /* ---------- Get available ads for display ---------- */
  const getAvailableAds = (adType) => {
    if (!agency) return 0;
    return agency[adType] || 0;
  };

  /* ---------- generic field ---------- */
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = type === 'number' ? parseInt(value) || 0 : value;

    // Special validation for ad fields
    if (name === 'classifiedAds' || name === 'videoAds' || name === 'featuredAds') {
      if (!isValidAdValue(name, newValue)) {
        const maxAllowed = calculateMaxAds(name);
        setToast({ 
          success: false, 
          message: `Cannot assign ${newValue} ${name.replace('Ads', ' ads')}. Maximum allowed is ${maxAllowed}.` 
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
    setForm(f => ({ ...f, image: "" }));
  };

  /* ---------- delete image from cloudinary ---------- */
  const deleteImageFromCloudinary = async (imageUrl) => {
    if (!imageUrl) return;
    
    try {
      // Extract public_id from Cloudinary URL
      const parts = imageUrl.split('/');
      const fileNameWithExtension = parts[parts.length - 1];
      const publicId = fileNameWithExtension.split('.')[0];
      
      // Cloudinary delete API call
      await axios.delete(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        data: {
          public_id: publicId,
          upload_preset: uploadPreset
        }
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
      return false;
    }
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.name || !form.designation || !form.email || !form.phone) {
      return setToast({ success: false, message: "Please fill in all required agent information fields." });
    }

    // Final validation for ad quotas
    if (!isValidAdValue('classifiedAds', form.classifiedAds)) {
      return setToast({ 
        success: false, 
        message: `Invalid classified ads allocation. Maximum allowed is ${calculateMaxAds('classifiedAds')}.` 
      });
    }
    if (!isValidAdValue('videoAds', form.videoAds)) {
      return setToast({ 
        success: false, 
        message: `Invalid video ads allocation. Maximum allowed is ${calculateMaxAds('videoAds')}.` 
      });
    }
    if (!isValidAdValue('featuredAds', form.featuredAds)) {
      return setToast({ 
        success: false, 
        message: `Invalid featured ads allocation. Maximum allowed is ${calculateMaxAds('featuredAds')}.` 
      });
    }

    // Check if all ads are being removed
    if (form.classifiedAds === 0 && form.videoAds === 0 && form.featuredAds === 0) {
      const proceed = confirm("You're removing all advertising quotas from this agent. They won't be able to create promoted properties. Continue anyway?");
      if (!proceed) return;
    }

    setSubmitting(true);
    setToast(null);

    let imageUrl = originalImage; // Default to original image
    let imageChanged = false;
    let oldImageToDelete = null;

    /* Image handling logic */
    if (file) {
      // New image selected - upload new one and delete old one
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", uploadPreset);
        
        const { data } = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          fd
        );
        imageUrl = data.secure_url;
        imageChanged = true;
        
        // Mark old image for deletion if it exists and is different from new one
        if (originalImage && originalImage !== imageUrl) {
          oldImageToDelete = originalImage;
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        setToast({ 
          success: false, 
          message: "Failed to upload agent image. Please try again." 
        });
        setSubmitting(false);
        return;
      }
    } else if (!preview && originalImage) {
      // Image was removed and no new image selected
      imageUrl = ""; // Remove image
      imageChanged = true;
      oldImageToDelete = originalImage;
    }

    /* Prepare payload according to agent model */
    const payload = { 
      name: form.name,
      designation: form.designation,
      phone: form.phone,
      email: form.email,
      image: imageUrl,
      classifiedAds: form.classifiedAds,
      videoAds: form.videoAds,
      featuredAds: form.featuredAds
    };

    try {
      /* Update agent via service */
      const res = await agentService.updateAgent(token, agentId, payload);
      
      setToast({
        success: res.success,
        message: res.success 
          ? "Agent updated successfully! Changes have been saved." 
          : res.message || "Failed to update agent. Please try again.",
      });

      if (res.success) {
        // Update local state with new data
        setAgent({ ...agent, ...payload });
        setOriginalAgent({ ...originalAgent, ...payload });
        
        // Update image references
        if (imageUrl) {
          setOriginalImage(imageUrl);
        }

        // Delete old image from Cloudinary if needed
        if (oldImageToDelete) {
          await deleteImageFromCloudinary(oldImageToDelete);
        }

        // Refresh agency data to get updated ad counts
        const agencyRes = await agencyService.getMyAgency(token);
        if (agencyRes.success) {
          setAgency(agencyRes.data);
        }
      }
    } catch (error) {
      console.error("Error updating agent:", error);
      setToast({
        success: false,
        message: "An unexpected error occurred while updating the agent. Please try again.",
      });
    }
    
    setSubmitting(false);
  };

  if (!agency || !agent) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner/>
        <span className="ml-3 text-gray-600">Loading agent information...</span>
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Update Agent</h1>
        <p className="text-gray-600">
          Update agent information and adjust advertising quotas from your available pool.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-10 mt-5 space-y-8">
        {/* ------- image ------- */}
        <AgencyFormSection title="Agent Image">
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
              className="bg-gray-200 py-6 rounded text-center cursor-pointer hover:bg-gray-300"
            >
              Drag & Drop or <span className="underline">Browse</span>
            </div>
          ) : (
            <div className="relative bg-gray-200 py-6 flex justify-center">
              <img src={preview} alt="agent" className="max-h-40" />
              <button
                type="button"
                onClick={removeLogo}
                className="absolute top-4 right-4 bg-rose-500 text-white p-2 rounded"
              >
                <FaRegTrashAlt />
              </button>
            </div>
          )}
          {originalImage && !preview && (
            <p className="text-sm text-gray-500 mt-2">
              Previous image will be used if no new image is selected
            </p>
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
          description="Adjust advertising quotas from your available pool. You can reallocate ads between agents."
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
                max={calculateMaxAds('classifiedAds')}
                disabled={calculateMaxAds('classifiedAds') === 0}
                required
              />
              <div className="mt-2">
                <p className="text-sm text-blue-700 font-medium">
                  Available: {getAvailableAds('classifiedAds')} ads
                </p>
                <p className="text-xs text-blue-600">
                  Current: {originalAgent.classifiedAds} ads
                </p>
                {calculateMaxAds('classifiedAds') === 0 ? (
                  <p className="text-xs text-rose-600 mt-1">
                    No classified ads available for reallocation
                  </p>
                ) : (
                  <p className="text-xs text-blue-600 mt-1">
                    You can assign 0 to {calculateMaxAds('classifiedAds')} ads
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
                max={calculateMaxAds('videoAds')}
                disabled={calculateMaxAds('videoAds') === 0}
                required
              />
              <div className="mt-2">
                <p className="text-sm text-purple-700 font-medium">
                  Available: {getAvailableAds('videoAds')} ads
                </p>
                <p className="text-xs text-purple-600">
                  Current: {originalAgent.videoAds} ads
                </p>
                {calculateMaxAds('videoAds') === 0 ? (
                  <p className="text-xs text-rose-600 mt-1">
                    No video ads available for reallocation
                  </p>
                ) : (
                  <p className="text-xs text-purple-600 mt-1">
                    You can assign 0 to {calculateMaxAds('videoAds')} ads
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
                max={calculateMaxAds('featuredAds')}
                disabled={calculateMaxAds('featuredAds') === 0}
                required
              />
              <div className="mt-2">
                <p className="text-sm text-amber-700 font-medium">
                  Available: {getAvailableAds('featuredAds')} ads
                </p>
                <p className="text-xs text-amber-600">
                  Current: {originalAgent.featuredAds} ads
                </p>
                {calculateMaxAds('featuredAds') === 0 ? (
                  <p className="text-xs text-rose-600 mt-1">
                    No featured ads available for reallocation
                  </p>
                ) : (
                  <p className="text-xs text-amber-600 mt-1">
                    You can assign 0 to {calculateMaxAds('featuredAds')} ads
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {(form.classifiedAds === 0 && form.videoAds === 0 && form.featuredAds === 0) && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <span className="font-semibold">Note:</span> This agent won't be able to create promoted properties if all advertising quotas are removed.
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
                Updating Agent...
              </>
            ) : (
              "Update Agent Account"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}