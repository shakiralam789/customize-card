import CcContext from "@/context/ccContext";
import React, { useContext } from "react";
import { Redo, Undo } from "lucide-react";
import Link from "next/link";

export default function Nav() {
  const { undo, redo, undoStack, redoStack, setFrame } = useContext(CcContext);

  return (
    <nav className="customize-card-navbar prevent-customize-card-blur h-[54px] flex items-center relative text-sm bg-white shadow-sm border-b border-gray-200 px-2 py-1.5">
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/invitations"
              className="p-2 rounded-full text-gray-700 font-bold"
            >
              LOGO
            </Link>
          </div>

          <div className="flex space-x-4">
            <input
              onChange={(e) => {
                setFrame((prev) => {
                  return {
                    ...prev,
                    backgroundColor: e.target.value,
                  };
                });
              }}
              className="size-6"
              type="color"
            />
            {/* <button className="cursor-pointer px-2 py-1 flex items-center text-gray-700 font-bold hover:bg-gray-100 rounded">
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
            </button> */}

            {/* <button className="cursor-pointer px-2 py-1 flex items-center text-gray-700 font-bold hover:bg-gray-100 rounded">
              <MessageCircleCode className="size-5 mr-1" />
              Create RSVP
            </button> */}
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-gray-700 flex items-center space-x-2">
              <button
                onClick={undo}
                disabled={undoStack.current.length <= 1}
                className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center rounded-full size-8 hover:bg-gray-200 cursor-pointer"
              >
                <Undo />
              </button>
              <button
                onClick={redo}
                disabled={redoStack.current.length <= 0}
                className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center rounded-full size-8 hover:bg-gray-200 cursor-pointer"
              >
                <Redo />
              </button>
            </div>
            <div className="flex space-x-2">
              {/* <button className="hover:bg-gray-100 cursor-pointer text-primary font-semibold px-2 py-1 rounded">
                Save draft
              </button>
              <button className="cursor-pointer bg-primary font-semibold text-white px-4 py-1.5 rounded hover:bg-primary flex items-center">
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
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
