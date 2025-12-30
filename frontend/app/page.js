import Image from "next/image";
// import component from "../components/component/components.jsx"

import Hero from "@/components/Home";

export const metadata = {
  title: "RuntimeRiver - Write Blogs, Run Code & Access Dev Tools",
  description: "The open platform for developers. Write and share technical articles, compile code in 18+ languages, and access free dev tools. Join the community flow.",
  keywords: [
    "developer tools",
    "free developer tools",
    "online tools",
    "code formatter",
    "PDF tools",
    "Excel tools",
    "image optimizer",
    "tech blog",
    "developer blog platform",
    "programming tutorials",
    "coding tutorials",
    "web development",
    "job board",
    "developer jobs",
    "tech jobs",
    "developer ecosystem"
  ],
  authors: [{ name: "RuntimeRiver" }],
  creator: "RuntimeRiver",
  publisher: "RuntimeRiver",
  openGraph: {
    title: "RuntimeRiver - Write & Run Code",
    description: "Write articles, run code, and share knowledge with the global developer community.",
    url: "https://www.runtimeriver.com",
    siteName: "RuntimeRiver",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RuntimeRiver - The Open Dev Community",
    description: "Write blogs, run code, and grow your career. Open for all contributors.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.runtimeriver.com",
  },
};

export default function Home() {
  return (
    <>
      {/* <!-- Google tag (gtag.js) --> */}

      <main>
        <Hero />
      </main>
    </>
  );
}
