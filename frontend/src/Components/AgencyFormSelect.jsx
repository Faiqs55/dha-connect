import React from 'react'

const AgencyFormSelect = ({label, options, name, onChange}) => {
  return (
    <div className='flex flex-col gap-2.5'>
        <label htmlFor={name}>{label}</label>
        <div>
            <select onChange={onChange} defaultValue={options[0]} name={name} id={name} className='p-2.5 rounded-sm bg-gray-100 w-full outline-none border-[1px] border-gray-300'>
                {options.map(op => (
                    <option key={op.val} value={op.val}>{op.label}</option>
                ))}
            </select>
        </div>
    </div>
  )
}

export default AgencyFormSelect