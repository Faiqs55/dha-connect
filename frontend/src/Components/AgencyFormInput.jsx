import React from 'react'

const AgencyFormInput = ({disabled, name, label, placeholder, value, onChange, type="text" }) => {
  return (
    <div className='flex flex-col gap-2.5'>
      <label htmlFor={name}>{label}</label>
      <input 
      disabled={disabled}
        className={`p-2.5 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 rounded-sm bg-gray-100 w-full outline-none border-[1px] border-gray-300`} 
        id={name} 
        name={name} 
        placeholder={label} 
        value={value} 
        onChange={onChange}
        type={type} 
      />
    </div>
  )
}

export default AgencyFormInput;