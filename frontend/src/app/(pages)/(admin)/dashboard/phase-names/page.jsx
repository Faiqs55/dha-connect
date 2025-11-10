"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import phaseService from "@/services/phase.service";
import AlertResult from "@/Components/AlertResult";
import { FiUsers, FiToggleLeft, FiToggleRight, FiRefreshCcw } from "react-icons/fi";

const defaultForm = {
  name: "",
  isActive: true,
};

export default function PhaseNamesPage() {
  const { value: userToken, isLoaded } = useLocalStorage("authToken", null);
  const [phaseNames, setPhaseNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const sortedPhaseNames = useMemo(() => {
    const active = phaseNames.filter((item) => item.isActive);
    const inactive = phaseNames.filter((item) => !item.isActive);

    active.sort((a, b) => a.name.localeCompare(b.name));
    inactive.sort((a, b) => a.name.localeCompare(b.name));

    return [...active, ...inactive];
  }, [phaseNames]);

  const fetchPhaseNames = async () => {
    setRefreshing(true);
    try {
      const res = await phaseService.getPhaseNames(true);
      if (res?.success) {
        setPhaseNames(res.data || []);
      } else {
        setPhaseNames([]);
        setToast({ success: false, message: res?.message || "Failed to load phase names" });
      }
    } catch (error) {
      console.error("Error fetching phase names:", error);
      setToast({ success: false, message: "An unexpected error occurred while loading phase names" });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchPhaseNames();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userToken) {
      setToast({ success: false, message: "Authentication required" });
      return;
    }

    if (!form.name.trim()) {
      setToast({ success: false, message: "Phase name is required" });
      return;
    }

    setSubmitting(true);
    setToast(null);

    try {
      const payload = {
        name: form.name.trim(),
        isActive: form.isActive,
      };

      const res = await phaseService.createPhaseName(userToken, payload);
      setToast({
        success: res?.success,
        message:
          res?.message ||
          (res?.success ? "Phase name created successfully" : "Failed to create phase name"),
      });

      if (res?.success) {
        setForm(defaultForm);
        fetchPhaseNames();
      }
    } catch (error) {
      console.error("Error creating phase name:", error);
      setToast({ success: false, message: "An error occurred while creating the phase name" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (phaseName) => {
    if (!userToken) {
      setToast({ success: false, message: "Authentication required" });
      return;
    }

    try {
      const res = await phaseService.updatePhaseName(userToken, phaseName._id, {
        isActive: !phaseName.isActive,
      });

      setToast({
        success: res?.success,
        message:
          res?.message ||
          (res?.success ? "Phase name status updated" : "Failed to update phase name"),
      });

      if (res?.success) {
        setPhaseNames((prev) =>
          prev.map((item) =>
            item._id === phaseName._id ? { ...item, isActive: !phaseName.isActive } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating phase name:", error);
      setToast({ success: false, message: "An error occurred while updating status" });
    }
  };

  return (
    <>
      <AlertResult data={toast} onClose={() => setToast(null)} />

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 mb-2">Phase Names</h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Manage the catalogue of DHA phase names that appear in file rate forms. Activate or
            deactivate entries without removing historical associations.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchPhaseNames}
          disabled={refreshing}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <FiUsers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Add Phase Name</h2>
              <p className="text-sm text-slate-500">Create a reusable label for file rate entries.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700" htmlFor="name">
                Phase Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. DHA Lahore Phase 10 File Price"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-slate-700">Mark as active</span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {submitting ? "Saving..." : "Create Phase Name"}
            </button>
          </form>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Existing Phase Names</h2>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              {sortedPhaseNames.length} Total
            </span>
          </div>

          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            </div>
          ) : sortedPhaseNames.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-sm font-medium text-slate-600">
                No phase names yet. Create your first entry using the form on the left.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {sortedPhaseNames.map((phaseName) => {
                const isActive = phaseName.isActive;
                return (
                  <li
                    key={phaseName._id}
                    className="flex flex-col gap-3 rounded-lg border border-slate-200 px-4 py-3 shadow-sm transition hover:border-indigo-200 hover:shadow"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">{phaseName.name}</h3>
                        <p className="text-xs text-slate-500">{phaseName._id}</p>
                      </div>
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${
                          isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex gap-3 text-xs text-slate-500">
                        <span>
                          Created: {new Date(phaseName.createdAt).toLocaleDateString()}
                        </span>
                        <span>
                          Updated: {new Date(phaseName.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleActive(phaseName)}
                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                          isActive
                            ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {isActive ? (
                          <FiToggleLeft className="h-4 w-4" />
                        ) : (
                          <FiToggleRight className="h-4 w-4" />
                        )}
                        {isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}


