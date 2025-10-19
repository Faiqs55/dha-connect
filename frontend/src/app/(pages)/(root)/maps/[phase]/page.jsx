"use client";
import {useState, useEffect} from "react";
import { maps } from "@/static-data/mapsData";
import Link from "next/link";
import { useParams } from "next/navigation";

const sectors = [
  { name: "Sector A", link: "/maps/phase-1-lahore/sector-a" },
  { name: "Sector B", link: "/maps/phase-1-lahore/sector-b" },
  { name: "Sector C", link: "/maps/phase-1-lahore/sector-c" },
  { name: "Sector D", link: "/maps/phase-1-lahore/sector-d" },
  { name: "Sector E", link: "/maps/phase-1-lahore/sector-e" },
  { name: "Sector F", link: "/maps/phase-1-lahore/sector-f" },
  { name: "Sector G", link: "/maps/phase-1-lahore/sector-g" },
  { name: "Sector H", link: "/maps/phase-1-lahore/sector-h" },
  { name: "Sector J", link: "/maps/phase-1-lahore/sector-j" },
];

const page = () => {
  const [phase, setPhase] = useState(null);
  const phaseName = useParams().phase;

  useEffect(() => {
    const foundPhase = maps.find((m) => m.phase === phaseName);
    setPhase(foundPhase);
  }, [phase]);

  if (!phase) {
    return;
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
      <div className="max-w-6xl mx-auto rounded-lg overflow-hidden shadow-md mb-10">
        <iframe
          title="DHA Phase 1 Lahore Map"
          src={phase.mapLink}
          width="100%"
          height="400"
          allowFullScreen=""
          loading="lazy"
          className="border-0 w-full h-[400px]"
        ></iframe>
      </div>

      {/* Sectors List */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Society Maps in {phase.title}
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {phase.sectors.map((sector, index) => (
            <Link
              key={sector.id}
              href={`./${sector.sector}`}
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
