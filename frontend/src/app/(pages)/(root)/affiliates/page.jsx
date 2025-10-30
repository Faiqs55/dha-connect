import ContainerCenter from "@/Components/ContainerCenter";
import React from "react";



const document1 = "/Assets/document-1.pdf"
const document2 = "/Assets/document-2.pdf"
const document3 = "/Assets/document-3.pdf"
const document4 = "/Assets/document-4.pdf"
const document5 = "/Assets/document-5.pdf"
const document6 = "/Assets/document-6.pdf"
const document7 = "/Assets/document-7.pdf"
const document8 = "/Assets/document-8.pdf"

const AffiliatesHeader = () => {
  return (
    <div className="mt-9 w-full flex justify-center items-center">
      <div className="flex justify-center items-center">
        <h1 className="text-center font-bold text-1xl sm:text-2xl md:text-2xl lg:text-3xl">
          AFFILIATES
        </h1>
      </div>
    </div>
  );
};


const CategorySection = ({ title, categories }) => {
  return (
    <div className="space-y-4">
      {categories.map((category, i) => (
        <div key={i}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {category.title}
          </h2>
          <div className="space-y-8 mt-5">
            {category.items.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left bg-gray-200 hover:bg-gray-200 text-gray-500 font-medium py-3 px-4 rounded-md shadow-sm transition duration-200 text-sm"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};


const RegistrationCategories = () => {
  const categoriesLeft = [
    {
      title: "Architects",
      items: [
        {
          label: "Documents Required for Enlistment of Architect Firms",
          link: document1,
        },
        {
          label: "List of Approved Architect Firms",
          link: document2,
        },
      ],
    },
    {
      title: "Contractors",
      items: [
        {
          label: "List of Registered Contractors",
          link: document3,
        },
      ],
    },
    {
      title: "Property Dealers",
      items: [
        {
          label: "List of Registered Property Dealers",
          link: document4,
        },
      ],
    },
  ];

  const categoriesRight = [
    {
      title: "Solar Engineers",
      items: [
        {
          label: "List of Approved Solar Companies",
          link: document5,
        },
        {
          label: "Byelaws for Installing Solar Energy Panels",
          link: document6,
        },
      ],
    },
    {
      title: "MEP Engineers",
      items: [
        {
          label: "List of Approved MEP Engr Firms",
          link: document7,
        },
      ],
    },
    {
      title: "Structure Engineers",
      items: [
        {
          label: "List of Registered Structure Engineers",
          link: document8,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white px-4 py-5 sm:px-8 lg:px-16 font-sans">
      <div className="max-w-5xl mx-auto">
        <p className="text-gray-700 text-center text-base sm:text-l font-light mb-8 w-full">
          Architect, Contractors, Property Dealers and Structure Engineers
          should get registered to work with DHA.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-25">
          <CategorySection title="Left Column" categories={categoriesLeft} />
          <CategorySection title="Right Column" categories={categoriesRight} />
        </div>
      </div>
    </div>
  );
};


const AffiliatePage = () => {
  return (
    <ContainerCenter>
      <AffiliatesHeader />
      <RegistrationCategories />
    </ContainerCenter>
  );
};

export default AffiliatePage;
