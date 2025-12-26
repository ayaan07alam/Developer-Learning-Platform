"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CryptoJS from 'crypto-js';

export default function HashGeneratorPage() {
    const [input, setInput] = useState('');
    const [hashes, setHashes] = useState({
        md5: '',
        sha1: '',
        sha256: '',
        sha512: ''
    });
    const [copied, setCopied] = useState('');

    const generateHashes = () => {
        if (!input.trim()) {
            setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
            return;
        }

        setHashes({
            md5: CryptoJS.MD5(input).toString(),
            sha1: CryptoJS.SHA1(input).toString(),
            sha256: CryptoJS.SHA256(input).toString(),
            sha512: CryptoJS.SHA512(input).toString(),
        });
    };

    const copyToClipboard = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(''), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const clearAll = () => {
        setInput('');
        setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
    };

    const hashTypes = [
        { id: 'md5', name: 'MD5', value: hashes.md5, color: 'from-blue-500 to-cyan-500' },
        { id: 'sha1', name: 'SHA-1', value: hashes.sha1, color: 'from-green-500 to-emerald-500' },
        { id: 'sha256', name: 'SHA-256', value: hashes.sha256, color: 'from-purple-500 to-pink-500' },
        { id: 'sha512', name: 'SHA-512', value: hashes.sha512, color: 'from-orange-500 to-red-500' },
    ];

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                        <Hash className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Hash Generator</h1>
                    <p className="text-muted-foreground text-lg">
                        Generate MD5, SHA-1, SHA-256, and SHA-512 hashes securely
                    </p>
                </motion.div>

                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6 space-y-3"
                >
                    <div className="flex items-center justify-between">
                        <label className="text-lg font-semibold">Input Text</label>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={clearAll}
                            className="text-red-500 hover:text-red-600"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear
                        </Button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            generateHashes();
                        }}
                        placeholder="Enter text to hash..."
                        className="w-full h-32 p-4 rounded-lg bg-card border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-sm text-muted-foreground">
                        {input.length} characters
                    </p>
                </motion.div>

                {/* Hash Results */}
                <div className="space-y-4">
                    {hashTypes.map((hashType, index) => (
                        <motion.div
                            key={hashType.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${hashType.color}`} />
                                        <h3 className="font-bold text-lg">{hashType.name}</h3>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {hashType.id.toUpperCase()} Hash ({hashType.value.length || 0} characters)
                                    </p>
                                </div>
                                {hashType.value && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => copyToClipboard(hashType.value, hashType.id)}
                                        className="flex-shrink-0"
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        {copied === hashType.id ? 'Copied!' : 'Copy'}
                                    </Button>
                                )}
                            </div>
                            <div className="p-3 rounded-lg bg-background border border-border break-all font-mono text-sm">
                                {hashType.value || (
                                    <span className="text-muted-foreground italic">
                                        Enter text to generate {hashType.name} hash
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Info Box */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 p-6 rounded-xl bg-primary/10 border border-primary/20"
                >
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Hash className="w-5 h-5" />
                        About Hash Functions
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• <strong>MD5:</strong> 128-bit hash (not recommended for security)</li>
                        <li>• <strong>SHA-1:</strong> 160-bit hash (deprecated for security)</li>
                        <li>• <strong>SHA-256:</strong> 256-bit hash (secure, widely used)</li>
                        <li>• <strong>SHA-512:</strong> 512-bit hash (most secure option)</li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
}
