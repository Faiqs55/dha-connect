"use client";
import { useState, useEffect } from "react";
import { maps } from "@/static-data/mapsData";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GoogleMap, LoadScript, GroundOverlay } from "@react-google-maps/api";
import Spinner from "@/Components/Spinner";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const page = () => {
  const [phase, setPhase] = useState(null);
  const [opacity, setOpacity] = useState(0.9);
  const [mapKey, setMapKey] = useState(0); // Add key to force re-render
  const phaseName = useParams().phase;
  let bounds;
  let center;

  useEffect(() => {
    const foundPhase = maps.find((m) => m.phase === phaseName);
    setPhase(foundPhase);
  }, [phaseName]); // Fixed dependency - was [phase], should be [phaseName]

  // Force map re-render when opacity changes
  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [opacity]);

  if (phase) {
    bounds = {
      north: phase?.north,
      south: phase?.south,
      east: phase?.east,
      west: phase?.west,
    };

    center = {
      lng: phase?.long,
      lat: phase?.lat,
    };
  }

  if (!phase || !bounds || !center) {
    return <Spinner />;
  }

  return (
    <section className="bg-gray-50 py-10 px-4 md:px-10">
      {/* Header & Breadcrumb */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          {phase.title}
        </h1>
      </div>

      {/* Map Controls */}
      <div className="max-w-6xl mx-auto mb-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <label htmlFor="opacity-slider" className="block text-sm font-medium text-gray-700 mb-1">
                Map Overlay Opacity: <span className="text-blue-600 font-medium">{Math.round(opacity * 100)}%</span>
              </label>
              <input
                id="opacity-slider"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>More Transparent</span>
                <span>More Opaque</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded border border-gray-200">
              <p>Adjust slider to see through the overlay</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      {phase && bounds && center && (
        <div className="max-w-6xl mx-auto rounded-lg overflow-hidden shadow-md mb-10">
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS}>
            <GoogleMap
              key={mapKey} // Force re-render when opacity changes
              mapContainerStyle={containerStyle}
              center={center}
              zoom={15}
              mapTypeId="satellite"
            >
              <GroundOverlay
                key={`ground-overlay-${opacity}`} // Additional key for GroundOverlay
                url={phase.overlay}
                bounds={bounds}
                opacity={opacity}
              />
            </GoogleMap>
          </LoadScript>
        </div>
      )}

      {/* Sectors List */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Society Maps in {phase.title}
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {phase.sectors.map((sector, index) => (
            <Link
              key={sector.id}
              href={`${phase.phase}/${sector.sector}`}
              className="block bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-400 transition duration-300"
            >
              <p className="text-blue-600 font-medium hover:underline">
                {sector.title}, {phase.title}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Custom slider thumb styles */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: none;
        }
      `}</style>
    </section>
  );
};

export default page;