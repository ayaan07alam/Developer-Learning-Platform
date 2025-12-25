"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

const SubMenuItem = ({ item }) => {
  const { name, path } = item;
  const pathname = usePathname();

  const isActive = useMemo(() => path === pathname, [path, pathname]);

  return (
    <Link
      href={path}
      className={`text-sm mr-6 hover:text-sidebar-active hover:font-semibold ${
        isActive ? "text-sidebar-active font-semibold" : ""
      }`}
    >
      {name}
    </Link>
  );
};

export default SubMenuItem;
