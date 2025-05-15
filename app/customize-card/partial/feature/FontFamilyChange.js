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
    activeID,
    mainRefs,
    updateElementDimensions,
    updateElementState,
    itemsRefs,
    fontsLoaded,
  } = useContext(CcContext);
  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);

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

  function handleFontFamily(font) {
    if (!activeID) return;
    if (mainRefs.current[activeID]) {
      itemsRefs.current[activeID].style.fontFamily = font;
      mainRefs.current[activeID].style.width = `auto`;
      mainRefs.current[activeID].style.height = `auto`;

      requestAnimationFrame(() => {
        let newPosition = updateElementDimensions(activeItem);
        updateElementState(newPosition, {
          fontFamily: font,
          fontSize: activeItem?.fontSize,
        });
      });
    }
  }

  return (
    <div className="relative">
      <Menu
        menuClassName={"menu h-[calc(100vh-101px)] !w-[300px]"}
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
                fontFamily: getFontFamily(activeItem),
                opacity: fontsLoaded ? 1 : 0,
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
            className="font-list"
            key={index}
            style={{
              fontFamily: getFontFamily(font),
            }}
            onClick={() => handleFontFamily(font)}
          >
            {font}
          </MenuItemCom>
        ))}
      </Menu>
    </div>
  );
}
