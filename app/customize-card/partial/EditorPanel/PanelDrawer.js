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
          "bg-white rounded-xl z-40 shadow-lg fixed top-[70px] left-[108px] w-[250px] h-[calc(100vh-88px)] overflow-hidden overflow-y-auto",
          className
        )}
      >
        <div className="p-4 border-b border-b-gray-200 relative">
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
