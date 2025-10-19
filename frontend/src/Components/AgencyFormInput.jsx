import React from 'react'

const AgencyFormInput = ({ name, label, placeholder, value, onChange }) => {
  return (
    <div className='flex flex-col gap-2.5'>
      <label htmlFor={name}>{label}</label>
      <input 
        className={`p-2.5 rounded-sm bg-gray-100 w-full outline-none border-[1px] border-gray-300`} 
        id={name} 
        name={name} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange}
        type="text" 
      />
    </div>
  )
}

export default AgencyFormInput;