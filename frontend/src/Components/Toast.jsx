import React from 'react'

const Toast = ({message, color, result}) => {
  return (
    <div className={`bg-${color}-100 text-${color}-500 border border-${color}-500 px-6 py-3 rounded-md`}>
        <p><span className='font-semibold'>Result:</span> {result}</p>
        <p><span className='font-semibold'>Message:</span> {message}</p>
    </div>
  )
}

export default Toast