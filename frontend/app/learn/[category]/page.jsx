"use client"
import SidebarLeft from "@/components/sidebar";
import React from "react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

// export const metadata = {
//   title: "H | GeeksforGeek.dev",
//   description: "React, CSS, JavaScript",
// };

// Helper function to update meta tags
// const updateMetaTag = (name, content) => {
//   let meta = document.querySelector(`meta[name="${name}"]`);
//   if (!meta) {
//     meta = document.createElement('meta');
//     meta.setAttribute('name', name);
//     document.head.appendChild(meta);
//   }
//   meta.setAttribute('content', content);
// };

// // Helper function to update meta properties
// const updateMetaProperty = (property, content) => {
//   let meta = document.querySelector(`meta[property="${property}"]`);
//   if (!meta) {
//     meta = document.createElement('meta');
//     meta.setAttribute('property', property);
//     document.head.appendChild(meta);
//   }
//   meta.setAttribute('content', content);
// };

const CategoryPage = () => {
  const params = useParams();
  const category = params.category;
 

  // useEffect(() => {
  //   const categoryTitle = category ? `${category.charAt(0).toUpperCase() + category.slice(1)} - GeeksforGeeks.Dev` : "Browse Categories - GeeksforGeeks.Dev";
  //   const categoryDescription = `Explore comprehensive ${category || 'articles'} covering a wide range of topics on GeeksforGeeks.Dev. Dive deep into our ${category || 'diverse categories'} to enhance your knowledge and skills.`;

  //   // Update the document title
  //   document.title = categoryTitle;

  //   // Standard meta tags
  //   updateMetaTag('description', categoryDescription);
  //   updateMetaTag('viewport', 'width=device-width, initial-scale=1');
  //   updateMetaTag('robots', 'index, follow');

  //   // Open Graph meta tags
  //   updateMetaProperty('og:title', categoryTitle);
  //   updateMetaProperty('og:description', categoryDescription);
  //   updateMetaProperty('og:image', "/default-category-image.jpg"); // Update with your default or dynamic image path
  //   updateMetaProperty('og:type', 'website');

  //   // Twitter Card meta tags
  //   updateMetaProperty('twitter:card', 'summary_large_image');
  //   updateMetaProperty('twitter:title', categoryTitle);
  //   updateMetaProperty('twitter:description', categoryDescription);
  //   updateMetaProperty('twitter:image', "/default-category-image.jpg"); // Similarly, update as needed

  // }, [category]);


  return (
    <>
      <div className="grid grid-cols-12">
        <div className="sticky top-0 hidden sm:block sm:col-span-2 h-screen overflow-y-scroll">
          <SidebarLeft category={category} />
        </div>
        <div className="p-8 mx-auto w-full col-span-12 sm:col-span-8">
          <div className="max-w-full prose prose-blue prose-lg prose-li:marker:text-blue-500 prose-img:rounded prose-img:m-auto prose-img:object-cover prose-text-wrap dark:prose-invert">
            Category Page
          </div>
        </div>
        <div className=" h-full hidden sm:block col-span-2"></div>
      </div>
    </>
  );
};

export default CategoryPage;
