import React, { useState, useRef, useEffect } from 'react';

const CodeWithNotes = ({ children, note }) => {
    const [showNote, setShowNote] = useState(false);
    const noteRef = useRef(null);

    const toggleNote = () => {
        setShowNote(prev => !prev);
        if (!showNote) noteRef.current?.focus(); // Focus the note when it opens
    };

    const handleClickOutside = (event) => {
        if (noteRef.current && !noteRef.current.contains(event.target)) {
            setShowNote(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative">
            <code onClick={toggleNote} className="cursor-pointer block">
                {children}
            </code>
            {showNote && (
                <div
                    ref={noteRef}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-3 rounded-lg mt-2 z-10 shadow-lg transition duration-300 ease-out animate-scale-in overflow-hidden"
                    style={{ minWidth: '200px', maxWidth: '90vw' }}
                    role="dialog"
                    tabIndex="-1"
                    aria-labelledby="noteLabel"
                    aria-modal="true"
                >
                    <h3 id="noteLabel" className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Note:</h3>
                    <p className="text-gray-600 dark:text-gray-200 line-clamp-3">{note || "This is a default note about the code."}</p>
                </div>
            )}
        </div>
    );
};

export default CodeWithNotes;
