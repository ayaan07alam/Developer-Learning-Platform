import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import leftbarData from "@/public/leftbarData.json"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getMenuContent(techStack) {
  switch (techStack) {
    case "react":
      return leftbarData.react;
    case "javascript":
      return leftbarData.javascript;
    case "css":
      return leftbarData.css;
    case "typescript":
      return leftbarData.typescript;
    default:
      return [];
  }
}
