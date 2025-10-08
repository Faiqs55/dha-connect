import React from "react";
import styles from "./CustomSelect.module.css";

const CustomSelect = ({ name, options }) => {
  return (
    <div className="bg-white text-gray-500 rounded-md text-lg">
      <select
        className={`${styles.select} p-5 px-7 outline-none rounded-md w-full`}
        name={name}
        id=""
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelect;
