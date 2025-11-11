import React, { useRef, useState } from "react";
import CustomSelect from "./CustomSelect/CustomSelect";

const WidgetSearchFrom = (props) => {
  const cityRef = useRef(null);
  const phaseRef = useRef(null);
  const [keywordValue, setKeywordValue] = useState("");
  const cityOptions = ["All Cities", "Lahore", "Multan", "Quetta", "Karachi"];
  const phaseOptions = ["All Phases", "Phase 1", "Phase 2"];

  const submitHandler = (e) => {
    e.preventDefault();
    const queryData = {
      city: cityRef.current.value,
      phase: phaseRef.current.value,
      keyword: keywordValue,
    };

    console.log(queryData);
  };

  return (
    <form
      onSubmit={(e) => submitHandler(e)}
      className="flex flex-col w-full gap-4"
    >
      <CustomSelect
        style={"border-[1px] border-gray-200 rounded-sm text-gray-500 bg-[#fcfcfc]"}
        selectStyle={"px-5 py-3 rounded-sm w-full outline-none"}
        ref={cityRef}
        name={"city"}
        options={cityOptions}
      />
      <CustomSelect
        style={"border-[1px] border-gray-200 rounded-sm text-gray-500 bg-[#fcfcfc]"}
        selectStyle={"px-5 py-3 rounded-sm w-full outline-none"}
        ref={phaseRef}
        name={"phase"}
        options={phaseOptions}
      />

      <input
        className=" mb-5 border-[1px] border-gray-200 bg-[#fcfcfc] px-5 py-3 rounded-sm w-full outline-none"
        placeholder="Enter Keyword"
        type="text"
        name="keyword"
        onChange={(e) => setKeywordValue(e.target.value)}
        value={keywordValue}
      />

      <button
        className="bg-[#114085] text-white py-2.5 rounded-sm cursor-pointer"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default WidgetSearchFrom;
