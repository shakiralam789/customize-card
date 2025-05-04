// context/CcProvider.js
"use client";
import { act, useEffect, useRef, useState } from "react";
import CcContext from "./ccContext";
import uuid4 from "uuid4";

const CcProvider = ({ children }) => {
  const defText = {
    itemType: "text",
    position: { x: 200, y: 100 },
    fontSize: 20,
    textAlign: "center",
    color: "white",
    fontWeight: "normal",
    lineHeight: "1.2",
    fontStyle: "normal",
    letterSpacing: "0",
    textTransform: "none",
    textCurve: 0,
    rotate: 0,
    isPlaceholder: true,
  };

  const defSticker = {
    itemType: "sticker",
    position: { x: 200, y: 200 },
    width: 100,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
  };

  const [isStickerDrawerOpen, setIsStickerDrawerOpen] = useState(false);

  const [shouldBeSelected, setShouldBeSelected] = useState(true);

  const [activeID, setActiveID] = useState(null);

  const ignoreBlurRef = useRef(false);
  const itemsRefs = useRef({});

  const [allItems, setAllItems] = useState([
    // {
    //   id: uuid4(),
    //   name: "Sticker",
    //   itemType: "sticker",
    //   src: "/images/stickers/birthday-invitation.png",
    //   alt: "birthday-invitation",
    //   ...defSticker,
    //   position: { x: 200, y: 368 },
    // },
    // {
    //   id: uuid4(),
    //   // name: "Invitation Letter",
    //   itemType: "text",
    //   text: `<div>Saturday, June 17, 2025</div>
    //         <div>at three o'clock in the afternoon</div>
    //         <div>Grace Community Church</div>`,
    //   isPlaceholder: false,
    //   position: { x: 67, y: 200 },
    //   fontSize: 18,
    //   contentEditable: false,
    //   textAlign: "center",
    //   color: "#c6a489",
    //   fontWeight: "normal",
    //   lineHeight: "2",
    //   fontStyle: "normal",
    //   letterSpacing: "0",
    //   textTransform: "uppercase",
    //   active: false,
    //   rotate: 0,
    // },
    // {
    //   id: uuid4(),
    //   name: "Address",
    //   itemType: "text",
    //   text: `<div>4551 East Street Wilmot, Virginia</div>`,
    //   isPlaceholder: false,
    //   position: { x: 125, y: 310 },
    //   fontSize: 16,
    //   contentEditable: false,
    //   textAlign: "center",
    //   color: "#7db2bd",
    //   fontWeight: "normal",
    //   lineHeight: "2",
    //   fontStyle: "normal",
    //   letterSpacing: "0",
    //   textTransform: "none",
    //   active: false,
    // },
  ]);

  function addNewText() {
    const id = uuid4();

    setAllItems((prevItems) => {
      // Update zIndex and active state for all existing items
      const updatedItems = prevItems.map((item, index) => ({
        ...item,
        zIndex: 10 + index,
        active: false,
      }));

      return [
        ...updatedItems,
        {
          id: id,
          text: "",
          active: true,
          contentEditable: true,
          zIndex: 10 + prevItems.length,
          name: "Layer " + (prevItems.length + 1),

          ...defText,
        },
      ];
    });

    setActiveID(id);
  }

  function addNewSticker(e, data) {
    setAllItems((prevItems) => {
      const itemsWithNewSticker = [
        ...prevItems,
        {
          id: uuid4(),
          ...defSticker,
          ...data,
          name: "Layer " + (prevItems.length + 1),
        },
      ];

      return itemsWithNewSticker.map((item, index) => ({
        ...item,
        zIndex: 10 + index,
      }));
    });

    setActiveID(null);
    setIsStickerDrawerOpen(false);
  }
  function deleteField() {
    if (!activeID) return;

    setAllItems((prevItems) => {
      const filteredItems = prevItems.filter((item) => item.id !== activeID);
      const updatedItems = filteredItems.map((item, index) => ({
        ...item,
        zIndex: 10 + index,
      }));

      return updatedItems;
    });

    setActiveID(null);
  }

  function addToLocalStorage() {
    localStorage.setItem("customize-card-items", JSON.stringify(allItems));
  }

  useEffect(() => {
    let items = localStorage.getItem("customize-card-items");

    if (items) {
      items = JSON.parse(items);

      if (items && items.length > 0) {
        const updatedItem = items.map((item, index) => {
          let newItem = {
            ...item,
            zIndex: 10 + index,
            name: item.name ? item.name : `Layer ${index + 1}`,
            active: false,
          };
          if (!newItem.position) {
            return { ...newItem, position: { x: 0, y: 0 } };
          }
          return newItem;
        });

        setAllItems(updatedItem);

        setTimeout(() => {
          updatedItem.forEach((item, index) => {
            if (item.itemType === "text") {
              const element = itemsRefs.current[item.id];

              if (element) {
                element.innerHTML = item.isPlaceholder
                  ? "Enter text..."
                  : item.text || "";
              }
            }
          });
        }, 0);
      }
    }
  }, []);

  useEffect(() => {
    addToLocalStorage();
  }, [allItems]);

  return (
    <CcContext.Provider
      value={{
        allItems,
        setAllItems,
        addNewText,
        addNewSticker,
        ignoreBlurRef,
        activeID,
        setActiveID,
        itemsRefs,
        isStickerDrawerOpen,
        setIsStickerDrawerOpen,
        shouldBeSelected,
        setShouldBeSelected,
        defText,
        defSticker,
        deleteField,
      }}
    >
      {children}
    </CcContext.Provider>
  );
};

export default CcProvider;
