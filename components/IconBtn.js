import cn from "@/helper/cn";
import Link from "next/link";
import React from "react";

export default function IconBtn({
  children,
  href = "",
  className = "",
  ...props
}) {
  const baseClass =
    "size-7 *:size-5 [&.active]:bg-emerald-400 [&.active]:text-white flex items-center justify-center rounded-md hover:bg-gray-100";
  if (href) {
    return (
      <Link href={href} className={cn(baseClass, className)} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cn(baseClass, className)} {...props}>
      {children}
    </button>
  );
}
