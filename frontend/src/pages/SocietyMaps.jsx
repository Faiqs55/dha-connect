import React from 'react'
import { maps } from '../maps';
import { Link } from 'react-router';
const SocietyMaps = () => {
  return (
    <section className="py-12 px-4 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-10 pl-2">
          Society Maps in Lahore
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
          {maps.map((map, index) => (
            <Link
              key={index}
              to={`/maps/${map.phase}`}
              className="w-full max-w-sm bg-white  overflow-hidden shadow  transition-shadow duration-300"
            >
              <div className="overflow-hidden">
                <img
                  src={map.img}
                  alt={map.title}
                  className="w-full h-48 object-cover  transition-transform duration-500"
                />
              </div>
              <div className="bg-white p-3">
                <h3 className="text-lg font-medium text-black">
                  {map.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocietyMaps;