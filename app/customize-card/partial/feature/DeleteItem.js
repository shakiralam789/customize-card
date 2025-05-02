import CcContext from "@/context/ccContext";
import { TrashIcon } from "lucide-react";
import React, { useContext } from "react";

export default function DeleteItem() {
  const { deleteField } =
    useContext(CcContext);

  return (
    <button
      onClick={deleteField}
      className="size-8 bg-gray-200 hover:bg-gray-300 rounded-full p-1.5 flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-2"
    >
      <TrashIcon />
    </button>
  );
}
