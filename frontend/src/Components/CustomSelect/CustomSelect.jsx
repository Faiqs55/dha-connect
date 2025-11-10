import React from "react";
import styles from "./CustomSelect.module.css";

const CustomSelect = ({ 
  name, 
  style = {}, 
  selectStyle = {}, 
  options, 
  value,
  onChange,
  ref 
}) => {

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`${style}`}>
      <select
        ref={ref}
        className={`${styles.select} ${selectStyle}`}
        name={name}
        value={value}
        onChange={handleChange}
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