import CcContext from "@/context/ccContext";
import React, { useContext, useCallback } from "react";
import FontChange from "./feature/FontChange";
import ColorChange from "./feature/ColorChange";
import TextAlign from "./feature/TextAlign";
import FontWeight from "./feature/FontWeight";
import FontStyle from "./feature/FontStyle";
import TextTransform from "./feature/TextTransform";
import LineHeightChange from "./feature/LineHeightChange";
import LetterSpacingChange from "./feature/LetterSpacingChange";
import DeleteText from "./feature/DeleteText";
import { ImageIcon, Languages, MessageCircleCode, Sticker } from "lucide-react";
import TextCurveChange from "./feature/TextCurveChange";
import Drawer from "@/components/Drawer";
import DrawerContent from "./DrawerContent";
import DeleteSticker from "./feature/DeleteSticker";
import FlipShape from "./feature/FlipShape";
import FlipVerticalShape from "./feature/FlipVertiacalShape";
import RotateShape from "./feature/RotateShape";

export default function Nav() {
  const {
    addNewText,
    activeEditIndex,
    activeStickerIndex,
    isStickerDrawerOpen,
    setIsStickerDrawerOpen,
  } = useContext(CcContext);

  return (
    <nav className="customize-card-navbar h-[54px] flex items-center relative text-sm bg-white shadow-sm border-b border-gray-200 px-2 py-1.5">
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <button className="p-2 rounded-full text-gray-800 font-bold hover:bg-gray-100">
              LOGO
            </button>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={addNewText}
              className="cursor-pointer px-2 py-1 flex items-center text-gray-800 font-semibold hover:bg-gray-100 rounded"
            >
              <Languages className="mr-2" />
              Text
            </button>

            <Drawer
              isOpen={isStickerDrawerOpen}
              setIsOpen={setIsStickerDrawerOpen}
              title="Sticker"
              trigger={
                <button className="cursor-pointer px-2 py-1 flex items-center text-gray-800 font-bold hover:bg-gray-100 rounded">
                  <Sticker className="mr-2" />
                  Sticker
                </button>
              }
            >
              <DrawerContent />
            </Drawer>

            <button className="cursor-pointer px-2 py-1 flex items-center text-gray-800 font-bold hover:bg-gray-100 rounded">
              <ImageIcon className="mr-2" />
              Image
            </button>

            <button className="cursor-pointer px-2 py-1 flex items-center text-gray-800 font-bold hover:bg-gray-100 rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
              Theme color
            </button>

            <button className="cursor-pointer px-2 py-1 flex items-center text-gray-800 font-bold hover:bg-gray-100 rounded">
              <MessageCircleCode className="mr-2" />
              Create RSVP
            </button>
          </div>

          <div className="flex space-x-2">
            <button className="cursor-pointer border border-gray-300 text-emerald-500 font-semibold px-2 py-1 rounded hover:bg-gray-50">
              Save draft
            </button>
            <button className="cursor-pointer bg-emerald-500 font-semibold text-white px-2 py-1 rounded hover:bg-emerald-600 flex items-center">
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
        {activeEditIndex != null && (
          <div
            className={`min-h-[47px] space-x-4 border-t border-t-gray-200 bg-white shadow-sm z-50 absolute top-full left-0 w-full text-gray-800 py-2 px-4 flex items-center justify-center`}
          >
            <DeleteText />
            <FontChange />
            <ColorChange />
            <TextTransform />
            <TextAlign />
            <FontWeight />
            <FontStyle />
            <LineHeightChange />
            <LetterSpacingChange />
            <TextCurveChange />
          </div>
        )}
        {activeStickerIndex != null && (
          <div
            className={`min-h-[47px] space-x-4 border-t border-t-gray-200 bg-white shadow-sm z-50 absolute top-full left-0 w-full text-gray-800 py-2 px-4 flex items-center justify-center`}
          >
            <DeleteSticker />
            <FlipShape />
            <FlipVerticalShape />
            <RotateShape />
          </div>
        )}
      </div>
    </nav>
  );
}
