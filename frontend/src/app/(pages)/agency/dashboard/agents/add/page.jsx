"use client";
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import axios from "axios";
import agentService from "@/services/agent.service";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import AgencyFormSection from "@/Components/AgencyFormSection";
import AgencyFormInput from "@/Components/AgencyFormInput";
import AlertResult from "@/Components/AlertResult";

import Link from "next/link";

const cloudName = "dhdgrfseu";
const uploadPreset = "dha-agency-logo";

const emptyForm = {
  name: "",
  designation: "",
  phone: "",
  email: "",
  password: "",
  image: "", // Cloudinary URL
};

export default function AddAgentPage() {
  const { value: token } = useLocalStorage("agencyToken", null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /* ---------- generic field ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
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
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file)
      return setToast({ success: false, message: "Agent image is required" });

    setSubmitting(true);
    setToast(null);

    /* 1. upload */
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);
    let url;
    try {
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        fd
      );
      url = data.secure_url;
    } catch {
      setToast({ success: false, message: "Image upload failed" });
      setSubmitting(false);
      return;
    }

    /* 2. save agent */
    const payload = { ...form, image: url };
    const res = await agentService.addAgent(token, payload);

    setToast({
      success: res.success,
      message: res.message || (res.success ? "Agent added" : "Failed"),
    });
    if (res.success) {
      setForm(emptyForm);
      setFile(null);
      setPreview(null);
    }
    setSubmitting(false);
  };

  return (
    <>
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
      <h1 className="text-4xl font-semibold underline mb-6">Add New Agent</h1>

      <form onSubmit={handleSubmit} className="mb-10 mt-5 space-y-8">
        {/* ------- image ------- */}
        <AgencyFormSection title="Agent Image">
          <input type="file" hidden onChange={handleLogo} accept="image/*" />
          {!preview ? (
            <div
              onClick={(e) => e.currentTarget.querySelector("input")?.click()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) handleLogo({ target: { files: [f] } });
              }}
              onDragOver={(e) => e.preventDefault()}
              className="bg-gray-200 py-6 rounded text-center cursor-pointer hover:bg-gray-300"
            >
              Drag & Drop or <span className="underline">Browse</span>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleLogo}
              />
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
            label="Agent Password"
            name="password"
            value={form.password}
            type="password"
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

        {/* ------- submit ------- */}
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {submitting ? "Submitting..." : "Add Agent"}
        </button>
      </form>
    </>
  );
}
