import cn from "@/helper/cn";
import React from "react";

export default function HandleBtn({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "text-black bg-white hover:bg-primary hover:text-white [&.active]:bg-primary [&.active]:text-white border border-gray-400 rounded-full size-7 p-1.5 flex items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
