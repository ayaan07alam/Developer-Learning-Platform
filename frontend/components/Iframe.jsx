"use client"
import React, { useEffect, useRef } from 'react';

const Iframe = ({ src, title }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        try {
          iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
        } catch (e) {
          console.log('Cross-origin content, cannot access iframe content to adjust height.');
          // Handle cross-origin if needed (see cross-origin handling below)
        }
      }
    };

    const iframe = iframeRef.current;
    iframe.addEventListener('load', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      iframe.removeEventListener('load', handleResize);
    };
  }, []);

  return <iframe ref={iframeRef} src={src} title={title} style={{ width: '100%', border: 'none' }} />;
};

export default Iframe;
