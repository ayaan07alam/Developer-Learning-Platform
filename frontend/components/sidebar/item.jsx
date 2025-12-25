"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import SubMenuItem from "./sub-item";
import Link from "next/link";

const SidebarItem = ({ item }) => {
  const { name, items, path } = item;
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const activeItemRef = useRef(null);
  // console.log(pathname)

  const onClick = () => {
    if (items && items.length > 0) {
      setExpanded(!expanded);
    } else {
      // Navigate to the specified path when there are no sub-items
      // alert("path is: "+path)
      // alert(pathname + "/" + path)
      router.push(path, undefined, { replace: true });
    }
  };
  const isActive = useMemo(() => {
    if (items && items.length > 0) {
      if (items.find((item) => item.path === pathname)) {
        // alert(path,pathname)
        setExpanded(true);
        return true;
      }
    }

    return path === pathname;
  }, [items, path, pathname]);

// Scroll to active item when it becomes active
useEffect(() => {
  if (isActive && activeItemRef.current) {
    const parentContainer = activeItemRef.current.parentElement;
    parentContainer.scrollTo({
      top: activeItemRef.current.offsetTop - parentContainer.offsetTop,
      behavior: "smooth",
    });
  }
}, [isActive]);

  return (
    <>
      <div  ref={activeItemRef}
        className={`flex items-center p-2 rounded hover:bg-sidebar-background cursor-pointer hover:text-sidebar-active justify-between
     ${isActive && "text-sidebar-active bg-sidebar-background"}
    `}
        onClick={onClick}
      >
        <div className="flex items-center space-x-2">
          <p className="text-sm font-semibold">{name} </p>
        </div>
        {items && items.length > 0 && <ChevronDown size={18} className={expanded? "rotate-180 duration-200":""} />}
      </div>
      {expanded && items && items.length > 0 && (
        <div className="flex flex-col space-y-3 ml-5">
          {items.map((item) => (
            <SubMenuItem key={path} item={item} />
          ))}
        </div>
      )}
    </>
  );
};

export default SidebarItem;
