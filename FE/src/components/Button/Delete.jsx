import React from 'react';
import { FaTrash } from 'react-icons/fa';

const DeleteButton = ({ children, ...props }) => (
  <button
    className="px-[57px] py-4 bg-gray-800 rounded-sm shadow-[0px_8px_16px_0px_rgba(96,97,112,0.16)] shadow-[0px_2px_4px_0px_rgba(40,41,61,0.04)] outline outline-1 outline-offset-[-1px] outline-slate-500 inline-flex justify-center items-center gap-1 font-['Inter'] text-stone-200 text-xs font-medium leading-none tracking-tight overflow-hidden"
    {...props}
  >
    <span className="flex items-center gap-1.5">
      <span>{children || 'Delete'}</span>
      <FaTrash className="text-stone-200 text-xs" />
    </span>
  </button>
);

export default DeleteButton;
