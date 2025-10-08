import React from "react";
import { FaChevronRight } from "react-icons/fa6";

const QuickLink = ({ url="#", children }) => {
  return (
    <li className="list-none">
      <a href={url} className="flex items-center gap-2 text-sm text-gray-400 font-semibold">
        <FaChevronRight fontSize={12} />
        <span>
        {children}
        </span>
      </a>
    </li>
  );
};

export default QuickLink;
