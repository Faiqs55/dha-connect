import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import CustomSelect from "./CustomSelect/CustomSelect";

const HeroSearchForm = (props) => {
  const cityOptions = ["All Cities","Lahore", "Multan", "Quetta", "Karachi"];
  const phaseOptions = ["All Phases", "Phase 1", "Phase 2"];
  const typeOptions = ["Sale", "Rent", "Required"];
  const categoryOptions = ["Plot", "House", "Apartment", "Villa"];


  const submitHandler = (e) => {
    e.preventDefault();

  }

  return (
    <form className={`text-[${props.color}] grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 w-full gap-4`} onSubmit={(e) => {submitHandler(e)}}>

        <CustomSelect name={"city"} options={cityOptions}/>
        <CustomSelect name={"phase"} options={phaseOptions}/>
        <CustomSelect name={"type"} options={typeOptions}/>
        <CustomSelect name={"category"} options={categoryOptions}/>
        <input className="bg-white outline-none p-5 px-7 rounded-md" type="text" placeholder="Keyword" />

      <button className="bg-[#274abb] text-2xl rounded-md p-5 px-7 cursor-pointer flex justify-center" type="submit">
        <IoSearch color={`${props.color}`} />
      </button>
    </form>
  );
};

export default HeroSearchForm;
