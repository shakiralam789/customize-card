import React from "react";
import { MenuItem } from "@szhsin/react-menu";
import cn from "@/helper/cn";
import { Router } from "next/router";

export default function MenuItemCom({
  href = "",
  children,
  className = "",
  target = "",
  ...props
}) {
  if (href) {
    return (
      <MenuItem
        href={href}
        onClick={(e) => {
          e.syntheticEvent.preventDefault();
          if (target == "_blank") {
            window.open(href, "_blank");
          } else {
            Router.push(href);
          }
        }}
        className={cn("block outline-none", className)}
        {...props}
      >
        {children}
      </MenuItem>
    );
  }

  return (
    <MenuItem className={cn("block outline-none", className)} {...props}>
      {children}
    </MenuItem>
  );
}
