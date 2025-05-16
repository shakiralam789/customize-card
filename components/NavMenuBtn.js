import React from "react";

export default function NavMenuBtn({
  className = "",
  children,
  label,
  ...props
}) {
  return (
    <button
      {...props}
      className="cursor-pointer text-sm px-2 py-1 gap-1 flex items-center text-gray-700 font-semibold hover:bg-gray-100 rounded"
    >
      {children}
      {label}
    </button>
  );
}
