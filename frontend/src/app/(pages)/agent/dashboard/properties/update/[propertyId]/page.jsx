"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRegTrashAlt } from "react-icons/fa";
import AlertResult from "@/Components/AlertResult";
import propertyService from "@/services/property.service";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Link from "next/link";
import { useParams } from "next/navigation";

/* ---------- helpers ---------- */
const FormBlock = ({ heading, children }) => (
  <div className="bg-white shadow p-5 rounded-md">
    <h3 className="text-xl font-semibold mb-5">{heading}</h3>
    <div className="flex flex-col gap-4">{children}</div>
  </div>
);

const Badge = ({ label, active, onClick }) => (
  <span
    onClick={onClick}
    className={`px-2 py-1 sm:px-4 sm:py-2 sm:text-sm text-xs sm:font-semibold rounded-full cursor-pointer transition ${
      active
        ? "border-blue-500 bg-blue-100 text-blue-500"
        : "bg-gray-200 text-gray-600 border-transparent"
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
export default function page() {
  const basicInputStyles = "border border-gray-300 rounded-md px-3 py-2";

  const { value: token, isLoaded } = useLocalStorage("agentToken", null);
  const id = useParams().propertyId;
  const [property, setProperty] = useState(null);

  useEffect(() => {
    propertyService
      .getPropertyById(id)
      .then((res) => {
        if (res.success) {
          setProperty(res.data);
        } else {
          console.log(res.message);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  console.log(property);
  

  /* ---------- media ---------- */
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(""); // <-- NEW
  const [previewList, setPreviewList] = useState([]);
  const [thumbIndex, setThumbIndex] = useState(0);

  /* ---------- choices ---------- */
  const [purpose, setPurpose] = useState("Sell");
  const [type, setType] = useState("residential");
  const [subType, setSubType] = useState("House");

  const subTypes = {
    residential: [
      "House",
      "Flat",
      "Upper Portion",
      "Lower Portion",
      "Farm House",
      "Room",
      "Penthouse",
    ],
    plot: [
      "Residential Plot",
      "Commercial Plot",
      "Agricultural Land",
      "Industrial Land",
      "Plot File",
      "Plot Form",
    ],
    commercial: ["Office", "Shop", "Warehouse", "Factory", "Building", "Other"],
  };
  useEffect(() => setSubType(subTypes[type][0]), [type]);

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

  /* ---------- fields ---------- */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [paymentPlan, setPaymentPlan] = useState("Monthly");
  const [adType, setAdType] = useState("none");
  const [phase, setPhase] = useState("Phase 1");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("Marla");
  const [otherText, setOtherText] = useState("");

  /* ---------- ui ---------- */
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  /* ---------- validation ---------- */
  const isValid =
    title.trim() &&
    purpose &&
    type &&
    subType &&
    phase &&
    address.trim() &&
    price &&
    area.trim() &&
    areaUnit &&
    imageFiles.length > 0;

  /* ---------- media helpers ---------- */
  const fileToPreview = (file) =>
    new Promise((res) => {
      const reader = new FileReader();
      reader.onload = (e) => res({ url: e.target.result, name: file.name });
      reader.readAsDataURL(file);
    });

  const triggerImagePicker = () =>
    document.getElementById("image-input").click();
  const triggerVideoPicker = () =>
    document.getElementById("video-input").click();

  const addImages = async (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = await Promise.all(files.map(fileToPreview));
    setImageFiles((prev) => [...prev, ...files]);
    setPreviewList((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (idx) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviewList((prev) => prev.filter((_, i) => i !== idx));
    if (thumbIndex === idx) setThumbIndex(0);
  };

  const addVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) return alert("Video must be ≤ 50 MB");
    setVideoFile(file);
    // generate preview url for local video element
    setVideoPreview(URL.createObjectURL(file));
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview("");
  };

  /* ---------- Cloudinary upload (works for both image & video) ---------- */
  const uploadToCloudinary = async (file, resourceType = "image") => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "dha-agency-logo"); // <-- your preset (must allow video)

      const url = `https://api.cloudinary.com/v1_1/dhdgrfseu/${resourceType}/upload`;
      const { data } = await axios.post(url, fd);
      return data.secure_url;
    } catch (error) {
      // make caller abort submission
      throw new Error("Cloudinary upload failed");
    }
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setToast(null);

    try {
      const imageUrls = await Promise.all(
        imageFiles.map((f) => uploadToCloudinary(f, "image"))
      );
      const videoUrl = videoFile
        ? await uploadToCloudinary(videoFile, "video")
        : "";

      const payload = {
        title: title.trim(),
        description: description.trim(),
        adType,
        category: purpose,
        paymentPlan,
        type,
        subType,
        phase,
        address: address.trim(),
        price,
        area: area.trim(),
        areaUnit,
        bedrooms,
        bathrooms,
        otherFeatures: otherText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        images: imageUrls,
        video: videoUrl,
        thumbnailImage: imageUrls[thumbIndex],
      };

      /* TODO: await propertyService.addProperty(payload); */
      const res = await propertyService.addProperty(payload, token);
      setToast(res);

      if (res.success) {
        /* ======  CLEAR FORM ON SUCCESS  ====== */
        setTitle("");
        setDescription("");
        setAdType("none");
        setPurpose("Sell");
        setPaymentPlan("Monthly");
        setType("residential");
        setSubType(subTypes.residential[0]);
        setPhase("Phase 1");
        setAddress("");
        setPrice("");
        setArea("");
        setAreaUnit("Marla");
        setBedrooms("");
        setBathrooms("");
        setOtherText("");
        setImageFiles([]);
        setPreviewList([]);
        setVideoFile(null);
        setVideoPreview(""); // <-- NEW
        setThumbIndex(0);
        window.location.reload();
      }
    } catch (err) {
      // Cloudinary failed -> show error toast and DO NOT call backend
      setToast({ success: false, message: "Upload failed, please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AlertResult
        data={toast}
        onClose={() => {
          setToast(null);
        }}
      />

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
          id="video-input"
          type="file"
          accept="video/*"
          onChange={addVideo}
          className="hidden"
        />

        {/* ---------- Property Media (TOP) ---------- */}
        <FormBlock heading="Property Media">
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
                  onClick={() => setThumbIndex(i)}
                  className={`relative cursor-pointer rounded overflow-hidden border-2 ${
                    thumbIndex === i ? "border-blue-600" : "border-transparent"
                  }`}
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
              Property Video (≤ 50 MB)
            </label>
            <button
              type="button"
              onClick={triggerVideoPicker}
              className="px-4 py-2 text-sm font-semibold rounded-full bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300 transition"
            >
              + Add Video
            </button>
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
          <label className="text-sm font-semibold mb-1">Property Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={basicInputStyles}
            type="text"
            placeholder="Enter Title for your Property"
            required
          />

          <label className="text-sm font-semibold mb-1">
            Property Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your property (optional)"
            className={`${basicInputStyles} min-h-[100px]`}
          />

          <label className="text-sm font-semibold mb-1">
            Advertisement Type
          </label>
          <select
            value={adType}
            onChange={(e) => setAdType(e.target.value)}
            className={basicInputStyles}
          >
            <option value="none">None</option>
            <option value="classifiedAds">Classified Ad</option>
            <option value="videoAds">Video Ad</option>
            <option value="featureAds">Feature Ads</option>
          </select>
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
              <Tab
                value="residential"
                current={type}
                set={setType}
                label="Residential"
              />
              <Tab value="plot" current={type} set={setType} label="Plot" />
              <Tab
                value="commercial"
                current={type}
                set={setType}
                label="Commercial"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">
              Sub-type *
            </label>
            <div className="flex flex-wrap gap-3">
              {subTypes[type].map((st) => (
                <Badge
                  key={st}
                  label={st}
                  active={subType === st}
                  onClick={() => setSubType(st)}
                />
              ))}
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
                <option key={i + 1} value={`Phase ${i + 1}`}>{`Phase ${
                  i + 1
                }`}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2 block">
              Enter Location Address *
            </label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              placeholder="e.g. 209 Sector A, Phase 1"
              className={basicInputStyles}
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
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="Enter Price"
              className={basicInputStyles}
              required
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

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2 block">
              Other Features (optional)
            </label>
            <input
              type="text"
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              placeholder="e.g. Swimming Pool, Gym, Security"
              className={basicInputStyles}
            />
          </div>
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
