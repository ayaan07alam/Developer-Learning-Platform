"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getIndividualArticleData } from "@/lib/utils";
import { PortableText } from "@portabletext/react";
import { urlForImage } from "@/sanity/lib/image";
import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";
import Image from "next/image";
import SidebarLeft from "@/components/sidebar";
import Loader from "@/components/Loader/Loader";
import Head from "next/head";
import NotFound from "@/components/NotFound";
import ScrollProgressBar from "@/components/ScrollProgressBar/ScrollProgressBar";
import CodeWithNotes from "@/components/CodeWithNotes";
// This could be based on an identifier, the content of the code, index, or any other logic
const notes = {
  "packagejson": "This is a detailed explanation of the package.json file.",
  "tsconfigjson": "This is a detailed explanation of the tsconfig.json file"
};

// Sample code blocks
const codeBlocks = [
  { id: "packagejson", code: "tsconfig.json" },
  { id: "tsconfigjson", code: "package.json" }
];

const Page = () => {
  const { slug, category } = useParams();
  const [articleData, setArticleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getIndividualArticleData(slug);
        if (data) {
          setArticleData(data);
          setError(null);
        } else {
          setError("Article not found");
        }
      } catch (err) {
        setError("An error occurred while fetching the article");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  // useEffect for generating dynamic meta tags
  useEffect(() => {
    if (articleData) {
      // Update the document title
      document.title = `${articleData.title} - GeeksforGeeks.Dev`;

      // Update meta tags dynamically
      const updateMetaTag = (name, content) => {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
          meta = document.createElement("meta");
          meta.name = name;
          document.getElementsByTagName("head")[0].appendChild(meta);
        }
        meta.content = content;
      };

      // Update meta property tags dynamically
      const updateMetaProperty = (property, content) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("property", property);
          document.getElementsByTagName("head")[0].appendChild(meta);
        }
        meta.content = content;
      };

      // Standard meta tags
      updateMetaTag("description", articleData.smallDescription);
      updateMetaTag("viewport", "width=device-width, initial-scale=1");
      updateMetaTag("robots", "index, follow");

      // Open Graph meta tags
      updateMetaProperty("og:title", articleData.title);
      updateMetaProperty("og:description", articleData.smallDescription);
      updateMetaProperty(
        "og:image",
        articleData.image
          ? urlForImage(articleData.image).url()
          : "/default-image.jpg"
      );
      updateMetaProperty("og:type", "article");

      // Twitter Card meta tags
      updateMetaProperty("twitter:card", "summary_large_image");
      updateMetaProperty("twitter:title", articleData.title);
      updateMetaProperty("twitter:description", articleData.smallDescription);
      updateMetaProperty(
        "twitter:image",
        articleData.image
          ? urlForImage(articleData.image).url()
          : "/default-image.jpg"
      );

      // Additional tags as needed (e.g., author, publisher)
      updateMetaTag("author", "GeeksforGeeks.Dev");
      updateMetaTag("publisher", "GeeksforGeeks.Dev");
    }
  }, [articleData]);

  if (error) return <NotFound />;
  if (isLoading) return <Loader />;
  if (!articleData) return <NotFound />;

  return (
    <>
      <Head>
        <title>
          {articleData
            ? `${articleData.title} - GeeksforGeeks.Dev`
            : "GeeksforGeeks.dev"}
        </title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content={
            articleData
              ? articleData.smallDescription
              : "At GeeksforGeeks.Dev, we cover everything tech. From detailed tutorials and the latest tech news to essential roadmaps and innovative tools, we provide the resources you need to navigate the tech landscape."
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta
          property="og:title"
          content={articleData ? articleData.title : "GeeksforGeeks.Dev"}
        />
        <meta
          property="og:description"
          content={
            articleData
              ? articleData.smallDescription
              : "At GeeksforGeeks.Dev, we cover everything tech. From detailed tutorials and the latest tech news to essential roadmaps and innovative tools, we provide the resources you need to navigate the tech landscape."
          }
        />
        <meta
          property="og:image"
          content={
            articleData && articleData.image
              ? urlForImage(articleData.image).url()
              : "/default-image.jpg"
          }
        />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={articleData ? articleData.title : "GeeksforGeeks.Dev"}
        />
        <meta
          name="twitter:description"
          content={
            articleData
              ? articleData.smallDescription
              : "At GeeksforGeeks.Dev, we cover everything tech. From detailed tutorials and the latest tech news to essential roadmaps and innovative tools, we provide the resources you need to navigate the tech landscape."
          }
        />
        <meta
          name="twitter:image"
          content={
            articleData && articleData.image
              ? urlForImage(articleData.image).url()
              : "/default-image.jpg"
          }
        />
      </Head>
      <ScrollProgressBar articleId="blog-container" />
      <div className="grid grid-cols-12">
        <div className="sticky top-0 hidden sm:block sm:col-span-2 h-screen overflow-y-scroll">
          <SidebarLeft category={category} />
        </div>
        <div
          id="blog-container"
          className="p-8 mx-auto w-full col-span-12 sm:col-span-8"
        >
          <div className="max-w-full prose prose-blue prose-lg prose-li:marker:text-blue-500 prose-img:rounded prose-img:m-auto prose-img:object-cover prose-text-wrap dark:prose-invert">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
              {articleData.title}
            </h1>
            <PortableText
              value={articleData.Content}
              components={{
                block: {
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-blue-500">
                      {children}
                    </blockquote>
                  ),
                },
                types: {
                  code: ({ value }) => (
                    <CodeBlock
                      language={value.language}
                      code={value.code}
                      filename={value.filename}
                    />
                  ),
                  image: ({ value }) => (
                    <div className="w-full max-w-screen-lg mx-auto">
                      <Image
                        src={urlForImage(value)}
                        layout="responsive"
                        width={1200}
                        height={800}
                        alt={value.alt || `${articleData.title}`}
                        className="object-cover"
                      />
                    </div>
                  ),
                },
                marks: {
                  link: ({ children, value }) => (
                    <Link
                      href={value.href}
                      rel={
                        !value.href.startsWith("/")
                          ? "noreferrer noopener"
                          : undefined
                      }
                    >
                      {children}
                    </Link>
                  ),
                  code: ({ children }) => (
                    <code className="inline-block p-1/2 pl-1 pr-1 border-2 rounded-md bg-gray-100 border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
                       {/* {codeBlocks.map((block, index) => (
                <CodeWithNotes
                    key={index}
                    code={block.code}
                    note={notes[block.id] || "No additional notes available."}
                >{children}</CodeWithNotes>
            ))} */}
                      <CodeWithNotes  note="Details about JSON handling. Details about JSON handling.Details about JSON handling.Details about JSON handling.Details about JSON handling.Details about JSON handling.Details about JSON handling.Details about JSON handling.Details about JSON handling.Details about JSON handling.Details about JSON handling.">{children}</CodeWithNotes>
                    </code>
                  ),
                },
              }}
            />
          </div>
        </div>
        <div className="h-full hidden sm:block col-span-2"></div>
      </div>
    </>
  );
};

export default Page;
