import React from "react";

const AgencyFormSelect = ({ label, options, name, value, onChange }) => {
  return (
    <div className="flex flex-col gap-2.5">
      <label htmlFor={name}>{label}</label>
      <select
        name={name}
        id={name}
        value={value} // ← controlled
        onChange={onChange}
        className="p-2.5 rounded-sm bg-gray-100 w-full outline-none border border-gray-300"
      >
        {options.map((op) => (
          <option key={op.val} value={op.val}>
            {op.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AgencyFormSelect;