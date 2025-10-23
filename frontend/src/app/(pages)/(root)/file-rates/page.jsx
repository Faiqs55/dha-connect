import React from "react";


const phase10Data = [
  { title: "Affidavit (4-Marla) Commercial", rate: "150.00 Lac" },
  { title: "Allocation (5-Marla)", rate: "28.50 Lac" },
  { title: "Affidavit (5-Marla)", rate: "31.75 Lac" },
  { title: "Affidavit (8-Marla)", rate: "Not Available" },
  { title: "Allocation (10-Marla)", rate: "50.50 Lac" },
  { title: "Affidavit (10-Marla)", rate: "52.00 Lac" },
  { title: "Allocation (1-Kanal)", rate: "83.75 Lac" },
  { title: "Affidavit (1-Kanal)", rate: "90.00 Lac" },
  { title: "Affidavit (2-Kanal)", rate: "235.00 Lac" },
];

const phase13Data = [
  { title: "Allocation (5-Marla)", rate: "19.00 Lac" },
  { title: "Allocation (10-Marla)", rate: "30.50 Lac" },
  { title: "Allocation (1-Kanal)", rate: "58.50 Lac" },
];

const commercialData = [
  { title: "Phase 9 Prism Allocation (4-Marla)", rate: "205.00 Lac" },
  { title: "Phase 9 Prism Affidavit (4-Marla)", rate: "215.00 Lac" },
  { title: "Phase 9 Prism Affidavit (8-Marla)", rate: "Call Us For Best Rates" },
  { title: "Phase 10 Allocation (4-Marla)", rate: "150.00 Lac" },
];

const phase9PrismData = [
  { title: "Allocation (5-Marla)", rate: "40.00 Lac" },
  { title: "Affidavit (5-Marla)", rate: "45.00 Lac" },
  { title: "Allocation (10-Marla)", rate: "85.00 Lac" },
  { title: "Affidavit (10-Marla)", rate: "Call Us For Rates" },
  { title: "Allocation (1-Kanal)", rate: "125.00 Lac" },
  { title: "Affidavit (1-Kanal)", rate: "Call Us For Rates" },
];

const phase9TownData = [
  { title: "Allocation (5-Marla)", rate: "53.00 Lac" },
  { title: "Affidavit (5-Marla)", rate: "Not Available" },
  { title: "Affidavit (10 Marla)", rate: "125.00 Lac" },
];

const phase7Data = [
  { title: "Allocation (5-Marla)", rate: "31.25 Lac" },
  { title: "Allocation (7-Marla)", rate: "52.00 Lac" },
  { title: "Allocation (10-Marla)", rate: "105.00 Lac" },
  { title: "Allocation (1-Kanal)", rate: "145.00 Lac" },
];


const sections = [
  {
    id: "phase-10",
    heading: "DHA Lahore Phase 10 File Price",
    rows: phase10Data,
  },
  {
    id: "phase-13",
    heading: "DHA Phase 13 Lahore (Ex DHA City) File Rates",
    rows: phase13Data,
  },
  {
    id: "commercial",
    heading: "DHA Lahore Commercial File Prices",
    rows: commercialData,
  },
  {
    id: "phase-9-prism",
    heading: "DHA Lahore Phase 9 Prism File Price",
    rows: phase9PrismData,
  },
  {
    id: "phase-9-town",
    heading: "DHA Lahore Phase 9 Town File Price",
    rows: phase9TownData,
  },
  {
    id: "phase-7",
    heading: "DHA Lahore Phase 7 File Price",
    rows: phase7Data,
  },
];


function getTodayDate() {
  return "October 23, 2025";
}


 
function Section({ id, heading, rows }) {
  return (
    <section id={id} className="mb-8 bg-white border rounded shadow">
      <div className="px-5 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">{heading}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-sm text-gray-700 border-b">Description</th>
              <th className="p-3 text-sm text-gray-700 border-b">Rate</th>
              <th className="p-3 text-sm text-gray-700 border-b">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-3 border-b text-sm text-gray-700">{item.title}</td>
                <td className="p-3 border-b text-sm font-semibold text-gray-800">
                  {item.rate}
                </td>
                <td className="p-3 border-b text-sm text-gray-500">
                  {getTodayDate()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}


export default function page() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            DHA Lahore File Rates
          </h1>
          <p className="text-gray-600 mt-2">
            Residential & Commercial Plots latest prices
          </p>
        </header>

        <main>
          {sections.map((section) => (
            <Section
              key={section.id}
              id={section.id}
              heading={section.heading}
              rows={section.rows}
            />
          ))}
        </main>
      </div>
    </div>
  );
}