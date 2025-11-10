"use client";
import Link from 'next/link'
import React from 'react'
import { 
  HiOutlineBuildingOffice2, 
  HiOutlineUserGroup,
  HiOutlineDocumentText
} from 'react-icons/hi2'

const page = () => {
  const links = [
    {
      label: "Update Your Agency",
      link: "/agency/dashboard/update-agency",
      icon: HiOutlineBuildingOffice2
    },
    {
      label: "My Agents",
      link: "/agency/dashboard/agents",
      icon: HiOutlineUserGroup
    },
    {
      label: "Properties",
      link: "/agency/dashboard/properties",
      icon: HiOutlineDocumentText
    },
  ]

  return (
    <>
      <h1 className="text-3xl font-semibold mb-5">Quick Links</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {links.map((link) => {
          const IconComponent = link.icon;
          return (
            <div key={link.label} className="bg-slate-700 p-4 flex flex-col justify-between rounded-md">
              <span className="text-sm mb-3 text-gray-400">{link.label}</span>
              <h3 className="text-white text-lg font-semibold mb-3">
                {link.label}
              </h3>
              <Link
                href={link.link}
                className="bg-gray-800 text-white px-4 py-2 font-semibold self-end rounded-md text-sm"
              >
                Let's Go
              </Link>
            </div>
          );
        })}
      </div>
    </>
  )
}

export default page