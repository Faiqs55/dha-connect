"use client";
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import agencyService from "@/services/agency.service";
import ContainerCenter from "@/Components/ContainerCenter";
import AgencyFormSection from "@/Components/AgencyFormSection";
import AgencyFormInput from "@/Components/AgencyFormInput";
import AgencyFormSelect from "@/Components/AgencyFormSelect";
import AlertResult from "@/Components/AlertResult";

/* ---------- static data ---------- */
const cityOpts = [
  { val: "lahore", label: "Lahore" },
  { val: "karachi", label: "Karachi" },
  { val: "multan", label: "Multan" },
];
const phaseOpts = [
  { val: "phase1", label: "Phase 1" },
  { val: "phase2", label: "Phase 2" },
  { val: "phase3", label: "Phase 3" },
];

const emptyForm = {
  agencyName: "",
  agencyVideo: "",
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

  /* ---------- single state object ---------- */
  const [form, setForm] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /* ---------- generic field handler ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  /* ---------- logo handlers ---------- */
  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024)
      return setToast({ success: false, message: "Max 5 MB" });
    setLogoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeLogo = () => {
    setLogoFile(null);
    setPreview(null);
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!logoFile)
      return setToast({ success: false, message: "Agency logo is required" });

    setSubmitting(true);
    setToast(null);

    /* 1. upload logo */
    const fd = new FormData();
    fd.append("file", logoFile);
    fd.append("upload_preset", "dha-agency-logo");
    let logoUrl;
    try {
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/dhdgrfseu/image/upload`,
        fd
      );
      logoUrl = data.secure_url;
    } catch {
      setToast({ success: false, message: "Logo upload failed" });
      setSubmitting(false);
      return;
    }

    /* 2. save agency */
    const payload = { ...form, agencyLogo: logoUrl };
    const res = await agencyService.addAgency(payload);

    setToast({
      success: res.success,
      message: res.message || (res.success ? "Agency created" : "Failed"),
    });
    if (res.success) {
      setForm(emptyForm);
      setLogoFile(null);
      setPreview(null);
      setTimeout(() => window.location.reload(), 1500);
    }
    setSubmitting(false);
  };

  /* ---------- render ---------- */
  return (
    <>
      <AlertResult data={toast} onClose={() => setToast(null)} />

      <div className="page-head bg-gray-100">
        <ContainerCenter className="py-15">
          <h1 className="text-4xl">Agency Creation Form</h1>
        </ContainerCenter>
      </div>

      <form onSubmit={handleSubmit} className="py-10">
        <ContainerCenter className="space-y-10">
          {/* ------- logo ------- */}
          <AgencyFormSection title="Agency Logo">
            <input
              type="file"
              hidden
              onChange={handleLogo}
              accept="image/*"
            />
            {!preview ? (
              <div
                onClick={(e) => e.currentTarget.querySelector("input")?.click()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleLogo({ target: { files: [file] } });
                }}
                onDragOver={(e) => e.preventDefault()}
                className="bg-gray-200 py-6 rounded text-center cursor-pointer hover:bg-gray-300"
              >
                Drag & Drop or <span className="underline">Browse</span>
                <input type="file" hidden accept="image/*" onChange={handleLogo} />
              </div>
            ) : (
              <div className="relative bg-gray-200 py-6 flex justify-center">
                <img src={preview} alt="logo" className="max-h-40" />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute top-4 right-4 bg-rose-500 text-white p-2 rounded"
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            )}
          </AgencyFormSection>

          {/* ------- agency info ------- */}
          <AgencyFormSection
            title="Agency Information"
            innerStyle="grid md:grid-cols-2 gap-4"
          >
            <AgencyFormInput
              label="Agency Name"
              name="agencyName"
              value={form.agencyName}
              onChange={handleChange}
              required
            />
            <AgencyFormInput
              label="Agency Video URL (Optional)"
              name="agencyVideo"
              value={form.agencyVideo}
              onChange={handleChange}
            />
            <AgencyFormInput
              label="Agency Email"
              type="email"
              name="agencyEmail"
              value={form.agencyEmail}
              onChange={handleChange}
              required
            />
            <AgencyFormInput
              label="Admin Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <AgencyFormInput
              label="CEO Name"
              name="ceoName"
              value={form.ceoName}
              onChange={handleChange}
              required
            />
            <AgencyFormInput
              label="CEO Phone"
              name="ceoPhone"
              value={form.ceoPhone}
              onChange={handleChange}
              required
            />
            <AgencyFormInput
              label="WhatsApp (Optional)"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
            />
          </AgencyFormSection>

          {/* ------- location ------- */}
          <AgencyFormSection
            title="Location"
            innerStyle="grid md:grid-cols-2 gap-4"
          >
            <AgencyFormSelect
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              options={cityOpts}
            />
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
            />
          </AgencyFormSection>

          {/* ------- socials ------- */}
          <AgencyFormSection
            title="Social Media"
            innerStyle="grid md:grid-cols-2 gap-4"
          >
            {["facebook", "youtube", "twitter", "instagram"].map((s) => (
              <AgencyFormInput
                key={s}
                label={`${s.charAt(0).toUpperCase() + s.slice(1)} (Optional)`}
                name={s}
                value={form[s]}
                onChange={handleChange}
              />
            ))}
          </AgencyFormSection>

          {/* ------- about ------- */}
          <AgencyFormSection
            title="About"
            innerStyle="grid md:grid-cols-2 gap-4"
          >
            <AgencyFormInput
              label="About (Optional)"
              name="about"
              value={form.about}
              onChange={handleChange}
            />
            <AgencyFormInput
              label="Website (Optional)"
              name="website"
              value={form.website}
              onChange={handleChange}
            />
          </AgencyFormSection>

          {/* ------- submit ------- */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? "Creating..." : "Create Agency"}
          </button>
        </ContainerCenter>
      </form>
    </>
  );
}