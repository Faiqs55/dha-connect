import React from 'react'

const ContainerCenter = (props) => {
  return (
    <div className={`w-[80%] mx-auto my-0 ${props.className}`}>
        {props.children}
    </div>
  )
}

export default ContainerCenter