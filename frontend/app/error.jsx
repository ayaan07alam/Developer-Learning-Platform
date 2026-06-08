"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error('Global Application Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-foreground p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-8 bg-card border border-destructive/20 shadow-lg rounded-xl text-center flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-bold mb-3">Something went wrong!</h2>
        
        <p className="text-muted-foreground text-sm mb-8">
          We apologize for the inconvenience. A technical error has occurred. Our team has been notified.
        </p>

        <div className="flex flex-col w-full gap-3">
          <Button 
            onClick={() => reset()} 
            className="w-full gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Try again
          </Button>
          
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full gap-2">
              <Home className="w-4 h-4" /> Go back home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
