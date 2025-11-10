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
  

  /* ---------- generic field ---------- */
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((f) => ({ 
      ...f, 
      [name]: type === 'number' ? parseInt(value) || 0 : value 
    }));
  };

  /* ---------- logo ---------- */
  const handleLogo = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024)
      return setToast({ success: false, message: "Max 5 MB" });
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
    
    // Additional validation for ad quotas
    if (form.classifiedAds > (agency?.classifiedAds || 0)) {
      return setToast({ success: false, message: "Cannot assign more classified ads than available" });
    }
    if (form.videoAds > (agency?.videoAds || 0)) {
      return setToast({ success: false, message: "Cannot assign more video ads than available" });
    }
    if (form.featuredAds > (agency?.featuredAds || 0)) {
      return setToast({ success: false, message: "Cannot assign more featured ads than available" });
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
      } catch {
        setToast({ success: false, message: "Image upload failed" });
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
        message: res.message || (res.success ? "Agent updated successfully" : "Failed to update agent"),
      });

      if (res.success) {
        // Update local state with new data
        setAgent({ ...agent, ...payload });
        setOriginalAgent({ ...originalAgent, ...payload });
        
        // Update image references
        if (imageUrl) {
          setOriginalImage(imageUrl);
        }

        // Reset form for password field only
        setForm(f => ({ ...f, password: "" }));
        
        // Delete old image from Cloudinary if needed
        if (oldImageToDelete) {
          await deleteImageFromCloudinary(oldImageToDelete);
        }
      }
    } catch (error) {
      console.error("Error updating agent:", error);
      setToast({
        success: false,
        message: "An error occurred while updating the agent",
      });
    }
    
    setSubmitting(false);
  };

  if (!agency || !agent) {
    return <Spinner />;
  }

  return (
    <div>
      <AlertResult data={toast} onClose={() => setToast(null)} />

      <div className="mb-10 flex gap-2.5">
        <Link
          className="text-gray-500 font-bold text-sm underline"
          href={"/agency/dashboard"}
        >
          {"<< Dashboard"}
        </Link>
        <Link
          className="text-gray-500 font-bold text-sm underline"
          href={"/agency/dashboard/agents"}
        >
          {"<< My Agents"}
        </Link>
      </div>
      <h1 className="text-4xl font-semibold underline mb-6">Update Agent</h1>

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
          innerStyle="grid grid-cols-2 gap-5"
        >
          <AgencyFormInput
            label="Agent Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <AgencyFormInput
            label="Agent Designation"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            required
          />
          <AgencyFormInput
            label="Agent Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <AgencyFormInput
            label="Agent Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </AgencyFormSection>

        {/* ------- Ad Quotas Section ------- */}
        <AgencyFormSection
          title="Update Ads Quota"
          innerStyle="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {/* Classified Ads */}
          <div>
            <AgencyFormInput
              label={`Classified Ads (Available: ${agency.classifiedAds})`}
              name="classifiedAds"
              type="number"
              value={form.classifiedAds}
              onChange={handleChange}
              min="0"
              max={agency.classifiedAds}
              disabled={agency.classifiedAds === 0}
              required
            />
            {agency.classifiedAds === 0 ? (
              <p className="text-xs text-rose-500 mt-1">
                You are out of classified ads. Contact admin to get more.
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                You can assign 0 to {agency.classifiedAds} classified ads
              </p>
            )}
          </div>

          {/* Video Ads */}
          <div>
            <AgencyFormInput
              label={`Video Ads (Available: ${agency.videoAds})`}
              name="videoAds"
              type="number"
              value={form.videoAds}
              onChange={handleChange}
              min="0"
              max={agency.videoAds}
              disabled={agency.videoAds === 0}
              required
            />
            {agency.videoAds === 0 ? (
              <p className="text-xs text-rose-500 mt-1">
                You are out of video ads. Contact admin to get more.
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                You can assign 0 to {agency.videoAds} video ads
              </p>
            )}
          </div>

          {/* Featured Ads */}
          <div>
            <AgencyFormInput
              label={`Featured Ads (Available: ${agency.featuredAds})`}
              name="featuredAds"
              type="number"
              value={form.featuredAds}
              onChange={handleChange}
              min="0"
              max={agency.featuredAds}
              disabled={agency.featuredAds === 0}
              required
            />
            {agency.featuredAds === 0 ? (
              <p className="text-xs text-rose-500 mt-1">
                You are out of featured ads. Contact admin to get more.
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                You can assign 0 to {agency.featuredAds} featured ads
              </p>
            )}
          </div>
        </AgencyFormSection>

        {/* ------- submit ------- */}
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {submitting ? "Updating..." : "Update Agent"}
        </button>
      </form>
    </div>
  );
}