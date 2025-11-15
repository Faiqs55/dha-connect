"use client";
import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import agentService from "@/services/agent.service";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import AgencyFormSection from "@/Components/AgencyFormSection";
import AgencyFormInput from "@/Components/AgencyFormInput";
import AlertResult from "@/Components/AlertResult";
import Link from "next/link";
import agencyService from "@/services/agency.service";
import Spinner from "@/Components/Spinner";
import { useParams } from "next/navigation";
import { getAgentProfileUrl } from "@/utils/getFileUrl";

const emptyForm = {
  name: "",
  designation: "",
  phone: "",
  email: "",
  image: "", // Now this will be the file path
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
  const [loading, setLoading] = useState(true);
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
        
        // Set preview for existing image using the utility function
        if (agentData.image) {
          setPreview(getAgentProfileUrl(agentData.image));
        }
      }
      setLoading(false);
    }).catch(error => {
      console.error("Error loading data:", error);
      setToast({ success: false, message: "Failed to load agent data" });
      setLoading(false);
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

  /* ---------- image handling ---------- */
  const handleImage = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024)
      return setToast({ success: false, message: "Image size too large. Please select an image under 5MB." });
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    // Clear the image from form data
    setForm(prev => ({ ...prev, image: "" }));
  };

  const triggerImagePicker = () => {
    document.getElementById('agent-image-input').click();
  };

  /* ---------- toast helper ---------- */
  const fireToast = (ok, msg) => setToast({ success: ok, message: msg });

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.name || !form.designation || !form.email || !form.phone) {
      return fireToast(false, "Please fill in all required agent information fields.");
    }

    // Final validation for ad quotas
    if (!isValidAdValue('classifiedAds', form.classifiedAds)) {
      return fireToast(false, `Invalid classified ads allocation. Maximum allowed is ${calculateMaxAds('classifiedAds')}.`);
    }
    if (!isValidAdValue('videoAds', form.videoAds)) {
      return fireToast(false, `Invalid video ads allocation. Maximum allowed is ${calculateMaxAds('videoAds')}.`);
    }
    if (!isValidAdValue('featuredAds', form.featuredAds)) {
      return fireToast(false, `Invalid featured ads allocation. Maximum allowed is ${calculateMaxAds('featuredAds')}.`);
    }

    // Check if all ads are being removed
    if (form.classifiedAds === 0 && form.videoAds === 0 && form.featuredAds === 0) {
      const proceed = confirm("You're removing all advertising quotas from this agent. They won't be able to create promoted properties. Continue anyway?");
      if (!proceed) return;
    }

    setSubmitting(true);
    setToast(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append all form fields except _id
      Object.keys(form).forEach(key => {
        if (key !== '_id') {
          formData.append(key, form[key]);
        }
      });

      // Append image file if new one is selected
      if (file) {
        formData.append('image', file);
      }

      // If no file and no image in form, we need to explicitly remove the image
      if (!file && !form.image) {
        formData.append('image', ''); // Explicitly send empty to remove image
      }

      // Update agent with file upload using fetch directly
      const apiURL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiURL}/agent/${agentId}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      fireToast(
        result.success, 
        result.success 
          ? "Agent updated successfully! Changes have been saved." 
          : result.message || "Failed to update agent. Please try again."
      );

      if (result.success) {
        // Update local state with new data
        const updatedAgent = { ...agent, ...form };
        if (result.data && result.data.agent) {
          Object.assign(updatedAgent, result.data.agent);
        }
        
        setAgent(updatedAgent);
        setOriginalAgent(updatedAgent);
        
        // Update image references
        if (updatedAgent.image) {
          setOriginalImage(updatedAgent.image);
          setPreview(getAgentProfileUrl(updatedAgent.image));
        } else {
          setOriginalImage(null);
          setPreview(null);
        }

        // Clear file state
        setFile(null);

        // Refresh agency data to get updated ad counts
        const agencyRes = await agencyService.getMyAgency(token);
        if (agencyRes.success) {
          setAgency(agencyRes.data);
        }
      }
    } catch (err) {
      fireToast(false, err.message || "An unexpected error occurred while updating the agent. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner/>
        <span className="ml-3 text-gray-600">Loading agent information...</span>
      </div>
    );
  }

  if (!agency || !agent) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load agent data</p>
          <Link
            href="/agency/dashboard/agents"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Return to Agents List
          </Link>
        </div>
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
            onChange={handleImage} 
            accept="image/*" 
            id="agent-image-input"
          />
          
          {!preview ? (
            <div
              onClick={triggerImagePicker}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) handleImage({ target: { files: [f] } });
              }}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-center"
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Upload Agent Photo</p>
                  <p className="text-sm text-gray-500 mt-1">Click to browse or drag & drop</p>
                  <p className="text-xs text-gray-400 mt-2">JPG, PNG - Max 5MB</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative bg-white border border-gray-200 rounded-xl p-4">
              <img 
                src={preview} 
                alt="Agent preview" 
                className="w-32 h-32 object-cover mx-auto rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-colors shadow-lg"
              >
                <FaRegTrashAlt className="text-sm" />
              </button>
              <p className="text-center text-sm text-gray-500 mt-2">
                {file ? "New image preview" : "Current agent image"}
              </p>
            </div>
          )}
          
          {originalImage && !preview && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              No image selected. Agent will have no profile image if you proceed.
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