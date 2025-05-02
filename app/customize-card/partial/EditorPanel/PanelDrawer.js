import cn from "@/helper/cn";
import React from "react";
import { XIcon } from "lucide-react";

export default function PanelDrawer({
  children,
  className = "",
  show,
  onClose,
  title,
}) {

  return (
    show && (
      <div
        className={cn(
          "bg-white z-40 shadow-lg fixed top-[54px] left-[80px] w-[280px] h-[calc(100vh-54px)] overflow-y-auto",
          className
        )}
      >
        <div className="p-4 border-b border-b-gray-300 relative">
          <h2 className="font-semibold text-sm">{title}</h2>
          <button onClick={onClose} className="flex items-center justify-center size-7 rounded-full hover:bg-gray-100 absolute top-1/2 -translate-y-1/2 right-2">
            <XIcon />
          </button>
        </div>
        <div className="p-2">{children}</div>
      </div>
    )
  );
}
