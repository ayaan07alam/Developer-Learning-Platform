"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Copy, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CodeFormatterPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [copied, setCopied] = useState(false);

    const languages = [
        { id: 'javascript', name: 'JavaScript' },
        { id: 'json', name: 'JSON' },
        { id: 'html', name: 'HTML' },
        { id: 'css', name: 'CSS' },
    ];

    const formatCode = () => {
        if (!input.trim()) return;

        try {
            let formatted = '';

            if (language === 'json') {
                const parsed = JSON.parse(input);
                formatted = JSON.stringify(parsed, null, 2);
            } else if (language === 'javascript' || language === 'css') {
                // Basic formatting - add indentation
                formatted = input
                    .split('\n')
                    .map(line => line.trim())
                    .join('\n')
                    .replace(/\{/g, '{\n  ')
                    .replace(/\}/g, '\n}')
                    .replace(/;/g, ';\n');
            } else if (language === 'html') {
                // Basic HTML formatting
                formatted = input
                    .replace(/></g, '>\n<')
                    .split('\n')
                    .map(line => line.trim())
                    .join('\n');
            }

            setOutput(formatted || input);
        } catch (err) {
            setOutput('Error formatting code: ' + err.message);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const clearAll = () => {
        setInput('');
        setOutput('');
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Code2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Code Formatter</h1>
                    <p className="text-muted-foreground text-lg">
                        Beautify your code instantly. Supports JS, JSON, HTML, CSS
                    </p>
                </motion.div>

                {/* Language Selection */}
                <div className="flex justify-center gap-3 mb-6">
                    {languages.map((lang) => (
                        <button
                            key={lang.id}
                            onClick={() => setLanguage(lang.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${language === lang.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-card border border-border hover:border-primary'
                                }`}
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3 mb-6">
                    <Button onClick={formatCode}>
                        <Code2 className="w-4 h-4 mr-2" />
                        Format Code
                    </Button>
                    <Button onClick={clearAll} variant="outline">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear
                    </Button>
                </div>

                {/* Editor Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input */}
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold">Input Code</h2>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste your code here..."
                            className="w-full h-[500px] p-4 rounded-lg bg-card border border-border font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Output */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Formatted Output</h2>
                            {output && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={copyToClipboard}
                                >
                                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </Button>
                            )}
                        </div>
                        <textarea
                            value={output}
                            readOnly
                            placeholder="Formatted code will appear here..."
                            className="w-full h-[500px] p-4 rounded-lg bg-card border border-border font-mono text-sm resize-none focus:outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
