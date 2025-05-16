import cn from "@/helper/cn";
import React from "react";

export default function EditorPanelIcon({
  className = "",
  children,
  title = "",
  ...props
}) {
  return (
    <div
      {...props}
      className={cn(
        "text-xs [&.active]:text-gray-800 hover:text-gray-800 cursor-pointer flex flex-col items-center justify-center",
        className
      )}
    >
      <div className="size-5 mb-1">{children}</div>
      <span>{title}</span>
    </div>
  );
}
