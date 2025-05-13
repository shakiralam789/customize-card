import React, { useContext, useRef } from "react";
import { ImageIcon } from "lucide-react";
import uuid4 from "uuid4";
import NavMenuBtn from "@/components/NavMenuBtn";
import CcContext from "@/context/ccContext";
import { getImageDimensions } from "@/helper/helper";

export default function UploadImage() {
  const { addNewSticker } = useContext(CcContext);

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    let fixedWidth = 100;

    let { height, width } = await getImageDimensions(file);

    height = (height / width) * fixedWidth;
    width = fixedWidth;

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!validImageTypes.includes(file.type)) {
      alert("Please select a valid image file (jpg, png, webp, gif, svg).");
      return;
    }

    const id = uuid4();
    const src = URL.createObjectURL(file);
    const alt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

    const imageData = {
      id,
      src,
      alt,
      width,
      height,
    };

    addNewSticker(imageData);
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <NavMenuBtn label="Image" onClick={handleClick}>
        <ImageIcon className="size-5" />
      </NavMenuBtn>
    </>
  );
}
