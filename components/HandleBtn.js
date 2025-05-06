import cn from "@/helper/cn";
import React from "react";

export default function HandleBtn({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "text-black bg-white hover:bg-emerald-500 hover:text-white [&.active]:bg-emerald-500 [&.active]:text-white rounded-full size-7 p-1.5 flex items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
