import React, { useContext, useMemo } from "react";
import StickerContext from "./stickerContext";
import uuid4 from "uuid4";
import CcContext from "@/context/ccContext";

export default function StickerContextProvider({ children }) {
  const { addNewSticker } = useContext(CcContext);

  const [imageList, setImageList] = React.useState([
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
  ]);

  const stickerContextValue = useMemo(
    () => ({ imageList, addNewSticker }),
    [imageList, addNewSticker]
  );

  return (
    <StickerContext.Provider value={stickerContextValue}>
      {children}
    </StickerContext.Provider>
  );
}
