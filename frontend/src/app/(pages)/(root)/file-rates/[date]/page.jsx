"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import phaseService from "@/services/phase.service";
import Link from "next/link";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateForURL(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

function formatCurrencyValue(value, currency) {
  if (value === null || value === undefined || value === "") return "N/A";
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "N/A";
  const formattedRate = numericValue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currency} ${formattedRate}`;
}

function Section({ phaseName, records }) {
  return (
    <section className="mb-8 bg-white border rounded shadow">
      <div className="px-5 py-4 border-b bg-blue-900">
        <h2 className="text-xl font-semibold text-white">{phaseName}</h2>
      </div>

      {records.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-gray-500">No records available for this phase.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-sm text-gray-700 border-b">Description</th>
                <th className="p-3 text-sm text-gray-700 border-b">Category</th>
                <th className="p-3 text-sm text-gray-700 border-b">Property Type</th>
                <th className="p-3 text-sm text-gray-700 border-b">Rate (PKR)</th>
                <th className="p-3 text-sm text-gray-700 border-b">Rate (USD)</th>
                <th className="p-3 text-sm text-gray-700 border-b">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr
                  key={record._id || index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-3 border-b text-sm text-gray-700">
                    {record.description}
                  </td>
                  <td className="p-3 border-b text-sm text-gray-700">
                    {record.categoryType || "Allocation"}
                  </td>
                  <td className="p-3 border-b text-sm text-gray-700">
                    {record.propertyType || "Residential"}
                  </td>
                  <td className="p-3 border-b text-sm font-semibold text-gray-800">
                    {formatCurrencyValue(record.ratePKR, "PKR")}
                  </td>
                  <td className="p-3 border-b text-sm font-semibold text-gray-800">
                    {formatCurrencyValue(record.rateUSD, "USD")}
                  </td>
                  <td className="p-3 border-b text-sm text-gray-500">
                    {formatDate(record.lastUpdated)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function HistoricalDatePage() {
  const params = useParams();
  const router = useRouter();
  const selectedDate = params.date;
  const [phasesData, setPhasesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allHistoryDates, setAllHistoryDates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const res = await phaseService.getAllPhases();
        if (!res.success || !res.data) {
          setError("Failed to fetch phases");
          return;
        }

        // Filter data for selected date and published records
        const selectedDateStr = formatDateForURL(selectedDate);
        const allDates = new Set();

        // Filter records for the selected date
        const filteredRecords = res.data.filter((record) => {
          if (!record.isPublished) return false;
          
          const recordDateStr = formatDateForURL(record.lastUpdated);
          if (!recordDateStr) return false;

          // Collect all unique dates for navigation
          allDates.add(recordDateStr);

          return recordDateStr === selectedDateStr;
        });

        // Group filtered records by phaseName
        const grouped = {};
        filteredRecords.forEach((record) => {
          const phaseName = record.phaseName;
          if (phaseName) {
            if (!grouped[phaseName]) {
              grouped[phaseName] = [];
            }
            grouped[phaseName].push(record);
          }
        });

        // Convert grouped object to array
        const phasesArray = Object.entries(grouped).map(([phaseName, records]) => ({
          phaseName,
          records: records.sort((a, b) => {
            // Sort by lastUpdated descending (newest first)
            return new Date(b.lastUpdated) - new Date(a.lastUpdated);
          }),
        }));

        setPhasesData(phasesArray);
        setAllHistoryDates(Array.from(allDates).sort().reverse());
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            <p className="mt-4 text-gray-600">Loading historical data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-semibold">Error loading data</p>
            <p className="text-red-600 text-sm mt-2">{error}</p>
            <Link
              href="/file-rates"
              className="mt-4 inline-block text-blue-900 hover:underline"
            >
              ← Back to File Rates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Link
            href="/file-rates"
            className="text-blue-900 hover:underline font-medium inline-flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to File Rates
          </Link>
        </div>

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            DHA Lahore File Rates
          </h1>
          <p className="text-gray-600 mt-2">
            Historical data for {formatDate(selectedDate)}
          </p>
        </header>

        {allHistoryDates.length > 0 && (
          <div className="mb-6 bg-white border rounded-lg p-4 shadow">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Select another date:
            </h3>
            <div className="flex flex-wrap gap-2">
              {allHistoryDates.map((dateStr) => {
                const isSelected = dateStr === selectedDate;
                return (
                  <Link
                    key={dateStr}
                    href={`/file-rates/${dateStr}`}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                      isSelected
                        ? "bg-blue-900 text-white"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {formatDate(dateStr)}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <main>
          {phasesData.length === 0 ? (
            <div className="bg-white border rounded shadow p-8 text-center">
              <p className="text-gray-500">
                No records available for {formatDate(selectedDate)}.
              </p>
            </div>
          ) : (
            phasesData.map((phaseData) => (
              <Section
                key={phaseData.phaseName}
                phaseName={phaseData.phaseName}
                records={phaseData.records}
              />
            ))
          )}
        </main>
      </div>
    </div>
  );
}
