"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCode, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function MarkdownPreviewPage() {
    const [markdown, setMarkdown] = useState('# Hello World\n\nStart typing **markdown** here...');

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                        <FileCode className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Markdown Preview</h1>
                    <p className="text-muted-foreground text-lg">
                        Preview markdown with live rendering
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Editor */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <FileCode className="w-5 h-5" />
                            <h2 className="text-lg font-semibold">Markdown</h2>
                        </div>
                        <textarea
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            placeholder="# Enter markdown here..."
                            className="w-full h-[600px] p-4 rounded-lg bg-card border border-border font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Preview */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            <h2 className="text-lg font-semibold">Preview</h2>
                        </div>
                        <div className="h-[600px] p-6 rounded-lg bg-card border border-border overflow-auto prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown>{markdown}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
