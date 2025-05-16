import React, { useRef } from "react";
import { UploadIcon } from "lucide-react";
import uuid4 from "uuid4";
import { getImageDimensions } from "@/helper/helper";

export default function UploadImage({ addNewSticker }) {
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
    <div className="absolute bottom-4 left-0 right-0 w-full bg-white px-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        className="w-full px-3 text-sm font-semibold py-1.5 mt-4 duration-300 bg-primary hover:bg-primary text-white rounded-md flex items-center justify-center gap-2"
        label={"Upload Image"}
        onClick={handleClick}
      >
        <UploadIcon className="shrink-0 size-4" />
        <span>Upload Image</span>
      </button>
    </div>
  );
}
