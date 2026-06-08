"use client";
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-foreground p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full p-8 bg-card border border-border shadow-lg rounded-xl text-center"
      >
        <motion.h1 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-7xl font-extrabold text-primary mb-6 drop-shadow-sm"
        >
          404
        </motion.h1>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Page Not Found</h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-4">We can't seem to find the page you're looking for.</p>
        <p className="mb-8 text-sm sm:text-base text-muted-foreground">It might have been moved or deleted.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/" className="w-full sm:w-auto inline-block px-8 py-3 text-sm sm:text-base font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition shadow-sm hover:shadow-md">
            Go to Homepage
          </Link>
          <Link href="/contact" className="w-full sm:w-auto inline-block px-8 py-3 text-sm sm:text-base font-semibold text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition shadow-sm hover:shadow-md">
            Contact Us
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;