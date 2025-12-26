"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Binary, ArrowRightLeft, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Base64Page() {
    const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleEncode = () => {
        if (!input.trim()) {
            setOutput('');
            setError('Please enter text to encode');
            return;
        }

        try {
            const encoded = btoa(input);
            setOutput(encoded);
            setError('');
        } catch (err) {
            setError('Failed to encode: ' + err.message);
            setOutput('');
        }
    };

    const handleDecode = () => {
        if (!input.trim()) {
            setOutput('');
            setError('Please enter Base64 to decode');
            return;
        }

        try {
            const decoded = atob(input);
            setOutput(decoded);
            setError('');
        } catch (err) {
            setError('Invalid Base64 string');
            setOutput('');
        }
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        setInput('');
        setOutput('');
        setError('');
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
        setError('');
    };

    const swap = () => {
        setInput(output);
        setOutput('');
        setError('');
        setMode(mode === 'encode' ? 'decode' : 'encode');
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                        <Binary className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Base64 Encoder/Decoder</h1>
                    <p className="text-muted-foreground text-lg">
                        Encode and decode Base64 strings instantly
                    </p>
                </motion.div>

                {/* Mode Toggle */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center gap-3 mb-6"
                >
                    <Button
                        onClick={() => handleModeChange('encode')}
                        variant={mode === 'encode' ? 'default' : 'outline'}
                        className="min-w-[120px]"
                    >
                        Encode
                    </Button>
                    <Button
                        onClick={() => handleModeChange('decode')}
                        variant={mode === 'decode' ? 'default' : 'outline'}
                        className="min-w-[120px]"
                    >
                        Decode
                    </Button>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 p-4 rounded-lg border bg-red-500/10 border-red-500/50 text-red-600"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Input/Output Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">
                                {mode === 'encode' ? 'Plain Text' : 'Base64'}
                            </h2>
                            <span className="text-sm text-muted-foreground">
                                {input.length} characters
                            </span>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
                            className="w-full h-[300px] p-4 rounded-lg bg-card border border-border font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <div className="flex gap-2">
                            <Button
                                onClick={mode === 'encode' ? handleEncode : handleDecode}
                                className="flex-1"
                            >
                                {mode === 'encode' ? 'Encode' : 'Decode'}
                            </Button>
                            <Button
                                onClick={clearAll}
                                variant="outline"
                                className="text-red-500 hover:text-red-600"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>

                    {/* Swap Button */}
                    <div className="hidden lg:flex items-center justify-center">
                        <Button
                            onClick={swap}
                            variant="outline"
                            size="icon"
                            className="rounded-full w-12 h-12"
                            disabled={!output}
                        >
                            <ArrowRightLeft className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Output */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">
                                {mode === 'encode' ? 'Base64' : 'Plain Text'}
                            </h2>
                            {output && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={copyToClipboard}
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    {copied ? 'Copied!' : 'Copy'}
                                </Button>
                            )}
                        </div>
                        <textarea
                            value={output}
                            readOnly
                            placeholder={`${mode === 'encode' ? 'Encoded' : 'Decoded'} result will appear here...`}
                            className="w-full h-[300px] p-4 rounded-lg bg-card border border-border font-mono text-sm resize-none focus:outline-none"
                        />
                    </motion.div>
                </div>

                {/* Info Box */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 p-6 rounded-xl bg-primary/10 border border-primary/20"
                >
                    <h3 className="font-semibold mb-3">About Base64 Encoding</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                        Base64 is a binary-to-text encoding scheme that represents binary data in ASCII string format.
                        It's commonly used for:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Encoding images in CSS and HTML files</li>
                        <li>• Transmitting data over media designed for text</li>
                        <li>• Storing complex data in databases</li>
                        <li>• Email attachments and API responses</li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
}
