"use client";
import ContainerCenter from "@/Components/ContainerCenter";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { forms } from "@/static-data/formsData";

const page = () => {
  const searchParams = useParams().formsName.replaceAll("-", " ");
  const [list, setList] = useState(null);
  
  useEffect(() => {
    const foundForm = forms.find(f => f.name.toLowerCase() === searchParams);
    setList(foundForm);
  }, []);


  
  
  return (
    <>
      <ContainerCenter>
        {/* PAGE HEADER  */}
        <div className="py-12">
          <h1 className="text-center text-4xl font-semibold uppercase">{searchParams}</h1>
          <div className="py-12">
            <h2 className="uppercase text-lg font-semibold text-white bg-[#114085] p-4">{searchParams}</h2>
            {list && list.formList.map(f => (
              <div key={f.id} className="p-4 border-b border-gray-300 bg-gray-50">
                <a className="hover:text-blue-800" target="_blank" href={f.pdf}>{f.name}</a>
              </div>
            ))}
          </div>
        </div>
    </ContainerCenter>
    </>
  );
};

export default page;
