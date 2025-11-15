"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AlertResult from "@/Components/AlertResult";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import electedBodiesService from "@/services/electedBodies.service";
import { FiArrowLeft, FiUpload, FiX } from "react-icons/fi";
import { getElectedBodyPhotoUrl } from "@/utils/getFileUrl";

const defaultForm = {
  name: "",
  designation: "",
  email: "",
  whatsappNo: "",
  agencyBelong: "",
  profileSummary: "",
  uploadVideo: "",
  status: "current",
  isActive: true,
};

export default function EditElectedMemberPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params?.memberId;
  const { value: token } = useLocalStorage("authToken", null);
  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchMember = async () => {
      if (!memberId) return;
      setLoading(true);
      try {
        const res = await electedBodiesService.getMemberById(memberId);
        if (!res?.success) {
          throw new Error(res?.message || "Failed to load member details");
        }
        setFormData({
          name: res.data.name || "",
          designation: res.data.designation || "",
          email: res.data.email || "",
          whatsappNo: res.data.whatsappNo || "",
          agencyBelong: res.data.agencyBelong || "",
          profileSummary: res.data.profileSummary || "",
          uploadVideo: res.data.uploadVideo || "",
          status: res.data.status || "current",
          isActive:
            typeof res.data.isActive === "boolean" ? res.data.isActive : true,
        });
        setPhotoPreview(getElectedBodyPhotoUrl(res.data.photo) || "");
      } catch (error) {
        console.error(error);
        setToast({ success: false, message: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId]);

  const handleChange = (field) => (event) => {
    const value =
      field === "isActive"
        ? event.target.checked
        : event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setToast({ success: false, message: "Please select a valid image file" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setToast({ success: false, message: "Image size must be under 5MB" });
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removeSelectedPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      setToast({
        success: false,
        message: "Authentication required to update member",
      });
      return;
    }

    if (!photoPreview) {
      setToast({
        success: false,
        message: "Profile photo is required",
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        email: formData.email?.trim() || undefined,
        whatsappNo: formData.whatsappNo?.trim() || undefined,
        agencyBelong: formData.agencyBelong?.trim() || undefined,
        profileSummary: formData.profileSummary?.trim() || undefined,
        uploadVideo: formData.uploadVideo?.trim() || undefined,
      };

      // Only include photo if a new file was selected
      if (photoFile) {
        payload.photo = photoFile;
      }

      const res = await electedBodiesService.updateMember(
        token,
        memberId,
        payload
      );

      if (!res?.success) {
        throw new Error(res?.message || "Failed to update member");
      }

      setToast({
        success: true,
        message: res.message || "Member updated successfully",
      });

      setTimeout(() => {
        router.push("/dashboard/elected-bodies");
      }, 700);
    } catch (error) {
      console.error(error);
      setToast({ success: false, message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-500" />
      </div>
    );
  }

  return (
    <>
      <AlertResult data={toast} onClose={() => setToast(null)} />

      <div className="mb-6 flex items-center gap-4 text-sm">
        <Link
          href="/dashboard/elected-bodies"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
        >
          <FiArrowLeft />
          Back to Members
        </Link>
      </div>

      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          Edit Elected Body Member
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Update the profile to reflect the latest leadership information and
          keep residents in the loop with fresh details.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10"
      >
        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Profile Photo *
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            {!photoPreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-40 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50/50"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow">
                  <FiUpload className="text-xl text-indigo-500" />
                </span>
                <span className="font-medium text-slate-700">
                  Click to upload profile photo
                </span>
                <span className="text-xs text-slate-400">
                  PNG, JPG up to 5MB
                </span>
              </button>
            ) : (
              <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-slate-200">
                <img
                  src={photoPreview}
                  alt="Selected profile"
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600 shadow hover:bg-white"
                  >
                    <FiUpload className="text-sm" />
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={removeSelectedPhoto}
                    className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-rose-600 shadow hover:bg-white"
                  >
                    <FiX className="text-sm" />
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Full Name *
            </label>
            <input
              required
              value={formData.name}
              onChange={handleChange("name")}
              placeholder="Enter member name"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Designation *
            </label>
            <input
              required
              value={formData.designation}
              onChange={handleChange("designation")}
              placeholder="e.g. President, General Secretary"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              placeholder="name@dha.org"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              WhatsApp Number
            </label>
            <input
              value={formData.whatsappNo}
              onChange={handleChange("whatsappNo")}
              placeholder="+92 300 0000000"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Agency / Committee
            </label>
            <input
              value={formData.agencyBelong}
              onChange={handleChange("agencyBelong")}
              placeholder="Associated agency or committee (optional)"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Profile Summary
            </label>
            <textarea
              rows={5}
              value={formData.profileSummary}
              onChange={handleChange("profileSummary")}
              placeholder="Highlight noteworthy achievements, focus areas, and a message for the community."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Highlight Video URL
            </label>
            <input
              value={formData.uploadVideo}
              onChange={handleChange("uploadVideo")}
              placeholder="https://youtube.com/embed/..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid gap-5 rounded-2xl bg-slate-50 p-5 md:grid-cols-2 md:p-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Member Status
              </label>
              <select
                value={formData.status}
                onChange={handleChange("status")}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="current">Current Body</option>
                <option value="old">Previous Body</option>
              </select>
            </div>

            <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
              <div>
                <p className="font-medium text-slate-800">Active Member</p>
                <p className="text-xs text-slate-500">
                  Toggle off to archive this profile from the public view.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange("isActive")}
                className="h-5 w-5 accent-indigo-600"
              />
            </label>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/elected-bodies")}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Updating..." : "Update Member"}
          </button>
        </div>
      </form>
    </>
  );
}