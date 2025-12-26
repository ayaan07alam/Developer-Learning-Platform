"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileJson, Check, X, Copy, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function JSONValidatorPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [isValid, setIsValid] = useState(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const validateJSON = () => {
        if (!input.trim()) {
            setError('Please enter some JSON to validate');
            setIsValid(false);
            setOutput('');
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 2);
            setOutput(formatted);
            setIsValid(true);
            setError('');
        } catch (err) {
            setIsValid(false);
            setError(err.message);
            setOutput('');
        }
    };

    const formatJSON = () => {
        if (!input.trim()) return;

        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 2);
            setInput(formatted);
            setOutput(formatted);
            setIsValid(true);
            setError('');
        } catch (err) {
            setIsValid(false);
            setError(err.message);
        }
    };

    const minifyJSON = () => {
        if (!input.trim()) return;

        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            setInput(minified);
            setOutput(minified);
            setIsValid(true);
            setError('');
        } catch (err) {
            setIsValid(false);
            setError(err.message);
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

    const downloadJSON = () => {
        if (!output) return;

        const blob = new Blob([output], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'formatted.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    const clearAll = () => {
        setInput('');
        setOutput('');
        setIsValid(null);
        setError('');
    };

    const loadSample = () => {
        const sample = JSON.stringify({
            "name": "John Doe",
            "age": 30,
            "email": "john@example.com",
            "address": {
                "street": "123 Main St",
                "city": "New York",
                "country": "USA"
            },
            "hobbies": ["reading", "coding", "gaming"]
        }, null, 2);
        setInput(sample);
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <FileJson className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">JSON Validator & Formatter</h1>
                    <p className="text-muted-foreground text-lg">
                        Validate, format, and minify your JSON data instantly
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap justify-center gap-3 mb-6"
                >
                    <Button onClick={validateJSON} className="bg-green-600 hover:bg-green-700">
                        <Check className="w-4 h-4 mr-2" />
                        Validate
                    </Button>
                    <Button onClick={formatJSON} variant="outline">
                        Format (Prettify)
                    </Button>
                    <Button onClick={minifyJSON} variant="outline">
                        Minify
                    </Button>
                    <Button onClick={loadSample} variant="outline">
                        Load Sample
                    </Button>
                    <Button onClick={clearAll} variant="outline" className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear
                    </Button>
                </motion.div>

                {/* Status Message */}
                {isValid !== null && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`mb-6 p-4 rounded-lg border ${isValid
                                ? 'bg-green-500/10 border-green-500/50 text-green-600'
                                : 'bg-red-500/10 border-red-500/50 text-red-600'
                            }`}
                    >
                        <div className="flex items-start gap-2">
                            {isValid ? (
                                <>
                                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Valid JSON!</p>
                                        <p className="text-sm opacity-80">Your JSON is properly formatted</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Invalid JSON</p>
                                        <p className="text-sm opacity-80">{error}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Editor Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Input JSON</h2>
                            <span className="text-sm text-muted-foreground">
                                {input.length} characters
                            </span>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste your JSON here..."
                            className="w-full h-[500px] p-4 rounded-lg bg-card border border-border font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </motion.div>

                    {/* Output */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Output</h2>
                            {output && (
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={copyToClipboard}
                                        className="text-xs"
                                    >
                                        <Copy className="w-3 h-3 mr-1" />
                                        {copied ? 'Copied!' : 'Copy'}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={downloadJSON}
                                        className="text-xs"
                                    >
                                        <Download className="w-3 h-3 mr-1" />
                                        Download
                                    </Button>
                                </div>
                            )}
                        </div>
                        <textarea
                            value={output}
                            readOnly
                            placeholder="Formatted JSON will appear here..."
                            className="w-full h-[500px] p-4 rounded-lg bg-card border border-border font-mono text-sm resize-none focus:outline-none"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
