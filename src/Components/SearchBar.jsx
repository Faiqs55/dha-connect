import React from 'react'
import { IoMdArrowDropdown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

const SearchBar = () => {
  return (
    <div>
        <form action="" className='flex gap-5'>
            <div className='cites cursor-pointer bg-[#fcfcfc] rounded-sm flex w-fit p-5 text-[#888]'>
                <div className='flex items-center gap-4'>
                    <span className='cursor-pointer'>All Cities</span>
                    <IoMdArrowDropdown/>
                </div>
                <div className="search">
                    <input type="text" />
                </div>
            </div>

            <button className='bg-[#274abb] text-white px-7 rounded-sm text-2xl'>
               <IoSearch />
            </button>
        </form>
    </div>
  )
}

export default SearchBar