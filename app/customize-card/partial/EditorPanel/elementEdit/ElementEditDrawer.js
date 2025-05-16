import CcContext from "@/context/ccContext";
import cn from "@/helper/cn";
import useItemsMap from "@/hook/useItemMap";
import React, { useContext } from "react";
import DeleteItem from "../../feature/DeleteItem";
import FontFamilyChange from "../../feature/FontFamilyChange";
import FontChange from "../../feature/FontChange";
import ColorChange from "../../feature/ColorChange";
import TextTransform from "../../feature/TextTransform";
import TextAlign from "../../feature/TextAlign";
import FontWeight from "../../feature/FontWeight";
import FontStyle from "../../feature/FontStyle";
import LineHeightChange from "../../feature/LineHeightChange";
import LetterSpacingChange from "../../feature/LetterSpacingChange";
import TextCurveChange from "../../feature/TextCurveChange";
import RotateShape from "../../feature/RotateShape";
import Duplicate from "../../feature/Duplicate";
import FlipShape from "../../feature/FlipShape";
import FlipVerticalShape from "../../feature/FlipVertiacalShape";

export default function ElementEditDrawer({ className = "" }) {
  const { activeID, allItems } = useContext(CcContext);
  const itemsMap = useItemsMap(allItems);
  const activeItem = itemsMap.get(activeID);
  return (
    activeID != null &&
    !activeItem?.locked && (
      <div
        className={cn(
          "prevent-customize-card-blur text-primary-text bg-white rounded-xl z-40 shadow-lg fixed top-[70px] right-4 w-[280px] h-[calc(100vh-88px)] overflow-hidden overflow-y-auto",
          className
        )}
      >
        <div className="bg-slate-100">
          <div className="flex items-center justify-between px-4 py-2 border-b border-b-gray-200 relative">
            <h2 className="font-semibold text-sm">{activeItem?.name}</h2>
            <div className="flex gap-1 items-center">
              <Duplicate />
              <DeleteItem />
            </div>
          </div>
        </div>
        <div className="p-4 text-gray-800">
          <>
            {activeItem?.itemType === "text" && (
              <div className="space-y-4">
                <div>
                  <label className="def-label">Color</label>
                  <ColorChange />
                </div>
                <div>
                  <label className="def-label">Typography</label>
                  <div className="space-y-2">
                    <FontFamilyChange />
                    <div className="grid grid-cols-6 gap-1.5">
                      <TextAlign />
                      <div className="col-span-3">
                        <FontChange />
                      </div>
                    </div>
                    <div className="grid grid-cols-6 gap-1.5">
                      <TextTransform />
                      <FontWeight />
                      <FontStyle />
                      <LineHeightChange />
                      <LetterSpacingChange />
                      <TextCurveChange />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeItem?.itemType === "sticker" && (
              <div>
                <label className="def-label">Flip Shape</label>
                <div className="grid grid-cols-6 gap-1.5">
                  <FlipShape />
                  <FlipVerticalShape />
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    )
  );
}
