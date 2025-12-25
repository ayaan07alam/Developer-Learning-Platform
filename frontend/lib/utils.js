import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import leftbarData from "@/public/leftbarData.json"
import { client } from "@/sanity/lib/client";

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export async function fetchSlugs() {
  const query = `
    *[_type == "post"]{
    "slug": slug.current,
    "category": categories[0]->title,
  "updated_Date":_updatedAt,
}
  `;

  try {
    const slugs = await client.fetch(query);
    return slugs;
  } catch (error) {
    console.error("Failed to fetch slugs:", error);
    return [];
  }
}

export function getMenuContent(techStack) {
  // const filePath = path.join(process.cwd(), 'public', 'menuContent.json'); // Adjust the path accordingly
  // const menuContentData = JSON.parse(leftbarData);
  switch (techStack) {
    case "react":
      return leftbarData.react;
    case "javascript":
      return leftbarData.javascript;
      case "css":
        return leftbarData.css;
      case "typescript":
        return leftbarData.typescript;
    // Add cases for other tech stacks if needed
    default:
      return []; // Return an empty array if the tech stack is not recognized
  }
}
export async function getBlogCardData(){
  const query = `
  *[_type=='post'] | order(_createdAt desc){
    title,
    smallDescription,
    mainImage,
    "currentSlug":slug.current 
  }
  `
  const data = await client.fetch(query);
  return data;
}
// export async function getIndividualArticleData(slug){
//   const query = `
//   *[_type=='post' && slug.current=='${slug}']{
//     title,
//     'currentSlug': slug.current,
//       mainImage,
//       'Content':content
//   }[0]
//   `
//   const data = await client.fetch(query);
//   return data;
// }

// export const getIndividualArticleData = async(slug)=>{
//   const query = `
//   *[_type=='post' && slug.current=='${slug}']{
//     title,
//     'currentSlug': slug.current,
//       mainImage,
//       'Content':content
//   }[0]
//   `
//   const data = await client.fetch(query);
//   return data;
// }


export const getIndividualArticleData = async (slug) => {
  const query = `
    *[_type=='post' && slug.current=='${slug}']{
      title,
      smallDescription,
      'currentSlug': slug.current,
      mainImage,
      'Content':content
    }[0]
  `;
  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error("Error fetching individual article data:", error);
    // Handle error appropriately, potentially returning a default value or error object
    return { error: "Failed to fetch article data." };
  }
}