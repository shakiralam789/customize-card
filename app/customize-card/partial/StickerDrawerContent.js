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
      src: "/images/stickers/heart.png",
      alt: "heart",
    },
    {
      id: uuid4(),
      src: "/images/stickers/heart-light.png",
      alt: "heart light",
    },
    {
      id: uuid4(),
      src: "/images/stickers/fireworks.png",
      alt: "fire-worksht",
    },
    {
      id: uuid4(),
      src: "/images/stickers/light-luminous.png",
      alt: "light-luminous",
    },
    {
      id: uuid4(),
      src: "/images/stickers/light-halo-special.png",
      alt: "light-halo-special",
    },
    {
      id: uuid4(),
      src: "/images/stickers/speech-balloon.png",
      alt: "speech-balloon",
    },
    {
      id: uuid4(),
      src: "/images/stickers/light-fantasy.png",
      alt: "light-fantasy",
    },
    {
      id: uuid4(),
      src: "/images/stickers/explosion-color.png",
      alt: "explosion-color",
    },
    {
      id: uuid4(),
      src: "/images/stickers/lion-leopard.png",
      alt: "lion-leopard.png",
    },
    {
      id: uuid4(),
      src: "/images/stickers/earth-travel.png",
      alt: "earth-travel",
    },
    {
      id: uuid4(),
      src: "/images/stickers/package-tour.png",
      alt: "package-tour",
    },
    {
      id: uuid4(),
      src: "/images/stickers/astronaut-spacecraft.png",
      alt: "astronaut-spacecraft",
    },
  ];

  return (
    <div className="prevent-customize-card-blur p-4 grid grid-cols-3 gap-2">
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
                  item.width = width;
                  item.height = height;
                  addNewSticker(item);
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
              />
            </div>
          );
        })}
    </div>
  );
}
