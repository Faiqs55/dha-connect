"use client";
import {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation';
import ContainerCenter from '@/Components/ContainerCenter';
import CustomSelect from '@/Components/CustomSelect/CustomSelect';
import agencyService from '@/services/agency.service';
import { MdEmail } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import Link from 'next/link';

const phases = ["All Phases", "Phase 1", "Phase 2", "Phase 3", "Phase 4"];
const cities = ["All Cities", "Lahore", "Islamabad", "Karachi", "Multan"];

const page = () => {
    const [agencies, setAgencies] = useState(null);
    const [formData, setFormData] = useState({
    city: "",
    phase: "",
    keyword: "",
  });
  const router = useRouter();

  const getAgencies = async () => {
    try {
      const res = await agencyService.getAllAgencies();
      if (!res.success) {
      }
      setAgencies(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAgencies();
  }, []);
  

   const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create query parameters
    const queryParams = new URLSearchParams();

    // Add non-empty values to query parameters
    Object.entries(formData).forEach(([key, value]) => {
      if (value && value !== "All Cities" && value !== "All Phases") {
        queryParams.append(key, value);
      }
    });

    // Construct the search URL
    const searchUrl = `/agencies${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    // Navigate to the search results
    router.push(searchUrl);

    // Alternatively, you can make an API call here
    // fetchAgencies(queryParams.toString());
  };

  const fetchAgencies = async (queryString) => {
    try {
      // Example API call
      // const response = await fetch(`/api/agencies?${queryString}`);
      // const data = await response.json();
      // Handle the response data
      console.log("Would fetch agencies with:", queryString);
    } catch (error) {
      console.error("Error fetching agencies:", error);
    }
  };

  return (
    <>
       {/* HERO  */}
      <div className="bg-[#f7f7f7] py-16">
        <ContainerCenter>
          <h1 className="text-4xl font-semibold">Find Real Estate Agencies</h1>
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex gap-3.5 flex-col md:flex-row"
          >
            <CustomSelect
              style={
                "border-[1px] border-gray-200 rounded-sm text-gray-500 md:w-[400px] bg-[#fcfcfc]"
              }
              selectStyle={"px-5 py-3 rounded-sm w-full outline-none"}
              name={"city"}
              value={formData.city}
              options={cities}
              onChange={(value) => handleSelectChange("city", value)}
            />

            <CustomSelect
              style={
                "border-[1px] border-gray-200 rounded-sm text-gray-500 md:w-[400px] bg-[#fcfcfc]"
              }
              selectStyle={"px-5 py-3 rounded-sm w-full outline-none"}
              name={"phase"}
              value={formData.phase}
              options={phases}
              onChange={(value) => handleSelectChange("phase", value)}
            />

            <input
              className="border-[1px] border-gray-200 bg-[#fcfcfc] px-5 py-3 rounded-sm w-full outline-none"
              placeholder="Enter Keyword"
              type="text"
              name="keyword"
              value={formData.keyword}
              onChange={handleInputChange}
            />

            <button
              className="bg-[#114085] text-white py-2.5 px-10 rounded-sm cursor-pointer hover:bg-[#1d3a9b] transition-colors"
              type="submit"
            >
              Search
            </button>
          </form>
        </ContainerCenter>
      </div>

      {/* MAIN  */}
      <div className="mt-10">
        <ContainerCenter className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {agencies && agencies.map((a) => (
            <div key={a._id} className="rounded-md border border-gray-300">
              <div className="flex justify-center border-b p-5 border-gray-300">
                <img
                  className="w-[100px] h-[100px]"
                  src={a.agencyLogo}
                  alt=""
                />
              </div>
              {/* <h3> */}
              <Link href={`/agencies/${a._id}`} className="text-lg block hover:text-blue-800 hover:underline text-center border-b border-gray-300 py-4 sm:py-2 font-semibold">
                {a.agencyName}
              </Link>
              {/* </h3> */}
              {/* <span className="text-center text-xs py-4 sm:py-2 font-semibold block">
                347 Properties
              </span> */}
              <div className="flex gap-2 px-2 py-2">
                <span className="bg-blue-50 text-blue-600 flex items-center justify-center gap-2.5 rounded-md font-semibold flex-1 py-2 text-center cursor-pointer">
                  <MdEmail />
                  Email
                </span>
                <span className="bg-blue-50 text-blue-600 flex items-center justify-center gap-2.5 rounded-md font-semibold flex-1 py-2 text-center cursor-pointer">
                  <IoMdCall />
                  Phone
                </span>
              </div>
            </div>
          ))}
        </ContainerCenter>
      </div>
    </>
  )
}

export default page