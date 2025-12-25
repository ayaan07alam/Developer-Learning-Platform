import React from "react";
import './Loader.css';  // Ensure this path is correct

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <div className="loader">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
      <h2 className="mt-2 text-white text-lg font-semibold">Loading... Good Stuff Takes Time!</h2>
    </div>
  );
};

export default LoadingPage;
