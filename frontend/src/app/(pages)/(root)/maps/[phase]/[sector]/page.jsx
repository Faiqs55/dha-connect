"use client";
import { useState, useEffect } from "react";
import { maps } from "@/static-data/mapsData";
import { useParams } from "next/navigation";
import Spinner from "@/Components/Spinner";
import { GoogleMap, LoadScript, GroundOverlay } from "@react-google-maps/api";


const containerStyle = {
  width: "100%",
  height: "500px",
};

const page = () => {
  const [phase, setPhase] = useState(null);
  const [sector, setSector] = useState(null);
  const phaseName = useParams().phase;
  const sectorName = useParams().sector;
  let bounds;
  let center;

  useEffect(() => {
    const foundPhase = maps.find((m) => m.phase === phaseName);
    setPhase(foundPhase);
    const foundSector = foundPhase.sectors.find((s) => s.sector === sectorName);
    setSector(foundSector);
  }, [phase]);

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
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          {phase.title}: {sector.title}
        </h1>
      </div>

      {/* Map Section */}
      {phase && bounds && center && sector && (
        <div className="max-w-6xl mx-auto rounded-lg overflow-hidden shadow-md mb-10">
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={17}
              mapTypeId="satellite"
            >
              <GroundOverlay
                url={phase.overlay} // place your image in public/images/
                bounds={bounds}
                opacity={0.8}
              />
            </GoogleMap>
          </LoadScript>
        </div>
      )}
    </section>
  );
};

export default page;
