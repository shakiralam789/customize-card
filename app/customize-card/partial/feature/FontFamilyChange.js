import MenuItemCom from "@/components/MenuListCom";
import CcContext from "@/context/ccContext";
import { getFontFamily } from "@/helper/helper";
import useItemsMap from "@/hook/useItemMap";
import { Menu, MenuButton } from "@szhsin/react-menu";
import { ChevronDown } from "lucide-react";
import React, { useContext } from "react";

export default function FontFamilyChange() {
  const { allItems, setAllItems, activeID } = useContext(CcContext);
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
    "Cormorant Garamond", // Elegant serif
    "Playfair Display", // Stylish serif
    "Cinzel",
  ];

  return (
    <Menu
      menuClassName={"menu !w-[300px]"}
      align="end"
      gap={4}
      menuButton={
        <MenuButton
          className={
            "min-w-[150px] px-2 flex items-center justify-between gap-2 h-[28px] rounded border border-gray-200 hover:bg-gray-100 [&.szh-menu-button--open]:bg-gray-100"
          }
        >
          <span style={{ fontFamily: getFontFamily(activeItem?.fontFamily) }}>
            {activeItem?.fontFamily || "Arial"}
          </span>
          <ChevronDown className="size-5" />
        </MenuButton>
      }
    >
      {fonts.map((font, index) => (
        <MenuItemCom
          key={index}
          style={{ fontFamily: getFontFamily(font) }}
          onClick={() => {
            if (!activeID) return;
            setAllItems((prevItems) =>
              prevItems.map((item) =>
                item.id === activeID ? { ...item, fontFamily: font } : item
              )
            );
          }}
        >
          {font}
        </MenuItemCom>
      ))}
    </Menu>
  );
}
