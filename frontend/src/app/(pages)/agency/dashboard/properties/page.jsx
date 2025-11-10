"use client";
import Spinner from "@/Components/Spinner";
import AlertResult from "@/Components/AlertResult";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import propertyService from "@/services/property.service";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const AgencyPropertiesPage = () => {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [titleFilter, setTitleFilter] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [toast, setToast] = useState(null);

  const { value: agencyToken, isLoaded } = useLocalStorage("agencyToken", null);

  const getProperties = async (query = null) => {
    try {
      const res = await propertyService.getAgencyProperties(agencyToken, query);
      if (res.success) {
        setProperties(res.data);
      } else {
        if (res.message && !res.message.includes("No properties found")) {
          setToast({ success: false, message: res.message });
        }
        setProperties([]);
      }
    } catch (error) {
      setToast({ success: false, message: "Failed to fetch properties" });
      setProperties([]);
    }
  };

  useEffect(() => {
    if (agencyToken && isLoaded) {
      getProperties();
    }
    setLoading(false);
  }, [agencyToken, isLoaded]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    getProperties({ 
      title: titleFilter, 
      category: categoryFilter,
      status: statusFilter
    });
    setLoading(false);
  };

  const clearFilters = () => {
    setTitleFilter("");
    setCategoryFilter("All");
    setStatusFilter("All");
    setLoading(true);
    getProperties();
    setLoading(false);
  };

  const handleStatusUpdate = async (propertyId, newStatus) => {
    setUpdatingStatus(propertyId);
    setToast(null);

    try {
      const res = await propertyService.updatePropertyStatus(propertyId, newStatus, agencyToken);
      
      if (res.success) {
        setToast({ success: true, message: "Property status updated successfully" });
        setProperties(prev => prev.map(prop => 
          prop._id === propertyId ? { ...prop, status: newStatus } : prop
        ));
      } else {
        setToast({ success: false, message: res.message || "Failed to update status" });
      }
    } catch (error) {
      setToast({ success: false, message: "Error updating property status" });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'sold': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <AlertResult data={toast} onClose={() => setToast(null)} />

      <div className="mb-8">
        <Link
          className="text-gray-500 font-bold text-sm underline hover:text-gray-700"
          href={"/agency/dashboard"}
        >
          {"<< Dashboard"}
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 mb-8 justify-between items-start lg:items-center">
        <h1 className="text-2xl lg:text-3xl font-semibold text-gray-700 text-center lg:text-left">
          Agency Properties
        </h1>
        <button
          onClick={clearFilters}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md cursor-pointer transition-colors w-full lg:w-auto"
        >
          Clear Filters
        </button>
      </div>

      {/* FILTERS */}
      <form onSubmit={submitHandler} className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Title Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Search by Title
            </label>
            <input
              onChange={(e) => setTitleFilter(e.target.value)}
              value={titleFilter}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              placeholder="Enter property title..."
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {["All", "Sell", "Rent", "Project"].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {["All", "available", "pending", "sold"].map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-md cursor-pointer transition-colors w-full md:w-auto"
        >
          Apply Filters
        </button>
      </form>

      {!loading ? (
        <div className="mt-5">
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((p) => (
                <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden" key={p._id}>
                  {/* Image with Status Badge */}
                  <div className="h-40 w-full relative">
                    <Image
                      className="object-cover object-center"
                      src={p.thumbnailImage}
                      fill
                      alt={p.title}
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(p.status)}`}>
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white">
                        {p.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    {/* Title and Price */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-800 text-base line-clamp-2 flex-1 mr-2">{p.title}</h3>
                      <span className="text-sm font-bold text-blue-600 whitespace-nowrap">PKR {p.price}</span>
                    </div>

                    {/* Property Details Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium">Ad Type:</span>
                        <span className="ml-1 font-semibold">{p.adType === 'none' ? 'Normal' : p.adType}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium">Area:</span>
                        <span className="ml-1 font-semibold">{p.area} {p.areaUnit}</span>
                      </div>
                    </div>

                    {/* Agent Information - Compact */}
                    {p.agent && (
                      <div className="border-t border-gray-300 pt-3 mb-3">
                        <div className="flex items-center gap-2">
                          {p.agent.image && (
                            <div className="w-8 h-8 relative rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={p.agent.image}
                                alt={p.agent.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-800 truncate">{p.agent.name}</p>
                            <p className="text-xs text-gray-500 truncate">{p.agent.designation}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Status Update Section */}
                    {(p.status === 'pending' || p.status === 'available') && (
                      <div className="border-t border-gray-300 pt-3">
                        <div className="flex gap-2 items-center">
                          <select
                            defaultValue={p.status}
                            className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={updatingStatus === p._id}
                          >
                            <option value="pending">Pending</option>
                            <option value="available">Available</option>
                          </select>
                          <button
                            onClick={() => {
                              const select = document.querySelector(`select[defaultValue="${p.status}"]`);
                              const newStatus = select?.value || (p.status === 'pending' ? 'available' : 'pending');
                              handleStatusUpdate(p._id, newStatus);
                            }}
                            disabled={updatingStatus === p._id}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1.5 text-xs rounded transition-colors flex items-center"
                          >
                            {updatingStatus === p._id ? (
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              "Update"
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Sold Properties - Minimal */}
                    {p.status === 'sold' && (
                      <div className="border-t pt-3">
                        <p className="text-xs text-gray-500 text-center">
                          Property Sold
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <div className="text-6xl mb-4">🏠</div>
              <p className="text-2xl text-gray-600 mb-4">No Properties Found</p>
              <p className="text-gray-500 mb-6">No properties match your current filters.</p>
              <button
                onClick={clearFilters}
                className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-md cursor-pointer transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center py-16">
          <Spinner />
        </div>
      )}

      {/* Properties Count */}
      {!loading && properties.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-600 font-semibold">
            Showing {properties.length} propert{properties.length === 1 ? 'y' : 'ies'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AgencyPropertiesPage;