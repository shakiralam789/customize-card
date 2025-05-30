import cn from "@/helper/cn";
import React from "react";

export default function ResizeCircle({ className = "", ...props }) {
  return (
    <div
      {...props}
      className={cn(
        "border border-gray-400 size-3.5 bg-white rounded-full [&.active]:bg-primary hover:bg-primary flex items-center justify-center",
        className
      )}
    ></div>
  );
}
