"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import contactService from "@/services/contact.service";
import AlertResult from "@/Components/AlertResult";

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ContactQueriesPage() {
  const { value: userToken, isLoaded } = useLocalStorage("authToken", null);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchQueries = async () => {
    if (!userToken) {
      setToast({
        success: false,
        message: "Authentication required to view contact queries.",
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    const res = await contactService.getContactQueries(userToken);
    if (res.success) {
      setQueries(res.data || []);
    } else {
      setToast({
        success: false,
        message: res.message || "Failed to fetch contact queries",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isLoaded && userToken) {
      fetchQueries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, userToken]);

  const totalQueries = queries.length;
  const latestQuery = useMemo(
    () => (queries.length ? queries[0] : null),
    [queries]
  );

  return (
    <div className="space-y-6">
      <AlertResult data={toast} onClose={() => setToast(null)} />

      <header className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Contact Queries</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review and follow up on inquiries submitted through the public contact form.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            Total Queries: <span className="text-lg">{totalQueries}</span>
          </div>
          {latestQuery && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
              Latest: <span className="font-semibold">{formatDateTime(latestQuery.createdAt)}</span>
            </div>
          )}
        </div>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-72 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-800" />
          </div>
        ) : queries.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm font-medium text-slate-500">
            No contact queries have been received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] table-fixed">
              <colgroup>
                <col className="w-[18%]" />
                <col className="w-[22%]" />
                <col className="w-[18%]" />
                <col className="w-[30%]" />
                <col className="w-[12%]" />
              </colgroup>
              <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-widest text-slate-600">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3 w-1/3">Message</th>
                  <th className="px-4 py-3">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {queries.map((query) => (
                  <tr key={query._id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-4 font-semibold text-slate-900">{query.name}</td>
                    <td className="px-4 py-4">
                      <a className="break-all text-blue-700 hover:underline" href={`mailto:${query.email}`}>
                        {query.email}
                      </a>
                    </td>
                    <td className="px-4 py-4 text-slate-800">{query.subject}</td>
                    <td className="px-4 py-4 text-slate-600">
                      <span className="line-clamp-3 whitespace-pre-wrap break-words">{query.message}</span>
                    </td>
                    <td className="px-4 py-4 text-slate-500">{formatDateTime(query.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


