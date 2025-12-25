"use client";
import SidebarItem from "./item";
import {getMenuContent} from "@/lib/utils";

const SidebarLeft = ({category}) => {

  //get the current url path
//   const pathname = usePathname();
//   const pathParts = pathname.split('/'); // spliting to get the last path name
//   const currentCategory = pathParts[pathParts.length - 1];

// console.log(currentCategory)

  // This tells which category leftbar data it should show
  const techStack = category; // Change this to "JavaScript" or other tech stacks as needed

  //setting the leftbar according to the user hit the URL like if react then react leftbar, if js then js leftbar data
const menuContent = getMenuContent(techStack) ;
// console.log(menuContent);

  return (
    <div>
      <div className="flex flex-col space-y-6 w-full mb-8 ">
        <div className="bg-gray-400 pt-4 dark:bg-gray-950 px-2 sticky top-0 z-30"><div className="text-white text-sm font-bold">{techStack.toUpperCase()} TUTORIAL </div></div>
      
        <div className="flex flex-col space-y-2">
          {menuContent.map((item, index) => (
            <SidebarItem key={index} item={item}  currentCategoryURL={techStack} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;