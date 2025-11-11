"use client";
import { useState, useEffect } from "react";
import { maps } from "@/static-data/mapsData";
import { useParams } from "next/navigation";
import Spinner from "@/Components/Spinner";
import { GoogleMap, LoadScript, GroundOverlay } from "@react-google-maps/api";
import Link from "next/link";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const page = () => {
  const [phase, setPhase] = useState(null);
  const [sector, setSector] = useState(null);
  const [opacity, setOpacity] = useState(0.9);
  const [mapKey, setMapKey] = useState(0);
  const phaseName = useParams().phase;
  const sectorName = useParams().sector;
  let bounds;
  let center;

  useEffect(() => {
    const foundPhase = maps.find((m) => m.phase === phaseName);
    setPhase(foundPhase);
    if (foundPhase) {
      const foundSector = foundPhase.sectors.find((s) => s.sector === sectorName);
      setSector(foundSector);
    }
  }, [phaseName, sectorName]); // Fixed dependencies

  // Force map re-render when opacity changes
  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [opacity]);

  if (phase && sector) {
    bounds = {
      north: phase?.north,
      south: phase?.south,
      east: phase?.east,
      west: phase?.west,
    };

    center = {
      lng: sector?.long,
      lat: sector?.lat,
    };
  }

  if (!sector || !phase || !bounds || !center) {
    return <Spinner />;
  }

  return (
    <section className="bg-gray-50 py-10 px-4 md:px-10">
      {/* Header & Breadcrumb */}
      <div className="max-w-6xl mx-auto mb-6">
        <h3 className="text-sm my-1.5 font-semibold text-gray-500 underline">
          <Link href={`/maps/${phase.phase}`}>{"<<"} {phase.title}</Link>
        </h3>
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          {phase.title}: {sector.title}
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
      {phase && bounds && center && sector && (
        <div className="max-w-6xl mx-auto rounded-lg overflow-hidden shadow-md mb-10">
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS}>
            <GoogleMap
              key={mapKey} // Force re-render when opacity changes
              mapContainerStyle={containerStyle}
              center={center}
              zoom={17}
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
          {phase.sectors.map((sectorItem, index) => (
            <Link
              key={sectorItem.id}
              href={`/maps/${phase.phase}/${sectorItem.sector}`}
              className={`block bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-400 transition duration-300 ${
                sectorItem.sector === sector.sector ? 'border-blue-400 bg-blue-50' : ''
              }`}
            >
              <p className={`font-medium hover:underline ${
                sectorItem.sector === sector.sector ? 'text-blue-700' : 'text-blue-600'
              }`}>
                {sectorItem.title}, {phase.title}
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