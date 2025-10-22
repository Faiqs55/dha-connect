import Link from "next/link";
import React from "react";
import { FaChevronRight } from "react-icons/fa6";

const QuickLink = ({ url="#", children }) => {
  return (
    <li className="list-none">
      <Link href={url} className="flex items-center gap-2 text-sm text-gray-400 font-semibold">
        <FaChevronRight fontSize={12} />
        <span>
        {children}
        </span>
      </Link>
    </li>
  );
};

export default QuickLink;
