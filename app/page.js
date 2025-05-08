"use client";

import React from "react";
import CurvedText from "./customize-card/partial/CurvedText";
export default function Home() {
  let [text, setText] = React.useState("aoshdas");
  return (
    <div className="min-h-screen text-ba flex items-center justify-center bg-gray-100 p-10 relative">
      <div
        contentEditable
        onChange={(e) => {
          setText(e.target.innerHTML);
        }}
        className="w-full bg-black text-white p-10"
        dangerouslySetInnerHTML={{ __html: text }}
      ></div>
      <button>
        
      </button>
      {/* <CurvedText text={"Curved Text Example"} radius={120}/> */}
    </div>
  );
}
