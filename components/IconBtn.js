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
    "text-secondary-text border border-light-gray size-7 *:size-4 [&.active]:bg-primary [&.active]:text-white flex items-center justify-center rounded-md bg-very-light-gray hover:bg-slate-200";
  if (href) {
    return (
      <Link href={href} className={cn(baseClass, className)} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button
      className={cn(
        "disabled:!cursor-not-allowed disabled:opacity-50 text-secondary-text border border-light-gray w-9 aspect-square *:size-5 [&.active]:bg-primary [&.active]:text-white flex items-center justify-center rounded-md bg-very-light-gray hover:bg-slate-200",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
