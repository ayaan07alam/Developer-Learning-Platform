import React, { useState, useEffect } from "react";
import './Loader.css';

const LOADING_MESSAGES = [
  "Good things take time...",
  "Brewing some code...",
  "Fetching the latest bytes...",
  "Compiling the universe...",
  "Aligning the pixels...",
  "Waking up the server...",
  "Searching for the missing semicolon...",
  "Just a moment...",
  "Optimizing your experience..."
];

const LoadingPage = ({ fullScreen = true }) => {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    // Select a random message on mount
    const randomMessage = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
    setMessage(randomMessage);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center bg-gray-900 ${fullScreen ? 'h-screen w-full' : 'py-12 w-full'}`}>
      <div className="loader">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
      <h2 className="mt-4 text-white text-lg font-semibold animate-pulse px-4 text-center">
        {message}
      </h2>
    </div>
  );
};

export default LoadingPage;
