import MenuItemCom from "@/components/MenuListCom";
import CcContext from "@/context/ccContext";
import { getFontFamily } from "@/helper/helper";
import useItemsMap from "@/hook/useItemMap";
import { Menu, MenuButton } from "@szhsin/react-menu";
import { ChevronDown } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";

export default function FontFamilyChange() {
  const {
    allItems,
    setAllItems,
    activeID,
    mainRefs,
    updateElementDimensions,
    updateElementState,
  } = useContext(CcContext);
  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const fonts = [
    // System / Web-safe fonts
    "Arial",
    "Courier New",
    "Georgia",
    "Times New Roman",
    "Verdana",
    "Trebuchet MS",
    "Tahoma",
    "Lucida Console",
    "Impact",
    "Palatino Linotype",
    "Segoe UI",

    // Decorative fonts
    "Dancing Script",
    "Great Vibes",
    "Pacifico",
    "Satisfy",
    "Parisienne",
    "Alex Brush",
    "Allura",
    "Sacramento",
    "Marck Script",
    "Cookie",
    "Herr Von Muellerhoff",
    "Tangerine",
    "Cormorant Garamond",
    "Playfair Display",
    "Cinzel",
  ];

  // useEffect(() => {
  //   const style = document.createElement('style');
  //   style.textContent = `
  //     @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Allura&family=Cinzel&family=Cormorant+Garamond&family=Cookie&family=Dancing+Script&family=Great+Vibes&family=Herr+Von+Muellerhoff&family=Marck+Script&family=Pacifico&family=Parisienne&family=Playfair+Display&family=Sacramento&family=Satisfy&family=Tangerine&display=swap');
  //   `;
  //   document.head.appendChild(style);

  //   setTimeout(() => {
  //     setFontsLoaded(true);
  //   }, 500);

  //   return () => {
  //     document.head.removeChild(style);
  //   };
  // }, []);

  function handleFontFamily(font) {
    if (!activeID) return;
    setAllItems((prevItems) =>
      prevItems.map((item) =>
        item.id === activeID ? { ...item, fontFamily: font } : item
      )
    );
    if (mainRefs.current[activeID]) {
      mainRefs.current[activeID].style.width = `auto`;
      mainRefs.current[activeID].style.height = `auto`;

      requestAnimationFrame(() => {
        let newPosition = updateElementDimensions();
        updateElementState(newPosition, activeItem?.fontSize);
      });
    }
  }

  return (
    <Menu
      menuClassName={"menu !w-[300px]"}
      align="end"
      gap={4}
      menuButton={
        <MenuButton
          className={
            "min-w-[150px] px-2 flex items-center justify-between gap-2 h-[28px] whitespace-nowrap rounded border border-gray-200 hover:bg-gray-100 [&.szh-menu-button--open]:bg-gray-100"
          }
        >
          <span
            style={{
              fontFamily: getFontFamily(activeItem?.fontFamily),
            }}
          >
            {activeItem?.fontFamily || "Arial"}
          </span>
          <ChevronDown className="size-5" />
        </MenuButton>
      }
    >
      {fonts.map((font, index) => (
        <MenuItemCom
          key={index}
          style={{
            fontFamily: getFontFamily(font),
            opacity: fontsLoaded ? 1 : 0.5,
          }}
          onClick={() => handleFontFamily(font)}
        >
          {font}
        </MenuItemCom>
      ))}
    </Menu>
  );
}
