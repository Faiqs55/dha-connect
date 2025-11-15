"use client";
import React, { useState, useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import AlertResult from "@/Components/AlertResult";
import propertyService from "@/services/property.service";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Link from "next/link";
import agentService from "@/services/agent.service";

/* ---------- helpers ---------- */
const FormBlock = ({ heading, children }) => (
  <div className="bg-white shadow p-5 rounded-md">
    <h3 className="text-xl font-semibold mb-5">{heading}</h3>
    <div className="flex flex-col gap-4">{children}</div>
  </div>
);

const Badge = ({ label, active, onClick, disabled = false }) => (
  <span
    onClick={disabled ? undefined : onClick}
    className={`px-2 py-1 sm:px-4 sm:py-2 sm:text-sm text-xs sm:font-semibold rounded-full cursor-pointer transition ${
      disabled
        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        : active
        ? "border-blue-500 bg-blue-100 text-blue-500"
        : "bg-gray-200 text-gray-600 border-transparent hover:bg-gray-300"
    }`}
  >
    {label}
  </span>
);

const Tab = ({ value, current, set, label }) => (
  <button
    type="button"
    onClick={() => set(value)}
    className={`px-3 py-1.5 sm:px-5 sm:py-2 text-sm font-semibold border-b-2 transition ${
      current === value ? "border-blue-700 text-blue-700" : "border-transparent"
    }`}
  >
    {label}
  </button>
);

/* ---------- main page ---------- */
export default function AddPropertyPage() {
  const basicInputStyles = "border border-gray-300 rounded-md px-3 py-2";
  const { value: token, isLoaded } = useLocalStorage("agentToken", null);

  /* ---------- media ---------- */
  const [imageFiles, setImageFiles] = useState([]);
  const [featureImageFile, setFeatureImageFile] = useState(null);
  const [featureImagePreview, setFeatureImagePreview] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [previewList, setPreviewList] = useState([]);
  const [agent, setAgent] = useState(null);

  const getCurrentAgent = async () => {
    try {
      const res = await agentService.getCurrentAgent(token);
      if(res.success){
        setAgent(res.data.agent);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(token && isLoaded){
       getCurrentAgent();
    }
  }, [token, isLoaded]);  

  /* ---------- choices ---------- */
  const [purpose, setPurpose] = useState("Sell");
  const [type, setType] = useState("Houses");
  const [subType, setSubType] = useState("Home");

  // Define sub-types based on type and purpose
  const getSubTypes = () => {
    if (type === "Houses") {
      if (purpose === "Sell") {
        return ["Home", "Flat", "Farm House", "Pent House"];
      } else if (purpose === "Rent") {
        return ["Home", "Flat", "Upper Portion", "Lower Portion", "Farm House", "Room", "PentHouse"];
      } else { // Project
        return ["Home", "Flat", "Farm House", "PentHouse"];
      }
    } else if (type === "Plots") {
      return purpose === "Sell" ? ["Residential Plot", "Commercial Plot"] : [];
    } else if (type === "Files") {
      return purpose === "Sell" ? ["Affidavit", "Allocation"] : [];
    } else if (type === "Commercial") {
      return ["Office", "Shop", "Building", "Other"];
    }
    return [];
  };

  // Update subType when type or purpose changes
  useEffect(() => {
    const availableSubTypes = getSubTypes();
    if (availableSubTypes.length > 0 && !availableSubTypes.includes(subType)) {
      setSubType(availableSubTypes[0]);
    }
  }, [type, purpose]);

  const bedOpts = [
    "Studio",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "10+",
  ];
  const bathOpts = ["1", "2", "3", "4", "5", "6", "6+"];
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  /* ---------- amenities ---------- */
  const [plotAmenities, setPlotAmenities] = useState([]);
  const [plotFileType, setPlotFileType] = useState("");
  const [otherText, setOtherText] = useState("");

  /* ---------- fields ---------- */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [paymentPlan, setPaymentPlan] = useState("Monthly");
  const [adType, setAdType] = useState("normal");
  const [phase, setPhase] = useState("Phase 1");
  const [plot, setPlot] = useState("");
  const [block, setBlock] = useState("");
  const [street, setStreet] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [priceInDollar, setPriceInDollar] = useState("");
  const [area, setArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("Marla");

  /* ---------- ui ---------- */
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  /* ---------- price conversion ---------- */
  const handlePriceChange = (value) => {
    setPrice(value);
    if (value) {
      const dollarValue = (parseFloat(value) / 282).toFixed(2);
      setPriceInDollar(dollarValue);
    } else {
      setPriceInDollar("");
    }
  };

  const handleDollarChange = (value) => {
    setPriceInDollar(value);
    if (value) {
      const pkrValue = (parseFloat(value) * 282).toFixed(2);
      setPrice(pkrValue);
    } else {
      setPrice("");
    }
  };

  /* ---------- clear features when type changes ---------- */
  useEffect(() => {
    if (type !== "Houses") {
      setBedrooms("");
      setBathrooms("");
    }
    if (type !== "Plots") {
      setPlotAmenities([]);
    }
    if (type !== "Files") {
      setPlotFileType("");
    }
  }, [type]);

  /* ---------- validation ---------- */
  const isValid =
    title.trim() &&
    purpose &&
    type &&
    subType &&
    phase &&
    block.trim() &&
    street.trim() &&
    address.trim() &&
    price &&
    area.trim() &&
    areaUnit &&
    featureImageFile &&
    imageFiles.length > 0;

  /* ---------- media helpers ---------- */
  const fileToPreview = (file) =>
    new Promise((res) => {
      const reader = new FileReader();
      reader.onload = (e) => res({ url: e.target.result, name: file.name });
      reader.readAsDataURL(file);
    });

  const triggerImagePicker = () => document.getElementById("image-input").click();
  const triggerFeatureImagePicker = () => document.getElementById("feature-image-input").click();
  const triggerVideoPicker = () => document.getElementById("video-input").click();

  const addImages = async (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = await Promise.all(files.map(fileToPreview));
    setImageFiles((prev) => [...prev, ...files]);
    setPreviewList((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (idx) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviewList((prev) => prev.filter((_, i) => i !== idx));
  };

  const addFeatureImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFeatureImageFile(file);
    setFeatureImagePreview(URL.createObjectURL(file));
  };

  const removeFeatureImage = () => {
    setFeatureImageFile(null);
    setFeatureImagePreview("");
  };

  const addVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) return alert("Video must be ≤ 50 MB");
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview("");
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setToast(null);

    try {
      // Convert "normal" to "none" for backend compatibility
      const backendAdType = adType === "normal" ? "none" : adType;

      const payload = {
        title: title.trim(),
        description: description.trim(),
        adType: backendAdType,
        category: purpose,
        paymentPlan,
        type,
        subType,
        phase,
        block: block.trim(),
        plot: plot.trim(),
        street: street.trim(),
        address: address.trim(),
        price,
        area: area.trim(),
        areaUnit,
        bedrooms: bedrooms || "0",
        bathrooms: bathrooms || "0",
        otherFeatures: otherText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        // Send files directly - they will be handled by Multer
        images: imageFiles,
        featureImage: featureImageFile,
        video: videoFile,
        // Add plot-specific fields
        ...(type === "Plots" && {
          plotAmenities,
        }),
        ...(type === "Files" && {
          plotFileType: subType
        })
      };

      const res = await propertyService.addProperty(payload, token);
      setToast(res);

      if (res.success) {
        // Clear form on success
        setTitle("");
        setDescription("");
        setAdType("normal");
        setPurpose("Sell");
        setPaymentPlan("Monthly");
        setType("Houses");
        setSubType("Home");
        setPhase("Phase 1");
        setPlot("");
        setBlock("");
        setStreet("");
        setAddress("");
        setPrice("");
        setPriceInDollar("");
        setArea("");
        setAreaUnit("Marla");
        setBedrooms("");
        setBathrooms("");
        setPlotAmenities([]);
        setPlotFileType("");
        setOtherText("");
        setImageFiles([]);
        setPreviewList([]);
        setFeatureImageFile(null);
        setFeatureImagePreview("");
        setVideoFile(null);
        setVideoPreview("");

        getCurrentAgent();
      }
    } catch (err) {
      setToast({ success: false, message: err.message || "An error occurred while adding property" });
    } finally {
      setSubmitting(false);
    }
  };

  // Check if video field should be enabled
  const isVideoEnabled = adType === "videoAds" || adType === "featuredAds";

  // Get available types based on purpose
  const getAvailableTypes = () => {
    if (purpose === "Sell") {
      return ["Houses", "Plots", "Files", "Commercial"];
    } else {
      return ["Houses", "Commercial"];
    }
  };

  return (
    <>
      <AlertResult data={toast} onClose={() => {setToast(null)}} />

      <div className="mb-10 flex gap-2.5">
        <Link
          className="text-gray-500 font-bold text-sm underline"
          href={"/agent/dashboard"}
        >
          {"<< Dashboard"}
        </Link>
        <Link
          className="text-gray-500 font-bold text-sm underline"
          href={"/agent/dashboard/properties"}
        >
          {"<< Properties"}
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* hidden native inputs */}
        <input
          id="image-input"
          type="file"
          multiple
          accept="image/*"
          onChange={addImages}
          className="hidden"
        />
        <input
          id="feature-image-input"
          type="file"
          accept="image/*"
          onChange={addFeatureImage}
          className="hidden"
        />
        <input
          id="video-input"
          type="file"
          accept="video/*"
          onChange={addVideo}
          className="hidden"
          disabled={!isVideoEnabled}
        />

        {/* ---------- Property Media (TOP) ---------- */}
        <FormBlock heading="Property Media">
          {/* Feature Image */}
          <div>
            <label className="text-sm font-semibold mb-2 block">
              Upload Feature Image *
            </label>
            <button
              type="button"
              onClick={triggerFeatureImagePicker}
              className="px-4 py-2 text-sm font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-500 hover:bg-blue-200 transition"
            >
              + Upload Feature Image
            </button>
            {featureImagePreview && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={featureImagePreview}
                  alt="Feature"
                  className="h-24 w-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={removeFeatureImage}
                  className="bg-rose-500 text-white p-2 rounded"
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            )}
          </div>

          {/* images */}
          <div>
            <label className="text-sm font-semibold mb-2 block">
              Property Images *
            </label>
            <button
              type="button"
              onClick={triggerImagePicker}
              className="px-4 py-2 text-sm font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-500 hover:bg-blue-200 transition"
            >
              + Add Images
            </button>
            <div className="flex flex-wrap gap-3 mt-3">
              {previewList.map((p, i) => (
                <div
                  key={i}
                  className="relative rounded overflow-hidden border-2 border-transparent"
                >
                  <img src={p.url} alt="" className="h-24 w-24 object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(i);
                    }}
                    className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded"
                  >
                    <FaRegTrashAlt />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* video */}
          <div>
            <label className="text-sm font-semibold mb-2 block">
              Property Video (≤ 50 MB) {!isVideoEnabled && "(Available With Video Ad Or Featured Ad)"}
            </label>
            <button
              type="button"
              onClick={triggerVideoPicker}
              disabled={!isVideoEnabled}
              className={`px-4 py-2 text-sm font-semibold rounded-full border transition ${
                isVideoEnabled 
                  ? "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300" 
                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              }`}
            >
              + Add Video
            </button>
            <p className="text-blue-400 text-xs font-semibold mt-1.5">Add Video To Get 10x Boost</p>
            {videoFile && (
              <div className="mt-3 flex items-center gap-3">
                <video
                  src={videoPreview}
                  controls
                  className="h-24 w-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="bg-rose-500 text-white p-2 rounded"
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            )}
          </div>
        </FormBlock>

        {/* ---------- Property Information ---------- */}
        <FormBlock heading="Property Information">
          <label className="text-sm font-semibold flex gap-3">
            <span>Property Title *</span>
            <p className="text-sm font-medium text-gray-500">(I.E. Phase | Plot | House | File Detail)</p>
          </label>
          
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={basicInputStyles}
            type="text"
            placeholder="Enter Title For Your Property"
            required
          />

          <label className="text-sm font-semibold mb-1">
            Property Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe Your Property (Optional)"
            className={`${basicInputStyles} min-h-[100px]`}
          />

          <div>
            <label className="text-sm font-semibold mb-2 block">
              Select Ad Type
            </label>
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex flex-col gap-1.5 items-center">
                <Badge
                  label="Normal"
                  active={adType === "normal"}
                  onClick={() => setAdType("normal")}
                />
                <p className="text-blue-400 text-xs font-semibold">1x Boost</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Badge
                  label={`Classified Ad ${agent?.classifiedAds || 0} Left`}
                  active={adType === "classifiedAds"}
                  onClick={() => setAdType("classifiedAds")}
                  disabled={!agent?.classifiedAds || agent.classifiedAds === 0}
                />
                <p className="text-blue-400 text-xs font-semibold">5x Boost</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Badge
                  label={`Video Ad ${agent?.videoAds || 0} Left`}
                  active={adType === "videoAds"}
                  onClick={() => setAdType("videoAds")}
                  disabled={!agent?.videoAds || agent.videoAds === 0}
                />
                <p className="text-blue-400 text-xs font-semibold">10x Boost</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Badge
                  label={`Featured Ad ${agent?.featuredAds || 0} Left`}
                  active={adType === "featuredAds"}
                  onClick={() => setAdType("featuredAds")}
                  disabled={!agent?.featuredAds || agent.featuredAds === 0}
                />
                <p className="text-blue-400 text-xs font-semibold">15x Boost</p>
              </div>
            </div>
          </div>
        </FormBlock>

        {/* ---------- Location & Purpose ---------- */}
        <FormBlock heading="Location & Purpose">
          <div>
            <label className="text-sm font-semibold mb-2 block">
              Select Purpose *
            </label>
            <div className="flex gap-3">
              {["Sell", "Rent", "Project"].map((p) => (
                <Badge
                  key={p}
                  label={p}
                  active={purpose === p}
                  onClick={() => setPurpose(p)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">
              Select Property Type *
            </label>
            <div className="border-b border-gray-200 flex">
              {getAvailableTypes().map((t) => (
                <Tab
                  key={t}
                  value={t}
                  current={type}
                  set={setType}
                  label={t}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">
              Sub-Type *
            </label>
            <div className="flex flex-wrap gap-3">
              {getSubTypes().map((st) => (
                <Badge
                  key={st}
                  label={st}
                  active={subType === st}
                  onClick={() => setSubType(st)}
                />
              ))}
              {getSubTypes().length === 0 && (
                <p className="text-gray-500 text-sm">No Sub-Types Available For This Selection</p>
              )}
            </div>
          </div>

          {purpose === "Rent" && (
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-2 block">
                Payment Plan *
              </label>
              <select
                className={`${basicInputStyles}`}
                value={paymentPlan}
                onChange={(e) => setPaymentPlan(e.target.value)}
              >
                <option value="Yearly">Yearly</option>
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
                <option value="Daily">Daily</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}
        </FormBlock>

        {/* ---------- Address Details ---------- */}
        <FormBlock heading="Address Details">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2 block">
              Select Phase *
            </label>
            <select
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
              className={basicInputStyles}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={`Phase ${i + 1}`}>{`Phase ${i + 1}`}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2 block">
              Enter Block *
            </label>
            <input
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              type="text"
              placeholder="E.G. Block A, Block B, etc."
              className={basicInputStyles}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2 block">
              Plot/House/Office Number
            </label>
            <input
              value={plot}
              onChange={(e) => setPlot(e.target.value)}
              type="text"
              placeholder="E.G. Plot 123, House 456, Office 789"
              className={basicInputStyles}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2 block">
              Enter Street Address *
            </label>
            <input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              type="text"
              placeholder="E.G. Street 1, Main Boulevard, etc."
              className={basicInputStyles}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2 block">
              Enter Complete Address *
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="E.G. House # 123, Sector C, Near Main Market, DHA Phase 8"
              className={`${basicInputStyles} min-h-[80px]`}
              required
            />
          </div>
        </FormBlock>

        {/* ---------- Price & Area ---------- */}
        <FormBlock heading="Price & Area">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2 block">
              {purpose === "Rent" && paymentPlan + " Plan"} Price (PKR) *
            </label>
            <input
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              type="number"
              placeholder="Enter Price In PKR"
              className={basicInputStyles}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2 block">
              Price In Dollar
            </label>
            <input
              value={priceInDollar}
              onChange={(e) => handleDollarChange(e.target.value)}
              type="number"
              placeholder="Auto-Calculated From PKR"
              className={basicInputStyles}
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">
              Area Size *
            </label>
            <div className="flex gap-3 sm:flex-row flex-col">
              <input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                type="text"
                placeholder="Area"
                className={`${basicInputStyles} sm:flex-5`}
                required
              />
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value)}
                className={`${basicInputStyles} sm:flex-2`}
              >
                <option>Marla</option>
                <option>Sq. Ft.</option>
                <option>Sq. M.</option>
                <option>Sq. Yd.</option>
                <option>Kanal</option>
              </select>
            </div>
          </div>
        </FormBlock>

        {/* ---------- Features & Amenities ---------- */}
        <FormBlock heading="Features & Amenities">
          {type === "Houses" && (
            <>
              <div>
                <label className="text-sm font-semibold mb-2 block">Bedrooms</label>
                <div className="flex flex-wrap gap-3">
                  {bedOpts.map((b) => (
                    <Badge
                      key={b}
                      label={b}
                      active={bedrooms === b}
                      onClick={() => setBedrooms(b)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Bathrooms
                </label>
                <div className="flex flex-wrap gap-3">
                  {bathOpts.map((bt) => (
                    <Badge
                      key={bt}
                      label={bt}
                      active={bathrooms === bt}
                      onClick={() => setBathrooms(bt)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {type === "Plots" && (
            <div>
              <label className="text-sm font-semibold mb-2 block">Plot Amenities</label>
              <div className="flex flex-wrap gap-3">
                {["Possession", "Non-Possession", "Boundry Wall", "Corner", "Park Face"].map((opt) => (
                  <Badge
                    key={opt}
                    label={opt}
                    active={plotAmenities.includes(opt)}
                    onClick={() => {
                      setPlotAmenities(prev => 
                        prev.includes(opt) 
                          ? prev.filter(item => item !== opt)
                          : [...prev, opt]
                      );
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Features (common for all types except where specified) */}
          {(type === "Houses" || type === "Commercial" || type === "Files" || type === "Plots") && (
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-2 block">
                Other Features (Optional)
              </label>
              <input
                type="text"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder="E.G. Swimming Pool, Gym, Security"
                className={basicInputStyles}
              />
            </div>
          )}
        </FormBlock>

        {/* ---------- Submit ---------- */}
        <button
          type="submit"
          disabled={submitting || !isValid}
          className="bg-blue-900 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-md disabled:bg-gray-400"
        >
          {submitting ? "Uploading…" : "Submit Property"}
        </button>
      </form>
    </>
  );
}