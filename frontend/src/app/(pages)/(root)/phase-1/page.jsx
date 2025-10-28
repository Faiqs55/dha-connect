"use client";
import Link from "next/link";
import { GoogleMap, LoadScript, GroundOverlay } from "@react-google-maps/api";

const page = () => {
  const center = {
    lat: 31.472202263735927, 
    lng: 74.37676656495834 ,
  };

  const containerStyle = {
  width: "100%",
  height: "500px",
};


  const bounds = {
    north: 31.48453355528388, 
    south: 31.46271951681101, 
    east: 74.39239688642047,
    west: 74.35597205579292,
  };

  return (
    <section className="bg-gray-50 py-10 px-4 md:px-10">
      {/* Header & Breadcrumb */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          DHA Lahore, Phase 1
        </h1>
      </div>

      {/* Map Section */}
      <div className="max-w-6xl mx-auto rounded-lg overflow-hidden shadow-md mb-10">
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            mapTypeId="satellite"
          >
            <GroundOverlay
              url="/p-3.png" // place your image in public/images/
              bounds={bounds}
              opacity={0.8}
            />
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Sectors List */}
      {/* <div className="max-w-6xl mx-auto">
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
      </div> */}
    </section>
  );
};

export default page;
