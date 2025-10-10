import React from 'react'

const AgencyFormSelect = ({label, options, name}) => {
  return (
    <div>
        <label htmlFor={name}>{label}</label>
        <div>
            <select name={name} id="name">
                {options.map(op => (
                    <option value={op.val}>{op.label}</option>
                ))}
            </select>
        </div>
    </div>
  )
}

export default AgencyFormSelect