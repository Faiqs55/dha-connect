"use client";
import { useState, useRef } from "react";
import { FaRegTrashAlt, FaUpload, FaGlobe, FaMapMarkerAlt, FaUserTie, FaShareAlt, FaVideo } from "react-icons/fa";
import { MdBusiness, MdEmail, MdPhone, MdInfo, MdLock } from "react-icons/md";
import { useRouter } from "next/navigation";
import AlertResult from "@/Components/AlertResult";
import Link from "next/link";

/* ---------- helpers ---------- */
const FormBlock = ({ heading, children, icon }) => (
  <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-100">
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
      {icon}
      <h3 className="text-xl font-bold text-gray-800">{heading}</h3>
    </div>
    <div className="flex flex-col gap-5">{children}</div>
  </div>
);

const FormInput = ({ label, name, value, onChange, type = "text", required = false, placeholder, icon }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-700">
      {icon}
      <span>{label}{required && <span className="text-red-500 ml-1">*</span>}</span>
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
    />
  </div>
);

const FormSelect = ({ label, name, value, onChange, options, required = false, icon }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-700">
      {icon}
      <span>{label}{required && <span className="text-red-500 ml-1">*</span>}</span>
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
    >
      {options.map((opt) => (
        <option key={opt.val} value={opt.val}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const FormTextarea = ({ label, name, value, onChange, required = false, placeholder, rows = 4, icon }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-700">
      {icon}
      <span>{label}{required && <span className="text-red-500 ml-1">*</span>}</span>
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
    />
  </div>
);

/* ---------- static data ---------- */
const cityOpts = [
  { val: "lahore", label: "Lahore" },
  { val: "karachi", label: "Karachi" },
  { val: "multan", label: "Multan" },
  { val: "islamabad", label: "Islamabad" },
  { val: "rawalpindi", label: "Rawalpindi" },
  { val: "faisalabad", label: "Faisalabad" },
];

const phaseOpts = Array.from({ length: 10 }, (_, i) => ({
  val: `phase${i + 1}`,
  label: `Phase ${i + 1}`,
}));

const emptyForm = {
  agencyName: "",
  password: "",
  agencyEmail: "",
  ceoName: "",
  ceoPhone: "",
  whatsapp: "",
  city: cityOpts[0].val,
  phase: phaseOpts[0].val,
  address: "",
  facebook: "",
  youtube: "",
  twitter: "",
  instagram: "",
  about: "",
  website: "",
};

export default function CreateAgencyPage() {
  const router = useRouter();

  /* ---------- state ---------- */
  const [form, setForm] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const logoFileRef = useRef(null);
  const videoFileRef = useRef(null);

  /* ---------- generic field handler ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  /* ---------- logo handlers ---------- */
  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setToast({ success: false, message: "Logo must be less than 5MB" });
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (logoFileRef.current) logoFileRef.current.value = "";
  };

  const triggerLogoPicker = () => logoFileRef.current?.click();

  /* ---------- video handlers ---------- */
  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      setToast({ success: false, message: "Video must be less than 100MB" });
      return;
    }
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    if (videoFileRef.current) videoFileRef.current.value = "";
  };

  const triggerVideoPicker = () => videoFileRef.current?.click();

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!logoFile) {
      setToast({ success: false, message: "Agency logo is required" });
      return;
    }

    setSubmitting(true);
    setToast(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      // Append logo file
      formData.append('agencyLogo', logoFile);

      // Append video file if exists
      if (videoFile) {
        formData.append('agencyVideo', videoFile);
      }

      // Save agency with file upload using fetch directly since we need FormData
      const apiURL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiURL}/agency`, {
        method: "POST",
        body: formData,
        // Note: Don't set Content-Type header when using FormData,
        // let the browser set it with the correct boundary
      });

      const result = await res.json();

      setToast({
        success: result.success,
        message: result.message || (result.success ? "Agency created successfully" : "Failed to create agency"),
      });

      if (result.success) {
        // Reset form
        setForm(emptyForm);
        setLogoFile(null);
        setLogoPreview(null);
        setVideoFile(null);
        setVideoPreview(null);
        
        // Clear file inputs
        if (logoFileRef.current) logoFileRef.current.value = "";
        if (videoFileRef.current) videoFileRef.current.value = "";
      }
    } catch (err) {
      setToast({ success: false, message: err.message || "An error occurred while creating agency" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AlertResult data={toast} onClose={() => setToast(null)} />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm mb-4 transition-colors"
              href="/"
            >
              <span className="mr-2">←</span>
              Back to Home
            </Link>
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg rounded-xl p-8 text-center">
              <h1 className="text-4xl font-bold mb-4">Create New Agency</h1>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                Start your journey by creating your agency profile. Fill in the details below to get started.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hidden file inputs */}
            <input
              type="file"
              hidden
              ref={logoFileRef}
              accept="image/*"
              onChange={handleLogo}
            />
            <input
              type="file"
              hidden
              ref={videoFileRef}
              accept="video/*"
              onChange={handleVideo}
            />

            {/* ------- Media Upload Section ------- */}
            <FormBlock 
              heading="Media Upload" 
              icon={<FaUpload className="text-blue-600 text-lg" />}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Logo Upload */}
                <div>
                  <label className="text-sm font-semibold mb-3 block text-gray-700">
                    Agency Logo *
                  </label>
                  {!logoPreview ? (
                    <div
                      onClick={triggerLogoPicker}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaUpload className="text-gray-400 text-2xl" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Upload Agency Logo</p>
                          <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative bg-white border border-gray-200 rounded-xl p-4">
                      <img 
                        src={logoPreview} 
                        alt="Agency logo preview" 
                        className="w-32 h-32 object-contain mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute top-2 right-2 bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-colors shadow-lg"
                      >
                        <FaRegTrashAlt className="text-sm" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Video Upload */}
                <div>
                  <label className="text-sm font-semibold mb-3 block text-gray-700">
                    Agency Video (Optional)
                  </label>
                  {!videoPreview ? (
                    <div
                      onClick={triggerVideoPicker}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaVideo className="text-gray-400 text-2xl" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Upload Agency Video</p>
                          <p className="text-sm text-gray-500 mt-1">MP4, MOV up to 100MB</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative bg-white border border-gray-200 rounded-xl p-4">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute top-2 right-2 bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-colors shadow-lg"
                      >
                        <FaRegTrashAlt className="text-sm" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </FormBlock>

            {/* ------- Agency Information ------- */}
            <FormBlock 
              heading="Agency Information" 
              icon={<MdBusiness className="text-blue-600 text-lg" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Agency Name"
                  name="agencyName"
                  value={form.agencyName}
                  onChange={handleChange}
                  required={true}
                  placeholder="Enter your agency name"
                  icon={<MdBusiness className="text-gray-400" />}
                />
                <FormInput
                  label="Agency Email"
                  name="agencyEmail"
                  type="email"
                  value={form.agencyEmail}
                  onChange={handleChange}
                  required={true}
                  placeholder="agency@example.com"
                  icon={<MdEmail className="text-gray-400" />}
                />
                <FormInput
                  label="Admin Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required={true}
                  placeholder="Create a strong password"
                  icon={<MdLock className="text-gray-400" />}
                />
                <FormInput
                  label="Website"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://youragency.com"
                  icon={<FaGlobe className="text-gray-400" />}
                />
              </div>
            </FormBlock>

            {/* ------- CEO Information ------- */}
            <FormBlock 
              heading="CEO Information" 
              icon={<FaUserTie className="text-blue-600 text-lg" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="CEO Name"
                  name="ceoName"
                  value={form.ceoName}
                  onChange={handleChange}
                  required={true}
                  placeholder="Enter CEO full name"
                  icon={<FaUserTie className="text-gray-400" />}
                />
                <FormInput
                  label="CEO Phone"
                  name="ceoPhone"
                  value={form.ceoPhone}
                  onChange={handleChange}
                  required={true}
                  placeholder="+92 300 1234567"
                  icon={<MdPhone className="text-gray-400" />}
                />
                <FormInput
                  label="WhatsApp Number"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  icon={<MdPhone className="text-gray-400" />}
                />
              </div>
            </FormBlock>

            {/* ------- Location Information ------- */}
            <FormBlock 
              heading="Location" 
              icon={<FaMapMarkerAlt className="text-blue-600 text-lg" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  options={cityOpts}
                  icon={<FaMapMarkerAlt className="text-gray-400" />}
                />
                <FormSelect
                  label="Phase"
                  name="phase"
                  value={form.phase}
                  onChange={handleChange}
                  options={phaseOpts}
                  icon={<FaMapMarkerAlt className="text-gray-400" />}
                />
                <div className="md:col-span-2">
                  <FormTextarea
                    label="Street Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter complete street address"
                    rows={3}
                    icon={<FaMapMarkerAlt className="text-gray-400" />}
                  />
                </div>
              </div>
            </FormBlock>

            {/* ------- Social Media ------- */}
            <FormBlock 
              heading="Social Media" 
              icon={<FaShareAlt className="text-blue-600 text-lg" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Facebook"
                  name="facebook"
                  value={form.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/yourpage"
                  icon={<span className="text-blue-600 font-bold">f</span>}
                />
                <FormInput
                  label="YouTube"
                  name="youtube"
                  value={form.youtube}
                  onChange={handleChange}
                  placeholder="https://youtube.com/yourchannel"
                  icon={<span className="text-red-600 font-bold">YT</span>}
                />
                <FormInput
                  label="Twitter"
                  name="twitter"
                  value={form.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/yourhandle"
                  icon={<span className="text-blue-400 font-bold">𝕏</span>}
                />
                <FormInput
                  label="Instagram"
                  name="instagram"
                  value={form.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/yourprofile"
                  icon={<span className="text-pink-600 font-bold">IG</span>}
                />
              </div>
            </FormBlock>

            {/* ------- About Agency ------- */}
            <FormBlock 
              heading="About Agency" 
              icon={<MdInfo className="text-blue-600 text-lg" />}
            >
              <FormTextarea
                label="About Your Agency"
                name="about"
                value={form.about}
                onChange={handleChange}
                placeholder="Tell us about your agency, your mission, and what makes you special..."
                rows={6}
                icon={<MdInfo className="text-gray-400" />}
              />
            </FormBlock>

            {/* ------- Submit Button ------- */}
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {submitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Agency...
                  </div>
                ) : (
                  "Create Agency Account"
                )}
              </button>
              
              <p className="text-center text-gray-500 text-sm mt-3">
                By creating an agency account, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}