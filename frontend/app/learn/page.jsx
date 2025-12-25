"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaReact, FaNodeJs, FaVuejs, FaAngular, FaDocker, FaCss3Alt, FaSass, FaBootstrap, FaJs, FaNpm, FaHtml5 } from "react-icons/fa";
import { SiExpress, SiHtml5, SiMongodb, SiTypescript, SiGraphql, SiTailwindcss, SiRedux, SiRestapi, SiWebpack, SiJest } from "react-icons/si";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { X } from "lucide-react";

const getIcon = (title) => {
  switch (title) {
    case "React": return <FaReact className="text-blue-500 text-4xl" />;
    case "Node.js": return <FaNodeJs className="text-green-500 text-4xl" />;
    case "Express.js": return <SiExpress className="text-gray-500 text-4xl" />;
    case "MongoDB": return <SiMongodb className="text-green-500 text-4xl" />;
    case "TypeScript": return <SiTypescript className="text-blue-500 text-4xl" />;
    case "HTML": return <SiHtml5 className="text-orange-500 text-4xl" />;
    case "CSS": return <FaCss3Alt className="text-blue-400 text-4xl" />;
    case "JavaScript": return <FaJs className="text-yellow-400 text-4xl" />;
    case "Next.js": return <div className="text-4xl font-bold">N</div>; // Placeholder
    default: return <div className="text-4xl">📚</div>;
  }
};

const items = [
  {
    id: 1,
    title: "HTML",
    subtitle: "The structure of the web",
    description: "HTML (Hypertext Markup Language) is the fundamental building block of the web, defining the structure of web pages.",
    link: "/learn/html",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 2,
    title: "CSS",
    subtitle: "Design and style",
    description: "CSS (Cascading Style Sheets) is used to control the look and feel of your web pages.",
    link: "/learn/css",
    color: "from-blue-400 to-blue-600"
  },
  {
    id: 3,
    title: "JavaScript",
    subtitle: "The brain of the web",
    description: "JavaScript is a programming language that powers dynamic interactions and functionality on websites.",
    link: "/learn/javascript",
    color: "from-yellow-400 to-yellow-600"
  },
  {
    id: 4,
    title: "React",
    subtitle: "Building interactive UIs",
    description: "React is a popular JavaScript library for building user interfaces, especially for single-page applications.",
    link: "/learn/react",
    color: "from-blue-400 to-cyan-400"
  },
  {
    id: 5,
    title: "Next.js",
    subtitle: "React Framework",
    description: "Next.js is a powerful React framework for building modern web applications.",
    link: "/learn/nextjs",
    color: "from-gray-800 to-black"
  },
  {
    id: 6,
    title: "TypeScript",
    subtitle: "Static Typing",
    description: "TypeScript is a superset of JavaScript that adds static typing, making it easier to catch errors early.",
    link: "/learn/typescript",
    color: "from-blue-600 to-blue-800"
  },
  // Add more items as needed...
];

const Learn = () => {
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (selectedId !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-24 pb-12">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Explore Tutorials
          </h1>
          <p className="text-muted-foreground text-lg">
            Master the latest technologies with our comprehensive specific guides.
            From basics to advanced concepts, we've got you covered.
          </p>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {items.map((item) => (
            <motion.div
              layoutId={item.id}
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group cursor-pointer relative p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-primary/30 transition-all duration-300 shadow-xl"
            >
              <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br rounded-3xl", item.color)} />

              <div className="relative z-10 flex flex-col items-start h-full">
                <div className="mb-4 p-3 rounded-2xl bg-background/50 border border-white/5 shadow-inner">
                  {getIcon(item.title)}
                </div>
                <h3 className="text-xl font-bold mb-1 text-foreground">{item.title}</h3>
                <p className="text-sm font-medium text-primary mb-3">{item.subtitle}</p>
                <div className="mt-auto pt-4 flex items-center text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                  Read More →
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {selectedId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedId(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                layoutId={selectedId}
                className="relative w-full max-w-lg bg-[#1a1b26] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>

                <div className="relative z-10">
                  <div className="mb-6">
                    {getIcon(items.find((item) => item.id === selectedId).title)}
                  </div>

                  <motion.h2 className="text-3xl font-bold mb-2 text-white">
                    {items.find((item) => item.id === selectedId).title}
                  </motion.h2>

                  <motion.p className="text-lg text-primary mb-4 font-medium">
                    {items.find((item) => item.id === selectedId).subtitle}
                  </motion.p>

                  <motion.p className="text-gray-400 leading-relaxed mb-8">
                    {items.find((item) => item.id === selectedId).description}
                  </motion.p>

                  <Link
                    href={items.find((item) => item.id === selectedId).link}
                    className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                  >
                    Start Learning Now
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Learn;
