import StickerContext from "@/context/contextSelector/sticker/stickerContext";
import Image from "next/image";
import React, { memo } from "react";
import { useContextSelector } from "use-context-selector";
import UploadImage from "./feature/UploadImage";
const StickerDrawerContent = memo(() => {
  const stickers = useContextSelector(StickerContext, (ctx) => ctx.imageList);
  const addNewSticker = useContextSelector(
    StickerContext,
    (ctx) => ctx.addNewSticker
  );

  return (
    <div className="prevent-customize-card-blur p-4">
      <div className="grid grid-cols-3 gap-2">
        {stickers &&
          stickers.length > 0 &&
          stickers.map((item) => {
            return (
              <div
                onClick={async () => {
                  const img = new window.Image();
                  img.src = item.src;

                  img.onload = () => {
                    let width = 100;
                    let height = (img.naturalHeight / img.naturalWidth) * width;
                    const newItem = { ...item, width, height };
                    addNewSticker(newItem);
                  };
                }}
                key={item.id}
                className="w-full aspect-square hover:shadow"
              >
                <Image
                  className="w-full h-full object-contain cursor-pointer"
                  src={item.src}
                  alt={item.alt}
                  width={100}
                  height={100}
                  priority
                />
              </div>
            );
          })}
      </div>
      <UploadImage addNewSticker={addNewSticker} />
    </div>
  );
});

StickerDrawerContent.displayName = "StickerDrawerContent";

export default StickerDrawerContent;
