"use client"
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Check, Copy } from "lucide-react";

const CodeBlock = ({ language, code, filename }) => {
  const [copied, setCopied] = useState(false);
  const customTheme = {
    ...oneDark,
    'code[class*="language-"]': {
      color: "#f8f8f2",
      fontSize: "14px",
      fontFamily: "'Fira Code', monospace",
    },
    'pre[class*="language-"]': {
      margin: 0,
      padding: "1.5rem",
      backgroundColor: "transparent",
    }
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full my-6 rounded-xl overflow-hidden shadow-2xl bg-[#1e1e1e] border border-white/10">
      {/* Mac Window Header */}
      <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          {filename && (
            <span className="ml-4 text-xs text-gray-400 font-mono">{filename}</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
            {language}
          </span>
          <CopyToClipboard text={code} onCopy={handleCopy}>
            <button
              className="group p-1.5 hover:bg-white/10 rounded-md transition-colors"
              title="Copy code"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400 group-hover:text-white" />
              )}
            </button>
          </CopyToClipboard>
        </div>
      </div>

      {/* Code Area */}
      <div className="overflow-auto max-h-[600px] custom-scrollbar">
        <SyntaxHighlighter
          language={language}
          style={customTheme}
          showLineNumbers={true}
          wrapLongLines={true}
          customStyle={{ margin: 0, background: 'transparent' }}
          lineNumberStyle={{ minWidth: "3em", paddingRight: "1em", color: "#5c6370" }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

CodeBlock.propTypes = {
  language: PropTypes.string,
  code: PropTypes.string.isRequired,
  filename: PropTypes.string,
};

export default CodeBlock;
