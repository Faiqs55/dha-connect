"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import phaseService from "@/services/phase.service";
import AlertResult from "@/Components/AlertResult";
import Link from "next/link";
import { FiEdit2, FiTrash2, FiSearch, FiFilter } from "react-icons/fi";

export default function FileRatesPage() {
  const router = useRouter();
  const { value: userToken, isLoaded } = useLocalStorage("authToken", null);
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhaseName, setSelectedPhaseName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const recordsPerPage = 8;

  const fetchPhases = async () => {
    setLoading(true);
    try {
      // Use new public API endpoint (no token needed for GET)
      const res = await phaseService.getAllPhases();
      if (res.success) {
        setPhases(res.data || []);
      } else {
        console.error("Failed to fetch phases:", res.message);
        setToast({ success: false, message: res.message || "Failed to fetch phases" });
      }
    } catch (error) {
      console.error("Error in fetchPhases:", error);
      setToast({ 
        success: false, 
        message: error.message || "An error occurred while fetching phases. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchPhases();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const handleEdit = (phase) => {
    router.push(`/dashboard/file-rates/${phase._id}/edit`);
  };

  const handleDelete = async (phase) => {
    if (!userToken) {
      setToast({ success: false, message: "Authentication required" });
      return;
    }

    if (!confirm(`Are you sure you want to delete this record for ${phase.phaseName}?`)) {
      return;
    }

    try {
      const res = await phaseService.deletePhase(userToken, phase._id);
      setToast({
        success: res.success,
        message: res.message || (res.success ? "Record deleted successfully" : "Failed to delete record"),
      });

      if (res.success) {
        fetchPhases();
      }
    } catch (error) {
      setToast({ success: false, message: "An error occurred while deleting" });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrencyValue = (value, currency) => {
    if (value === null || value === undefined || value === "") return "N/A";
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return "N/A";
    const formattedRate = numericValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${currency} ${formattedRate}`;
  };

  // Get unique phase names for filter dropdown
  const uniquePhaseNames = Array.from(
    new Set(phases.map((phase) => phase.phaseName).filter(Boolean))
  ).sort();

  // Helper function to format date for comparison (YYYY-MM-DD)
  const formatDateForFilter = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  // Filter phases based on search query, phase name, and date
  const filteredPhases = phases.filter((phase) => {
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const searchableFields = [
        phase.phaseName || "",
        phase.description || "",
        phase.categoryType || "",
        phase.propertyType || "",
        formatCurrencyValue(phase.ratePKR, "PKR") || "",
        formatCurrencyValue(phase.rateUSD, "USD") || "",
        phase.status || "",
        phase.isPublished ? "Yes" : "No",
        phase.isPublished ? "yes" : "no",
        formatDate(phase.lastUpdated) || "",
        phase.ratePKR?.toString() || "",
        phase.rateUSD?.toString() || "",
      ];

      const matchesSearch = searchableFields.some((field) =>
        field.toLowerCase().includes(query)
      );
      if (!matchesSearch) return false;
    }

    // Phase Name filter
    if (selectedPhaseName && phase.phaseName !== selectedPhaseName) {
      return false;
    }

    // Date filter
    if (selectedDate) {
      const phaseDate = formatDateForFilter(phase.lastUpdated);
      if (phaseDate !== selectedDate) {
        return false;
      }
    }

    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPhases.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentPhases = filteredPhases.slice(indexOfFirstRecord, indexOfLastRecord);

  // Reset to page 1 when filters or phases change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedPhaseName, selectedDate, phases.length]);

  // Clear filters function
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedPhaseName("");
    setSelectedDate("");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Show first 3 pages, ellipsis, and last page
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page, ellipsis, and last 3 pages
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <>
      <AlertResult data={toast} onClose={() => setToast(null)} />

      <div className="mb-6">
        <Link
          className="text-gray-500 font-bold text-sm underline hover:text-gray-700 transition"
          href={"/dashboard"}
        >
          {"<< Dashboard"}
        </Link>
      </div>

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-2">Phase File Rates</h1>
        <p className="text-sm md:text-base text-gray-600">Manage DHA phase file rates and pricing information</p>
      </div>

      {/* Search Bar, Filters and Add Button */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 lg:justify-end lg:items-center">
        {/* Search Bar */}
        <div className="relative w-full sm:flex-1 lg:w-auto lg:min-w-[280px] xl:min-w-[320px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="block w-full pl-9 md:pl-10 pr-3 py-2 md:py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 text-sm text-slate-700"
          />
        </div>

        {/* Filters and Add Button Row */}
        <div className="flex flex-col sm:flex-row gap-3 lg:items-center">
          {/* Phase Name Filter */}
          <div className="relative w-full sm:w-auto lg:min-w-[180px] xl:min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <FiFilter className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            </div>
            <select
              value={selectedPhaseName}
              onChange={(e) => setSelectedPhaseName(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-8 md:pr-10 py-2 md:py-2.5 border border-gray-300 rounded-md bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 appearance-none cursor-pointer"
            >
              <option value="">All Phases</option>
              {uniquePhaseNames.map((phaseName) => (
                <option key={phaseName} value={phaseName}>
                  {phaseName}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 md:h-5 md:w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Date Filter */}
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 md:h-5 md:w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-3 py-2 md:py-2.5 border border-gray-300 rounded-md bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 cursor-pointer"
            />
          </div>

          {/* Add Button - Right after Date Filter */}
          <Link
            href="/dashboard/file-rates/add"
            className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-2.5 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition font-semibold flex items-center justify-center gap-2 whitespace-nowrap text-sm md:text-base"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add File Rate</span>
            <span className="sm:hidden">Add</span>
          </Link>

          {/* Clear Filters Button */}
          {(selectedPhaseName || selectedDate || searchQuery) && (
            <button
              onClick={clearFilters}
              className="w-full sm:w-auto px-4 py-2 md:py-2.5 border border-gray-300 rounded-md bg-white text-slate-700 text-sm font-medium hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      ) : phases.length === 0 ? (
        <div className="bg-gray-50 border border-gray-300 rounded-md p-8 md:p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 md:h-16 md:w-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-600 text-base md:text-lg mb-2">No phase records found</p>
          <p className="text-gray-500 text-xs md:text-sm">Click "Add File Rate" to create your first record</p>
        </div>
      ) : filteredPhases.length === 0 ? (
        <div className="bg-gray-50 border border-gray-300 rounded-md p-8 md:p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 md:h-16 md:w-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-gray-600 text-base md:text-lg mb-2">No results found</p>
          <p className="text-gray-500 text-xs md:text-sm">
            Try adjusting your search query: "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-300 rounded-md w-full">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <table className="w-full table-auto">
              <thead className="bg-slate-100 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Phase Name
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Property Type
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Rate (PKR)
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Rate (USD)
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPhases.map((phase) => (
                  <tr key={phase._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="text-sm font-semibold text-slate-900 break-words">{phase.phaseName || "N/A"}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-slate-700">{phase.description}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-slate-600">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-800">
                          {phase.categoryType || "Allocation"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-slate-600">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-800">
                          {phase.propertyType || "Residential"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-slate-900">
                        {formatCurrencyValue(phase.ratePKR, "PKR")}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-slate-900">
                        {formatCurrencyValue(phase.rateUSD, "USD")}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-slate-600">
                        {formatDate(phase.lastUpdated)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          phase.status === "new" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {phase.status || "new"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          phase.isPublished 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {phase.isPublished ? "Yes" : "No"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleEdit(phase)}
                          className="p-2 text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(phase)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {currentPhases.map((phase) => (
              <div key={phase._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-3">
                  {/* Phase Name */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">{phase.phaseName || "N/A"}</h3>
                      <p className="text-xs text-gray-500">{formatDate(phase.lastUpdated)}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <button
                        onClick={() => handleEdit(phase)}
                        className="p-1.5 text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(phase)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Description</p>
                      <p className="text-slate-700 font-medium">{phase.description}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Category</p>
                      <p className="text-slate-700 font-medium">{phase.categoryType || "Allocation"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Property Type</p>
                      <p className="text-slate-700 font-medium">{phase.propertyType || "Residential"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Rate (PKR)</p>
                      <p className="text-slate-900 font-semibold">{formatCurrencyValue(phase.ratePKR, "PKR")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Rate (USD)</p>
                      <p className="text-slate-900 font-semibold">{formatCurrencyValue(phase.rateUSD, "USD")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        phase.status === "new" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {phase.status || "new"}
                      </span>
                    </div>
                  </div>

                  {/* Published Badge */}
                  <div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      phase.isPublished 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {phase.isPublished ? "Published" : "Not Published"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredPhases.length > recordsPerPage && (
        <div className="mt-6 bg-white border border-gray-300 rounded-md px-3 md:px-4 py-3">
          {/* Results Info */}
          <div className="mb-3 md:mb-0 md:flex md:items-center md:justify-between">
            <div className="mb-3 md:mb-0">
              <p className="text-xs md:text-sm text-slate-700">
                Showing <span className="font-semibold">{indexOfFirstRecord + 1}</span> to{" "}
                <span className="font-semibold">
                  {Math.min(indexOfLastRecord, filteredPhases.length)}
                </span>{" "}
                of <span className="font-semibold">{filteredPhases.length}</span> results
                {(searchQuery || selectedPhaseName || selectedDate) && (
                  <span className="hidden sm:inline text-slate-500 ml-2">
                    (filtered from {phases.length} total)
                  </span>
                )}
              </p>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-slate-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1 overflow-x-auto">
                {getPageNumbers().map((page, index) => {
                  if (page === 'ellipsis') {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-1 md:px-2 text-xs md:text-sm text-slate-500"
                      >
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition whitespace-nowrap ${
                        currentPage === page
                          ? "bg-blue-900 text-white"
                          : "bg-white text-slate-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-slate-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
