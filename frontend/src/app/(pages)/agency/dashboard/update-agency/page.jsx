"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegTrashAlt } from "react-icons/fa";
import axios from "axios";
import agencyService from "@/services/agency.service";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import ContainerCenter from "@/Components/ContainerCenter";
import AgencyFormSection from "@/Components/AgencyFormSection";
import AgencyFormInput from "@/Components/AgencyFormInput";
import AgencyFormSelect from "@/Components/AgencyFormSelect";
import AlertResult from "@/Components/AlertResult";
import Link from "next/link";

/* ---------- static selects ---------- */
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

/* ---------- initial empty state ---------- */
const empty = {
  agencyName: "",
  agencyVideo: "",
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

export default function UpdateAgencyPage() {
  const router = useRouter();
  const { value: token, isLoaded } = useLocalStorage("agencyToken", null);

  /* ---------- local state ---------- */
  const [form, setForm] = useState(empty);
  const [logoFile, setLogoFile] = useState(null); // new file
  const [preview, setPreview] = useState(null); // preview url
  const [originalLogo, setOriginalLogo] = useState(null); // url from db
  const [toast, setToast] = useState(null); // AlertResult
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [oldLogoToDelete, setOldLogoToDelete] = useState(null); // public_id or full URL

  const fileRef = useRef(null);

  /* ---------- fetch existing agency ---------- */
  useEffect(() => {
    if (token && isLoaded){      
      agencyService
        .getMyAgency(token)
        .then((res) => {
          if (res.success) {
            const a = res.data;
            setForm({ ...empty, ...a });
            if (a.agencyLogo) {
              setOriginalLogo(a.agencyLogo);
              setPreview(a.agencyLogo);
            }
          } else throw new Error(res.message || "Fetch failed");
        })
        .catch((e) => fireToast(false, e.message))
        .finally(() => setLoading(false));
    }
    
  }, [token, isLoaded]);

  

  /* ---------- generic field handler ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // LOGO HELPERS
  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return fireToast(false, "Max 5 MB");
    setLogoFile(file);
    setPreview(URL.createObjectURL(file));
    // ⭐ mark old logo for deletion (we'll do it only if upload succeeds)
    if (originalLogo) setOldLogoToDelete(originalLogo);
  };

  const removeLogo = () => {
    setLogoFile(null);
    setPreview(""); // show empty box
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ---------- toast helper ---------- */
  const fireToast = (ok, msg) => setToast({ success: ok, message: msg });

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return fireToast(false, "Not authenticated");
    setSubmitting(true);

    let logoUrl = originalLogo; // default: keep old

    /* ---------- 1.  upload new logo ---------- */
    if (logoFile) {
      const fd = new FormData();
      fd.append("file", logoFile);
      fd.append("upload_preset", "dha-agency-logo");
      try {
        const { data } = await axios.post(
          `https://api.cloudinary.com/v1_1/dhdgrfseu/image/upload`,
          fd
        );
        logoUrl = data.secure_url;
      } catch {
        fireToast(false, "Logo upload failed");
        setSubmitting(false);
        return;
      }

      /* ---------- 2.  delete previous logo from Cloudinary ---------- */
      if (oldLogoToDelete) {
        // extract public_id from URL  (works for https://res.cloudinary.com/.../v123/public_id.ext)
        const parts = oldLogoToDelete.split("/");
        const public_id = parts[parts.length - 1].split(".")[0];
        try {
          await axios.post("/api/delete-logo", { public_id }); // ← your new endpoint
        } catch (e) {
          console.warn("Could not delete old logo:", e);
        }
      }
    }

    const payload = {
      agencyLogo: logoUrl,
      agencyName: form.agencyName,
      agencyVideo: form.agencyVideo,
      agencyEmail: form.agencyEmail,
      ceoName: form.ceoName,
      ceoPhone: form.ceoPhone,
      whatsapp: form.whatsapp,
      city: form.city,
      phase: form.phase,
      address: form.address,
      facebook: form.facebook,
      youtube: form.youtube,
      twitter: form.twitter,
      instagram: form.instagram,
      about: form.about,
      website: form.website,
    };
    const res = await agencyService.updateAgency(form._id, payload, token);

    fireToast(res.success, res.message || (res.success ? "Updated" : "Failed"));
    if (res.success) {
      setOriginalLogo(logoUrl);
      setLogoFile(null);
      setOldLogoToDelete(null);
      setTimeout(() => window.location.reload(), 1500);
    }
    setSubmitting(false);
  };

  /* ---------- render ---------- */
  if (loading)
    return (
      <ContainerCenter className="py-20 text-center">Loading…</ContainerCenter>
    );

  return (
    <>
      <AlertResult data={toast} onClose={() => setToast(null)} />

      <ContainerCenter>
        <div className="mb-10">
        <Link
          className="text-gray-500 font-bold text-sm underline"
          href={"/agency/dashboard"}
        >
          {"<< Dashboard"}
        </Link>
      </div>
        <h1 className="text-3xl font-semibold mb-6">Update Agency</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ------- logo ------- */}
          <AgencyFormSection title="Agency Logo">
            <input
              type="file"
              hidden
              ref={fileRef}
              accept="image/*"
              onChange={handleLogo}
            />
            {!preview ? (
              <div
                onClick={() => fileRef.current?.click()}
                className="bg-gray-200 py-6 rounded text-center cursor-pointer hover:bg-gray-300"
              >
                Drag & Drop or <span className="underline">Browse</span>
              </div>
            ) : (
              <div className="relative bg-gray-200 py-6 flex justify-center">
                <img src={preview} alt="logo" className="max-h-40" />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute cursor-pointer top-4 right-4 bg-rose-500 text-white p-2 rounded"
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
              label="Agency Video URL"
              name="agencyVideo"
              value={form.agencyVideo}
              onChange={handleChange}
            />
            <AgencyFormInput
              label="Agency Email"
              name="agencyEmail"
              type="email"
              value={form.agencyEmail}
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
              label="WhatsApp"
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
                label={s.charAt(0).toUpperCase() + s.slice(1)}
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
              label="About"
              name="about"
              value={form.about}
              onChange={handleChange}
            />
            <AgencyFormInput
              label="Website"
              name="website"
              value={form.website}
              onChange={handleChange}
            />
          </AgencyFormSection>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? "Updating…" : "Update Agency"}
          </button>
        </form>
      </ContainerCenter>
    </>
  );
}
