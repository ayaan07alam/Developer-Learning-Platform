import Image from "next/image";
// import component from "../components/component/components.jsx"

import Hero from "@/components/Home";

export const metadata = {
  title: "IntelForgeeks - Developer Tools, Blog, Tutorials & Jobs | Complete Developer Ecosystem",
  description: "Your complete developer platform: 40+ free tools (PDF, Excel, Image, Code), tech blog platform, interactive tutorials, and job board. Write, learn, build, and connect - all in one place.",
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
  authors: [{ name: "IntelForgeeks" }],
  creator: "IntelForgeeks",
  publisher: "IntelForgeeks",
  openGraph: {
    title: "IntelForgeeks - Complete Developer Ecosystem",
    description: "40+ free tools, tech blog, tutorials & jobs for developers",
    url: "https://intellforgeeks.com",
    siteName: "IntelForgeeks",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IntelForgeeks - Developer Tools, Blog & More",
    description: "40+ free tools, tech blog, tutorials & jobs - everything developers need",
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
    canonical: "https://intellforgeeks.com",
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
