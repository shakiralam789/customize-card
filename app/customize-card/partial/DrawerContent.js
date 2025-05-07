import CcContext from "@/context/ccContext";
import Image from "next/image";
import React, { useContext } from "react";
import uuid4 from "uuid4";

export default function DrawerContent() {
  const { addNewSticker } = useContext(CcContext);
  const stickers = [
    {
      id: uuid4(),
      src: "/images/stickers/birthday-invitation.png",
      alt: "birthday-invitation",
    },
    {
      id: uuid4(),
      src: "/images/stickers/invitation-letter.png",
      alt: "invitation-letter",
    },
    {
      id: uuid4(),
      src: "/images/stickers/birthday-card.png",
      alt: "birthday-card",
    },
    {
      id: uuid4(),
      src: "/images/stickers/and.png",
      alt: "and",
    }
  ];

  return (
    <div className="p-4 grid grid-cols-3 gap-2">
      {stickers &&
        stickers.length > 0 &&
        stickers.map((item) => {
          return (
            <div
              onClick={(e) => addNewSticker(e, item)}
              key={item.id}
              className="w-full shadow hover:shadow-xl"
            >
              <Image
                className="w-full aspect-square object-contain cursor-pointer"
                src={item.src}
                alt={item.alt}
                width={100}
                height={100}
              />
            </div>
          );
        })}
    </div>
  );
}
