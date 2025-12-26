"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Diff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DiffCheckerPage() {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [showDiff, setShowDiff] = useState(false);

    const getDiff = () => {
        const lines1 = text1.split('\n');
        const lines2 = text2.split('\n');
        const maxLines = Math.max(lines1.length, lines2.length);
        const diffs = [];

        for (let i = 0; i < maxLines; i++) {
            const line1 = lines1[i] || '';
            const line2 = lines2[i] || '';

            if (line1 !== line2) {
                diffs.push({
                    lineNum: i + 1,
                    original: line1,
                    modified: line2,
                    type: !line1 ? 'added' : !line2 ? 'removed' : 'modified'
                });
            }
        }

        return diffs;
    };

    const differences = showDiff ? getDiff() : [];

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <Diff className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Diff Checker</h1>
                    <p className="text-muted-foreground text-lg">
                        Compare text and code differences side by side
                    </p>
                </motion.div>

                <div className="flex justify-center mb-6">
                    <Button onClick={() => setShowDiff(!showDiff)}>
                        {showDiff ? 'Hide Differences' : 'Compare'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold">Original Text</h2>
                        <textarea
                            value={text1}
                            onChange={(e) => setText1(e.target.value)}
                            placeholder="Paste original text here..."
                            className="w-full h-[400px] p-4 rounded-lg bg-card border border-border font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold">Modified Text</h2>
                        <textarea
                            value={text2}
                            onChange={(e) => setText2(e.target.value)}
                            placeholder="Paste modified text here..."
                            className="w-full h-[400px] p-4 rounded-lg bg-card border border-border font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {showDiff && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-xl bg-card border border-border"
                    >
                        <h3 className="font-semibold mb-4">
                            Differences Found: {differences.length}
                        </h3>
                        {differences.length === 0 ? (
                            <p className="text-muted-foreground">No differences found!</p>
                        ) : (
                            <div className="space-y-3">
                                {differences.map((diff, index) => (
                                    <div key={index} className="p-3 rounded-lg bg-background border border-border">
                                        <div className="text-sm text-muted-foreground mb-2">
                                            Line {diff.lineNum}
                                        </div>
                                        {diff.type === 'removed' && (
                                            <div className="p-2 rounded bg-red-500/10 text-red-600 font-mono text-sm">
                                                - {diff.original}
                                            </div>
                                        )}
                                        {diff.type === 'added' && (
                                            <div className="p-2 rounded bg-green-500/10 text-green-600 font-mono text-sm">
                                                + {diff.modified}
                                            </div>
                                        )}
                                        {diff.type === 'modified' && (
                                            <>
                                                <div className="p-2 rounded bg-red-500/10 text-red-600 font-mono text-sm mb-1">
                                                    - {diff.original}
                                                </div>
                                                <div className="p-2 rounded bg-green-500/10 text-green-600 font-mono text-sm">
                                                    + {diff.modified}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
