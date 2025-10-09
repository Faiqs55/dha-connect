import React from "react";
import styles from "./CustomSelect.module.css";

const CustomSelect = ({ name, style={}, selectStyle={}, options, ref }) => {

  

  return (
    <div className={`${style}`}>
      <select
        ref={ref}
        className={`${styles.select} ${selectStyle}`}
        name={name}
        id=""
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelect;
