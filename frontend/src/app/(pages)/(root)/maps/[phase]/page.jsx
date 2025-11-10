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
  const phaseName = useParams().phase;
  let bounds;
  let center;

  useEffect(() => {
    const foundPhase = maps.find((m) => m.phase === phaseName);
    setPhase(foundPhase);
  }, [phase]);

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

      {/* Map Section */}
      {phase && bounds && center && (
        <div className="max-w-6xl mx-auto rounded-lg overflow-hidden shadow-md mb-10">
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={15}
              mapTypeId="satellite"
            >
              <GroundOverlay
                url={phase.overlay} // place your image in public/images/
                bounds={bounds}
                opacity={0.9}
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
              className="block bg-white p-4 hover:shadow-md hover:border-blue-400 transition duration-300"
            >
              <p className="text-blue-600 font-medium hover:underline">
                {sector.title}, {phase.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default page;
