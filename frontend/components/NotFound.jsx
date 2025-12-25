import Link from 'next/link';
import React from 'react';
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-800 p-4">
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-6xl font-bold text-secondary mb-4">404</h1>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Page Not Found</h2>
        <p className="text-lg sm:text-xl mb-4">We can't seem to find the page you're looking for.</p>
        <p className="mb-6 text-sm sm:text-base">It might have been moved or deleted.</p>
        <Link href="/" className="inline-block px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-lg font-semibold text-white bg-primary rounded-md hover:bg-primary/90 transition duration-300">

          Go to Homepage

        </Link>
        <div className="mt-6">
          <Link href="/contact" className="inline-block px-4 py-2 sm:px-6 text-sm sm:text-base text-primary underline hover:text-primary/80">

            Contact Us

          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;