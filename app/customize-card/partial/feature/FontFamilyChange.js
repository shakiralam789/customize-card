import MenuItemCom from "@/components/MenuListCom";
import CcContext from "@/context/ccContext";
import { getFontFamily } from "@/helper/helper";
import useItemsMap from "@/hook/useItemMap";
import { Menu, MenuButton } from "@szhsin/react-menu";
import { ChevronDown } from "lucide-react";
import React, { useContext } from "react";

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

      let newPosition = updateElementDimensions(activeItem);
      updateElementState(newPosition, {
        fontFamily: font,
        fontSize: activeItem?.fontSize,
      });
    }
  }

  return (
    <Menu
      menuClassName={"menu w-[250px] max-h-[300px] overflow-y-auto"}
      align="right"
      gap={4}
      menuButton={
        <MenuButton
          className={
            "border border-light-gray text-xs w-full px-3 py-1.5 flex items-center justify-between gap-2 whitespace-nowrap rounded-md bg-gray-100 [&.szh-menu-button--open]:bg-gray-100"
          }
        >
          <span
            style={{
              fontFamily: getFontFamily(activeItem.fontFamily),
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
  );
}
