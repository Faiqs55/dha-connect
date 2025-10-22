"use client";
import ContainerCenter from "@/Components/ContainerCenter";
import React from "react";
import { forms } from "@/static-data/formsData";
import Link from "next/link";

const page = () => {
  return (
    <>
      <ContainerCenter>
        {/* PAGE HEADER  */}
        <div className="py-12">
          <h1 className="text-center text-4xl font-semibold uppercase">
            DHA CONNECTS FORMS
          </h1>
        </div>

        <div className="flex flex-col">
          {forms.map((f) => (
            <Link key={f.id} className="p-5 capitalize font-semibold text-lg hover:bg-gray-100 hover:text-blue-800 duration-150 bg-gray-50 border-b border-gray-200" href={`/forms/${f.name.toLowerCase().replaceAll(" ", "-")}`}>
              {f.name}
            </Link>
          ))}
        </div>
      </ContainerCenter>
    </>
  );
};

export default page;
