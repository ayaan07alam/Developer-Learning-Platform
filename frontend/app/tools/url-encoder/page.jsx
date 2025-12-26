"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function URLEncoderPage() {
    const [mode, setMode] = useState('encode');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);

    const handleEncode = () => {
        if (!input.trim()) return;
        setOutput(encodeURIComponent(input));
    };

    const handleDecode = () => {
        if (!input.trim()) return;
        try {
            setOutput(decodeURIComponent(input));
        } catch (err) {
            setOutput('Invalid URL encoded string');
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

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                        <Link2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">URL Encoder/Decoder</h1>
                    <p className="text-muted-foreground text-lg">
                        Encode and decode URL strings safely
                    </p>
                </motion.div>

                <div className="flex justify-center gap-3 mb-6">
                    <Button
                        onClick={() => setMode('encode')}
                        variant={mode === 'encode' ? 'default' : 'outline'}
                    >
                        Encode
                    </Button>
                    <Button
                        onClick={() => setMode('decode')}
                        variant={mode === 'decode' ? 'default' : 'outline'}
                    >
                        Decode
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold">Input</h2>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={mode === 'encode' ? 'Enter URL to encode...' : 'Enter encoded URL...'}
                            className="w-full h-[300px] p-4 rounded-lg bg-card border border-border font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Button
                            onClick={mode === 'encode' ? handleEncode : handleDecode}
                            className="w-full"
                        >
                            {mode === 'encode' ? 'Encode' : 'Decode'}
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Output</h2>
                            {output && (
                                <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </Button>
                            )}
                        </div>
                        <textarea
                            value={output}
                            readOnly
                            placeholder="Result will appear here..."
                            className="w-full h-[300px] p-4 rounded-lg bg-card border border-border font-mono text-sm resize-none focus:outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
