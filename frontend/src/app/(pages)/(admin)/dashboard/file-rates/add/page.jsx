"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import phaseService from "@/services/phase.service";
import AlertResult from "@/Components/AlertResult";
import Link from "next/link";

export default function AddFileRatePage() {
  const router = useRouter();
  const { value: userToken, isLoaded } = useLocalStorage("authToken", null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [phaseNames, setPhaseNames] = useState([]);
  const [phaseNamesLoading, setPhaseNamesLoading] = useState(true);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [form, setForm] = useState({
    phaseName: "",
    description: "",
    ratePKR: "",
    categoryType: "Allocation",
    propertyType: "Residential",
    lastUpdated: getTodayDate(),
    status: "new",
    isPublished: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  useEffect(() => {
    const fetchPhaseNames = async () => {
      setPhaseNamesLoading(true);
      try {
        const res = await phaseService.getPhaseNames();
        if (res?.success) {
          setPhaseNames(res.data || []);
        } else {
          setPhaseNames([]);
          if (res?.message) {
            setToast({ success: false, message: res.message });
          }
        }
      } catch (error) {
        console.error("Error fetching phase names:", error);
        setToast({ success: false, message: "Failed to load phase names" });
      } finally {
        setPhaseNamesLoading(false);
      }
    };

    fetchPhaseNames();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userToken) {
      setToast({ success: false, message: "Authentication required" });
      return;
    }

    setSubmitting(true);
    setToast(null);

    try {
      const payload = {
        phaseName: form.phaseName,
        description: form.description,
        ratePKR: form.ratePKR,
        categoryType: form.categoryType,
        propertyType: form.propertyType,
        lastUpdated: form.lastUpdated,
        status: form.status,
        isPublished: form.isPublished,
      };

      const res = await phaseService.createPhase(userToken, payload);
      setToast({
        success: res.success,
        message: res.message || (res.success ? "Phase record created successfully" : "Failed to create phase record"),
      });

      if (res.success) {
        // Redirect back to file rates page after successful creation
        setTimeout(() => {
          router.push("/dashboard/file-rates");
        }, 1500);
      }
    } catch (error) {
      setToast({ success: false, message: "An error occurred while saving" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoaded || phaseNamesLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <>
      <AlertResult data={toast} onClose={() => setToast(null)} />

      <div className="mb-6">
        <Link
          className="text-gray-500 font-bold text-sm underline hover:text-gray-700 transition"
          href={"/dashboard/file-rates"}
        >
          {"<< Back to File Rates"}
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-800 mb-2">Add File Rate</h1>
        <p className="text-gray-600">Create a new DHA phase file rate and pricing information</p>
      </div>

      <div className="bg-white border border-gray-300 rounded-md p-6 md:p-8">
        {phaseNames.length === 0 && (
          <div className="mb-6 rounded-md bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-900">
            No phase names available. Please create a phase name first before adding file rates.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phase Name <span className="text-red-500">*</span>
              </label>
              <select
                name="phaseName"
                value={form.phaseName}
                onChange={handleChange}
                required
                disabled={phaseNames.length === 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition"
              >
                <option value="">Select Phase Name</option>
                {phaseNames.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition"
                placeholder="e.g., 10 Marla, 5 Marla"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Rate (PKR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="ratePKR"
                value={form.ratePKR}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition"
                placeholder="e.g., 7000000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category Type <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryType"
                value={form.categoryType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition"
              >
                <option value="Allocation">Allocation</option>
                <option value="Affidavit">Affidavit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Property Type <span className="text-red-500">*</span>
              </label>
              <select
                name="propertyType"
                value={form.propertyType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Last Updated <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="lastUpdated"
                value={form.lastUpdated}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition"
              >
                <option value="new">New</option>
                <option value="old">Old</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={form.isPublished}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Published
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Link
              href="/dashboard/file-rates"
              className="flex-1 px-6 py-2.5 border border-gray-300 text-slate-700 rounded-md hover:bg-gray-50 transition text-center font-semibold"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || phaseNames.length === 0}
              className="flex-1 px-6 py-2.5 bg-blue-900 text-white rounded-md hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold"
            >
              {submitting ? "Saving..." : "Add File Rate"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

