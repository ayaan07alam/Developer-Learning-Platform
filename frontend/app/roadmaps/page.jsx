import React from 'react';
import { cn } from "@/lib/utils";

export const metadata = {
  title: 'Tech Roadmaps',
  description: "Unlock your full potential with detailed tech roadmaps. Find personalized paths in software development, data science, cybersecurity, and more.",
}

const Roadmaps = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Developer Roadmaps
          </h1>
          <p className="text-muted-foreground text-lg">
            Follow these step-by-step guides to master your tech stack.
          </p>
        </div>

        <div className="w-full h-[80vh] rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-white/5 backdrop-blur-sm relative">
          <div className="absolute top-0 left-0 right-0 h-10 bg-[#2d2d2d] flex items-center px-4 gap-2 border-b border-white/10 z-20">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            <span className="ml-4 text-xs text-gray-400 font-mono">roadmap.sh/frontend</span>
          </div>
          <iframe
            src="https://roadmap.sh/r/embed?id=661ec0c3339f6036540fc79e"
            width="100%"
            height="100%"
            className="w-full h-full pt-10 bg-white"
            frameBorder="0"
            title="Roadmap Embed"
          />
        </div>
      </div>
    </div>
  )
}

export default Roadmaps;