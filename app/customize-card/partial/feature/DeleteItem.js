import IconBtn from "@/components/IconBtn";
import CcContext from "@/context/ccContext";
import { TrashIcon } from "lucide-react";
import React, { useContext } from "react";

export default function DeleteItem() {
  const { deleteField } = useContext(CcContext);

  return (
    <IconBtn onClick={deleteField}>
      <TrashIcon />
    </IconBtn>
  );
}
