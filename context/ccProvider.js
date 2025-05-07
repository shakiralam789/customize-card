// context/CcProvider.js
"use client";
import { useRef, useState } from "react";
import CcContext from "./ccContext";
import uuid4 from "uuid4";
import { frame } from "framer-motion";

const defText = {
  itemType: "text",
  position: { x: 200, y: 100 },
  fontSize: 16,
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
  fontFamily: "Arial",
};

const defSticker = {
  itemType: "sticker",
  position: { x: 200, y: 200 },
  width: 100,
  scaleX: 1,
  scaleY: 1,
  rotate: 0,
};

const staticData = {
  id: "geometric-floral",
  data: {
    items: [
      {
        id: "aa43be97-a5ad-4eda-af60-8de829453b88",
        name: "Invitation Letter",
        itemType: "text",
        text: '<p data-pm-slice="1 1 []">YOU ARE CORDIALLY</p><p>INVITED TO THE WEDDING OF </p>',
        isPlaceholder: false,
        position: {
          x: 95,
          y: 118,
        },
        fontSize: 9,
        contentEditable: false,
        textAlign: "center",
        color: "#241f31",
        fontWeight: "normal",
        lineHeight: "2",
        fontStyle: "normal",
        letterSpacing: "1.1",
        textTransform: "uppercase",
        active: false,
        rotate: "0",
        zIndex: 10,
        fontFamily: "Times New Roman",
      },
      {
        id: "e71ed857-1ae6-4b27-b12e-42e8edd37519",
        text: '<p data-pm-slice="1 1 []">LORALEIGH</p><p>JAMESON</p>',
        active: false,
        contentEditable: false,
        zIndex: 11,
        name: "Text",
        itemType: "text",
        position: {
          x: 88,
          y: 180,
        },
        fontSize: 18,
        textAlign: "center",
        color: "#241f31",
        fontWeight: "bold",
        lineHeight: "1.5",
        fontStyle: "normal",
        letterSpacing: "6.6",
        textTransform: "none",
        textCurve: 0,
        rotate: 0,
        isPlaceholder: false,
        fontFamily: "Times New Roman",
      },
      {
        id: "cc0b9c71-2d81-4e1a-ae17-b6b69f74f0fb",
        text: '<p data-pm-slice="1 1 []">CHRISTOPHER</p><p>WASHINGTON</p>',
        active: false,
        contentEditable: false,
        zIndex: 12,
        name: "Text",
        itemType: "text",
        position: {
          x: 71,
          y: 275,
        },
        fontSize: 18,
        textAlign: "center",
        color: "#241f31",
        fontWeight: "bold",
        lineHeight: "1.5",
        fontStyle: "normal",
        letterSpacing: "6.6",
        textTransform: "none",
        textCurve: 0,
        rotate: 0,
        isPlaceholder: false,
        fontFamily: "Times New Roman",
      },
      {
        id: "77973ef2-a0c8-49fc-bfbc-24c23ed384d3",
        text: '<p data-pm-slice="1 1 []">SATURDAY, SEPTEMBER 16TH, 2025</p><p>7 O’CLOCK IN THE EVENING</p><p>MAJESTIC BALLROOM</p><p>SAN DIEGO</p>',
        active: false,
        contentEditable: false,
        zIndex: 13,
        name: "Text",
        itemType: "text",
        position: {
          x: 84,
          y: 335,
        },
        fontSize: 9,
        textAlign: "center",
        color: "#241f31",
        fontWeight: "normal",
        lineHeight: "2",
        fontStyle: "normal",
        letterSpacing: "1.1",
        textTransform: "none",
        textCurve: 0,
        rotate: 0,
        isPlaceholder: false,
        fontFamily: "Times New Roman",
      },
      {
        id: "4db09e3e-bff3-4f02-9714-d39885374466",
        itemType: "sticker",
        position: {
          x: 132,
          y: 232,
        },
        width: 100,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        src: "/images/stickers/and.png",
        alt: "and",
        name: "and sticker",
        zIndex: 14,
        active: false,
        contentEditable: false,
      },
    ],
    frame: {
      backgroundImage: "/images/invitations/geometric-flowers.jpg",
      backgroundColor: "#fff",
    },
  },
};

const CcProvider = ({ children }) => {
  const [zoom, setZoom] = useState(100);
  const [showCenterLine, setShowCenterLine] = useState(false);
  const [horizontalCentralLine, setHorizontalCentralLine] = useState(false);

  const parentRef = useRef(null);
  const [isStickerDrawerOpen, setIsStickerDrawerOpen] = useState(false);

  const shouldBeSelected = useRef(true);

  const [activeID, setActiveID] = useState(null);

  const ignoreBlurRef = useRef(false);
  const itemsRefs = useRef({});

  const [allItems, setAllItems] = useState([]);
  const [frame, setFrame] = useState({});

  function addNewText() {
    const id = uuid4();

    setAllItems((prevItems) => {
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
          name: "Text",

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
          name: "Sticker",
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

  function getDataOnLoad(id) {
    let items = [];
    let frameData = {};
    let zoom = 100;

    let storageName = `customize-card-data${id || ""}`;
    let zoomName = `customize-card-zoom${id || ""}`;

    let localTItems = localStorage.getItem(storageName);
    let localTZoom = localStorage.getItem(zoomName);

    if (zoom) {
      let parseZoom = JSON.parse(localTZoom);
      zoom = parseZoom || 100;
      setZoom(zoom);
    }

    if (localTItems) {
      let parseItems = JSON.parse(localTItems);
      if (parseItems) {
        items = parseItems?.data?.items || [];
        frameData = parseItems?.data?.frame || {};
      }
    } else if (id) {
      items = staticData?.data?.items || [];
      frameData = staticData?.data?.frame || {};
    }

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

    setFrame(frameData);
  }

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
        defText,
        defSticker,
        deleteField,
        showCenterLine,
        setShowCenterLine,
        parentRef,
        horizontalCentralLine,
        setHorizontalCentralLine,
        zoom,
        setZoom,
        getDataOnLoad,
        frame,
        setFrame,
      }}
    >
      {children}
    </CcContext.Provider>
  );
};

export default CcProvider;
