import { IoSearch } from "react-icons/io5";
import CustomSelect from "./CustomSelect/CustomSelect";
import { useRef, useState } from "react";

const HeroSearchForm = (props) => {

  const cityRef = useRef(null);
  const phaseRef = useRef(null);
  const typeRef = useRef(null);
  const categoryRef = useRef(null);
  const [keywordValue, setKeywordValue] = useState("");

  const cityOptions = ["All Cities","Lahore", "Multan", "Quetta", "Karachi"];
  const phaseOptions = ["All Phases", "Phase 1", "Phase 2"];
  const typeOptions = ["All Property Types","Sale", "Rent", "Required"];
  const categoryOptions = ["All Categories","Plot", "House", "Apartment", "Villa"];

  const submitHandler = (e) => {
    e.preventDefault();
    const queryData = {
      city: cityRef.current.value,
      phase: phaseRef.current.value,
      type: typeRef.current.value,
      category: categoryRef.current.value,
      keywordValue
    };

    console.log(queryData);
  }

  return (
    <form className={`text-[${props.color}] grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 w-full gap-4`} onSubmit={(e) => {submitHandler(e)}}>

        <CustomSelect ref={cityRef} name={"city"} options={cityOptions}/>
        <CustomSelect ref={phaseRef} name={"phase"} options={phaseOptions}/>
        <CustomSelect ref={typeRef} name={"type"} options={typeOptions}/>
        <CustomSelect ref={categoryRef} name={"category"} options={categoryOptions}/>
        <input onChange={(e) => setKeywordValue(e.target.value)} value={keywordValue} name="keyword" className="bg-white outline-none p-5 px-7 rounded-md" type="text" placeholder="Keyword" />

      <button className="bg-[#274abb] text-2xl rounded-md p-5 px-7 cursor-pointer flex justify-center" type="submit">
        <IoSearch color={`${props.color}`} />
      </button>
    </form>
  );
};

export default HeroSearchForm;
