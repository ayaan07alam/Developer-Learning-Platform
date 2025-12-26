"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Type, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CaseConverterPage() {
    const [input, setInput] = useState('');
    const [copied, setCopied] = useState('');

    const conversions = {
        upper: input.toUpperCase(),
        lower: input.toLowerCase(),
        title: input.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
        camel: input.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, ''),
        pascal: input.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) =>
            word.toUpperCase()).replace(/\s+/g, ''),
        snake: input.toLowerCase().replace(/\s+/g, '_'),
        kebab: input.toLowerCase().replace(/\s+/g, '-'),
    };

    const cases = [
        { id: 'upper', name: 'UPPERCASE', example: 'HELLO WORLD' },
        { id: 'lower', name: 'lowercase', example: 'hello world' },
        { id: 'title', name: 'Title Case', example: 'Hello World' },
        { id: 'camel', name: 'camelCase', example: 'helloWorld' },
        { id: 'pascal', name: 'PascalCase', example: 'HelloWorld' },
        { id: 'snake', name: 'snake_case', example: 'hello_world' },
        { id: 'kebab', name: 'kebab-case', example: 'hello-world' },
    ];

    const copyToClipboard = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(''), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center">
                        <Type className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Case Converter</h1>
                    <p className="text-muted-foreground text-lg">
                        Convert text between UPPER, lower, Title, camelCase and more
                    </p>
                </motion.div>

                <div className="mb-6 space-y-3">
                    <label className="text-lg font-semibold">Enter Text</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type or paste your text here..."
                        className="w-full h-32 p-4 rounded-lg bg-card border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="space-y-3">
                    {cases.map((caseType, index) => (
                        <motion.div
                            key={caseType.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 rounded-xl bg-card border border-border"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold">{caseType.name}</h3>
                                        <span className="text-xs text-muted-foreground">({caseType.example})</span>
                                    </div>
                                    <p className="font-mono text-sm break-all">
                                        {conversions[caseType.id] ||
                                            <span className="text-muted-foreground italic">Enter text to convert</span>
                                        }
                                    </p>
                                </div>
                                {conversions[caseType.id] && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => copyToClipboard(conversions[caseType.id], caseType.id)}
                                        className="ml-2 flex-shrink-0"
                                    >
                                        {copied === caseType.id ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
