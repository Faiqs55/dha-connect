"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { MdOutlineGroupAdd } from "react-icons/md";
import AlertResult from "@/Components/AlertResult";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import electedBodiesService from "@/services/electedBodies.service";

const statusBadges = {
  current: "bg-emerald-100 text-emerald-700",
  old: "bg-slate-200 text-slate-700",
};

const activeBadges = {
  true: "bg-indigo-100 text-indigo-700",
  false: "bg-rose-100 text-rose-700",
};

const statusOptions = [
  { label: "All Status", value: "" },
  { label: "Current", value: "current" },
  { label: "Previous", value: "old" },
];

const activeOptions = [
  { label: "All Members", value: "" },
  { label: "Active Only", value: "true" },
  { label: "Inactive Only", value: "false" },
];

export default function ElectedBodiesDashboard() {
  const router = useRouter();
  const { value: token } = useLocalStorage("authToken", null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await electedBodiesService.getMembers({
        status: statusFilter,
        isActive: activeFilter,
        search: searchTerm,
      });

      if (!res?.success) {
        throw new Error(res?.message || "Unable to load elected body members");
      }

      setMembers(res.data || []);
    } catch (error) {
      console.error(error);
      setToast({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, activeFilter]);

  const filteredMembers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return members;

    return members.filter((member) => {
      const fields = [
        member.name,
        member.designation,
        member.email,
        member.whatsappNo,
        member.agencyBelong,
        member.status,
      ];

      return fields
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term));
    });
  }, [members, searchTerm]);

  const handleDelete = async (id) => {
    if (!token) {
      setToast({
        success: false,
        message: "Authentication required to delete member",
      });
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to remove this elected body member?"
    );
    if (!confirmDelete) return;

    try {
      const res = await electedBodiesService.deleteMember(token, id);
      if (!res?.success) {
        throw new Error(res?.message || "Failed to delete member");
      }
      setToast({ success: true, message: res.message });
      fetchMembers();
    } catch (error) {
      console.error(error);
      setToast({ success: false, message: error.message });
    }
  };

  return (
    <>
      <AlertResult data={toast} onClose={() => setToast(null)} />

      <div className="mb-6">
        <Link
          className="text-gray-500 font-semibold text-sm underline hover:text-gray-700 transition"
          href={"/dashboard"}
        >
          {"<< Back to Dashboard"}
        </Link>
      </div>

      <header className="mb-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Elected Bodies
            </h1>
            <p className="mt-2 text-sm text-slate-500 max-w-2xl">
              Manage the leadership roster, update profiles, and keep the
              community informed with an accurate list of elected officials.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard/elected-bodies/add")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 hover:shadow-indigo-500/20"
          >
            <MdOutlineGroupAdd className="text-lg" />
            Add Members
          </button>
        </div>
      </header>

      <section className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr),minmax(0,340px)]">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center px-3 text-slate-400">
            <FiSearch />
          </div>
          <input
            type="text"
            placeholder="Search by name, designation, email or agency..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            {statusOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={activeFilter}
            onChange={(event) => setActiveFilter(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            {activeOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-72 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-500" />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <p className="text-lg font-semibold text-slate-700">
              No members found
            </p>
            <p className="max-w-xs text-sm text-slate-500">
              Try adjusting your filters or add new members to bring this panel
              to life.
            </p>
            <button
              onClick={() => router.push("/dashboard/elected-bodies/add")}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-5 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              <MdOutlineGroupAdd />
              Add your first member
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Member
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Agency
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredMembers.map((member) => (
                  <tr
                    key={member._id}
                    className="transition hover:bg-indigo-50/40"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          {member.photo ? (
                            <img
                              src={member.photo}
                              alt={member.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-500">
                              N/A
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {member.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {member.designation}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm text-slate-600">
                        {member.email && (
                          <p className="flex items-center gap-2 break-all">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-semibold uppercase text-indigo-600">
                              @
                            </span>
                            {member.email}
                          </p>
                        )}
                        {member.whatsappNo && (
                          <p className="flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold uppercase text-emerald-600">
                              WA
                            </span>
                            {member.whatsappNo}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {member.agencyBelong || "—"}
                      </p>
                      {member.profileSummary && (
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {member.profileSummary}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusBadges[member.status] || "bg-slate-100 text-slate-600"}`}
                        >
                          <span className="h-2 w-2 rounded-full bg-current" />
                          {member.status === "current"
                            ? "Current Body"
                            : "Previous Body"}
                        </span>
                        <span
                          className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                            activeBadges[member.isActive]
                          }`}
                        >
                          <span className="h-2 w-2 rounded-full bg-current" />
                          {member.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/elected-bodies/${member._id}/edit`)
                          }
                          className="inline-flex items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 p-2 text-indigo-600 transition hover:bg-indigo-100"
                          title="Edit member"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(member._id)}
                          className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                          title="Delete member"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

